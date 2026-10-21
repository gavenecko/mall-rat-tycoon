/* ============================== CRIME & CONSEQUENCES (v4) ==============================
   Shoplifting stealth minigame, Heat, court (fine or community service), store bans,
   Back Alley counterfeits, counterfeit-selling busts, police raids. Satire: crime should
   never beat a burger shift on average. Test hooks: window.__stealForce / __bustForce / __raidForce. */
let stealIv=null;
const R=()=>S.rap;
const isBanned=id=>!!(S.rap.bans[id]&&S.day<=S.rap.bans[id]);
function heatColor(h){return h>=60?'#d32f2f':h>=30?'#f57c00':h>0?'#fbc02d':'#43a047'}
function heatPill(){const h=Math.round(R().heat);return'<span class="heat" style="background:'+heatColor(h)+'">🔥 Heat '+h+'</span> '}
function addHeat(n){R().heat=Math.min(100,R().heat+n)}
function storeOf(it){return STORES.filter(s=>s.id===it.store)[0]}
function security(it){const s=storeOf(it),hi=s?s.tier[1]:100;const a=Math.min(1,Math.log(hi)/Math.log(30000)),b=Math.min(1,Math.log(Math.max(1,priceOf(it)))/Math.log(50000));return Math.max(.05,Math.min(1,a*.6+b*.4))}

/* ---------- court ---------- */
function courtCase(c){
  const r=R(),prior=r.offenses;r.offenses++;r.caught++;addHeat(c.heat||15);
  const fine=Math.max(10,Math.round(c.base*(1.5+.25*Math.min(2,prior)))),cs=Math.min(6,2+prior),forced=prior>=2;
  let ban='';if(c.store){r.storeOff[c.store]=(r.storeOff[c.store]||0)+1;const n=r.storeOff[c.store];if(n>=2){r.bans[c.store]=S.day+2*(n-1);ban='<p>🚫 <b>Banned from '+esc(storeOf({store:c.store}).name)+' until Day '+r.bans[c.store]+'.</b> Your photo is now on the wall behind the register.</p>'}}
  const entry={day:S.day,what:c.what,pen:cs+' shifts community service'};r.record.unshift(entry);if(r.record.length>30)r.record.length=30;
  r.cs+=cs;notify('🚨 '+c.what+': '+(forced?cs+' shifts community service (assigned)':'court date pending'));sfx('bad');save();
  sheet('<h3>🚨 Busted!</h3><div style="font-size:44px;text-align:center">👮‍♀️'+(c.emoji||'🛍️')+'</div><p>'+esc(c.what)+'.'+(c.confiscated?' The item has been confiscated.':'')+'</p>'+
    '<div class="small">Offense #'+r.offenses+' · Heat '+Math.round(r.heat)+'/100</div>'+ban+
    (forced?'<p>⚖️ Judge Judgy has seen enough of you. <b>'+cs+' shifts of community service</b>, no fine option. Paid jobs are blocked until it\'s done.</p><button class="btn alt big" id="docs">🧹 Yes, Your Honor</button>':
     '<p>⚖️ Choose your penalty:</p><button class="btn big" id="payfine">💸 Pay a '+money(fine)+' fine</button><button class="btn alt big" id="docs">🧹 '+cs+' shifts of community service (unpaid, blocks paid jobs)</button>'));
  $('#docs').onclick=()=>{closeSheet();toast('🧹 Report to 💼 Work for community service');rerender()};
  if($('#payfine'))$('#payfine').onclick=()=>openPay('Court fine',fine,()=>{r.cs=Math.max(0,r.cs-cs);r.finesPaid+=fine;entry.pen='Fine '+money(fine);toast('⚖️ Fine paid. Try to stay boring.');save();rerender()});
}

