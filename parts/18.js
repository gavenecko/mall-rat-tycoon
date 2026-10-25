/* ===== v13: readable photoshoot, job hints, toast strip, story cutscenes, seasonal encounters, piercings & face tats ===== */
/* ---- shoot icons (opaque, outlined) ---- */
function shootIcon(x,k,cx,cy,s){x.save();x.globalAlpha=1;x.translate(cx,cy);x.scale(s/40,s/40);x.lineJoin='round';x.lineCap='round';const st=(c,w)=>{x.strokeStyle=OUT;x.lineWidth=w+2.4;x.stroke();x.strokeStyle=c;x.lineWidth=w;x.stroke()};
  if(k==='golden'){for(let i=0;i<8;i++){const a=i*Math.PI/4;x.beginPath();x.moveTo(Math.cos(a)*11,Math.sin(a)*11);x.lineTo(Math.cos(a)*17,Math.sin(a)*17);st('#ffb300',3)}oCirc(x,0,0,9,'#ffca28')}
  else if(k==='neon'){oRect(x,-16,-16,32,32,8,'#311b92');x.beginPath();x.moveTo(3,-12);x.lineTo(-7,2);x.lineTo(0,2);x.lineTo(-3,12);x.lineTo(8,-3);x.lineTo(1,-3);x.closePath();x.fillStyle='#ff4fd8';x.fill();x.strokeStyle=OUT;x.lineWidth=1.4;x.stroke()}
  else if(k==='vintage'){oRect(x,-17,-12,34,24,3,'#3e2723');x.fillStyle='#fff';for(let i=-14;i<15;i+=7){x.fillRect(i,-10,3,3);x.fillRect(i,7,3,3)}oRect(x,-9,-5,18,10,2,'#d7a35a')}
  else if(k==='cool'){for(let i=0;i<3;i++){const a=i*Math.PI/3;x.beginPath();x.moveTo(Math.cos(a)*16,Math.sin(a)*16);x.lineTo(-Math.cos(a)*16,-Math.sin(a)*16);st('#4fc3f7',3.4)}oCirc(x,0,0,4,'#e1f5fe')}
  else if(k==='peace'){oRect(x,-7,-17,6,20,3,'#ffcc99');oRect(x,2,-17,6,20,3,'#ffcc99');x.save();x.translate(0,0);oRect(x,-10,0,21,16,6,'#ffcc99');x.restore()}
  else if(k==='flip'){x.beginPath();x.moveTo(-14,10);x.bezierCurveTo(-18,-14,10,-20,16,-6);x.bezierCurveTo(8,-10,0,-4,4,8);x.bezierCurveTo(-2,2,-8,6,-14,10);x.closePath();x.fillStyle='#8d5524';x.fill();x.strokeStyle=OUT;x.lineWidth=1.5;x.stroke();
    x.beginPath();x.moveTo(10,10);x.lineTo(18,8);st('#90a4ae',1.6);x.beginPath();x.moveTo(8,15);x.lineTo(16,15);st('#90a4ae',1.6)}
  else if(k==='selfie'){oRect(x,-10,-17,20,34,4,'#263238');oRect(x,-7,-12,14,22,2,'#81d4fa');oCirc(x,0,13.5,1.6,'#b0bec5')}
  else{x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?7:17;x.lineTo(Math.cos(a)*r,Math.sin(a)*r)}x.closePath();x.fillStyle='#ffd600';x.fill();x.strokeStyle=OUT;x.lineWidth=1.5;x.stroke()}
  x.restore()}
