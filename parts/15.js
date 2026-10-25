/* ============================== v10 ==============================
   Hand-drawn opaque pet sprites (no emoji fonts), drawn seasonal decor,
   wandering/tappable pets, Credit Karen score + apartments, wishlist price targets. */
const OUT='#3b2730';
function rr_(x,X,Y,W,H,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+H,r);x.arcTo(X+W,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.arcTo(X,Y,X+W,Y,r);x.closePath()}
function sh(x,fill,lw){x.globalAlpha=1;x.fillStyle=fill;x.fill();x.strokeStyle=OUT;x.lineWidth=lw;x.stroke()}
function oval(x,cx,cy,rx,ry,rot){x.beginPath();x.ellipse(cx,cy,Math.max(.5,rx),Math.max(.5,ry),rot||0,0,Math.PI*2)}
function eye(x,cx,cy,r,sleepy){x.globalAlpha=1;if(sleepy){x.strokeStyle=OUT;x.lineWidth=Math.max(1.2,r*.7);x.beginPath();x.moveTo(cx-r,cy);x.lineTo(cx+r,cy);x.stroke();return}
  x.fillStyle='#1b1014';x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(cx-r*.35,cy-r*.35,r*.38,0,7);x.fill()}
/* each sprite: draws centred on (0,0) feet at y=0, size s, returns head anchor {x,y,r} */
const PET_DRAW={
 hamster(x,s,lw){oval(x,0,-s*.3,s*.42,s*.3);sh(x,'#e8a958',lw);oval(x,0,-s*.24,s*.24,s*.17);sh(x,'#fff3df',lw*.6);
  [-1,1].forEach(d=>{oval(x,d*s*.22,-s*.56,s*.08,s*.08);sh(x,'#f2b8c6',lw)});eye(x,-s*.13,-s*.38,s*.045);eye(x,s*.13,-s*.38,s*.045);
  x.fillStyle='#ff8fab';x.beginPath();x.arc(0,-s*.31,s*.035,0,7);x.fill();x.fillStyle='#f7a1a1';oval(x,-s*.25,-s*.28,s*.06,s*.04);x.fill();oval(x,s*.25,-s*.28,s*.06,s*.04);x.fill();return{x:0,y:-s*.6,r:s*.2}},
 cat(x,s,lw){x.strokeStyle=OUT;x.lineWidth=lw*2.6;x.beginPath();x.moveTo(s*.28,-s*.08);x.quadraticCurveTo(s*.6,-s*.1,s*.5,-s*.48);x.stroke();x.strokeStyle='#9aa0a8';x.lineWidth=lw*1.4;x.stroke();
  oval(x,0,-s*.24,s*.3,s*.24);sh(x,'#9aa0a8',lw);oval(x,0,-s*.58,s*.24,s*.2);sh(x,'#9aa0a8',lw);
  [-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.22,-s*.66);x.lineTo(d*s*.2,-s*.86);x.lineTo(d*s*.06,-s*.74);x.closePath();sh(x,'#9aa0a8',lw)});
  x.fillStyle='#7cd67c';[-1,1].forEach(d=>{oval(x,d*s*.09,-s*.6,s*.045,s*.055);x.fill();x.fillStyle='#1b1014';oval(x,d*s*.09,-s*.6,s*.015,s*.045);x.fill();x.fillStyle='#7cd67c'});
  x.fillStyle='#ff8fab';x.beginPath();x.moveTo(-s*.03,-s*.53);x.lineTo(s*.03,-s*.53);x.lineTo(0,-s*.5);x.fill();
  x.strokeStyle=OUT;x.lineWidth=1;[-1,1].forEach(d=>{x.beginPath();x.moveTo(d*s*.06,-s*.5);x.lineTo(d*s*.26,-s*.53);x.moveTo(d*s*.06,-s*.49);x.lineTo(d*s*.25,-s*.45);x.stroke()});return{x:0,y:-s*.78,r:s*.2}},
 pug(x,s,lw){oval(x,0,-s*.26,s*.34,s*.24);sh(x,'#d9b98c',lw);x.strokeStyle=OUT;x.lineWidth=lw;x.beginPath();x.arc(s*.34,-s*.42,s*.06,0,Math.PI*1.6);x.stroke();
  oval(x,0,-s*.58,s*.24,s*.21);sh(x,'#d9b98c',lw);[-1,1].forEach(d=>{oval(x,d*s*.22,-s*.68,s*.07,s*.1,d*.5);sh(x,'#4a3a32',lw)});
  oval(x,0,-s*.5,s*.13,s*.09);sh(x,'#4a3a32',lw*.6);eye(x,-s*.1,-s*.63,s*.05);eye(x,s*.1,-s*.63,s*.05);x.fillStyle='#111';oval(x,0,-s*.53,s*.04,s*.025);x.fill();
  x.fillStyle='#ff8fab';oval(x,s*.02,-s*.44,s*.03,s*.035);x.fill();return{x:0,y:-s*.77,r:s*.2}},
 axolotl(x,s,lw){x.strokeStyle=OUT;x.lineWidth=lw*2.4;x.beginPath();x.moveTo(-s*.3,-s*.14);x.quadraticCurveTo(-s*.6,-s*.1,-s*.55,-s*.3);x.stroke();x.strokeStyle='#5cbf6a';x.lineWidth=lw*1.3;x.stroke();
  oval(x,0,-s*.17,s*.36,s*.14);sh(x,'#5cbf6a',lw);[-1,1].forEach(d=>{oval(x,d*s*.2,-s*.04,s*.06,s*.05);sh(x,'#4aa957',lw*.6)});
  oval(x,s*.14,-s*.38,s*.22,s*.16);sh(x,'#5cbf6a',lw);
  [[-1,-.1],[-1,.05],[-1,.2]].forEach((g,i)=>{[-1,1].forEach(d=>{x.beginPath();x.moveTo(s*.14+d*s*.18,-s*.42+i*s*.06);x.lineTo(s*.14+d*s*.34,-s*.52+i*s*.1);x.strokeStyle=OUT;x.lineWidth=lw*2.2;x.stroke();x.strokeStyle='#ff7eb3';x.lineWidth=lw*1.2;x.stroke()})});
  eye(x,s*.06,-s*.42,s*.04);eye(x,s*.22,-s*.42,s*.04);x.strokeStyle=OUT;x.lineWidth=1.2;x.beginPath();x.arc(s*.14,-s*.36,s*.06,.2,Math.PI-.2);x.stroke();
  x.fillStyle='#e9f7a8';[[-s*.12,-s*.2],[0,-s*.13],[-s*.22,-s*.12]].forEach(p=>{x.beginPath();x.arc(p[0],p[1],s*.025,0,7);x.fill()});return{x:s*.14,y:-s*.54,r:s*.18}},
 capy(x,s,lw){oval(x,-s*.04,-s*.26,s*.4,s*.25);sh(x,'#9a6b45',lw);rr_(x,s*.08,-s*.66,s*.36,s*.3,s*.12);sh(x,'#9a6b45',lw);
  [s*.14,s*.3].forEach(e=>{oval(x,e,-s*.68,s*.05,s*.04);sh(x,'#7a5235',lw*.7)});eye(x,s*.22,-s*.54,s*.04,true);
  x.fillStyle='#3b2730';[s*.37,s*.41].forEach(n=>{oval(x,n,-s*.5,s*.015,s*.02);x.fill()});oval(x,s*.26,-s*.74,s*.08,s*.07);sh(x,'#ffa726',lw*.7);
  x.fillStyle='#4caf50';x.beginPath();x.ellipse(s*.3,-s*.81,s*.04,s*.02,-.5,0,7);x.fill();return{x:s*.24,y:-s*.66,r:s*.18}}};
