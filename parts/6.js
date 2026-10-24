/* ============================== JOBS ==============================
   Each job: make(el, api) -> {tick(dt), bot()}. api.pay(base) / api.miss(msg).
   bot() performs one correct action (used by automated tests). */
const CUSTOMERS=['🧑','👵','🤠','👽','🧛','🦸','👩‍🚀','🐸','🤡','🧙','🦖','🐱'];
const JOBS=[
 {id:'burger',name:'Burger Bonanza',emoji:'🍔',unlock:0,desc:'Stack ingredients bottom→top to match the ticket.',make:makeBurger},
 {id:'cashier',name:'Cashier Chaos',emoji:'🧾',unlock:1,desc:'Count out the exact change. Math is a vibe.',make:makeCashier},
 {id:'shelf',name:'Shelf Stocker',emoji:'📦',unlock:2,desc:'Toss each product into the bin of the same color. Fast!',make:makeShelf},
 {id:'barista',name:'Barista Brain',emoji:'☕',unlock:3,desc:'Memorize the drink, then build it from memory.',make:makeBarista},
 {id:'dog',name:'Dog Walker',emoji:'🐕',unlock:4,desc:'Steer the pup: grab bones, dodge puddles, cats & cones.',make:makeDog},
 {id:'pizza',name:'Pizza Dash',emoji:'🍕',unlock:5,desc:'Toss the pizza when the right house is in the zone.',make:makePizza},
 {id:'shoot',name:'Influencer Photoshoot',emoji:'🤳',unlock:6,desc:'Match the client\'s filter + pose. Better drip = bigger pay.',make:makeShoot}
];
const jobState=id=>S.jobs[id]||(S.jobs[id]={xp:0,shifts:0,best:0});
const LVL_K=40,PAY_K=1.15;// v8 balance (see sim_v8.js)
const jobLevel=id=>1+Math.floor(Math.sqrt(jobState(id).xp/LVL_K));
const jobMult=id=>Math.min(4,1+.3*(jobLevel(id)-1));
let shift=null,lastResult=null;
function startShift(job){sfx('start');shift={job:job,earned:0,count:0,end:gnow()+SHIFT_MS,last:gnow(),game:null};render()}
function endShift(){
  if(!shift)return;clearInterval(jobTick);jobTick=null;const s=shift;shift=null;if(s.job.cs){csEnd(s);return}const js=jobState(s.job.id),before=jobLevel(s.job.id);
  js.xp+=s.count*10+5;js.shifts++;js.best=Math.max(js.best,s.earned);S.shifts++;S.cash+=s.earned;S.earned+=s.earned;
  const lvl=jobLevel(s.job.id);lastResult={job:s.job,earned:s.earned,count:s.count,levelUp:lvl>before?lvl:0};
  save();sfx(lastResult.levelUp?'level':'coin');bumpCash();if(s.earned>0)setTimeout(()=>avMood('happy',2600),50);
}
function renderWork(v){
  if(shift)return runShift(v);
  if(lastResult){const r=lastResult;v.insertAdjacentHTML('beforeend','<div class="card center" style="border:3px solid #2bb34a"><div style="font-size:40px">'+r.job.emoji+'</div><b>Shift over!</b><div>'+r.count+' done · paid <b class="pr">'+money(r.earned)+'</b></div>'+(r.levelUp?'<div>⬆️ <b>'+r.job.name+' level '+r.levelUp+'!</b> Pay ×'+jobMult(r.job.id).toFixed(2)+'</div>':'')+'</div>')}
  csCard(v);v.insertAdjacentHTML('beforeend','<div class="small" style="margin:0 4px 8px">Shifts are 45s of game time (they pause if you leave the app). Pay = base × level bonus (+30% per job level, max ×4)'+setBonusLine()+'. Total shifts: '+S.shifts+'</div>');
  JOBS.forEach(j=>{const st=jobState(j.id),lv=jobLevel(j.id),locked=S.shifts<j.unlock||S.rap.cs>0,need=LVL_K*lv*lv,prev=LVL_K*(lv-1)*(lv-1);
    const d=document.createElement('div');d.className='card'+(locked?' lock':'');
    d.innerHTML='<div class="row"><span style="font-size:40px">'+j.emoji+'</span><div style="flex:1"><b>'+j.name+'</b> '+(locked?'🔒':'<span class="small">Lv '+lv+' · pay ×'+jobMult(j.id).toFixed(2)+' · best '+money(st.best)+'</span>')+'<div class="small">'+j.desc+'</div>'+
      (locked?'<div class="small"><b>'+(S.rap.cs>0?'🚫 Finish community service first':'Unlocks after '+j.unlock+' total shifts')+'</b></div>':'<div class="bar"><div style="width:'+Math.min(100,(st.xp-prev)/(need-prev)*100)+'%;background:#ff4f9a"></div></div>')+'</div>'+
      '<button class="btn green" data-job="'+j.id+'" '+(locked?'disabled':'')+'>Clock in</button></div>';
    v.appendChild(d)});
  onAll(v,'[data-job]',b=>{lastResult=null;startShift(JOBS.filter(j=>j.id===b.dataset.job)[0])});
}
function runShift(v){
  const j=shift.job;
  v.innerHTML='<div class="card row sp jhead" style="padding:10px 14px;background:linear-gradient(120deg,'+(JOB_HEAD[j.id]||'#ff6f61,#ff3d81')+')"><b>'+j.emoji+' '+j.name+'</b><b>⏱ <span id="stime"></span></b><b>💰 <span id="searn"></span></b></div><div id="jarea"></div><button class="btn alt" id="quit" style="margin-top:10px;width:100%">Clock out early</button>';
  const api={
    pay:base=>{if(!shift)return;shift.combo=(shift.combo||0)+1;burst(shift.combo>=5?14:8);if(shift.combo>=3&&shift.combo%1===0)comboText(shift.combo+'× COMBO!');if(j.cs){shift.count++;floatText('+1 🗑️');sfx('coin');upd();return}const amt=Math.max(1,Math.round(base*PAY_K*setPayMult()*jobMult(j.id)*(1+Math.min(.5,Math.max(0,shift.combo-2)*.05))));shift.earned+=amt;shift.count++;floatText('+'+money(amt));sfx('coin');upd()},
    miss:msg=>{if(shift)shift.combo=0;toast(msg);sfx('bad');const a=$('#jarea');if(a){a.classList.remove('flash');void a.offsetWidth;a.classList.add('flash');shake(a)}}
  };
  function upd(){if(!shift)return;const now=gnow(),dt=Math.min(.1,(now-shift.last)/1000);shift.last=now;
    if(now>=shift.end){endShift();render();return}
    if(shift.game&&shift.game.tick)shift.game.tick(dt);
    const t=$('#stime');if(t){t.textContent=Math.ceil((shift.end-now)/1000)+'s';$('#searn').textContent=money(shift.earned)}}
  $('#jarea').style.setProperty('--jbg',JOB_BG[j.id]||'');shift.game=j.make($('#jarea'),api);
  $('#quit').onclick=()=>{endShift();render()};
  upd();jobTick=setInterval(upd,50);
}
function setBar(el,p){if(!el)return;el.style.width=Math.max(0,Math.min(1,p)*100)+'%';el.style.background=p<.3?'#e53935':'#2bb34a'}
function padBtn(parent,html,fn,style){const b=document.createElement('button');b.className='ing';b.innerHTML=html;if(style)b.setAttribute('style',style);b.addEventListener('pointerdown',e=>{e.preventDefault();fn()});parent.appendChild(b);return b}