function shootIconURL(k){const c=document.createElement('canvas');c.width=c.height=88;shootIcon(c.getContext('2d'),k,44,44,76);return c.toDataURL()}
function drawMark(x,cx,cy,good){x.save();x.globalAlpha=1;oCirc(x,cx,cy,11,good?'#43a047':'#e53935');x.strokeStyle='#fff';x.lineWidth=3;x.lineCap='round';x.beginPath();if(good){x.moveTo(cx-5,cy);x.lineTo(cx-1,cy+4);x.lineTo(cx+6,cy-4)}else{x.moveTo(cx-4,cy-4);x.lineTo(cx+4,cy+4);x.moveTo(cx+4,cy-4);x.lineTo(cx-4,cy+4)}x.stroke();x.restore()}
const SHOOT_ROUNDS=12;
function shootLimit(n){return Math.max(6000,11000-(n-1)*450)}
makeShoot=function(el,api){AV.mood='smile';
  el.innerHTML='<div class="bar"><div id="pat"></div></div><canvas id="cv" style="border-radius:14px"></canvas><button class="btn big green" id="sready">✅ Ready!</button><div class="small center">Filter</div><div class="pad" id="pf"></div><div class="small center">Pose</div><div class="pad" id="pp"></div><div class="small center">Face</div><div class="pad" id="pface"></div>';
  const W=Math.min(window.innerWidth-24,420),H=250,x=setupCanvas(el.querySelector('#cv'),W,H);let want,f=null,p=null,t0,limit,n=0,likes=0,flash=0,phase='brief',pt=gnow(),res=null,brief='';
  const FN=k=>SHOOT_F.filter(q=>q[0]===k)[0],PN=k=>SHOOT_P.filter(q=>q[0]===k)[0];
  function next(){if(n>=SHOOT_ROUNDS){phase='done';api.done&&api.done();if(shift){shift.end=gnow()}return}n++;want={f:pick(SHOOT_F),p:pick(SHOOT_P)};brief=pick(BRIEFS);f=null;p=null;limit=shootLimit(n);phase='brief';pt=gnow();$('#sready').hidden=false;setBar($('#pat'),1);draw()}
  function go(){if(phase!=='brief')return;phase='play';t0=gnow();$('#sready').hidden=true;sfx('click');draw()}
  function tile(k,label,val,X,Y,w,h){oRect(x,X,Y,w,h,12,'#ffffff');shootIcon(x,k,X+h/2,Y+h/2,h*.7);x.fillStyle='#6a1b9a';x.font='bold 11px sans-serif';x.textAlign='left';x.textBaseline='alphabetic';x.fillText(label,X+h,Y+h*.42);x.fillStyle='#222';x.font='bold '+(w<170?13:15)+'px sans-serif';x.fillText(val,X+h,Y+h*.75)}
  function draw(){const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#fce4ec');g.addColorStop(1,'#e1bee7');x.globalAlpha=1;x.fillStyle=g;x.fillRect(0,0,W,H);
    const sc=(H-70)/170;x.save();x.translate(W/2,H-6-162*sc);x.scale(sc,sc);drawAvatar(x,S.char,S.equipped);x.restore();
    if(f&&phase!=='brief'){x.fillStyle=FN(f)[3];x.fillRect(0,56,W,H-56)}if(p&&phase!=='brief')shootIcon(x,p,W/2+70,110,44);
    if(phase==='brief'){x.fillStyle='rgba(255,255,255,.93)';x.fillRect(0,0,W,H);x.fillStyle='#6a1b9a';x.font='bold 18px sans-serif';x.textAlign='center';x.fillText('📋 CLIENT BRIEF · round '+n+'/'+SHOOT_ROUNDS,W/2,28);
      const tw=W-40;tile(want.f[0],'FILTER',want.f[2],20,44,tw,64);tile(want.p[0],'POSE',want.p[2],20,118,tw,64);
      x.fillStyle='#555';x.font='italic 12px sans-serif';x.textAlign='center';x.fillText(brief,W/2,204);const left=Math.max(0,Math.ceil((4500-(gnow()-pt))/1000));x.fillStyle='#222';x.font='bold 13px sans-serif';x.fillText('Tap Ready when you\'ve got it (auto-start in '+left+'s)',W/2,230)}
    else{x.fillStyle='rgba(255,255,255,.95)';x.fillRect(0,0,W,54);const tw=(W-24)/2;tile(want.f[0],'FILTER',want.f[2],8,5,tw,44);tile(want.p[0],'POSE',want.p[2],16+tw,5,tw,44);
      x.fillStyle='#222';x.font='bold 13px sans-serif';x.textAlign='left';x.fillText('❤ '+likes.toLocaleString(),8,72);x.textAlign='right';x.fillText('Drip '+dripScore(),W-8,72)}
    if(phase==='result'&&res){x.fillStyle='rgba(255,255,255,.92)';x.fillRect(16,84,W-32,108);x.strokeStyle=OUT;x.lineWidth=1.5;x.strokeRect(16,84,W-32,108);x.textAlign='left';x.font='bold 14px sans-serif';
      [[res.fOk,'Filter: '+(res.f?FN(res.f)[2]:'none'),res.fOk?'':'wanted '+want.f[2]],[res.pOk,'Pose: '+(res.p?PN(res.p)[2]:'none'),res.pOk?'':'wanted '+want.p[2]]].forEach((r,i)=>{drawMark(x,36,112+i*40,r[0]);x.fillStyle='#222';x.fillText(r[1],54,110+i*40);x.fillStyle='#c62828';x.font='12px sans-serif';x.fillText(r[2],54,125+i*40);x.font='bold 14px sans-serif'});
      x.textAlign='center';x.fillStyle=res.fOk&&res.pOk?'#2e7d32':'#c62828';x.fillText(res.msg,W/2,186)}
    if(flash>0){x.fillStyle='rgba(255,255,255,'+flash+')';x.fillRect(0,0,W,H)}}
  el._draw=draw;
  function finish(timeout){const fOk=f===want.f[0],pOk=p===want.p[0];res={f:f,p:p,fOk:fOk,pOk:pOk,msg:''};
    if(fOk&&pOk){const sp=Math.max(0,1-(gnow()-t0)/limit);api.pay(4+dripScore()/25+sp*4);S.stats9.shoots++;likes+=Math.round(50+dripScore()*20*(1+sp));flash=1;sfx('click');res.msg='Nailed it! Client is obsessed.'}
    else{res.msg=timeout?'⌛ Too slow, the light is gone.':'📉 Off-brand!';api.miss(timeout?'⌛ The light is gone. Client ghosted.':'📉 Off-brand! Client wanted '+want.f[2]+' + '+want.p[2])}
    S.stats13.rounds++;phase='result';pt=gnow();draw()}
  function check(){if(phase==='brief')go();if(phase!=='play')return;if(!f||!p){draw();return}finish(false)}
  $('#sready').onclick=go;
  SHOOT_F.forEach(q=>padBtn($('#pf'),'<img alt="" src="'+shootIconURL(q[0])+'" style="width:34px;height:34px;display:block;margin:0 auto"><span class="small">'+q[2]+'</span>',()=>{if(phase==='result')return;f=q[0];check()}));
  SHOOT_P.forEach(q=>padBtn($('#pp'),'<img alt="" src="'+shootIconURL(q[0])+'" style="width:34px;height:34px;display:block;margin:0 auto"><span class="small">'+q[2]+'</span>',()=>{if(phase==='result')return;p=q[0];check()}));
  PHOTO_FACES.forEach(e=>padBtn(el.querySelector('#pface'),e[1]+'<br><span class="small">'+e[2]+'</span>',()=>{AV.mood=e[0];S.stats12.faces++;draw()}));
  next();
  return{paused(){return phase==='brief'||phase==='result'},phase(){return phase},
    tick(dt){const now=gnow();if(flash>0)flash=Math.max(0,flash-dt*3);
      if(phase==='brief'){if(now-pt>=4500)go();else draw();return}if(phase==='result'){if(now-pt>=1400)next();else if(flash>0)draw();return}
      const r=1-(now-t0)/limit;if(r<=0){finish(true);return}setBar($('#pat'),r);if(flash>0)draw()},
    bot(){if(phase==='result')next();if(phase==='brief')go();f=want.f[0];p=want.p[0];finish(false);next()}}};
