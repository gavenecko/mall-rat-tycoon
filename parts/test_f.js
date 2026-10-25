(async()=>{
 await G(()=>{const o=document.getElementById('phov');if(o)o.remove();closeSheet()});
 // sprite opacity: every pet x every accessory
 const f1=await G(()=>{const OFF={hamster:[0,-.3],cat:[0,-.24],pug:[0,-.26],axolotl:[0,-.17],capy:[-.04,-.26]};const AP={bow:[.6,0],bandana:[0,1.4],sunnies:[.55,.8],crown:[0,-.25],collar:[0,1.45]};const bad=[];let n=0;
   PETS.forEach(p=>{[null].concat(PET_ACC.map(a=>a.k)).forEach(w=>{const c=document.createElement('canvas');c.width=c.height=200;const x=c.getContext('2d');const h=drawPetSprite(x,p.k,100,180,150,false,w);
     const px=(X,Y)=>x.getImageData(Math.round(X),Math.round(Y),1,1).data;const o=OFF[p.k],b=px(100+o[0]*150,180+o[1]*150);n++;if(b[3]!==255||(b[0]>245&&b[1]>245&&b[2]>245))bad.push(p.k+'/'+w+' body '+[].slice.call(b));
     if(w){const a=AP[w],q=px(100+h.x+a[0]*h.r,180+h.y+a[1]*h.r);const c2=document.createElement('canvas');c2.width=c2.height=200;const x2=c2.getContext('2d');drawPetSprite(x2,p.k,100,180,150,false,null);const q0=x2.getImageData(Math.round(100+h.x+a[0]*h.r),Math.round(180+h.y+a[1]*h.r),1,1).data;
       if(q[3]!==255||(q[0]===q0[0]&&q[1]===q0[1]&&q[2]===q0[2]&&q0[3]===255))bad.push(p.k+'/'+w+' acc '+[].slice.call(q))}})});
   const x=document.createElement('canvas').getContext('2d');x.globalAlpha=.3;drawPetSprite(x,'hamster',50,90,80,false,null);return{n,bad,alpha:x.globalAlpha}});
 ok(f1.bad.length===0&&f1.n===30&&f1.alpha===.3,'all 5 pets x 6 accessory states: opaque (alpha 255), non-background, ctx alpha restored '+JSON.stringify(f1));
 // in-room pixels per pet
 const f2=await G(async()=>{const g=__game,res={};g.S.cash=1e5;for(const k of ['hamster','cat','pug','axolotl','capy']){g.S.pet={k:k,name:'T',full:90,joy:90,acc:{crown:1},wear:'crown',day:1,fedDay:0,away:0,starve:0,wx:3,wy:WALL+1.5};
     g.go('room');PW.moving=false;PW.tx=3;PW.wait=gnow()+1e7;PW.heart=0;await new Promise(r=>setTimeout(r,120));const cv=document.querySelector('#view canvas, main canvas, canvas');const cs=[].slice.call(document.querySelectorAll('canvas')).filter(c=>c.width>300)[0];
     const d=cs.width/(COLS*Math.floor(Math.min(innerWidth-24,560)/COLS)),c=Math.floor(Math.min(innerWidth-24,560)/COLS);const X=(3.5)*c*d,Y=(WALL+1.5+.9-.28)*c*d;const p=cs.getContext('2d').getImageData(Math.round(X),Math.round(Y),1,1).data;
     const bg=roomBg(c).getContext('2d').getImageData(Math.round(X),Math.round(Y),1,1).data;res[k]=[p[3],Math.abs(p[0]-bg[0])+Math.abs(p[1]-bg[1])+Math.abs(p[2]-bg[2])]}return res});
 ok(Object.keys(f2).every(k=>f2[k][0]===255&&f2[k][1]>25),'each pet drawn opaque in the room '+JSON.stringify(f2));
 // all five pets screenshot
 await G(()=>{if(PW.iv){clearInterval(PW.iv);PW.iv=null}const d=document.createElement('div');d.id='lineup';d.style.cssText='position:fixed;left:0;right:0;top:70px;z-index:9998;background:#fff;padding:8px';const W=innerWidth-16,c=Math.floor(W/COLS),H=c*ROWS;
   const cv=document.createElement('canvas');d.appendChild(cv);document.body.appendChild(d);const x=setupCanvas(cv,c*COLS,H);x.drawImage(roomBg(c),0,0,c*COLS,H);seasonFX(x,c);
   [['hamster','bow'],['cat','sunnies'],['pug','crown'],['axolotl','bandana'],['capy','collar']].forEach((p,i)=>drawPetSprite(x,p[0],c*COLS*(.12+i*.19),(WALL+(i%2?3.2:2.2))*c,c*1.3,false,p[1]));
   d.insertAdjacentHTML('beforeend','<div class="small center">hamster · cat · pug · "axolotl" · capybara</div>')});
 await sleep(100);await shot('pets');await G(()=>{const d=document.getElementById('lineup');if(d)d.remove()});
 // wander + tap reaction + home score
 const f3=await G(async()=>{const g=__game;g.go('room');const p=g.S.pet;const x0=p.wx,y0=p.wy;PW.tx=null;PW.wait=0;PW.moving=false;await new Promise(r=>setTimeout(r,1600));const moved=Math.hypot(p.wx-x0,p.wy-y0)>.2;
   PW.moving=false;PW.wait=gnow()+1e7;const cs=[].slice.call(document.querySelectorAll('canvas')).filter(c=>c.width>300)[0],r=cs.getBoundingClientRect(),c=Math.floor(Math.min(innerWidth-24,560)/COLS);const av=JSON.stringify(g.S.avatar);
   cs.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,clientX:r.left+(p.wx+.5)*c,clientY:r.top+(p.wy+.3)*c}));const hearts=PW.heart>gnow();const still=JSON.stringify(g.S.avatar)===av;
   const h1=homeScore();const keep=g.S.pet;g.S.pet=null;const h0=homeScore();g.S.pet=keep;return{moved,hearts,still,bonus:h1-h0}});
 ok(f3.moved&&f3.hearts&&f3.still&&f3.bonus>0,'pet wanders, reacts to taps, boosts home score '+JSON.stringify(f3));
 // credit karen + apartments
 const f4=await G(async()=>{const g=__game,C=g.S.credit;closeSheet();g.S.shifts=Math.max(g.S.shifts,20);g.S.card.bal=0;C.lastBal=500;const s0=C.score;nextDay();const up=C.score-s0;
   const l0=cardLimit();g.S.card.bal=Math.round(cardLimit()*.95);const s1=C.score;nextDay();const down=C.score-s1;g.S.card.bal=0;
   g.S.cash=0;g.S.bnpl=[{label:'x',amt:50,left:1}];const s2=C.score;nextDay();const bnpl=C.score-s2;g.S.card.bal=0;
   C.score=800;const lim=cardLimit();g.S.cash=1e5;onTab='wallet';g.go('online');const card=!!document.querySelector('#creditcard');document.querySelector('[data-apt="row"]').click();const moved=g.S.apt.k;const c0=g.S.cash;nextDay();const rent=c0-g.S.cash;
   return{up,down,bnpl,l0,lim,card,moved,rent,home:apt().home}});
 ok(f4.up>0&&f4.down<0&&f4.bnpl<=-20&&f4.lim>f4.l0&&f4.card&&f4.moved==='row'&&f4.rent>=400&&f4.home===25,'Credit Karen score, limit multiplier, apartment + rent '+JSON.stringify(f4));
 await G(()=>{onTab='wallet';__game.go('online');const e=document.querySelector('#creditcard');if(e)e.scrollIntoView()});await sleep(150);await shot('credit');
 // wishlist targets + alerts
 const f5=await G(()=>{const g=__game;let it=null;for(const i of g.ITEMS){if(!i.rare&&offOf(i)>=10){it=i;break}}if(!it)return{none:1};g.S.wish={};g.S.wish[it.id]=1;g.S.wishT={};onTab='wish';g.go('online');document.querySelector('[data-a="alert"]').click();const t1=g.S.wishT[it.id];
   const n0=g.S.inbox.length,a0=g.S.stats10.alerts;wishAlerts();const hit=g.S.stats10.alerts-a0;g.S.wishT[it.id]=50;const off=offOf(it);wishAlerts();const hit2=g.S.stats10.alerts-a0-hit;return{t1,hit,off,hit2,low:low7(it)<=priceOf(it)}});
 ok(f5.t1===10&&f5.hit===1&&(f5.off>=50?f5.hit2===1:f5.hit2===0)&&f5.low,'wishlist price targets + 7-day low '+JSON.stringify(f5));
 await G(()=>{onTab='wish';__game.go('online');window.scrollTo(0,0)});await shot('wish');
})()
