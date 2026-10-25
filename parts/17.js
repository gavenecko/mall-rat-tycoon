/* ===== v12: safe toast queue, emotes in photos/shoot, Teslow dealership + garage, Planet Fatness gym, food court, mall encounters, accessibility ===== */
(function(){const st=document.createElement('style');st.textContent=
 '#toast{top:auto!important;bottom:calc(78px + env(safe-area-inset-bottom,0px))!important;background:none!important;padding:0!important;box-shadow:none!important;opacity:1!important;transform:translateX(-50%)!important;display:flex;flex-direction:column;gap:4px;align-items:center;width:max-content;max-width:88%;z-index:40!important}'+
 '#toast.tqtop{bottom:auto!important;top:calc(70px + env(safe-area-inset-top,0px))!important}#toast.tqmid{bottom:auto!important;top:42%!important}#toast .tq{background:rgba(29,26,43,.95);color:#fff;font:700 12.5px/1.25 system-ui,sans-serif;padding:6px 12px;border-radius:14px;box-shadow:0 4px 14px rgba(0,0,0,.25);max-width:100%;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;animation:tqin .25s ease-out;transition:opacity .3s,transform .3s}'+
 '#toast .tq.ach{background:linear-gradient(120deg,#ff8f00,#ffca28);color:#3b2730}#toast .tq.out{opacity:0;transform:translateY(8px)}@keyframes tqin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'+
 'body.rm *{animation:none!important;transition:none!important}body.ts1 #view,body.ts1 .sheetbox{zoom:1.12}body.ts2 #view,body.ts2 .sheetbox{zoom:1.25}body.ts1 #nav button,body.ts2 #nav button{font-size:13px}'+
 '.npcbox{display:flex;gap:10px;align-items:center}.npcbox canvas{border-radius:12px;flex:none}';document.head.appendChild(st)})();
toast=function(t){const e=$('#toast');if(!e)return;t=String(t);if(e.lastChild&&e.lastChild.textContent===t&&!/out/.test(e.lastChild.className))return;
  const d=document.createElement('div');d.className='tq'+(/^🏆/.test(t)?' ach':'');d.textContent=t.length>90?t.slice(0,88)+'…':t;e.appendChild(d);
  while(e.children.length>3)e.removeChild(e.firstChild);toastPlace(e);const life=/^🏆/.test(t)?2200:1500;setTimeout(()=>{d.className+=' out';setTimeout(()=>{if(d.parentNode)d.parentNode.removeChild(d)},320)},life)};
function toastPlace(e){const hit=()=>{const r=e.getBoundingClientRect();let n=0;Array.prototype.forEach.call(document.querySelectorAll('#view .btn,#view button,.sheetbox .btn'),b=>{const q=b.getBoundingClientRect();if(q.width&&!(q.right<r.left||q.left>r.right||q.bottom<r.top||q.top>r.bottom))n++});return n};
  let best='',bn=1e9;['','tqmid','tqtop'].some(c=>{e.classList.remove('tqtop','tqmid');if(c)e.classList.add(c);const n=hit();if(n<bn){bn=n;best=c}return n===0});e.classList.remove('tqtop','tqmid');if(best)e.classList.add(best)}
function applyUI(){const b=document.body;if(!b||!S||!S.ui)return;b.classList.toggle('rm',!!S.ui.rm);b.classList.toggle('ts1',S.ui.ts===1);b.classList.toggle('ts2',S.ui.ts===2)}
const _openMore=openMore;openMore=function(){_openMore();const h=$('#sheet .sheetbox h3');if(!h)return;const TS=['Normal','Large','Extra large'];
  h.insertAdjacentHTML('afterend','<div class="lbl">♿ Accessibility</div><div class="chips" id="tsz">'+TS.map((n,i)=>'<button class="chip '+(S.ui.ts===i?'on':'')+'" data-ts="'+i+'">Aa '+n+'</button>').join('')+'</div><button class="btn alt big" id="mRm">'+(S.ui.rm?'🐢 Reduce motion: on':'🐇 Reduce motion: off')+'</button>');
  onAll($('#sheet'),'[data-ts]',b=>{S.ui.ts=+b.dataset.ts;applyUI();save();openMore()});$('#mRm').onclick=()=>{S.ui.rm=!S.ui.rm;applyUI();save();openMore()}};