/* --- Burger Bonanza --- */
function makeBurger(el,api){
  const ING=[['bun','🍞','#e0a050'],['patty','🥩','#6b3a1e'],['cheese','🧀','#ffcc00'],['lettuce','🥬','#4caf50'],['tomato','🍅','#e53935'],['onion','🧅','#d9b3ff'],['pickle','🥒','#7cb342'],['bacon','🥓','#c0392b']];
  const E=k=>ING.filter(i=>i[0]===k)[0];
  el.innerHTML='<div class="card row"><span class="cust" id="cust"></span><div class="ticket" id="tk"></div></div><div class="bar"><div id="pat"></div></div><canvas id="cv"></canvas><div class="pad" id="pad"></div>';
  const W=Math.min(window.innerWidth-24,420),H=150,x=setupCanvas(el.querySelector('#cv'),W,H);
  let order,stack,t0,limit,round=0;
  function next(){round++;const n=Math.min(2+Math.floor(round/2),6),mid=[];for(let i=0;i<n;i++)mid.push(ING[1+rand(ING.length-1)][0]);
    order=['bun'].concat(mid,['bun']);stack=[];limit=5000+order.length*1300;t0=gnow();$('#cust').textContent=pick(CUSTOMERS);draw()}
  function draw(){$('#tk').innerHTML='<b>Order</b> (bottom → top):<br>'+order.map((o,i)=>'<span style="font-size:22px;opacity:'+(i<stack.length?.25:1)+'">'+E(o)[1]+'</span>').join(' ');
    jobBg('kitchen',x,W,H);x.fillStyle='#ddd';ell(x,W/2,H-10,95,10);x.fill();
    stack.forEach((s,i)=>{const y=H-20-i*14;x.fillStyle=E(s)[2];
      if(s==='bun'){x.beginPath();if(i===0)x.ellipse(W/2,y,72,9,0,0,Math.PI*2);else x.ellipse(W/2,y+4,72,20,0,Math.PI,0);x.fill()}
      else if(s==='cheese'){poly(x,[W/2-74,y-4,W/2+74,y-4,W/2+60,y+6,W/2-60,y+6]);x.fill()}
      else{rr(x,W/2-74,y-6,148,12,6);x.fill()}})}
  function tap(k){if(stack.length>=order.length)return;const want=order[stack.length];if(k!==want){api.miss('❌ Wrong topping! Customer stormed off');next();return}
    stack.push(k);sfx('click');draw();if(stack.length===order.length){api.pay(3+order.length*1.2+Math.max(0,1-(gnow()-t0)/limit)*5);next()}}
  ING.forEach(g=>padBtn($('#pad'),'<b>'+g[1]+'</b>'+g[0],()=>tap(g[0])));
  next();
  return{tick(){const p=1-(gnow()-t0)/limit;if(p<=0){api.miss('😤 Too slow! Customer left');next();return}setBar($('#pat'),p)},bot(){tap(order[stack.length])}};
}
/* --- Cashier Chaos --- */
function makeCashier(el,api){
  const DEN=[[1000,'$10','💵'],[500,'$5','💵'],[100,'$1','💵'],[25,'25¢','🪙'],[10,'10¢','🪙'],[5,'5¢','🪙']];
  const GOODS=['🧃 Juice','🧦 Socks','🍫 Candy bar','🧴 Lotion','📓 Notebook','🕯️ Candle','🧸 Teddy','🎧 Earbuds'];
  el.innerHTML='<canvas id="cv"></canvas><div class="card row"><span class="cust" id="cust"></span><div class="ticket" id="tk"></div></div><div class="bar"><div id="pat"></div></div>'+
    '<div class="card center" style="font-size:18px;margin:6px 0">Change given: <b id="given">$0.00</b></div><div class="pad" id="pad" style="grid-template-columns:repeat(3,1fr)"></div>'+
    '<div class="row" style="margin-top:8px"><button class="btn alt" id="undo" style="flex:1">↩ Undo</button><button class="btn green" id="ok" style="flex:2">Give change ✔</button></div>';
  const W=Math.min(window.innerWidth-24,420),H=120,x=setupCanvas(el.querySelector('#cv'),W,H);let good='';
  function draw(){jobBg('register',x,W,H);x.font='30px sans-serif';x.textAlign='center';x.fillText($('#cust').textContent,W*.2,H-44);x.font='22px sans-serif';if(good)x.fillText(good.split(' ')[0],W*.55,H-30);
    x.fillStyle='#1b5e20';rr(x,W*.74,H-66,W*.2,22,4);x.fill();x.fillStyle='#b9f6ca';x.font='bold 12px monospace';x.fillText(price?cents(price):'',W*.84,H-50);x.textAlign='left'}
  let price,paid,given,t0;const limit=15000;
  const sum=()=>given.reduce((a,b)=>a+b,0);
  function next(){price=5*(20+rand(380));paid=[500,1000,2000].filter(v=>v>price)[0];given=[];t0=gnow();$('#cust').textContent=pick(CUSTOMERS);good=pick(GOODS);
    $('#tk').innerHTML=good+' costs <b>'+cents(price)+'</b><br>Customer hands you <b>'+cents(paid)+'</b>';upd();draw()}
  function upd(){$('#given').textContent=cents(sum())}
  function done(){const ch=paid-price;if(sum()===ch)api.pay(4+Math.max(0,1-(gnow()-t0)/limit)*6);else api.miss('❌ Wrong change! Needed '+cents(ch)+', gave '+cents(sum()));next()}
  DEN.forEach(d=>padBtn($('#pad'),'<b>'+d[2]+'</b>'+d[1],()=>{given.push(d[0]);sfx('click');upd()}));
  $('#undo').onclick=()=>{given.pop();upd()};$('#ok').onclick=done;
  next();
  return{tick(){const p=1-(gnow()-t0)/limit;if(p<=0){api.miss('😤 Customer gave up waiting');next();return}setBar($('#pat'),p)},
    bot(){const rem=paid-price-sum();if(rem===0)done();else{given.push(DEN.filter(d=>d[0]<=rem)[0][0]);upd()}}};
}
/* --- Shelf Stocker --- */
function makeShelf(el,api){
  const C=[['Red','#e53935'],['Blue','#1e63d6'],['Yellow','#fdd835'],['Green','#2e7d32'],['Purple','#7b1fa2'],['Orange','#fb8c00']];
  const P=['Soda','Cereal','Soap','Chips','Shampoo','Candy','Juice','Socks','Cookies','Glue'];
  el.innerHTML='<div class="bar"><div id="pat"></div></div><canvas id="cv"></canvas><div class="pad" id="pad" style="grid-template-columns:1fr 1fr"></div>';
  const W=Math.min(window.innerWidth-24,420),H=170,x=setupCanvas(el.querySelector('#cv'),W,H);
  let bins,target,t0,limit,n=0,streak=0;
  function next(){bins=shuffle(C).slice(0,4);target=pick(bins);const prod=pick(P);n++;limit=Math.max(1400,3600-n*90);t0=gnow();
    jobBg('aisle',x,W,H);
    rr(x,W/2-50,22,100,124,10);x.fillStyle=target[1];x.fill();x.strokeStyle='rgba(0,0,0,.4)';x.lineWidth=2;x.stroke();
    rr(x,W/2-40,62,80,36,6);x.fillStyle='#fff';x.fill();x.fillStyle='#222';x.font='bold 18px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(prod,W/2,80);
    const pad=$('#pad');pad.innerHTML='';
    bins.forEach((c,i)=>padBtn(pad,'<b>🗑️</b>'+c[0]+' bin',()=>tap(i),'background:'+c[1]+';color:'+(lum(c[1])>.6?'#222':'#fff')+';padding:18px 4px'))}
  function tap(i){if(bins[i]===target){streak++;api.pay(2+Math.min(streak,10)*.3+Math.max(0,1-(gnow()-t0)/limit)*2)}else{streak=0;api.miss('❌ That\'s the '+bins[i][0]+' bin!')}next()}
  next();
  return{tick(){const p=1-(gnow()-t0)/limit;if(p<=0){streak=0;api.miss('📦 Dropped it!');next();return}setBar($('#pat'),p)},bot(){tap(bins.indexOf(target))}};
}
/* --- Barista Brain --- */
function makeBarista(el,api){
  const ING=[['espresso','☕','#4e342e'],['milk','🥛','#f5f5f5'],['foam','☁️','#fff3d6'],['caramel','🍯','#c68e17'],['choco','🍫','#5d4037'],['ice','🧊','#b3e5fc'],['vanilla','🌼','#f3e5ab'],['matcha','🍵','#7cb342']];
  const E=k=>ING.filter(i=>i[0]===k)[0];
  el.innerHTML='<div class="card row"><span class="cust" id="cust"></span><div class="ticket" id="tk"></div></div><div class="bar"><div id="pat"></div></div><canvas id="cv"></canvas><div class="pad" id="pad"></div>';
  const W=Math.min(window.innerWidth-24,420),H=150,x=setupCanvas(el.querySelector('#cv'),W,H);
  let recipe,made,phase,t0,showUntil,limit,n=0;
  function next(){n++;const len=Math.min(3+Math.floor(n/3),6);recipe=[];for(let i=0;i<len;i++)recipe.push(pick(ING)[0]);made=[];phase='show';showUntil=gnow()+1500+len*450;limit=5000+len*1500;
    $('#cust').textContent=pick(CUSTOMERS);draw()}
  function draw(){$('#tk').innerHTML=phase==='show'?'<b>Memorize!</b> 👀<br>'+recipe.map(r=>'<span style="font-size:22px">'+E(r)[1]+'</span>').join(' '):'<b>Make it!</b> (in order)<br>'+recipe.map((r,i)=>'<span style="font-size:22px">'+(i<made.length?E(r)[1]:'❓')+'</span>').join(' ');
    jobBg('cafe',x,W,H);const cx=W/2,top=20,bot=H-12,hw=50,per=(bot-top-6)/recipe.length;
    made.forEach((m,i)=>{x.fillStyle=E(m)[2];const y2=bot-i*per,y1=y2-per;poly(x,[cx-hw+4,y1,cx+hw-4,y1,cx+hw-8,y2,cx-hw+8,y2]);x.fill()});
    x.strokeStyle='#555';x.lineWidth=3;x.beginPath();x.moveTo(cx-hw,top);x.lineTo(cx-hw+6,bot);x.lineTo(cx+hw-6,bot);x.lineTo(cx+hw,top);x.stroke();x.beginPath();x.arc(cx+hw+8,(top+bot)/2,14,-1.3,1.3);x.stroke()}
  function tap(k){if(phase==='show'){phase='make';t0=gnow()}
    if(k!==recipe[made.length]){api.miss('❌ That\'s not the recipe!');next();return}made.push(k);sfx('click');draw();
    if(made.length===recipe.length){api.pay(4+recipe.length*1.4+Math.max(0,1-(gnow()-t0)/limit)*5);next()}}
  ING.forEach(g=>padBtn($('#pad'),'<b>'+g[1]+'</b>'+g[0],()=>tap(g[0])));
  next();
  return{tick(){const now=gnow();if(phase==='show'){setBar($('#pat'),1);if(now>=showUntil){phase='make';t0=now;draw()}return}
      const p=1-(now-t0)/limit;if(p<=0){api.miss('😤 Drink took too long!');next();return}setBar($('#pat'),p)},
    bot(){tap(recipe[made.length])}};
}
/* --- Dog Walker --- */
function makeDog(el,api){
  el.innerHTML='<canvas id="cv"></canvas><div class="row" style="margin-top:8px"><button class="btn big" id="L" style="flex:1">◀</button><button class="btn big" id="R" style="flex:1">▶</button></div><div class="small center">Tap the left/right side of the path or the arrows</div>';
  const W=Math.min(window.innerWidth-24,420),H=330,cv=el.querySelector('#cv'),x=setupCanvas(cv,W,H),dogY=H-50;
  let lane=1,objs=[],spawn=0,speed=150,stun=0,tm=0;
  const lx=i=>W*(i+.5)/3, move=d=>{lane=Math.max(0,Math.min(2,lane+d));sfx('click')};
  $('#L').addEventListener('pointerdown',e=>{e.preventDefault();move(-1)});$('#R').addEventListener('pointerdown',e=>{e.preventDefault();move(1)});
  cv.addEventListener('pointerdown',e=>{const r=cv.getBoundingClientRect();move(e.clientX-r.left<W/2?-1:1)});
  function draw(){jobBg('park',x,W,H);x.fillStyle='rgba(224,214,195,.92)';x.fillRect(W*.05,0,W*.9,H);x.strokeStyle='#fff';x.lineWidth=3;x.setLineDash([16,14]);x.lineDashOffset=-tm*speed;
    line(x,W/3,0,W/3,H);line(x,2*W/3,0,2*W/3,H);x.setLineDash([]);x.font='34px serif';x.textAlign='center';x.textBaseline='middle';
    objs.forEach(o=>x.fillText({bone:'🦴',puddle:'💧',cat:'🐈',cone:'🚧'}[o.t],lx(o.lane),o.y));
    x.globalAlpha=stun>0&&Math.floor(stun*10)%2?.4:1;x.font='44px serif';x.fillText('🐕',lx(lane),dogY);x.globalAlpha=1;
    x.strokeStyle='#d32f2f';x.lineWidth=2;line(x,lx(lane),dogY+10,W/2,H)}
  draw();
  return{tick(dt){tm+=dt;speed+=dt*4;stun=Math.max(0,stun-dt);spawn-=dt;
      if(spawn<=0){spawn=.55+Math.random()*.4;objs.push({lane:rand(3),y:-20,t:Math.random()<.5?'bone':pick(['puddle','cat','cone'])})}
      objs.forEach(o=>{o.y+=speed*dt;if(!o.hit&&o.lane===lane&&Math.abs(o.y-dogY)<24){o.hit=1;if(o.t==='bone')api.pay(2.2);else if(stun<=0){stun=1;api.miss({puddle:'💦 Splash! Muddy pup',cat:'🐈 Pup chased a cat!',cone:'🚧 Bonk!'}[o.t])}}});
      objs=objs.filter(o=>o.y<H+30&&!(o.hit&&o.t==='bone'));draw()},
    bot(){const b={lane:rand(3),y:dogY-4,t:'bone'};objs=objs.filter(o=>o.t==='bone'||o.lane!==b.lane);objs.push(b);lane=b.lane}};
}
/* --- Pizza Dash --- */
function makePizza(el,api){
  el.innerHTML='<div class="card center" style="font-size:18px;margin-bottom:6px">Deliver to house <b id="tgt" style="font-size:26px;color:#d32f2f"></b></div><canvas id="cv"></canvas><button class="btn big" id="toss" style="margin-top:8px">🍕 TOSS!</button>';
  const W=Math.min(window.innerWidth-24,420),H=210,x=setupCanvas(el.querySelector('#cv'),W,H),zone=W/2,HC=['#ef9a9a','#90caf9','#a5d6a7','#fff59d','#ce93d8','#ffcc80'];
  let houses=[],speed=70,target=null,fly=0,used={};
  function addHouse(xp){let n;do{n=1+rand(99)}while(used[n]);used[n]=1;houses.push({x:xp,num:n,c:pick(HC)})}
  for(let i=0;i<7;i++)addHouse(W*.75+i*100);
  function newTarget(){const up=houses.filter(h=>h.x>zone+60&&!h.done);target=pick(up.slice(0,3));$('#tgt').textContent='#'+target.num}
  newTarget();
  function toss(){fly=.35;const h=houses.filter(q=>Math.abs(q.x-zone)<34&&!q.done)[0];
    if(h&&h===target){h.done=1;api.pay(6+speed/30);newTarget()}else api.miss(h?'🏠 Wrong house! That was #'+h.num:'🍕 Pizza on the sidewalk!')}
  $('#toss').addEventListener('pointerdown',e=>{e.preventDefault();toss()});
  function draw(){jobBg('street',x,W,H);x.fillStyle='#9e9e9e';x.fillRect(0,H-50,W,50);x.fillStyle='#fff';const off=(gnow()/12)%40;for(let i=-40;i<W+40;i+=40)x.fillRect(i-off,H-27,20,4);
    x.fillStyle='rgba(255,235,59,.35)';x.fillRect(zone-34,0,68,H-50);x.strokeStyle='#fbc02d';x.lineWidth=2;x.strokeRect(zone-34,1,68,H-52);
    houses.forEach(h=>{x.fillStyle=h.c;x.fillRect(h.x-30,70,60,90);x.fillStyle='#8d6e63';poly(x,[h.x-36,72,h.x+36,72,h.x,38]);x.fill();x.fillStyle='#5d4037';x.fillRect(h.x-8,128,16,32);
      x.fillStyle=h===target?'#d32f2f':'#fff';rr(x,h.x-16,82,32,22,5);x.fill();x.fillStyle=h===target?'#fff':'#222';x.font='bold 15px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(h.num,h.x,93);
      if(h.done){x.font='22px serif';x.fillText('✅',h.x,58)}});
    x.font='38px serif';x.fillText('🛵',zone,H-30);if(fly>0){x.font='26px serif';x.fillText('🍕',zone,H-60-(.35-fly)*250)}}
  draw();
  return{tick(dt){speed+=dt*1.5;fly=Math.max(0,fly-dt);houses.forEach(h=>{h.x-=speed*dt});
      if(target.x<zone-40&&!target.done){api.miss('⌛ Missed house #'+target.num+'!');newTarget()}
      houses=houses.filter(h=>{if(h.x<-50){delete used[h.num];return false}return true});while(houses[houses.length-1].x<W+300)addHouse(houses[houses.length-1].x+100);draw()},
    bot(){target.x=zone;toss()}};
}