/* ---- first-time job hints ---- */
const JOB_HINTS={burger:'Read the ticket, then tap ingredients bottom → top. Bun first!',cashier:'Tap bills and coins until the change matches exactly. You have 15 seconds per customer.',
 shelf:'Look at the product colour, tap the bin of the SAME colour. It speeds up slowly.',barista:'Memorize the drink while it shows, then tap the ingredients in the same order.',
 dog:'Drag or tap left/right to steer. Bones = cash, puddles/cats/cones = ouch.',pizza:'Tap TOSS when the glowing house is inside the zone.',
 shoot:'Each round: read the client brief (filter + pose), tap Ready, then pick that filter AND pose. You get feedback after every round.',litter:'Tap the trash before it blows away.'};
function jobHintHTML(j){return'<div class="card" id="jhint" style="border:3px solid #7c4dff;position:relative;z-index:3"><b>👋 First shift: '+esc(j.name)+'</b><div class="small" style="font-size:14px;margin:6px 0">'+(JOB_HINTS[j.id]||j.desc)+'</div><div class="small">The shift clock is paused until you\'re ready.</div><button class="btn big green" id="jhok">Got it, start!</button></div>'}
const _runShift=runShift;runShift=function(v){_runShift(v);const j=shift&&shift.job;if(!j||j.cs||(S.hints&&S.hints[j.id]))return;shift.paused=true;
  const a=$('#jarea');a.insertAdjacentHTML('beforebegin',jobHintHTML(j));a.style.opacity='.35';a.style.pointerEvents='none';
  $('#jhok').onclick=()=>{S.hints[j.id]=1;shift.paused=false;const h=$('#jhint');if(h)h.remove();a.style.opacity='';a.style.pointerEvents='';save();sfx('click')}};