/* ---- emotes in fit-check + shoot ---- */
const PHOTO_FACES=[['smile','🙂','Chill']].concat(EMOTES);
const _fitCheck=fitCheck;fitCheck=function(){const m=AV.mood;AV.mood=S.fitMood||'smile';try{_fitCheck()}finally{AV.mood=m}
  const h=$('#sheet .sheetbox h3');if(h)h.insertAdjacentHTML('afterend','<div class="chips" id="fmood">'+PHOTO_FACES.map(e=>'<button class="chip '+((S.fitMood||'smile')===e[0]?'on':'')+'" data-fm="'+e[0]+'">'+e[1]+' '+e[2]+'</button>').join('')+'</div>');
  onAll($('#sheet'),'[data-fm]',b=>{S.fitMood=b.dataset.fm;sfx('click');fitCheck()})};
const _makeShoot=makeShoot;makeShoot=function(el,api){AV.mood='smile';const R=_makeShoot(el,api);const pp=el.querySelector('#pp');if(!pp)return R;pp.insertAdjacentHTML('afterend','<div class="small center">Face</div><div class="pad" id="pface"></div>');
  PHOTO_FACES.forEach(e=>padBtn(el.querySelector('#pface'),e[1]+'<br><span class="small">'+e[2]+'</span>',()=>{AV.mood=e[0];S.stats12.faces++;if(el._draw)el._draw()}));return R};
const _endShift12=endShift;endShift=function(){AV.mood='smile';return _endShift12.apply(this,arguments)};
/* ---- shared art helpers ---- */
function oRect(x,X,Y,w,h,r,c){x.fillStyle=c;rr(x,X,Y,w,h,r);x.fill();x.strokeStyle=OUT;x.lineWidth=1.6;x.stroke()}
function oCirc(x,X,Y,r,c){x.fillStyle=c;circ(x,X,Y,r);x.fill();x.strokeStyle=OUT;x.lineWidth=1.6;x.stroke()}
/* ---- cars ---- */
const CARS=[{k:'beater',n:'Hondo Civic-ish (2003)',p:900,curb:3,cb:.03,t:'Smells like fries. Runs on hope.'},{k:'van',n:'Toyoda Sienna-ish Minivan',p:3500,curb:5,cb:.04,t:'Sliding doors. Infinite snack crumbs.'},
 {k:'truck',n:'Ford F-One-Fifty-ish',p:9000,curb:7,cb:.05,t:'You will be asked to help people move.'},{k:'teslow',n:'Teslow Model Why',p:18000,curb:10,cb:.06,t:'Self-driving* (*into poles). Updates overnight, forgets your seat.'},
 {k:'lambro',n:'Lambroghini Countach-ish',p:75000,curb:15,cb:.08,t:'Doors go up. Your credit score goes down.'}];
const CAR_COLS=['#e53935','#1e88e5','#fdd835','#43a047','#f5f5f5','#212121','#ff4fa3','#8e24aa'];
function carDef(){return S.car&&CARS.filter(c=>c.k===S.car.k)[0]}
function drawCar(x,k,X,Y,w,col){x.save();x.globalAlpha=1;const s=w/100;x.translate(X,Y);x.scale(s,s);x.lineJoin='round';const glass='#b3e5fc';
  if(k==='lambro'){x.fillStyle=col;x.beginPath();x.moveTo(2,40);x.lineTo(8,28);x.lineTo(40,18);x.lineTo(62,18);x.lineTo(98,32);x.lineTo(98,42);x.lineTo(2,44);x.closePath();x.fill();x.strokeStyle=OUT;x.lineWidth=1.6;x.stroke();
    x.fillStyle=glass;x.beginPath();x.moveTo(42,21);x.lineTo(60,21);x.lineTo(74,29);x.lineTo(34,29);x.closePath();x.fill();x.stroke()}
  else if(k==='truck'){oRect(x,2,24,96,18,4,col);oRect(x,8,8,40,20,5,col);oRect(x,13,12,30,12,3,glass);x.strokeStyle=OUT;x.lineWidth=1.6;x.beginPath();x.moveTo(55,24);x.lineTo(55,16);x.lineTo(98,16);x.lineTo(98,24);x.stroke()}
  else if(k==='van'){oRect(x,2,8,96,34,9,col);oRect(x,8,12,22,13,3,glass);oRect(x,34,12,24,13,3,glass);oRect(x,62,12,26,13,3,glass)}
  else if(k==='teslow'){x.fillStyle=col;x.beginPath();x.moveTo(3,40);x.quadraticCurveTo(2,26,22,24);x.quadraticCurveTo(40,8,62,12);x.quadraticCurveTo(80,16,92,26);x.quadraticCurveTo(99,30,98,40);x.closePath();x.fill();x.strokeStyle=OUT;x.lineWidth=1.6;x.stroke();
    x.fillStyle=glass;x.beginPath();x.moveTo(28,25);x.quadraticCurveTo(42,13,60,15);x.quadraticCurveTo(74,18,82,26);x.closePath();x.fill();x.stroke()}
  else{oRect(x,2,22,96,20,5,col);oRect(x,18,8,56,18,5,col);oRect(x,23,12,21,11,2,glass);oRect(x,48,12,21,11,2,glass);oRect(x,4,26,8,5,2,'#ffe082')}
  [[22,42],[78,42]].forEach(p=>{oCirc(x,p[0],p[1],8.5,'#212121');oCirc(x,p[0],p[1],3.6,'#bdbdbd')});x.restore()}
