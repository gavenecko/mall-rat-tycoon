"use strict";
/* =====================================================================
   MALL RAT TYCOON v2 — single file. Sections:
   DATA -> ITEM GENERATION -> STATE/SAVES -> DRAWING -> SCREENS -> JOBS -> BOOT
   ES2017-safe; all storage access guarded for sandboxed viewers.
===================================================================== */
/* ============================ DATA ============================ */
const START_CASH=150, DAY_MS=600000, OPEN_COUNT=4, SHIFT_MS=45000;
// [name, hex] — names match the hex used for drawing
const COLORS=[['Red','#d32f2f'],['Pink','#f48fb1'],['Hot Pink','#ff1493'],['Orange','#fb8c00'],['Yellow','#fdd835'],['Lime','#9ccc65'],
 ['Green','#2e7d32'],['Mint','#98ff98'],['Teal','#00897b'],['Sky Blue','#4fc3f7'],['Royal Blue','#1e4fd6'],['Navy','#1a237e'],
 ['Purple','#7b1fa2'],['Lavender','#b39ddb'],['Burgundy','#800020'],['Brown','#6d4c41'],['Tan','#d2b48c'],['Beige','#f5f5dc'],
 ['Black','#212121'],['Gray','#9e9e9e'],['White','#fafafa'],['Gold','#d4af37'],['Silver','#c0c0c0']];
const PATTERNS=[{name:'Plain',key:''},{name:'Plain',key:''},{name:'Striped',key:'stripes'},{name:'Polka-Dot',key:'dots'},{name:'Checkered',key:'checks'}];
const SPARKLE={name:'Sparkle',key:'sparkle'};
const SLOTS=['hats','tops','bottoms','shoes','accessories'];
const ROOM_CATS=['furniture','decor'];
const CAT_LABEL={hats:'🧢 Hats',tops:'👕 Tops',bottoms:'👖 Bottoms',shoes:'👟 Shoes',accessories:'🕶️ Accessories',furniture:'🛋️ Furniture',decor:'🪴 Decor'};
// key = drawing shape; name = display noun. plain:1 => no fabric pattern. w/h = room footprint; layer: floor|rug|wall
const B=(key,name,mul,o)=>Object.assign({key:key,name:name,mul:mul},o||{});
const BASES={
 hats:[B('cap','Baseball Cap',1),B('beanie','Beanie',.8),B('tophat','Top Hat',2),B('bucket','Bucket Hat',1),B('crown','Crown',6,{plain:1}),B('cowboy','Cowboy Hat',1.6)],
 tops:[B('tee','T-Shirt',1),B('tank','Tank Top',.7),B('hoodie','Hoodie',1.5),B('blazer','Blazer',3),B('puffer','Puffer Jacket',2.5),B('sweater','Sweater',1.4)],
 bottoms:[B('jeans','Jeans',1.2),B('joggers','Joggers',1),B('shorts','Shorts',.7),B('skirt','Skirt',.9)],
 shoes:[B('sneakers','Sneakers',1),B('boots','Boots',1.5),B('heels','Heels',1.8),B('slides','Slides',.4),B('loafers','Loafers',1.3)],
 accessories:[B('sunglasses','Sunglasses',1,{plain:1}),B('chain','Chain Necklace',1.5,{plain:1}),B('handbag','Handbag',2.5),B('watch','Watch',2,{plain:1}),B('scarf','Scarf',.8)],
 furniture:[B('sofa','Sofa',3,{w:2,h:1}),B('bed','Bed',4,{w:2,h:2}),B('chair','Chair',1,{w:1,h:1}),B('table','Table',1.5,{w:2,h:1}),B('bookshelf','Bookshelf',2,{w:1,h:2}),B('bathtub','Bathtub',3,{w:2,h:1})],
 decor:[B('plant','Potted Plant',.5,{w:1,h:1}),B('lamp','Floor Lamp',.8,{w:1,h:1,plain:1}),B('rug','Rug',1,{w:2,h:2,layer:'rug'}),B('tv','TV',3,{w:2,h:1,plain:1}),B('fishtank','Fish Tank',2,{w:1,h:1,plain:1}),
  B('painting','Painting',1.5,{w:1,h:1,layer:'wall'}),B('clock','Wall Clock',.7,{w:1,h:1,layer:'wall',plain:1}),B('curtains','Curtained Window',1.2,{w:2,h:1,layer:'wall'}),B('poster','Poster',.4,{w:1,h:1,layer:'wall'}),B('wallshelf','Wall Shelf',.8,{w:2,h:1,layer:'wall'})]
};
const STORES=[
 {id:'frauda',name:'Frauda',tag:'Milano-ish luxury',color:'#111',emoji:'👜',cats:['tops','bottoms','shoes','accessories'],tier:[400,9000]},
 {id:'goochie',name:'Goochie',tag:'Double G, double price',color:'#0a6b3a',emoji:'🐍',cats:['hats','tops','shoes','accessories'],tier:[300,7000]},
 {id:'balence',name:'BalenceNada',tag:'Ugly-chic, extra $$$',color:'#444',emoji:'👟',cats:['shoes','tops','bottoms','hats'],tier:[350,8000]},
 {id:'vuitno',name:'Louis Vuitno',tag:'Monogram everything',color:'#6b4a1e',emoji:'🧳',cats:['accessories','hats','decor'],tier:[500,15000]},
 {id:'shanel',name:'Shanel',tag:'No. 5 out of 10',color:'#000',emoji:'💄',cats:['tops','bottoms','accessories','shoes'],tier:[450,12000]},
 {id:'versnatchy',name:'Versnatchy',tag:'Medusa approved',color:'#b8860b',emoji:'👑',cats:['hats','tops','furniture','decor'],tier:[800,30000]},
 {id:'hermeez',name:'Hermeez',tag:'Waitlist for the waitlist',color:'#e65100',emoji:'🍊',cats:['accessories','furniture','decor'],tier:[2000,25000]},
 {id:'dollar',name:'Dollar Treet',tag:'Everything about a buck',color:'#2a9d3a',emoji:'💵',cats:['hats','accessories','decor','shoes'],tier:[1,5]},
 {id:'wally',name:"Wally's Mart",tag:'Save money. Live... ok.',color:'#1f6fd1',emoji:'🛒',cats:['tops','bottoms','shoes','furniture','decor'],tier:[4,60]},
 {id:'ikeya',name:'Ikeya',tag:'Some assembly required',color:'#0051ba',emoji:'🪑',cats:['furniture','decor'],tier:[15,400]},
 {id:'thrift',name:'Thrift Shift',tag:'Pre-loved, pre-smelled',color:'#9b59b6',emoji:'♻️',cats:['hats','tops','bottoms','shoes','furniture'],tier:[1,25]},
 {id:'targit',name:'Targit',tag:'Came for soap, left with a lamp',color:'#cc0000',emoji:'🎯',cats:['decor','furniture','tops','bottoms'],tier:[8,150]}
];
const BODIES={slim:{label:'Slim',sh:15,hip:12},average:{label:'Average',sh:17,hip:14},curvy:{label:'Curvy',sh:16,hip:18},broad:{label:'Broad',sh:21,hip:15},round:{label:'Round',sh:20,hip:19}};
const SKINS=['#ffe0c4','#f6c89f','#e0ac69','#c68642','#8d5524','#5c3a21'];
const HAIRS={buzz:'Buzz',short:'Short',spiky:'Spiky',bob:'Bob',long:'Long',ponytail:'Ponytail',bun:'Bun',afro:'Afro'};
const HAIR_COLORS=[['Black','#1f1410'],['Brown','#5a3825'],['Auburn','#a0522d'],['Blonde','#e6c27a'],['Silver','#c9c9c9'],['Pink','#ff6fb5'],['Blue','#3fa9f5'],['Purple','#7b4fd6']];
const GENDERS={male:{label:'Male',body:'broad',hair:'short'},female:{label:'Female',body:'curvy',hair:'long'},nb:{label:'Non-binary',body:'slim',hair:'bob'}};