/* ============================== BOOT ============================== */
function showError(e){const v=document.getElementById('view');if(v)v.innerHTML='<div class="card" style="color:#b00"><b>Oops, the game hit an error:</b><br>'+esc(e&&e.message||e)+'</div>'}
window.addEventListener('error',ev=>showError(ev.error||ev.message));
function boot(){
  try{
    if(!storageOK){const b=$('#banner');b.hidden=false;b.innerHTML='⚠️ This viewer blocks saving. Progress lasts only while it\'s open. Go to <b>⭐ Me → Export code</b> to keep it!'}
    $('#more').onclick=()=>{sfx('click');openMore()};
    $('#mail').onclick=()=>{sfx('click');openMail()};
    setInterval(()=>{clockTick();if(!S.char||!CLOCK.on)return;onlineTick();v8Tick();if(checkDay()){toast('☀️ Day '+S.day+'! Stores rotated & new deals');sfx('level');if(screen==='mall'&&!shift)rerender()}
      Array.prototype.forEach.call(document.querySelectorAll('.cd'),e=>{e.textContent=timeLeft()})},1000);
    screen=S.char?'mall':'create';nav();render();
    if(S.char)setTimeout(welcomeBack,600);
  }catch(e){showError(e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
/* test hook (harmless in play) */
window.__game={get S(){return S},ITEMS:ITEMS,ITEM:ITEM,STORES:STORES,JOBS:JOBS,go:go,get shift(){return shift},endShift:endShift,render:render,openStores:openStores,deals:deals,thumb:thumb,buy:id=>buy(ITEM[id]),onlineTick:onlineTick,nextDay:nextDay,CLAM:CLAM,KO_OF:KO_OF,courtCase:courtCase,crimeNewDay:crimeNewDay,startShift:startShift,CS_JOB:CS_JOB,alleyStock:alleyStock,stealAttempt:stealAttempt,sell:sell,fbSell:fbSell,fits:fits,fitsYard:fitsYard,ITEM:ITEM,save:save,curbAppeal:curbAppeal,houseValue:houseValue};