/* ---------- shoplifting stealth minigame ---------- */
function stealAttempt(it){
  if(isBanned(it.store)){toast('🚫 You\'re banned here');return}
  const sec=security(it),half=.22+.5*sec,speed=1.3+2.4*sec,lvl=sec<.3?'low 😴':sec<.6?'medium 👀':'HIGH 🚨';
  sheet('<h3>🤏 Five-finger discount?</h3><div class="small">'+esc(it.name)+' · security <b>'+lvl+'</b>. Tap GRAB while the camera looks away. Getting caught means a fine or community service. '+heatPill()+'</div><canvas id="stc"></canvas><div class="bar"><div id="stt"></div></div>'+
    '<button class="btn big" id="grab" style="background:#7b1fa2;box-shadow:0 2px 0 #4a148c">🤏 GRAB</button><button class="btn alt big" id="walk">😇 Never mind (buy it like a normal person)</button>');
  const W=Math.min(window.innerWidth-40,420),H=170,x=setupCanvas($('#stc'),W,H),img=new Image();img.src=thumb(it);
  const t0=Date.now(),LIMIT=7000;let ang=0,done=false;
  function draw(){const t=(Date.now()-t0)/1000;ang=Math.sin(t*speed)*1.15;const seen=Math.abs(ang)<half;
    x.fillStyle='#fff3e0';x.fillRect(0,0,W,H);x.fillStyle='#bcaaa4';x.fillRect(0,H-40,W,40);x.fillStyle='#8d6e63';x.fillRect(W/2-60,H-58,120,10);
    const cx=W/2,cy=14,len=H*1.4;x.fillStyle=seen?'rgba(244,67,54,.35)':'rgba(255,235,59,.3)';x.beginPath();x.moveTo(cx,cy);
    x.arc(cx,cy,len,Math.PI/2+ang-half,Math.PI/2+ang+half);x.closePath();x.fill();
    x.font='26px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('📹',cx,cy);
    if(img.complete)x.drawImage(img,cx-30,H-110,60,60);x.font='bold 13px sans-serif';x.fillStyle=seen?'#d32f2f':'#2e7d32';x.fillText(seen?'👁️ WATCHING':'✅ looking away',cx,H-18);
    const p=1-(Date.now()-t0)/LIMIT;setBar($('#stt'),p);
    if(p<=0&&!done){done=true;clearInterval(stealIv);closeSheet();toast('😅 You lost your nerve. Probably for the best.')}}
  clearInterval(stealIv);stealIv=setInterval(draw,30);draw();
  $('#walk').onclick=()=>{closeSheet();buy(it)};
  $('#grab').onclick=()=>{if(done)return;done=true;clearInterval(stealIv);const seen=Math.abs(ang)<half;
    let caught=seen?Math.random()<.9:Math.random()<(.04+.22*sec+R().heat/400);
    if(window.__stealForce)caught=window.__stealForce==='caught';
    closeSheet();
    if(!caught){S.owned[it.id]=(S.owned[it.id]||0)+1;if(it.rare)S.stock[it.id]=(S.stock[it.id]||0)+1;R().stolen++;const h=Math.round(3+8*sec);addHeat(h);
      sfx('buy');toast('😈 Got away with it… for now. Heat +'+h);save();rerender()}
    else courtCase({what:'Caught shoplifting '+it.name+' from '+storeOf(it).name,base:priceOf(it),store:it.store,heat:Math.round(15+20*sec),confiscated:true,emoji:'🤏'})};
}