function carThumb(k,col){const c=document.createElement('canvas');c.width=200;c.height=110;drawCar(c.getContext('2d'),k,0,6,200,col);return c.toDataURL()}
const _curbAppeal=curbAppeal;curbAppeal=function(){const c=carDef();return Math.min(100,_curbAppeal()+(c?c.curb:0))};
const _drawHouse=drawHouse;drawHouse=function(x,c){const R=_drawHouse(x,c);const d=carDef();if(!d)return R;const W=c*COLS,gy=HROWS*c,gw=W*.2,gx=W*.86-gw*1.02,gh=c*1.05;
  x.save();x.globalAlpha=1;oRect(x,gx,gy-gh,gw,gh,3,'#eceff1');x.strokeStyle='rgba(59,39,48,.35)';x.lineWidth=1;for(let y=gy-gh+gh/5;y<gy;y+=gh/5){x.beginPath();x.moveTo(gx+3,y);x.lineTo(gx+gw-3,y);x.stroke()}
  x.fillStyle='#3b2730';x.font='bold '+Math.round(c*.18)+'px sans-serif';x.textAlign='center';x.fillText('GARAGE',gx+gw/2,gy-gh-3);x.restore();drawCar(x,d.k,gx-gw*.05,gy-c*.18,gw*1.1,S.car.col);return R};
const _grant=grant;grant=function(it,p){const d=carDef();if(d&&p>0&&S.carDay!==S.day){const back=Math.min(50,Math.max(1,Math.round(p*d.cb)));S.carDay=S.day;S.cash+=back;setTimeout(()=>toast('🚗 Drove to the mall: rockstar parking cashback +'+money(back)),900)}return _grant(it,p)};
function dealerSheet(){const cur=carDef(),col=dealerSheet.col||CAR_COLS[0];
  sheet('<h3>🚗 Teslow & Lambroghini Motors</h3><div class="small">"Every car is pre-owned if you think about it." Owning a car adds curb appeal, parks in your garage, and your first mall buy each day gets drive-in cashback.'+(cur?' You drive: <b>'+esc(cur.n)+'</b>.':'')+'</div>'+
   '<div class="lbl">Paint</div><div class="sws">'+CAR_COLS.map(c=>'<button class="sw '+(c===col?'on':'')+'" style="background:'+c+'" data-cc="'+c+'"></button>').join('')+'</div>'+
   CARS.map(c=>{const mine=cur&&cur.k===c.k;return'<div class="card row" style="flex-wrap:nowrap"><img alt="" src="'+carThumb(c.k,mine?S.car.col:col)+'" style="width:96px;background:#e3f2fd;border-radius:10px"><div style="flex:1"><b>'+esc(c.n)+'</b><div class="small">'+c.t+' Curb +'+c.curb+' · cashback '+Math.round(c.cb*100)+'%</div></div>'+
    (mine?'<button class="btn alt" data-cpaint="1">Repaint $150</button>':'<button class="btn" data-car="'+c.k+'">'+money(c.p-(cur?Math.round(cur.p*.6):0))+'</button>')+'</div>'}).join('')+'<div class="small">Trade-in gives 60% of your current car\'s price.</div>');
  onAll($('#sheet'),'[data-cc]',b=>{dealerSheet.col=b.dataset.cc;dealerSheet()});
  onAll($('#sheet'),'[data-car]',b=>{buyCar(b.dataset.car,col)&&dealerSheet()});onAll($('#sheet'),'[data-cpaint]',b=>{if(S.car.col===col){toast('Already that colour');return}if(payCash(150,'paint')){S.car.col=col;save();dealerSheet()}})}