/* ---- toast strip (in flow under the header: never covers text) ---- */
(function(){const st=document.createElement('style');st.textContent='#toast{position:sticky!important;top:var(--hh,60px)!important;bottom:auto!important;left:auto!important;transform:none!important;width:auto!important;max-width:none!important;margin:4px 10px 0!important;padding:0!important;z-index:4!important;display:flex;flex-direction:column;gap:3px;align-items:stretch!important}'+
 '#toast:empty{display:none!important}#toast .tq{max-width:none;text-align:center;border-radius:12px;font-size:13px}';document.head.appendChild(st);
 const fix=()=>{const h=document.querySelector('header'),t=$('#toast');if(h&&t&&t.previousElementSibling!==h)h.insertAdjacentElement('afterend',t);if(h)document.documentElement.style.setProperty('--hh',h.offsetHeight+'px')};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();window.addEventListener('resize',fix);toastPlace=function(e){fix();e.classList.remove('tqtop','tqmid');while(e.children.length>2)e.removeChild(e.firstChild)}})();
/* ---- seasonal encounters ---- */
NPCS.ghostkid={n:'Kid in a Shrek costume',ch:{gender:'male',body:'slim',skin:'#7cb342',hair:'buzz',hairColor:'#558b2f',beard:'none'}};
NPCS.turkey={n:'Gary the Turkey Mascot',ch:{gender:'nb',body:'broad',skin:'#ffdbac',hair:'afro',hairColor:'#8d5524',beard:'none'}};
NPCS.santa={n:'Mall Santa (on break)',ch:{gender:'male',body:'broad',skin:'#ffdbac',hair:'short',hairColor:'#f5f5f5',beard:'wizard',beardColor:'#ffffff'}};
NPCS.cupid={n:'Cupid with a clipboard',ch:{gender:'nb',body:'slim',skin:'#f1c27d',hair:'bob',hairColor:'#ff6fb5',beard:'none',lip:'#d84a6b'}};
NPCS.bunny={n:'Easter Bunny (just a guy, Kevin)',ch:{gender:'male',body:'average',skin:'#e0ac69',hair:'mullet',hairColor:'#c9c9c9',beard:'stubble'}};
NPCS.lifeguard={n:'Sunscreen Kiosk Lifeguard',ch:{gender:'female',body:'curvy',skin:'#c68642',hair:'ponytail',hairColor:'#e6c27a',beard:'none'}};
ENC.push({k:'ghostkid',season:'spooky',line:'"TRICK OR TREAT. I am Shrek. This is my swamp (the food court)."',a:['Give candy money','"Nice ogre"'],r:[g=>({msg:'He gives you a fun-size Snickers in return. Business! -$2',cash:-2}),g=>g?{msg:'His mom tips you for the compliment. +$10',cash:10}:{msg:'He growls. It\'s actually scary.',cash:0}]},
 {k:'turkey',season:'thanks',line:'"Gobble gobble, want a coupon? Gobble. Please. My manager is watching."',a:['Take a coupon','Do the turkey dance'],r:[g=>({msg:'Coupon: 15% off gravy. You don\'t need gravy. +$5 anyway',cash:5}),g=>g?{msg:'The crowd loved it! Tips: +$20',cash:20}:{msg:'You pulled a hamstring. Worth it.',cash:0}]},
 {k:'santa',season:'holly',line:'"Ho ho… hold on, I\'m on my 15. What do you want for Christmas, kid?"',a:['"A car"','"World peace"'],r:[g=>g?{msg:'"I\'ll see what I can do." He slips you a $25 "elf bonus".',cash:25}:{msg:'He laughs for a full minute. Then coughs.',cash:0},g=>({msg:'He tears up. Gives you a candy cane. +$10 for your "nice list" fund.',cash:10})]},
 {k:'cupid',season:'galentine',line:'"Hi! Are you single? Would you like to buy a premium Cupid subscription?"',a:['"I\'m my own valentine"','Buy the trial ($10)'],r:[g=>({msg:'Cupid respects it. Gives you a chocolate. +$5',cash:5}),g=>g?{msg:'The trial matched you with… a 20% off pretzel coupon. +$15',cash:5}:{msg:'You were matched with Kevin, the Easter Bunny. -$10',cash:-10}]},
 {k:'bunny',season:'spring',line:'"Hey. I\'m the bunny. Want to help me hide eggs? Union rules say I need a buddy."',a:['Help hide eggs','Find the eggs instead'],r:[g=>({msg:'Kevin splits his hourly with you. +$15',cash:15}),g=>g?{msg:'You found the golden egg! +$30',cash:30}:{msg:'You found a 2019 egg. Do not open it.',cash:0}]},
 {k:'lifeguard',season:'summer',line:'"Ma\'am/sir! SPF check! You\'re indoors, but the vibes are UV."',a:['Accept SPF 100','"I tan in mall light"'],r:[g=>({msg:'Free sample. Smells like coconut and regret. +$0',cash:0,fit:1}),g=>g?{msg:'She is impressed. Gives you a free visor coupon. +$10',cash:10}:{msg:'Mall-light burn. Somehow. -$5 for aloe',cash:-5}]});