const ACC_DRAW={
 bow(x,h,lw){const r=h.r;[-1,1].forEach(d=>{x.beginPath();x.moveTo(h.x,h.y);x.lineTo(h.x+d*r*.9,h.y-r*.5);x.lineTo(h.x+d*r*.9,h.y+r*.4);x.closePath();sh(x,'#ff4f9a',lw)});x.beginPath();x.arc(h.x,h.y,r*.25,0,7);sh(x,'#ff86c0',lw)},
 bandana(x,h,lw){const r=h.r;x.beginPath();x.moveTo(h.x-r*1.1,h.y+r*1.15);x.lineTo(h.x+r*1.1,h.y+r*1.15);x.lineTo(h.x,h.y+r*2);x.closePath();sh(x,'#e53935',lw);x.fillStyle='#fff';[[-.4,1.35],[.3,1.4],[0,1.7]].forEach(p=>{x.beginPath();x.arc(h.x+p[0]*r,h.y+p[1]*r,r*.08,0,7);x.fill()})},
 sunnies(x,h,lw){const r=h.r;[-1,1].forEach(d=>{rr_(x,h.x+d*r*.55-r*.42,h.y+r*.55,r*.84,r*.5,r*.18);sh(x,'#111',lw)});x.strokeStyle='#111';x.lineWidth=lw;x.beginPath();x.moveTo(h.x-r*.15,h.y+r*.7);x.lineTo(h.x+r*.15,h.y+r*.7);x.stroke();
  x.fillStyle='#fff';x.fillRect(h.x-r*.85,h.y+r*.62,r*.18,r*.08)},
 crown(x,h,lw){const r=h.r,b=h.y-r*.05;x.beginPath();x.moveTo(h.x-r*.8,b);x.lineTo(h.x-r*.8,b-r*.75);x.lineTo(h.x-r*.4,b-r*.35);x.lineTo(h.x,b-r*.9);x.lineTo(h.x+r*.4,b-r*.35);x.lineTo(h.x+r*.8,b-r*.75);x.lineTo(h.x+r*.8,b);x.closePath();sh(x,'#ffc928',lw);
  x.fillStyle='#e53935';x.beginPath();x.arc(h.x,b-r*.3,r*.12,0,7);x.fill()},
 collar(x,h,lw){const r=h.r;rr_(x,h.x-r*.95,h.y+r*1.15,r*1.9,r*.28,r*.12);sh(x,'#1b7a45',lw);x.beginPath();x.arc(h.x,h.y+r*1.6,r*.28,0,7);sh(x,'#ffc928',lw);
  x.fillStyle=OUT;x.font='bold '+Math.max(6,Math.round(r*.4))+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('GG',h.x,h.y+r*1.62)}};
