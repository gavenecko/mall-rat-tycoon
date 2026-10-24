/* ========================= STATE / SAVES ========================= */
const $=q=>document.querySelector(q);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const money=n=>'$'+Math.floor(n).toLocaleString('en-US');
const cents=c=>'$'+(c/100).toFixed(2);
const KEY_AUTO='mrt2_auto', slotKey=n=>'mrt2_slot'+n;
const MEM={};
const storageOK=(function(){try{const k='__mrt_t';window.localStorage.setItem(k,'1');window.localStorage.removeItem(k);return true}catch(e){return false}})();
const store={
  get(k){if(storageOK){try{return window.localStorage.getItem(k)}catch(e){}}return Object.prototype.hasOwnProperty.call(MEM,k)?MEM[k]:null},
  set(k,v){MEM[k]=v;if(storageOK){try{window.localStorage.setItem(k,v)}catch(e){}}}
};
function fresh(){return{v:8,crime:{active:false,next:0},orders:[],inbox:[],wish:{},card:{bal:0},bnpl:[],flea:[],fb:{day:0,list:[]},oid:1,stats3:{won:0,flipped:0,scammed:0,haggled:0},gifted:{},dark:false,home:{wall:null,floor:null,ext:{},yard:[],water:{},size:0,waters:0,remodels:0},rap:{optin:false,lastSteal:{},hot:{},arrests:0,heat:0,record:[],offenses:0,caught:0,storeOff:{},bans:{},cs:0,csDone:0,stolen:0,fakesSold:0,busted:0,raids:0,alley:false,alleyBought:0,finesPaid:0},char:null,cash:START_CASH,owned:{},equipped:{},room:[],avatar:{x:4,y:7},day:1,dayAt:Date.now(),stock:{},jobs:{},
  shifts:0,earned:0,spent:0,dealsBought:0,ach:{},tutDone:false,muted:false,savedAt:0}}
function normalize(o){
  if(!o||typeof o!=='object'||typeof o.cash!=='number'||isNaN(o.cash))throw new Error('Not a valid save');
  const s=Object.assign(fresh(),o);
  Object.keys(s.owned).forEach(id=>{if(!ITEM[id]||!(s.owned[id]>0))delete s.owned[id]});
  Object.keys(s.equipped).forEach(k=>{if(!s.owned[s.equipped[k]])delete s.equipped[k]});
  s.room=(s.room||[]).filter(p=>ITEM[p.id]&&s.owned[p.id]);
  const f=fresh();['crime','card','fb','stats3','rap'].forEach(k=>{s[k]=Object.assign({},f[k],s[k]||{})});
  s.orders=(s.orders||[]).filter(o=>ITEM[o.id]);s.flea=(s.flea||[]).filter(a=>ITEM[a.id]);s.fb.list=(s.fb.list||[]).filter(l=>ITEM[l.id]);
  Object.keys(s.wish).forEach(id=>{if(!ITEM[id])delete s.wish[id]});homeFix(s);s.awayFrom=s.savedAt||0;if(!s.gt){s.gt=Date.now();if(s.char&&s.day>=40&&!s.ttFixed)s.ttOffer=true;if(s.gt-(s.dayAt||0)>DAY_MS)s.dayAt=s.gt-Math.min(DAY_MS*.5,Math.max(0,DAY_MS-1))}if(typeof v8Fix==="function")v8Fix(s);s.v=8;
  return s;
}
function load(){try{const raw=store.get(KEY_AUTO);return raw?normalize(JSON.parse(raw)):fresh()}catch(e){return fresh()}}
let S=fresh();// real load happens in parts/12.js once every catalog (incl. v6 home + v8 drops) exists
function save(){if(typeof clockTick==='function'&&S.gt)clockTick();S.savedAt=Date.now();checkAch();store.set(KEY_AUTO,JSON.stringify(S));hud()}
const b64e=s=>btoa(unescape(encodeURIComponent(s)));
const b64d=s=>decodeURIComponent(escape(atob(s)));
function exportCode(){return 'MRT3:'+b64e(JSON.stringify(S))}
function importCode(code){code=String(code||'').trim().replace(/^MRT\d:/,'').replace(/\s+/g,'');S=normalize(JSON.parse(b64d(code)));save()}
function slotMeta(n){try{const raw=store.get(slotKey(n));return raw?JSON.parse(raw):null}catch(e){return null}}
const itemCount=s=>Object.keys(s.owned).reduce((t,id)=>t+s.owned[id],0);
const closetValue=s=>Object.keys(s.owned).reduce((t,id)=>t+(ITEM[id]?ITEM[id].price*s.owned[id]:0),0);
const netWorth=s=>s.cash+closetValue(s);