/* ---------- community service ---------- */
function makeLitter(el,api){
  el.innerHTML='<div class="card small center">Pick up <b>10+</b> pieces of litter this shift for it to count. Unpaid. Character-building.</div><canvas id="cv"></canvas>';
  const W=Math.min(window.innerWidth-24,420),H=330,cv=el.querySelector('#cv'),x=setupCanvas(cv,W,H);let L=[],sp=0;
  const grab=o=>{L.splice(L.indexOf(o),1);api.pay(0)};
  cv.addEventListener('pointerdown',e=>{const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;const o=L.filter(o=>Math.hypot(o.x-px,o.y-py)<30)[0];if(o)grab(o)});
  function draw(){x.fillStyle='#a5d6a7';x.fillRect(0,0,W,H);x.fillStyle='#81c784';for(let i=0;i<8;i++){circ(x,(i*97)%W,(i*61)%H,30);x.fill()}x.fillStyle='#d7ccc8';x.fillRect(0,H/2-14,W,28);
    x.font='30px serif';x.textAlign='center';x.textBaseline='middle';L.forEach(o=>{x.globalAlpha=Math.min(1,o.life);x.fillText(o.e,o.x,o.y)});x.globalAlpha=1;x.fillText('🧹',W-24,H-24)}
  draw();
  return{tick(dt){sp-=dt;if(sp<=0){sp=.6;L.push({x:30+Math.random()*(W-60),y:30+Math.random()*(H-60),e:pick(['🥤','🍟','📰','🧃','🍌','🥫','🧻']),life:3})}L.forEach(o=>{o.life-=dt});L=L.filter(o=>o.life>0);draw()},
    bot(){if(!L.length)L.push({x:50,y:50,e:'🥤',life:3});grab(L[0])}};
}
const CS_JOB={id:'cs',name:'Community Service',emoji:'🧹',cs:true,make:makeLitter};
function csCard(v){const r=R();if(r.cs<=0)return;
  v.insertAdjacentHTML('beforeend','<div class="card" style="border:3px solid #f57c00"><div class="row"><span style="font-size:40px">🧹</span><div style="flex:1"><b>Community Service</b><div class="small">'+r.cs+' shift'+(r.cs>1?'s':'')+' left · unpaid · paid jobs blocked until done</div></div><button class="btn" id="csgo" style="background:#f57c00;box-shadow:0 2px 0 #bf5f00">Start</button></div></div>');
  $('#csgo').onclick=()=>{lastResult=null;startShift(CS_JOB)}}
function csEnd(s){const r=R(),okk=s.count>=10;if(okk){r.cs=Math.max(0,r.cs-1);r.csDone++;addHeat(-5);if(!r.cs){notify('⚖️ Community service complete. Society (cautiously) welcomes you back.');R().heat=Math.max(0,R().heat-10)}}
  lastResult={job:CS_JOB,earned:0,count:s.count,levelUp:0};save();toast(okk?'🧹 Shift counted! '+r.cs+' left':'🧹 Only '+s.count+' pieces. That shift didn\'t count.');sfx(okk?'coin':'bad')}

/* ---------- Back Alley (counterfeits) ---------- */
const FAKES=ITEMS.filter(i=>i.fake);
const alleyOpen=()=>S.day>=3||R().alley;
const alleyPrice=it=>Math.max(5,nicePrice(ITEM[it.real].price*.08));
function alleyStock(){return shuffle(FAKES,rng(S.day*31+7)).slice(0,8)}
function maybeContact(){if(!R().alley&&Math.random()<.35){R().alley=true;notify('🕶️ "Shady Steve" slid into your DMs: "u like designer? cheap. back alley behind the food court. tell no one."');setTimeout(()=>toast('🕶️ New contact unlocked the Back Alley…'),2000)}}
function alleyCard(){const d=document.createElement('div');d.className='store';d.style.background='#263238';
  d.innerHTML='<span style="font-size:34px">🚪</span><div style="flex:1">Back Alley<small>'+(alleyOpen()?'"Designer" goods. No receipts. No questions.':'🔒 Locked: come back Day 3, or know a guy on Facenook')+'</small></div>';
  d.onclick=()=>{if(!alleyOpen()){sfx('bad');toast('🔒 The door is locked. A sign says "Day 3".');return}sfx('click');go('mall','alley')};return d}