function drawPetSprite(x,k,cx,cy,s,flip,wear){x.save();x.globalAlpha=1;x.globalCompositeOperation='source-over';x.translate(cx,cy);if(flip)x.scale(-1,1);const lw=Math.max(1.4,s*.035);x.lineJoin='round';x.lineCap='round';
  x.fillStyle='rgba(30,10,30,.22)';oval(x,0,0,s*.36,s*.07);x.fill();x.globalAlpha=1;const h=(PET_DRAW[k]||PET_DRAW.hamster)(x,s,lw);if(wear&&ACC_DRAW[wear])ACC_DRAW[wear](x,h,lw);x.restore();return h}
const PTH={};function petThumb(k,wear){const key=k+(wear||'');if(PTH[key])return PTH[key];const c=document.createElement('canvas');c.width=c.height=96;drawPetSprite(c.getContext('2d'),k,48,88,82,false,wear);return PTH[key]=c.toDataURL()}
/* drawn seasonal decor shapes */
const DECO={
 pumpkin(x,s,lw){[-.25,.25,0].forEach(o=>{oval(x,o*s,0,s*.32,s*.36);sh(x,'#ff8a1f',lw)});x.fillStyle='#4caf50';x.fillRect(-s*.05,-s*.5,s*.1,s*.16);x.strokeStyle=OUT;x.lineWidth=lw;x.strokeRect(-s*.05,-s*.5,s*.1,s*.16)},
 bat(x,s,lw){x.beginPath();x.moveTo(0,-s*.1);x.quadraticCurveTo(-s*.3,-s*.4,-s*.6,-s*.1);x.quadraticCurveTo(-s*.4,0,-s*.3,s*.1);x.quadraticCurveTo(-s*.15,0,0,s*.15);x.quadraticCurveTo(s*.15,0,s*.3,s*.1);x.quadraticCurveTo(s*.4,0,s*.6,-s*.1);x.quadraticCurveTo(s*.3,-s*.4,0,-s*.1);sh(x,'#3a2a4a',lw);
  x.fillStyle='#ffeb3b';[-1,1].forEach(d=>{x.beginPath();x.arc(d*s*.06,-s*.02,s*.03,0,7);x.fill()})},
 leaf(x,s,lw,c){x.beginPath();x.moveTo(0,-s*.45);x.quadraticCurveTo(s*.4,-s*.1,0,s*.4);x.quadraticCurveTo(-s*.4,-s*.1,0,-s*.45);sh(x,c||'#e65100',lw);x.beginPath();x.moveTo(0,-s*.4);x.lineTo(0,s*.4);x.stroke()},
 leaf2(x,s,lw){DECO.leaf(x,s,lw,'#c62828')},
 snow(x,s,lw){x.strokeStyle='#5c8fd6';x.lineWidth=lw*2.2;for(let i=0;i<3;i++){x.save();x.rotate(i*Math.PI/3);x.beginPath();x.moveTo(-s*.4,0);x.lineTo(s*.4,0);x.stroke();x.restore()}x.strokeStyle='#fff';x.lineWidth=lw;for(let i=0;i<3;i++){x.save();x.rotate(i*Math.PI/3);x.beginPath();x.moveTo(-s*.4,0);x.lineTo(s*.4,0);x.stroke();x.restore()}},
 gift(x,s,lw){rr_(x,-s*.32,-s*.25,s*.64,s*.55,s*.05);sh(x,'#e53935',lw);x.fillStyle='#ffc928';x.fillRect(-s*.06,-s*.25,s*.12,s*.55);x.fillRect(-s*.32,-s*.02,s*.64,s*.1);oval(x,-s*.12,-s*.32,s*.12,s*.07,-.4);sh(x,'#ffc928',lw);oval(x,s*.12,-s*.32,s*.12,s*.07,.4);sh(x,'#ffc928',lw)},
 heart(x,s,lw){x.beginPath();x.moveTo(0,s*.35);x.bezierCurveTo(-s*.55,0,-s*.35,-s*.45,0,-s*.18);x.bezierCurveTo(s*.35,-s*.45,s*.55,0,0,s*.35);sh(x,'#ff3d81',lw)},
 flower(x,s,lw){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;oval(x,Math.cos(a)*s*.2,Math.sin(a)*s*.2,s*.16,s*.12,a);sh(x,'#ffafd0',lw)}x.beginPath();x.arc(0,0,s*.11,0,7);sh(x,'#ffd54f',lw)},
 sun(x,s,lw){x.strokeStyle='#ff9800';x.lineWidth=lw*1.6;for(let i=0;i<8;i++){const a=i*Math.PI/4;x.beginPath();x.moveTo(Math.cos(a)*s*.3,Math.sin(a)*s*.3);x.lineTo(Math.cos(a)*s*.45,Math.sin(a)*s*.45);x.stroke()}x.beginPath();x.arc(0,0,s*.24,0,7);sh(x,'#ffd54f',lw)},
 palm(x,s,lw){x.fillStyle='#8d6e63';x.fillRect(-s*.04,-s*.1,s*.08,s*.5);x.strokeStyle=OUT;x.lineWidth=lw;x.strokeRect(-s*.04,-s*.1,s*.08,s*.5);[-2.6,-2,-1.2,-.5].forEach(a=>{oval(x,Math.cos(a)*s*.2,-s*.1+Math.sin(a)*s*.15,s*.22,s*.07,a);sh(x,'#43a047',lw)})}};