function buyCar(k,col){const c=CARS.filter(q=>q.k===k)[0],cur=carDef();if(!c)return false;const price=c.p-(cur?Math.round(cur.p*.6):0);if(!payCash(price,c.n))return false;S.car={k:k,col:col||CAR_COLS[0]};S.stats12.cars++;sfx('level');toast('🔑 You bought a '+c.n+'!');save();return true}
/* ---- gym ---- */
function fitMult(){return 1+Math.min(100,(S.fit&&S.fit.lvl)||0)/2000}
function gymSheet(){const f=S.fit,done=f.day===S.day;
  sheet('<h3>🏋️ Planet Fatness</h3><div class="small">"Judgement-free zone (we judge silently)." Day pass $8. Hit the green zone for reps. Fitness: <b>'+f.lvl+'/100</b> → job pay ×'+fitMult().toFixed(3)+'. Skip 2+ days and you lose a little.'+(buffOn('protein')?' 🍗 Protein buff: gains ×2!':'')+'</div>'+
   '<div class="center"><canvas id="gymcv" style="border-radius:14px;touch-action:none"></canvas></div><button class="btn big" id="gymgo" '+(done?'disabled':'')+'>'+(done?'Done for today 💪 come back tomorrow':'Start workout ($8)')+'</button>');
  const W=Math.min(300,window.innerWidth-60),H=150,cv=$('#gymcv'),x=setupCanvas(cv,W,H);let st={on:false,reps:0,hits:0,t0:Date.now(),zone:.5};
  function frame(){if(!document.body.contains(cv))return;x.globalAlpha=1;x.fillStyle='#4a148c';x.fillRect(0,0,W,H);x.fillStyle='#ffd600';x.font='bold 14px sans-serif';x.textAlign='left';x.fillText('Reps '+st.reps+'/6 · good '+st.hits,10,20);
    const bx=20,bw=W-40,by=H-36;oRect(x,bx,by,bw,16,8,'#eeeeee');oRect(x,bx+bw*(st.zone-.09),by,bw*.18,16,4,'#66bb6a');const p=(Math.sin((Date.now()-st.t0)/260)+1)/2;st.p=p;oRect(x,bx+bw*p-4,by-6,8,28,3,'#ff4081');
    const lift=st.on?Math.abs(Math.sin((Date.now()-st.t0)/400))*18:0;const cx=W/2,cy=70-lift;x.strokeStyle=OUT;x.lineWidth=5;x.beginPath();x.moveTo(cx-60,cy);x.lineTo(cx+60,cy);x.stroke();x.strokeStyle='#9e9e9e';x.lineWidth=3;x.beginPath();x.moveTo(cx-60,cy);x.lineTo(cx+60,cy);x.stroke();
    [-1,1].forEach(s=>{oRect(x,cx+s*60-7,cy-18,14,36,4,'#263238');oRect(x,cx+s*48-5,cy-13,10,26,3,'#455a64')});requestAnimationFrame(frame)}
  frame();const go=$('#gymgo');go.onclick=()=>{if(!st.on){if(done||!payCash(8,'a day pass'))return;st.on=true;go.textContent='LIFT! (tap in the green)';sfx('click');return}
    const hit=Math.abs(st.p-st.zone)<.09;st.reps++;if(hit){st.hits++;sfx('coin')}else sfx('bad');st.zone=.2+Math.random()*.6;
    if(st.reps>=6){const g=gymGain(st.hits);go.disabled=true;go.textContent='+'+g+' fitness! Hit the showers';setTimeout(()=>{if($('#gymcv'))gymSheet()},1100)}}}