/* ======================= ITEM GENERATION ======================= */
const rand=n=>Math.floor(Math.random()*n);
const pick=a=>a[rand(a.length)];
function rng(seed){seed=(seed>>>0)||1;return function(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
function shuffle(a,r){r=r||Math.random;a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));const t=a[i];a[i]=a[j];a[j]=t}return a}
function nicePrice(p){return p<100?Math.max(1,Math.round(p)):p<1000?Math.round(p/5)*5:Math.round(p/50)*50}
const ITEMS=[], ITEM={};
(function gen(){
  const r=rng(2026), names={};
  function make(s,cat,base,rare){
    let it=null;
    for(let t=0;t<20&&!it;t++){
      const c=COLORS[Math.floor(r()*COLORS.length)];
      const pat=base.plain?PATTERNS[0]:(rare?SPARKLE:PATTERNS[Math.floor(r()*PATTERNS.length)]);
      const name=s.name+(rare?' Limited':'')+' '+c[0]+(pat.key?' '+pat.name:'')+' '+base.name;
      if(names[name])continue;names[name]=1;
      const lo=s.tier[0],hi=s.tier[1];
      let p=lo*Math.pow(hi/lo,Math.pow(r(),1.4))*base.mul;p=Math.min(Math.max(p,1),hi*2.5);if(rare)p*=3;
      it={id:s.id+'-'+cat+'-'+base.key+'-'+ITEMS.length,store:s.id,name:name,cat:cat,slot:SLOTS.indexOf(cat)>=0?cat:null,shape:base.key,
        price:nicePrice(p),color:c[1],colorName:c[0],pattern:pat.key,rare:!!rare,stock:rare?3:0,w:base.w||1,h:base.h||1,layer:base.layer||'floor'};
    }
    if(it){ITEMS.push(it);ITEM[it.id]=it}
  }
  STORES.forEach(s=>{
    s.cats.forEach(cat=>{shuffle(BASES[cat],r).slice(0,cat==='decor'?5:4).forEach(b=>make(s,cat,b,false))});
    const rc=s.cats[Math.floor(r()*s.cats.length)];make(s,rc,BASES[rc][Math.floor(r()*BASES[rc].length)],true);
  });
})();

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
function fresh(){return{v:2,char:null,cash:START_CASH,owned:{},equipped:{},room:[],avatar:{x:4,y:7},day:1,dayAt:Date.now(),stock:{},jobs:{},
  shifts:0,earned:0,spent:0,dealsBought:0,ach:{},tutDone:false,muted:false,savedAt:0}}