const SEASON_DECO={spooky:['pumpkin','bat'],thanks:['leaf','leaf2'],holly:['snow','gift'],galentine:['heart','flower'],spring:['flower','heart'],summer:['sun','palm']};
function drawDeco(x,k,cx,cy,s){x.save();x.globalAlpha=1;x.translate(cx,cy);x.lineJoin='round';DECO[k](x,s,Math.max(1.2,s*.05));x.restore()}
seasonFX=function(x,c){const se=season(),ks=SEASON_DECO[se.k]||['heart'],W=c*COLS,H=c*ROWS,r=rng(S.day*31+7);x.save();x.globalAlpha=1;
  x.strokeStyle='#5d4037';x.lineWidth=1.5;x.beginPath();x.moveTo(0,c*.12);for(let i=1;i<=4;i++)x.quadraticCurveTo(W*(i-.5)/4,c*.45,W*i/4,c*.12);x.stroke();
  const n=COLS*2;for(let i=0;i<n;i++){const t=(i+.5)/n,u=(t*4)%1;drawDeco(x,ks[i%ks.length],W*t,c*.12+c*.33*Math.sin(u*Math.PI)*.9+c*.1,c*.3)}
  [[c*.45,H-c*.4],[W-c*.45,H-c*.4]].forEach((p,i)=>drawDeco(x,ks[i%ks.length],p[0],p[1],c*.55));x.restore()};