function encPool(){const sk=season().k,sea=ENC.filter(e=>e.season===sk),base=ENC.filter(e=>!e.season);return sea.length?base.concat(sea,sea):base}
/* ---- piercings & face tattoos ---- */
const PIERCE={none:'None',studs:'Ear studs',hoops:'Hoops',nose:'Nose ring',brow:'Brow ring',septum:'Septum'};
const FTATS={none:'None',star:'Star',tear:'Teardrop',heart:'Heart',dots:'Three dots'};
BARBER.pierce=15;BARBER.ftat=30;
function drawPierce(x,ch){const p=ch.pierce,t=ch.ftat;if((!p||p==='none')&&(!t||t==='none'))return;x.save();x.globalAlpha=1;const gold='#ffc107';
  if(t==='star'){x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?1.4:3.4;x.lineTo(19+Math.cos(a)*r,63+Math.sin(a)*r)}x.closePath();x.fillStyle='#263238';x.fill()}
  else if(t==='tear'){x.fillStyle='#263238';x.beginPath();x.moveTo(-13,61.5);x.quadraticCurveTo(-11,65.5,-13,66.5);x.quadraticCurveTo(-15,65.5,-13,61.5);x.fill()}
  else if(t==='heart'){x.fillStyle='#c2185b';x.beginPath();x.moveTo(19,66);x.bezierCurveTo(15,63,16.5,60,19,61.8);x.bezierCurveTo(21.5,60,23,63,19,66);x.fill()}
  else if(t==='dots'){x.fillStyle='#263238';[[17,62],[20,62],[18.5,64.6]].forEach(q=>{circ(x,q[0],q[1],.95);x.fill()})}
  const ring=(cx,cy,r,a0,a1)=>{x.beginPath();x.arc(cx,cy,r,a0,a1);x.strokeStyle=OUT;x.lineWidth=2.6;x.stroke();x.beginPath();x.arc(cx,cy,r,a0,a1);x.strokeStyle=gold;x.lineWidth=1.4;x.stroke()};
  if(p==='studs'){[-1,1].forEach(f=>{oCirc(x,f*29.5,57.5,1.7,gold)})}else if(p==='hoops'){[-1,1].forEach(f=>ring(f*29.5,60.5,3.4,0,Math.PI*2))}
  else if(p==='nose')ring(2.2,61.2,1.9,-.6,Math.PI*1.3);else if(p==='brow')ring(15.5,46.5,2.1,-1.2,Math.PI*1.2);else if(p==='septum')ring(0,61.6,2,0,Math.PI);
  x.restore()}