function renderAlley(v){
  v.innerHTML='<div class="store" style="background:#263238"><span style="font-size:34px">🕶️</span><div>Back Alley<small>Stock changes daily. Everything is 100% authentic*</small></div></div>'+
    '<div class="row sp" style="margin-bottom:8px"><button class="btn alt" id="back">← Mall</button>'+heatPill()+'</div>'+
    '<div class="card small">*Counterfeit. Fine to wear. Resale value is trash, and passing fakes off as real on Fleabay/Facenook can get you busted. Buying here adds a little Heat.</div><div class="grid" id="ag"></div>';
  $('#back').onclick=()=>go('mall');
  alleyStock().forEach(it=>{const p=alleyPrice(it),real=ITEM[it.real],d=document.createElement('div');d.className='item';
    d.innerHTML='<img alt="" src="'+thumb(it)+'"><span class="badge" style="background:#455a64">COUNTERFEIT</span><div class="nm">'+esc(it.name)+'</div><div class="small">"Basically a '+esc(real.name)+'" ('+money(real.price)+')</div><div class="pr">'+money(p)+'</div><div class="small">Owned ×'+(S.owned[it.id]||0)+'</div><button class="btn" style="background:#455a64;box-shadow:0 2px 0 #263238">Buy (cash/card)</button>';
    d.querySelector('button').onclick=()=>openPay('Back Alley: '+it.name,p,()=>{S.owned[it.id]=(S.owned[it.id]||0)+1;R().alleyBought++;addHeat(2);
      if(it.slot&&!S.equipped[it.slot])S.equipped[it.slot]=it.id;sfx('buy');toast('🕶️ Pleasure doing business. Heat +2');save();rerender()});
    $('#ag').appendChild(d)});
}
/* selling fakes as real: pays like real, may get busted */
function fakeBust(it,claimed,where){let bust=Math.random()<(.25+R().heat/250);if(window.__bustForce!==undefined)bust=window.__bustForce;
  if(!bust){addHeat(4);return false}R().busted++;
  setTimeout(()=>courtCase({what:'Selling a counterfeit "'+ITEM[it.real].name+'" on '+where,base:claimed,heat:20,confiscated:true,emoji:'🕶️'}),50);return true}
function fbSell(){const own=Object.keys(S.owned).map(id=>ITEM[id]);
  sheet('<h3>📣 Sell on Facenook</h3><div class="small">A buyer messages you with an offer. Counterfeits get offers like the real thing… if nobody looks too closely.</div>'+(own.length?own.map(it=>'<div class="slot"><span class="row" style="flex-wrap:nowrap"><img src="'+thumb(it)+'" style="width:44px;border-radius:8px"><span>'+esc(it.fake?ITEM[it.real].name+' (wink)':it.name)+'<br><span class="small">'+(it.fake?'🕶️ counterfeit · real value '+money(it.price):'worth '+money(it.price))+'</span></span></span><button class="btn" data-s="'+it.id+'">Post</button></div>').join(''):'<p>You don\'t own anything.</p>'));
  onAll($('#sheet'),'[data-s]',b=>{const it=ITEM[b.dataset.s],claim=it.fake?ITEM[it.real]:it,offer=Math.max(1,Math.round(claim.price*(.4+Math.random()*.3))),buyer=pick(FB_SELLERS);
    sheet('<h3>📣 '+esc(claim.name)+'</h3><div class="chat"><div class="bub">'+buyer[1]+' '+esc(buyer[0])+': is this still available?? I\'ll give you '+money(offer)+' rn</div></div>'+(it.fake?'<div class="small">🕶️ It\'s a fake. If they notice, that\'s a fraud charge.</div>':'')+
      '<button class="btn green big" id="sok">🤝 Sell for '+money(offer)+'</button><button class="btn alt big" id="sno">Nah</button>');
    $('#sno').onclick=closeSheet;
    $('#sok').onclick=()=>{closeSheet();removeOne(it.id);
      if(it.fake&&fakeBust(it,claim.price,'Facenook')){save();rerender();return}
      if(it.fake)R().fakesSold++;S.cash+=offer;bumpCash();sfx('coin');toast('💸 Sold for '+money(offer)+'!');save();rerender()}})}