/* ======================= DAYS / ROTATION / DEALS ======================= */
function checkDay(){const g=gnow(),n=Math.floor((g-S.dayAt)/DAY_MS);if(n>0){if(n>3){S.dayAt=g}else S.dayAt+=n*DAY_MS;for(let i=0;i<Math.min(n,3);i++){S.day++;onNewDay()}save();return true}return false}
function nextDay(){S.day++;S.dayAt=gnow();onNewDay();save()}
function timeLeft(){const s=Math.max(0,Math.ceil((DAY_MS-(gnow()-S.dayAt))/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function openStores(){
  const POOL=STORES.filter(s=>!s.park),open=shuffle(POOL,rng(S.day*7919+3)).slice(0,OPEN_COUNT);
  if(!open.some(s=>s.tier[1]<=150)){open[OPEN_COUNT-1]=shuffle(POOL.filter(s=>s.tier[1]<=150),rng(S.day+1))[0]}
  return open;
}
let DEAL_CACHE={day:-1,list:[]};
function deals(){if(DEAL_CACHE.day!==S.day){const r=rng(S.day*104729+17);DEAL_CACHE={day:S.day,list:shuffle(ITEMS.filter(i=>!i.rare&&MALL_STORE[i.store]),r).slice(0,6).map(i=>({id:i.id,off:[20,30,40,50,60][Math.floor(r()*5)]}))}}return DEAL_CACHE.list}
function dealOf(id){const d=deals().filter(x=>x.id===id)[0];return d?d.off:0}
function offOf(it){return Math.max(dealOf(it.id),eventOff(it))}
function priceOf(it){const off=offOf(it);return off?Math.max(1,Math.round(it.price*(100-off)/100)):it.price}
function stockLeft(it){return it.rare?Math.max(0,it.stock-(S.stock[it.id]||0)):Infinity}

/* ============================ ACHIEVEMENTS ============================ */
const ACH=[
 ['first','First Swipe 💳','Buy your first item',s=>s.spent>0],
 ['ten','Hoarder 📦','Own 10 items',s=>itemCount(s)>=10],
 ['fit','Full Fit 👗','Wear something in all 5 slots',s=>SLOTS.every(k=>s.equipped[k])],
 ['lux','Big Spender 💎','Own an item worth $5,000+',s=>Object.keys(s.owned).some(id=>ITEM[id].price>=5000)],
 ['rare','Collector ✨','Own a Limited item',s=>Object.keys(s.owned).some(id=>ITEM[id].rare)],
 ['deal','Bargain Hunter 🔥','Buy a Daily Deal',s=>s.dealsBought>0],
 ['decor','Interior Designer 🛋️','Place 5 things in your room',s=>s.room.length>=5],
 ['wall','Gallery Wall 🖼️','Hang 3 wall decor items',s=>s.room.filter(p=>ITEM[p.id].layer==='wall').length>=3],
 ['shift','Employee of the Minute 🏅','Finish a work shift',s=>s.shifts>0],
 ['gig','Gig Economy 💼','Work every job once',s=>JOBS.every(j=>s.jobs[j.id]&&s.jobs[j.id].shifts>0)],
 ['earn','Paycheck Pro 💵','Earn $1,000 from jobs',s=>s.earned>=1000],
 ['nw','Ballin\' 🏆','Reach $10,000 net worth',s=>netWorth(s)>=10000],
 ['week','Mall Rat Week 📅','Reach day 7',s=>s.day>=7]
];
const ACH_REWARD=25;
function checkAch(){ACH.forEach(a=>{if(!S.ach[a[0]]&&S.char&&a[3](S)){S.ach[a[0]]=Date.now();S.cash+=ACH_REWARD;setTimeout(()=>{toast('🏆 '+a[1]+' (+'+money(ACH_REWARD)+')');sfx('level')},700)}})}

/* ============================== SOUND ============================== */
let AC=null;
const SFX={click:[[660,.05]],buy:[[523,.08],[659,.08],[784,.12]],coin:[[988,.06],[1319,.1]],bad:[[160,.18,'sawtooth']],level:[[523,.1],[659,.1],[784,.1],[1047,.2]],start:[[440,.08],[880,.12]]};
function sfx(n){if(S.muted)return;try{if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C()}if(AC.state==='suspended')AC.resume();
  let t=AC.currentTime;(SFX[n]||SFX.click).forEach(s=>{const o=AC.createOscillator(),g=AC.createGain();o.type=s[2]||'square';o.frequency.value=s[0];g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+s[1]);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+s[1]+.02);t+=s[1]*.85})}catch(e){}}

/* ============================ UI HELPERS ============================ */
function toast(t){const e=$('#toast');e.textContent=t;e.style.opacity=1;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>{e.style.opacity=0;e.classList.remove('show')},1800)}
function floatText(t,color){const e=document.createElement('div');e.className='float';e.textContent=t;e.style.color=color||'#1a8f3a';document.body.appendChild(e);setTimeout(()=>e.remove(),1050)}
function hud(){$('#cash').textContent=money(S.cash);$('#day').textContent='Day '+S.day;mailHud()}
function bumpCash(){const c=$('#cash');c.classList.add('bump');setTimeout(()=>c.classList.remove('bump'),200)}
function onAll(root,sel,fn){Array.prototype.forEach.call(root.querySelectorAll(sel),el=>el.addEventListener('click',e=>fn(el,e)))}
function setupCanvas(cv,w,h){const d=window.devicePixelRatio||1;cv.width=Math.round(w*d);cv.height=Math.round(h*d);cv.style.width=w+'px';cv.style.height=h+'px';const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);return x}