const _drawHead13=drawHead;drawHead=function(x,ch){_drawHead13(x,ch);drawPierce(x,ch)};
const _barberSheet=barberSheet;barberSheet=function(){_barberSheet();const d=barbDraft,bp=$('#bpay');if(!d||!bp)return;
  const chips=(obj,key)=>Object.keys(obj).map(k=>'<button class="chip '+((d[key]||'none')===k?'on':'')+'" data-bk13="'+key+'" data-v="'+k+'">'+obj[k]+'</button>').join('');
  bp.insertAdjacentHTML('beforebegin','<div class="lbl">💎 Piercings (Ink & Stink, '+money(BARBER.pierce)+')</div><div class="chips" id="bpi">'+chips(PIERCE,'pierce')+'</div><div class="lbl">✒️ Face tattoo ('+money(BARBER.ftat)+', SoundCloud rapper approved)</div><div class="chips" id="bft">'+chips(FTATS,'ftat')+'</div>');
  onAll($('#sheet'),'[data-bk13]',b=>{d[b.dataset.bk13]=b.dataset.v;sfx('click');barberSheet()})};
/* ---- story milestones with cutscene cards ---- */
const MILES=[{k:'firstk',t:'Chapter 1: From Rags…',test:s=>s.earned>=1000,cap:'You earned your first $1,000. Your piggy bank asked for a raise.',sc:'pig'},
 {k:'day7',t:'Chapter 2: Regular',test:s=>s.day>=7,cap:'A week of mall life. The fountain coins now whisper your name.',sc:'fountain'},
 {k:'tenk',t:'Chapter 3: Hustler',test:s=>s.earned>=10000,cap:'$10K earned! Your mom now tells the neighbors you\'re "in business".',sc:'cash'},
 {k:'moved',t:'Chapter 4: The Big Move',test:s=>s.apt&&s.apt.k!=='basement',cap:'You moved out of the basement. Mom cried. Then listed it on Airbnb.',sc:'keys'},
 {k:'car',t:'Chapter 5: Wheels',test:s=>!!s.car,cap:'You own a car. You will now be asked to drive everyone to the airport.',sc:'car'},
 {k:'swole',t:'Chapter 6: Swole Arc',test:s=>s.fit&&s.fit.lvl>=50,cap:'Planet Fatness put your photo on the wall. Under "do not let lift alone".',sc:'gym'},
 {k:'riches',t:'Finale: …to Riches',test:s=>s.earned>=100000,cap:'$100K earned. You are legally a Mall Magnate. The food court bows.',sc:'crown'}];
function drawScene(x,m,W,H){const G={pig:['#f8bbd0','#fce4ec'],fountain:['#b3e5fc','#e1f5fe'],cash:['#c8e6c9','#f1f8e9'],keys:['#ffe0b2','#fff3e0'],car:['#bbdefb','#e3f2fd'],gym:['#d1c4e9','#ede7f6'],crown:['#ffe082','#fff8e1']}[m.sc]||['#eee','#fff'];
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,G[0]);g.addColorStop(1,G[1]);x.globalAlpha=1;x.fillStyle=g;x.fillRect(0,0,W,H);for(let i=0;i<12;i++){x.fillStyle='rgba(255,255,255,.5)';circ(x,(i*97)%W,(i*53)%(H*.6),3+(i%4)*3);x.fill()}
  const px=W*.7,py=H*.62;
  if(m.sc==='pig'){oCirc(x,px,py,30,'#f48fb1');oCirc(x,px+28,py-2,9,'#f8bbd0');oRect(x,px-14,py-34,10,10,3,'#f48fb1');oRect(x,px-12,py+24,8,12,3,'#f48fb1');oRect(x,px+8,py+24,8,12,3,'#f48fb1');x.fillStyle='#3b2730';circ(x,px+10,py-10,2.5);x.fill();oRect(x,px-6,py-31,14,4,2,'#3b2730')}
  else if(m.sc==='fountain'){oRect(x,px-40,py+4,80,26,8,'#90a4ae');oRect(x,px-6,py-30,12,36,4,'#b0bec5');for(let i=-1;i<=1;i++){x.beginPath();x.moveTo(px,py-30);x.quadraticCurveTo(px+i*30,py-50,px+i*36,py+4);x.strokeStyle='#4fc3f7';x.lineWidth=4;x.stroke()}[[-20,14],[0,18],[18,12]].forEach(q=>oCirc(x,px+q[0],py+q[1],4,'#ffc107'))}
  else if(m.sc==='cash'){for(let i=0;i<5;i++)oRect(x,px-34+i*4,py+10-i*10,68,16,3,'#66bb6a');oCirc(x,px,py-30,12,'#ffc107')}
  else if(m.sc==='keys'){oCirc(x,px-12,py-10,16,'#ffc107');oCirc(x,px-12,py-10,6,G[1]);oRect(x,px,py-14,44,8,3,'#ffc107');oRect(x,px+30,py-6,6,10,2,'#ffc107');oRect(x,px+20,py-6,6,8,2,'#ffc107')}
  else if(m.sc==='car'){drawCar(x,(S.car&&S.car.k)||'beater',px-60,py-10,120,(S.car&&S.car.col)||'#e53935')}
  else if(m.sc==='gym'){oRect(x,px-50,py-4,100,8,3,'#9e9e9e');[-1,1].forEach(s=>{oRect(x,px+s*50-8,py-22,16,44,4,'#263238')})}
  else{x.beginPath();x.moveTo(px-34,py+16);x.lineTo(px-34,py-20);x.lineTo(px-17,py);x.lineTo(px,py-30);x.lineTo(px+17,py);x.lineTo(px+34,py-20);x.lineTo(px+34,py+16);x.closePath();x.fillStyle='#ffc107';x.fill();x.strokeStyle=OUT;x.lineWidth=2;x.stroke();oCirc(x,px,py+4,5,'#e53935')}
  const sc=(H*.86)/170;x.save();x.translate(W*.3,H*.96-162*sc);x.scale(sc,sc);const m0=AV.mood;AV.mood='happy';drawAvatar(x,S.char,S.equipped);AV.mood=m0;x.restore();
  x.strokeStyle=OUT;x.lineWidth=4;x.strokeRect(2,2,W-4,H-4)}