/* ---------- daily: heat decay, bans, raids ---------- */
function crimeNewDay(){const r=R();r.heat=Math.max(0,Math.round(r.heat*.85-4));
  Object.keys(r.bans).forEach(k=>{if(S.day>r.bans[k]){delete r.bans[k];notify('🚪 Your ban from '+storeOf({store:k}).name+' has expired. Behave.')}});
  let raid=r.heat>=50&&Math.random()<(r.heat-40)/120;if(window.__raidForce!==undefined)raid=window.__raidForce;
  if(raid){let n=0;Object.keys(S.owned).forEach(id=>{if(ITEM[id].fake){n+=S.owned[id];while(S.owned[id])removeOne(id)}});
    const fine=Math.round(75+4*r.heat);if(S.cash>=fine)S.cash-=fine;else S.card.bal+=fine;r.raids++;r.finesPaid+=fine;r.heat=Math.max(0,r.heat-25);
    r.record.unshift({day:S.day,what:'Police raid on your apartment',pen:'Fine '+money(fine)+(n?', '+n+' counterfeit'+(n>1?'s':'')+' seized':'')});
    notify('🚔 POLICE RAID! They seized '+n+' counterfeit item'+(n===1?'':'s')+' and fined you '+money(fine)+'. Your neighbors are now very interested in you.')}}

/* ---------- Me: criminal record ---------- */
function recordCard(){const r=R(),bans=Object.keys(r.bans).filter(isBanned);
  return'<div class="card"><div class="lbl" style="margin-top:0">🚔 Criminal record</div>'+heatPill()+'<div class="bar"><div style="width:'+r.heat+'%;background:'+heatColor(r.heat)+'"></div></div>'+
    [['Offenses',r.offenses],['Items shoplifted (got away)',r.stolen],['Times caught',r.caught],['Counterfeits sold',r.fakesSold],['Fines paid',money(r.finesPaid)],['Community service done / owed',r.csDone+' / '+r.cs],['Police raids',r.raids],['Store bans',bans.length?bans.map(b=>storeOf({store:b}).name+' (→Day '+r.bans[b]+')').join(', '):'none']]
      .map(a=>'<div class="slot"><span>'+a[0]+'</span><b>'+a[1]+'</b></div>').join('')+
    (r.record.length?'<div class="lbl">Rap sheet</div>'+r.record.slice(0,8).map(e=>'<div class="slot"><span>Day '+e.day+': '+esc(e.what)+'</span><span class="small">'+esc(e.pen)+'</span></div>').join(''):'<div class="small">Squeaky clean. Suspiciously so.</div>')+
    '<div class="small" style="margin-top:6px">Heat cools off a bit every day. High Heat = more security attention and police raids.</div></div>'}

/* ---------- header overflow menu ---------- */
function openMore(){sheet('<h3>Menu</h3>'+heatPill()+'<button class="btn alt big" id="mSnd">'+(S.muted?'🔇 Sound: off':'🔊 Sound: on')+'</button><button class="btn alt big" id="mTut">❓ Tutorial</button><button class="btn alt big" id="mMe">⭐ Stats, record & saves</button><button class="btn alt big" id="mMail">📬 Mailbox</button>');
  $('#mSnd').onclick=()=>{S.muted=!S.muted;save();sfx('click');openMore()};$('#mTut').onclick=()=>{closeSheet();showTut(0)};$('#mMe').onclick=()=>{closeSheet();go('me')};$('#mMail').onclick=()=>openMail()}

ACH.push(['steal','Five-Finger Discount 🤏','Get away with shoplifting',s=>s.rap.stolen>0],['caught','Caught Red-Handed 🚨','Get caught shoplifting',s=>s.rap.caught>0],
 ['banned','Persona Non Grata 🚫','Get banned from a store',s=>Object.keys(s.rap.storeOff).some(k=>s.rap.storeOff[k]>=2)],['reformed','Reformed 😇','Finish all your community service',s=>s.rap.csDone>0&&s.rap.cs===0],
 ['alley','Alley Cat 🕶️','Buy something in the Back Alley',s=>s.rap.alleyBought>0],['kingpin','Counterfeit Kingpin 👑','Sell 3 fakes without getting busted',s=>s.rap.fakesSold>=3],
 ['raided','Knock Knock 🚔','Survive a police raid',s=>s.rap.raids>0]);