/* pets: draw, wander, react */
const PET_S=()=>S.pet;
petObj=function(x,c){const p=S.pet;if(!p||p.away)return null;if(p.wx==null){p.wx=Math.min(COLS-1,S.avatar.x+1);p.wy=Math.max(WALL,S.avatar.y)}
  return{z:p.wy+1,f:()=>{const cx=(p.wx+.5)*c,cy=(p.wy+.9)*c,bob=PW.moving?Math.abs(Math.sin(gnow()/120))*c*.05:0;drawPetSprite(x,p.k,cx,cy-bob,c*1.05,PW.face<0,p.wear);
    const t=PW.heart-gnow();if(t>0){const k=1-t/1200;for(let i=0;i<3;i++)drawDeco(x,'heart',cx+(i-1)*c*.25,cy-c*1.05-k*c*.5-i*c*.08,c*.28)}
    else if(p.full<25||p.joy<35){x.save();x.globalAlpha=1;rr_(x,cx+c*.2,cy-c*1.15,c*.62,c*.34,c*.12);sh(x,'#fff',1.5);x.fillStyle=OUT;x.font='bold '+Math.round(c*.22)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(p.full<25?'food?':'bored',cx+c*.51,cy-c*.98);x.restore()}}}};
const PW={iv:null,tx:null,ty:null,wait:0,moving:false,face:1,heart:0,last:0,petT:0};
function petLoop(draw,cv,c){if(PW.iv)clearInterval(PW.iv);PW.iv=null;if(!S.pet||S.pet.away)return;PW.last=gnow();
  cv.addEventListener('pointerdown',e=>{const p=S.pet;if(!p||p.away)return;const r=cv.getBoundingClientRect(),gx=(e.clientX-r.left)/c-.5,gy=(e.clientY-r.top)/c-.5;
    if(Math.abs(gx-p.wx)<.75&&gy>p.wy-1.1&&gy<p.wy+.7){e.stopImmediatePropagation();e.preventDefault();petReact()}},true);
  PW.iv=setInterval(()=>{if(!document.body.contains(cv)||!S.pet||S.pet.away){clearInterval(PW.iv);PW.iv=null;return}const now=gnow(),dt=Math.min(.25,(now-PW.last)/1000);PW.last=now;const p=S.pet;
    if(PW.tx==null||(!PW.moving&&now>PW.wait)){const near=Math.random()<.4;PW.tx=near?Math.max(0,Math.min(COLS-1,S.avatar.x+(Math.random()<.5?-1:1))):Math.random()*(COLS-1);PW.ty=near?S.avatar.y:WALL+Math.random()*(ROWS-1-WALL);PW.moving=true}
    let moved=false;if(PW.moving){const dx=PW.tx-p.wx,dy=PW.ty-p.wy,d=Math.hypot(dx,dy),sp=(p.k==='capy'?.6:p.k==='hamster'?1.6:1.1)*dt;if(d<=sp){p.wx=PW.tx;p.wy=PW.ty;PW.moving=false;PW.wait=now+1500+Math.random()*3000}else{p.wx+=dx/d*sp;p.wy+=dy/d*sp;if(Math.abs(dx)>.05)PW.face=dx<0?-1:1}moved=true}
    if(moved||PW.heart>now-100)draw()},90)}
function petReact(){const p=S.pet,now=gnow();PW.heart=now+1200;PW.moving=false;PW.wait=now+1500;sfx('click');if(now-PW.petT>8000){PW.petT=now;p.joy=Math.min(100,p.joy+3);p.pets=(p.pets||0)+1;save()}
  toast(['💕 '+p.name+' loves you (and your wallet)','✨ '+p.name+' did a little spin','🥺 '+p.name+' demands snacks','😌 '+p.name+' approves of the decor'][Math.floor(Math.random()*4)])}