function gymGain(hits){const g=Math.max(1,Math.round(hits*(buffOn('protein')?2:1)*.8));S.fit.lvl=Math.min(100,S.fit.lvl+g);S.fit.day=S.day;S.fit.last=S.day;S.stats12.workouts++;save();return g}
/* ---- food court ---- */
const FOODS=[{k:'pretzel',n:'Auntie Anxious Pretzel',p:5,buff:'charm',d:'+1 ❤️ on gifts today'},{k:'orange',n:'Panda Excess Orange Chicken',p:9,buff:'protein',d:'Gym gains ×2 today'},
 {k:'pizza',n:'Sbarrow Slice',p:6,buff:'luck',d:'Claw grip 75% today'},{k:'cinna',n:'Cinnabomb Roll',p:7,buff:'sweet',d:'Supercutz 20% off today'},{k:'boba',n:'Boba Fettea',p:6,buff:'focus',d:'Mall encounters go your way today'}];
function buffOn(b){return S.meal&&S.meal.day===S.day&&FOODS.some(f=>f.k===S.meal.k&&f.buff===b)}
function drawFood(x,k,X,Y,s,bite){x.save();x.globalAlpha=1;x.translate(X,Y);x.scale(s/100,s/100);
  if(k==='pretzel'){x.strokeStyle=OUT;x.lineWidth=17;x.lineCap='round';const pz=()=>{x.beginPath();x.moveTo(20,70);x.bezierCurveTo(10,20,60,10,70,45);x.bezierCurveTo(78,72,30,72,40,40);x.bezierCurveTo(50,10,90,20,80,70);x.stroke()};pz();x.strokeStyle='#b5651d';x.lineWidth=13;pz();x.fillStyle='#fff';[[30,30],[62,24],[50,60],[76,50]].forEach(p=>{x.fillRect(p[0],p[1],3,3)})}
  else if(k==='orange'){oRect(x,18,40,64,48,6,'#fff');x.fillStyle='#e53935';x.fillRect(18,50,64,10);[[32,38],[48,32],[64,38],[42,44],[58,44]].forEach(p=>oCirc(x,p[0],p[1],9,'#ef6c00'))}
  else if(k==='pizza'){x.fillStyle='#ffca28';x.beginPath();x.moveTo(15,20);x.lineTo(85,20);x.lineTo(50,90);x.closePath();x.fill();x.strokeStyle=OUT;x.lineWidth=1.6;x.stroke();oRect(x,12,12,76,12,6,'#d7a35a');[[35,35],[60,36],[50,58]].forEach(p=>oCirc(x,p[0],p[1],6,'#c62828'))}
  else if(k==='cinna'){oCirc(x,50,55,34,'#d9a066');x.strokeStyle='#8d5524';x.lineWidth=4;x.beginPath();for(let a=0;a<14;a+=.2){const r=2+a*2.1;x.lineTo(50+Math.cos(a)*r,55+Math.sin(a)*r)}x.stroke();x.strokeStyle='#fff';x.lineWidth=5;x.beginPath();x.moveTo(26,40);x.quadraticCurveTo(50,30,74,44);x.stroke()}
  else{x.fillStyle='#d7ccc8';x.beginPath();x.moveTo(25,25);x.lineTo(75,25);x.lineTo(68,92);x.lineTo(32,92);x.closePath();x.fill();x.strokeStyle=OUT;x.lineWidth=1.6;x.stroke();oRect(x,20,18,60,9,4,'#ff80ab');oRect(x,54,0,6,24,2,'#4caf50');[[40,82],[50,86],[60,82],[45,74],[56,75]].forEach(p=>oCirc(x,p[0],p[1],4.5,'#3e2723'))}
  if(bite){x.globalCompositeOperation='destination-out';for(let i=0;i<bite;i++)circ(x,85-i*9,15+i*12,15),x.fill()}x.restore()}
function foodThumb(k){const c=document.createElement('canvas');c.width=c.height=100;drawFood(c.getContext('2d'),k,0,0,100,0);return c.toDataURL()}
function foodSheet(){const ate=S.meal&&S.meal.day===S.day;
  sheet('<h3>🍔 Food Court</h3><div class="small">One meal a day (your stomach has a credit limit too). Each gives a buff until tomorrow.'+(ate?' Today: <b>'+esc(FOODS.filter(f=>f.k===S.meal.k)[0].n)+'</b> ✅':'')+'</div>'+
   FOODS.map(f=>'<div class="card row" style="flex-wrap:nowrap"><img alt="" src="'+foodThumb(f.k)+'" style="width:56px;background:#fff8e1;border-radius:10px"><div style="flex:1"><b>'+esc(f.n)+'</b><div class="small">'+f.d+'</div></div><button class="btn" data-food="'+f.k+'" '+(ate?'disabled':'')+'>'+money(f.p)+'</button></div>').join(''));
  onAll($('#sheet'),'[data-food]',b=>eatSheet(b.dataset.food))}
