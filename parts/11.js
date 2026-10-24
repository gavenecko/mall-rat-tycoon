/* ============================== v7 GAME CLOCK ==============================
   S.gt = accumulated game time (ms, epoch-like so old timestamps stay valid). It only advances while the page is visible,
   via a 1s heartbeat; any gap > 15s between beats (sleep/background) is ignored. All day/auction timers use gnow(). */
const CLOCK={last:Date.now(),on:!document.hidden,awayShown:false};
const BEAT_MAX=15000,AWAY_MIN=30*60000,AWAY_CAP=24*3600000;
function gnow(){if(!S.gt)S.gt=Date.now();return S.gt+(CLOCK.on?Math.max(0,Math.min(Date.now()-CLOCK.last,BEAT_MAX)):0)}
function clockTick(){const n=Date.now(),d=n-CLOCK.last;if(CLOCK.on&&S.gt&&d>0&&d<=BEAT_MAX)S.gt+=d;CLOCK.last=n}
function clockPause(){if(!CLOCK.on)return;clockTick();CLOCK.on=false;if(S&&S.char)try{save()}catch(e){}}
function clockResume(){if(CLOCK.on)return;S.awayFrom=S.savedAt;CLOCK.last=Date.now();CLOCK.on=true;welcomeBack()}
document.addEventListener('visibilitychange',()=>{if(document.hidden)clockPause();else clockResume()});
window.addEventListener('pagehide',clockPause);
window.addEventListener('pageshow',()=>{if(!document.hidden)clockResume()});

/* ---- welcome back: small capped reward, optional one-time time-travel fix ---- */
function awayReward(ms){let lv=1;try{lv=Math.max.apply(0,JOBS.map(j=>jobLevel(j.id)))}catch(e){}
  const cap=Math.min(150,50+25*(lv-1));return Math.max(5,Math.round(cap*Math.min(1,ms/AWAY_CAP)))}
function welcomeBack(){if(!S||!S.char)return;const away=Math.max(0,Date.now()-(S.awayFrom||S.savedAt||Date.now()));S.awayFrom=0;
  const fix=!!S.ttOffer,gift=away>=AWAY_MIN&&(S.lastBonusAt||0)<Date.now()-AWAY_MIN;if(!gift&&!fix)return;
  const cash=gift?awayReward(away):0,hrs=away/3600000,pkg=gift&&hrs>=4;
  let pkgItem=null;if(pkg){const pool=ITEMS.filter(i=>MALL_STORE[i.store]&&!i.rare&&i.price<=60);pkgItem=pool[Math.floor(Math.random()*pool.length)]}
  if(gift){S.cash+=cash;S.lastBonusAt=Date.now();if(pkgItem)S.orders.unshift({oid:S.oid++,id:pkgItem.id,src:'Mystery',price:0,day:S.day,arrive:S.day,status:'delivered'});save();hud()}
  const t=hrs>=1?Math.floor(Math.min(hrs,99))+' hour'+(Math.floor(hrs)===1?'':'s'):Math.round(away/60000)+' minutes';
  sheet('<h3>👋 Welcome back, '+String(S.char.name).replace(/[<>&]/g,'')+'!</h3>'+(gift?'<p>You were away for <b>'+t+'</b>. The mall waited for you: no days passed, nothing piled up.</p><div class="card center" style="font-size:20px">💸 <b>+'+money(cash)+'</b> pocket money'+(pkgItem?'<div class="small" style="margin-top:6px">📦 Plus a free mystery package is on your doorstep!</div>':'')+'</div>':'')+
    (fix?'<div class="card" style="border:2px solid var(--brand2)"><b>🕰️ Time-travel fix</b><div class="small">An old version let real-world time pile up in-game days while you were gone. Tap to forgive card interest &amp; pay-in-4 debt, revive your plants, cool off Heat and restore your Crime membership. Your day counter stays as is.</div><button class="btn big" id="ttfix">✨ Fix my timeline</button></div>':'')+
    '<button class="btn alt big" id="wbok">Let\'s shop</button>');
  $('#wbok').onclick=closeSheet;if($('#ttfix'))$('#ttfix').onclick=()=>{timeFix();closeSheet()}}
function timeFix(){const forgiven=S.card.bal+S.bnpl.reduce((a,p)=>a+(p.left||p.rem||0)*(p.amt||p.each||0),0);S.card.bal=0;S.bnpl=[];
  if(S.home){Object.keys(S.home.water).forEach(k=>S.home.water[k]=S.day)}S.rap.heat=0;if(S.crime&&S.crime.next<S.day)S.crime.next=S.day+7;
  S.ttOffer=false;S.ttFixed=true;notify('🕰️ Timeline repaired. Debts from the time glitch were forgiven.');save();hud();toast('✨ Timeline fixed!');burst&&burst(20);rerender()}