function petBonus(){const p=S.pet;if(!p||p.away)return 0;return Math.min(15,3+Object.keys(p.acc||{}).length*2+(p.joy>=60&&p.full>=40?4:0))}

/* Credit Karen + apartments */
const APTS=[{k:'basement',name:'Your Parents\' Basement',min:0,rent:0,dep:0,home:0,blurb:'Free rent. Mandatory family dinners.'},{k:'lofts',name:'Vape-Ex Lofts',min:650,rent:40,dep:200,home:5,blurb:'Exposed brick, exposed pipes, exposed neighbors.'},
 {k:'avo',name:'Avocado Toast Towers',min:720,rent:120,dep:800,home:12,blurb:'Rooftop yoga. Lobby smells like money.'},{k:'row',name:'Billionaire\'s Row-ish',min:790,rent:400,dep:3000,home:25,blurb:'Doorman judges your outfits (lovingly).'}];
const apt=()=>APTS.filter(a=>a.k===S.apt.k)[0]||APTS[0];
function creditTier(s){return s<580?['Poor','💀','#d32f2f']:s<670?['Fair','😬','#f57c00']:s<740?['Good','🙂','#7cb342']:s<800?['Very Good','😎','#2e7d32']:['Exceptional','🧐','#1565c0']}
function creditMult(){const s=S.credit?S.credit.score:650;return s<580?.6:s<670?1:s<740?1.25:s<800?1.5:2}
function credit(d,why){const c=S.credit;c.score=Math.max(300,Math.min(850,c.score+d));if(why)c.log.unshift({d:d,why:why,day:S.day});c.log.length=Math.min(c.log.length,12)}
function creditNewDay(){const c=S.credit,lim=cardLimit(),bal=S.card.bal,u=bal/lim;
  if(bal<=0)credit(c.lastBal>0?8:2,c.lastBal>0?'Paid card in full 👏':'No debt');else if(u>.9)credit(-12,'Card maxed out ('+Math.round(u*100)+'%)');else if(u>.6)credit(-6,'High utilization ('+Math.round(u*100)+'%)');else if(u<.3)credit(3,'Low utilization');else credit(-1,'Carrying a balance');
  if(c.bnplPaid){credit(2*c.bnplPaid,'Pay-in-4 paid on time');c.bnplPaid=0}
  const a=apt();if(a.rent){if(S.cash>=a.rent){S.cash-=a.rent;credit(1,'Rent on time')}else if(S.card.bal+a.rent<=lim){S.card.bal+=a.rent;credit(-8,'Rent put on card')}else{S.apt.miss++;credit(-25,'Missed rent');notify('🏠 Missed rent at '+a.name+'! Strike '+S.apt.miss+'/2.');
    if(S.apt.miss>=2){const i=APTS.indexOf(a);S.apt={k:APTS[Math.max(0,i-1)].k,miss:0};notify('📦 Evicted from '+a.name+'. Back to '+apt().name+'. Mom made lasagna.')}}}
  c.lastBal=S.card.bal;c.hist.push(c.score);if(c.hist.length>14)c.hist.shift();if(S.day%4===0)notify('💅 Credit Karen: your score is '+c.score+' ('+creditTier(c.score)[0]+'). '+(c.score>=740?'Fine. I\'m impressed. Don\'t tell anyone.':c.score<580?'I need to speak to your financial manager.':'Could be worse. Could be better. Mostly worse.'))}