function eatSheet(k){const f=FOODS.filter(q=>q.k===k)[0];if(!payCash(f.p,f.n))return;S.meal={day:S.day,k:k};S.stats12.meals++;save();let bites=0;
  sheet('<h3>😋 '+esc(f.n)+'</h3><div class="small">Tap to take bites! Buff: '+f.d+'</div><div class="center"><canvas id="eatcv"></canvas></div><button class="btn big" id="bite">🦷 Bite</button>');
  const cv=$('#eatcv'),x=setupCanvas(cv,180,180);const dr=()=>{x.clearRect(0,0,180,180);drawFood(x,k,10,10,160,bites)};dr();
  $('#bite').onclick=()=>{bites++;sfx('click');dr();if(bites>=6){$('#bite').disabled=true;$('#bite').textContent='✨ Buff active: '+f.d;avMood('happy');toast('😋 '+f.d)}}}
/* ---- mall encounters ---- */
const NPCS={influencer:{n:'Brayden, Influencer',ch:{gender:'male',body:'slim',skin:'#f1c27d',hair:'spiky',hairColor:'#e6c27a',beard:'none'},eq:'tops'},
 cop:{n:'Officer Blort, Mall Cop',ch:{gender:'male',body:'broad',skin:'#e0ac69',hair:'buzz',hairColor:'#1f1410',beard:'mustache'}},
 karen:{n:'A Karen',ch:{gender:'female',body:'average',skin:'#ffdbac',hair:'bob',hairColor:'#e6c27a',beard:'none'}},
 kiosk:{n:'Kiosk Guy (Dead Sea lotion)',ch:{gender:'male',body:'average',skin:'#c68642',hair:'short',hairColor:'#1f1410',beard:'goatee'}},
 grandpa:{n:'Mall-Walking Grandpa',ch:{gender:'male',body:'slim',skin:'#ffdbac',hair:'buzz',hairColor:'#c9c9c9',beard:'full',beardColor:'#f1ead2'}}};
const ENC=[{k:'influencer',line:'"Yo can I film you for my \'rate strangers\' fits\' series? 2.1k followers. Huge."',a:['Strike a pose','Run away'],r:[(g)=>g?{msg:'You went viral-ish! +$40 brand deal',cash:40}:{msg:'He rated you "mid". Ouch. (+$5 pity Venmo)',cash:5},(g)=>({msg:'You escaped content.',cash:0})]},
 {k:'cop',line:'"Ma\'am/sir/friend, did you just… run on the escalator?"',a:['Apologize','Argue the law'],r:[(g)=>({msg:'"Carry on, citizen." He gives you a coupon. +$10',cash:10}),(g)=>g?{msg:'You cited Escalator Code 7b. He saluted you. +$15',cash:15}:{msg:'Fined for "escalator sass". -$15',cash:-15}]},
 {k:'karen',line:'"Do you WORK here? I need a manager. NOW."',a:['Fetch a manager','"I\'m the manager"'],r:[(g)=>({msg:'The real manager tipped you for the save. +$20',cash:20}),(g)=>g?{msg:'She left a 5-star review of you. Somehow +$25',cash:25}:{msg:'She asked for YOUR manager. You bought her a pretzel. -$5',cash:-5}]},
 {k:'kiosk',line:'"Excuse me! You have beautiful hands. Dead Sea lotion? Only $30!"',a:['Try a sample','Avoid eye contact'],r:[(g)=>g?{msg:'Free sample! Your hands glow. Drip feels +5%. (and +$0)',cash:0}:{msg:'Somehow you paid $15 for "the small one".',cash:-15},(g)=>({msg:'You walked in a perfect arc around the kiosk. Legendary.',cash:0})]},
 {k:'grandpa',line:'"Young one! Want to mall-walk a lap with me? I do 40 a day."',a:['Walk a lap','"Maybe tomorrow"'],r:[(g)=>({msg:'He told you stories about 1987 Sears. He gave you $10 "for candy".',cash:10,fit:1}),(g)=>({msg:'He nods. He will be here tomorrow. He is always here.',cash:0})]}];