function cutscene(m){const W=Math.min(340,window.innerWidth-50),H=200;sheet('<h3>📖 '+esc(m.t)+'</h3><div class="center"><canvas id="cutcv" style="border-radius:10px"></canvas></div><div class="card" style="font-size:15px;font-weight:700;margin-top:8px">'+esc(m.cap)+'</div><button class="btn big" id="cutok">Continue ▶</button>');
  drawScene(setupCanvas($('#cutcv'),W,H),m,W,H);$('#cutok').onclick=()=>{closeSheet();setTimeout(checkMiles,400)};sfx('level')}
function checkMiles(){if(!S.char||!S.miles||screen==='create'||shift)return null;const s=$('#sheet');if(s&&!s.hidden)return null;const m=MILES.filter(q=>!S.miles[q.k]&&q.test(S))[0];if(!m)return null;S.miles[m.k]=Date.now();save();cutscene(m);return m}
function storySheet(){const got=MILES.filter(m=>S.miles[m.k]);sheet('<h3>📖 Your story so far</h3><div class="small">'+got.length+'/'+MILES.length+' chapters</div>'+MILES.map(m=>'<div class="slot"><span>'+(S.miles[m.k]?'✅ '+esc(m.t):'🔒 ???')+'</span>'+(S.miles[m.k]?'<button class="btn alt" data-mile="'+m.k+'">Replay</button>':'')+'</div>').join(''));
  onAll($('#sheet'),'[data-mile]',b=>cutscene(MILES.filter(m=>m.k===b.dataset.mile)[0]))}
const _openMore13=openMore;openMore=function(){_openMore13();const h=$('#mMe');if(h){h.insertAdjacentHTML('beforebegin','<button class="btn alt big" id="mStory">📖 Story so far</button>');$('#mStory').onclick=storySheet}};
function bindV13(){clearTimeout(bindV13.t);bindV13.t=setTimeout(checkMiles,900)}
function v13Fix(s){if(!s.hints)s.hints={};if(!s.miles){s.miles={};}if(!s.stats13)s.stats13={rounds:0};if(s.char){if(!s.char.pierce)s.char.pierce='none';if(!s.char.ftat)s.char.ftat='none'}}
ACH.push(['storytime','Main Character Lore 📖','Unlock 4 story chapters',s=>s.miles&&Object.keys(s.miles).length>=4],['pierced','Hole-y Moly 💎','Get a piercing',s=>s.char&&s.char.pierce&&s.char.pierce!=='none']);