function creditBlock(v){const c=S.credit,t=creditTier(c.score),a=apt();
  v.insertAdjacentHTML('beforeend','<div class="card" id="creditcard"><div class="row sp"><b>💅 Credit Karen</b><span class="small">limit ×'+creditMult()+'</span></div><div class="row" style="align-items:center;gap:12px"><div style="font-size:38px;font-weight:900;color:'+t[2]+'">'+c.score+'</div><div><b>'+t[1]+' '+t[0]+'</b><div class="small">300–850 · pay your card in full, keep it under 30%, don\'t bounce Pay-in-4.</div></div></div>'+
   '<canvas id="crsp" width="300" height="46" style="width:100%;height:46px"></canvas>'+(c.log.length?'<div class="small">'+c.log.slice(0,4).map(l=>(l.d>=0?'🟢 +':'🔴 ')+l.d+' '+esc(l.why)).join('<br>')+'</div>':'')+'</div>'+
   '<div class="card" id="aptcard"><b>🏢 Apartments</b><div class="small">You live at <b>'+esc(a.name)+'</b>'+(a.rent?' · rent '+money(a.rent)+'/day (auto-pay)':'')+'. Better address = higher home score with the neighbors.</div>'+
   APTS.map(q=>{const here=q.k===a.k,ok=c.score>=q.min;return'<div class="slot"><span><b>'+esc(q.name)+'</b><br><span class="small">'+esc(q.blurb)+'<br>Score '+q.min+'+ · rent '+money(q.rent)+'/day · deposit '+money(q.dep)+' · home +'+q.home+'</span></span>'+(here?'<button class="btn alt" disabled>Home</button>':'<button class="btn" data-apt="'+q.k+'" '+(ok||APTS.indexOf(q)<APTS.indexOf(a)?'':'disabled')+'>'+(ok||APTS.indexOf(q)<APTS.indexOf(a)?'Move':'🔒 '+q.min)+'</button>')+'</div>'}).join('')+'</div>');
  const cv=$('#crsp');if(cv){const x=cv.getContext('2d'),h=c.hist.length>1?c.hist:[c.score,c.score];x.clearRect(0,0,300,46);x.strokeStyle=t[2];x.lineWidth=2.5;x.beginPath();h.forEach((s,i)=>{const X=i/(h.length-1)*296+2,Y=44-(s-300)/550*42;i?x.lineTo(X,Y):x.moveTo(X,Y)});x.stroke()}
  onAll(v,'[data-apt]',b=>{const q=APTS.filter(z=>z.k===b.dataset.apt)[0];if(APTS.indexOf(q)>APTS.indexOf(apt())){if(S.credit.score<q.min)return;if(S.cash<q.dep){toast('Need '+money(q.dep)+' cash for the deposit');sfx('bad');return}S.cash-=q.dep;S.spent+=q.dep}
    S.apt={k:q.k,miss:0};sfx('level');notify('🔑 Moved into '+q.name+'!');toast('🔑 Welcome to '+q.name);save();rerender()})}

/* wishlist price targets + 7-day low */
const WT=[0,10,25,50];
function priceOn(it,d){const s=S.day;try{S.day=d;return priceOf(it)}finally{S.day=s}}
function low7(it){let m=Infinity;for(let d=Math.max(1,S.day-6);d<=S.day;d++)m=Math.min(m,priceOn(it,d));return m}
function wishAlertBtn(it){const t=S.wishT[it.id]||0,lo=low7(it),now=priceOf(it);return'<div class="small">'+(now<=lo&&now<it.price?'📉 <b>7-day low!</b>':'7-day low '+money(lo))+'</div><button class="btn alt" data-a="alert" style="font-size:12px">🔔 '+(t?'Ping at -'+t+'%':'Ping on any sale')+'</button>'}
function wishAlerts(){Object.keys(S.wish).forEach(id=>{const it=ITEM[id];if(!it)return;const off=offOf(it),t=S.wishT[id]||0;if(off>0&&off>=t){const lo=priceOf(it)<=low7(it);notify((t?'🎯 Price target hit: ':'💖 Wishlist alert: ')+it.name+' is '+off+'% off ('+money(priceOf(it))+')'+(lo?' · lowest in 7 days!':''));S.stats10.alerts++}})}

function v10Fix(s){if(!s.credit)s.credit={score:640,hist:[],log:[],lastBal:0,bnplPaid:0};if(!s.apt)s.apt={k:'basement',miss:0};if(!s.wishT)s.wishT={};if(!s.stats10)s.stats10={alerts:0};if(s.pet){delete s.pet.x;delete s.pet.y}}
function v10NewDay(){creditNewDay()}
ACH.push(['karen','Karen-Approved 💅','Reach a 740 credit score',s=>s.credit&&s.credit.score>=740],['mover','Moving On Up 🔑','Leave your parents\' basement',s=>s.apt&&s.apt.k!=='basement'],
 ['petpat','Certified Pet Patter 🫳','Pet your pet 10 times',s=>s.pet&&(s.pet.pets||0)>=10],['sniper','Deal Sniper 🎯','Get 5 wishlist price alerts',s=>s.stats10&&s.stats10.alerts>=5]);