function encToday(){if(!S.char)return null;if(!S.enc||S.enc.day!==S.day){const r=rng(hash('enc')+S.day*7907)();S.enc={day:S.day,k:r<.55?(function(P){return P[Math.floor(rng(hash('who')+S.day)()*P.length)]})(typeof encPool==='function'?encPool():ENC).k:'',done:0}}return S.enc.k&&!S.enc.done?ENC.filter(e=>e.k===S.enc.k)[0]:null}
function encCard(){const e=encToday();if(!e)return'';return'<div class="card" id="enccard" style="border:3px solid #7c4dff"><div class="npcbox"><span id="encav"></span><div><b>👀 '+esc(NPCS[e.k].n)+' approaches!</b><div class="small">'+esc(e.line)+'</div></div></div><div class="row" style="margin-top:8px">'+e.a.map((a,i)=>'<button class="btn '+(i?'alt':'')+'" data-enc="'+i+'">'+esc(a)+'</button>').join('')+'</div></div>'}
function encChoose(i,roll){const e=encToday();if(!e)return null;const good=buffOn('focus')||(roll===undefined?Math.random():roll)<.55;const o=e.r[i](good);S.enc.done=1;S.stats12.enc++;
  if(o.cash>0){S.cash+=o.cash;S.earned+=o.cash}else if(o.cash<0)S.cash=Math.max(0,S.cash+o.cash);if(o.fit)S.fit.lvl=Math.min(100,S.fit.lvl+o.fit);notify('👀 '+NPCS[e.k].n+': '+o.msg);toast(o.msg);sfx(o.cash<0?'bad':'coin');save();return o}
function bindV12(){const a=$('#encav'),e=encToday();if(a&&e){const N=NPCS[e.k];a.appendChild(avatarCanvas(64,82,Object.assign({name:'',lip:''},N.ch),{}))}
  onAll(document,'[data-enc]',b=>{encChoose(+b.dataset.enc);rerender()});[['#dealerbtn',dealerSheet],['#gymbtn',gymSheet],['#foodbtn',foodSheet]].forEach(p=>{const b=$(p[0]);if(b)b.onclick=p[1]})}
function v12Cards(){const c=carDef();return encCard()+'<div class="card"><b>🏙️ Mall wing B</b><div class="row" style="margin-top:6px;gap:6px">'+
  '<button class="btn alt" id="dealerbtn">🚗 Teslow Motors'+(c?' ✓':'')+'</button><button class="btn alt" id="gymbtn">🏋️ Planet Fatness · '+S.fit.lvl+'</button><button class="btn alt" id="foodbtn">🍔 Food Court'+(S.meal&&S.meal.day===S.day?' ✓':'')+'</button></div></div>'}
/* buff hooks */
const _giftScore=giftScore;giftScore=function(n,it,w){return _giftScore(n,it,w)+(buffOn('charm')?1:0)};
const _clawResult=clawResult;clawResult=function(dx,roll){return Math.abs(dx)<=16&&roll<(buffOn('luck')?.75:.55)};
const _barberCost=barberCost;barberCost=function(a,b){const c=_barberCost(a,b);return buffOn('sweet')?Math.round(c*.8):c};
function v12NewDay(){const f=S.fit;if(f&&f.lvl>0&&S.day-(f.last||0)>2)f.lvl=Math.max(0,f.lvl-2)}
const _v10NewDay=v10NewDay;v10NewDay=function(){_v10NewDay();v12NewDay()};
function v12Fix(s){if(s.car===undefined)s.car=null;if(!s.fit)s.fit={lvl:0,day:0,last:0};if(!s.meal)s.meal={};if(!s.enc)s.enc={};if(!s.ui)s.ui={ts:0,rm:false};if(!s.stats12)s.stats12={cars:0,workouts:0,meals:0,enc:0,faces:0}}
ACH.push(['wheels','Got Wheels 🚗','Buy a car',s=>!!s.car],['swole','Swole Patrol 💪','Reach 50 fitness',s=>s.fit&&s.fit.lvl>=50],['foodie','Food Court Royalty 🍔','Eat 5 food court meals',s=>s.stats12&&s.stats12.meals>=5],['social','Mall Main Character 👀','Handle 5 mall encounters',s=>s.stats12&&s.stats12.enc>=5]);