function normalize(o){
  if(!o||typeof o!=='object'||typeof o.cash!=='number'||isNaN(o.cash))throw new Error('Not a valid save');
  const s=Object.assign(fresh(),o);
  Object.keys(s.owned).forEach(id=>{if(!ITEM[id]||!(s.owned[id]>0))delete s.owned[id]});
  Object.keys(s.equipped).forEach(k=>{if(!s.owned[s.equipped[k]])delete s.equipped[k]});
  s.room=(s.room||[]).filter(p=>ITEM[p.id]&&s.owned[p.id]);
  return s;
}
function load(){try{const raw=store.get(KEY_AUTO);return raw?normalize(JSON.parse(raw)):fresh()}catch(e){return fresh()}}
let S=load();
function save(){S.savedAt=Date.now();checkAch();store.set(KEY_AUTO,JSON.stringify(S));hud()}
const b64e=s=>btoa(unescape(encodeURIComponent(s)));
const b64d=s=>decodeURIComponent(escape(atob(s)));
function exportCode(){return 'MRT2:'+b64e(JSON.stringify(S))}
function importCode(code){code=String(code||'').trim().replace(/^MRT2:/,'').replace(/\s+/g,'');S=normalize(JSON.parse(b64d(code)));save()}
function slotMeta(n){try{const raw=store.get(slotKey(n));return raw?JSON.parse(raw):null}catch(e){return null}}
const itemCount=s=>Object.keys(s.owned).reduce((t,id)=>t+s.owned[id],0);
const closetValue=s=>Object.keys(s.owned).reduce((t,id)=>t+(ITEM[id]?ITEM[id].price*s.owned[id]:0),0);
const netWorth=s=>s.cash+closetValue(s);

/* ======================= DAYS / ROTATION / DEALS ======================= */
function checkDay(){const n=Math.floor((Date.now()-S.dayAt)/DAY_MS);if(n>0){S.day+=n;S.dayAt+=n*DAY_MS;save();return true}return false}
function nextDay(){S.day++;S.dayAt=Date.now();save()}
function timeLeft(){const s=Math.max(0,Math.ceil((DAY_MS-(Date.now()-S.dayAt))/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function openStores(){
  const open=shuffle(STORES,rng(S.day*7919+3)).slice(0,OPEN_COUNT);
  if(!open.some(s=>s.tier[1]<=150)){open[OPEN_COUNT-1]=shuffle(STORES.filter(s=>s.tier[1]<=150),rng(S.day+1))[0]}
  return open;
}
let DEAL_CACHE={day:-1,list:[]};
function deals(){if(DEAL_CACHE.day!==S.day){const r=rng(S.day*104729+17);DEAL_CACHE={day:S.day,list:shuffle(ITEMS.filter(i=>!i.rare),r).slice(0,6).map(i=>({id:i.id,off:[20,30,40,50,60][Math.floor(r()*5)]}))}}return DEAL_CACHE.list}
function dealOf(id){const d=deals().filter(x=>x.id===id)[0];return d?d.off:0}
function priceOf(it){const off=dealOf(it.id);return off?Math.max(1,Math.round(it.price*(100-off)/100)):it.price}
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
function toast(t){const e=$('#toast');e.textContent=t;e.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>{e.style.opacity=0},1800)}
function floatText(t,color){const e=document.createElement('div');e.className='float';e.textContent=t;e.style.color=color||'#1a8f3a';document.body.appendChild(e);setTimeout(()=>e.remove(),1050)}
function hud(){$('#cash').textContent=money(S.cash);$('#day').textContent='Day '+S.day;$('#mute').textContent=S.muted?'🔇':'🔊'}
function bumpCash(){const c=$('#cash');c.classList.add('bump');setTimeout(()=>c.classList.remove('bump'),200)}
function onAll(root,sel,fn){Array.prototype.forEach.call(root.querySelectorAll(sel),el=>el.addEventListener('click',e=>fn(el,e)))}
function setupCanvas(cv,w,h){const d=window.devicePixelRatio||1;cv.width=Math.round(w*d);cv.height=Math.round(h*d);cv.style.width=w+'px';cv.style.height=h+'px';const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);return x}
