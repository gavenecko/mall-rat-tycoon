(async()=>{
 await G(()=>{const o=document.getElementById('phov');if(o)o.remove();closeSheet();AV.mood='smile'});
 // H1 toast queue: below top bar, stacks max 3, clears
 const h1=await G(async()=>{__game.go('mall');window.scrollTo(0,0);for(let i=0;i<5;i++)toast(i?'msg '+i:'🏆 Some Very Long Achievement Name That Goes On And On Forever And Ever (+$25)');await new Promise(r=>setTimeout(r,350));
   const t=document.querySelector('#toast'),r=t.getBoundingClientRect(),top=document.querySelector('header,#top,.top,#hud');const tb=top?top.getBoundingClientRect().bottom:70;const n=t.children.length,nav=document.querySelector('#nav').getBoundingClientRect();
   await new Promise(r=>setTimeout(r,3200));return{n,top:r.top,tb,bottom:r.bottom,navTop:nav.top,left:t.children.length}});
 ok(h1.n>=2&&h1.bottom<=h1.tb+1,'toasts queue (max 3) in safe area above nav, never over top bar '+JSON.stringify(h1));
 // H2 emotes in fit-check + shoot
 const h2=await G(async()=>{closeSheet();S.fitMood='love';fitCheck();await new Promise(r=>setTimeout(r,200));const chips=document.querySelectorAll('[data-fm]').length;const on=document.querySelector('[data-fm].on').dataset.fm;
   document.querySelector('[data-fm="sad"]').click();await new Promise(r=>setTimeout(r,200));const after=S.fitMood;const img=document.querySelector('#sheet img').src.length;closeSheet();
   const g=__game;g.S.shifts=Math.max(g.S.shifts,6);g.go('work');const j=g.JOBS.filter(j=>j.id==='shoot')[0];g.startShift(j);await new Promise(r=>setTimeout(r,200));const face=document.querySelectorAll('#pface button').length;
   if(document.querySelector('#sready'))document.querySelector('#sready').click();const cv=document.querySelector('#jarea canvas,#cv');if(!cv)return{dbg:!!g.shift,sc:screen,h:document.querySelector('#view').innerHTML.slice(0,200)};const px=()=>{const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let s=0;for(let i=0;i<d.length;i+=40)s=(s*31+d[i]+d[i+1])%1e9;return s};const a=px();
   document.querySelectorAll('#pface button')[5].dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));await new Promise(r=>setTimeout(r,50));const mood=AV.mood,b=px();g.endShift();return{chips,on,after,img:img>1000,face,mood,changed:a!==b,reset:AV.mood}});
 ok(h2.chips===7&&h2.on==='love'&&h2.after==='sad'&&h2.img&&h2.face===7&&h2.mood==='love'&&h2.changed&&h2.reset==='smile','emotes in fit-check photo + photoshoot face pad '+JSON.stringify(h2));
 // H3 car dealership + garage + cashback
 const h3=await G(async()=>{const S=__game.S;__game.go('mall');S.cash=20000;const c0=curbAppeal();const ok1=buyCar('teslow','#e53935');const c1=curbAppeal();S.carDay=0;const it=__game.ITEMS.filter(i=>i.price>100&&i.price<300&&!i.rare&&!i.drop)[0];const before=S.cash;__game.buy(it.id);await new Promise(r=>setTimeout(r,100));
   const back=S.cash-(before-it.price);__game.go('room','outside');await new Promise(r=>setTimeout(r,300));const cv=document.querySelector('#yardcv');const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let red=0;for(let i=0;i<d.length;i+=4)if(d[i]>200&&d[i+1]<80&&d[i+2]<80)red++;
   S.cash=1e5;const trade=S.cash;buyCar('lambro','#fdd835');return{ok1,c0,c1,back,red,traded:trade-S.cash===75000-Math.round(18000*.6),car:S.car.k}});
 ok(h3.ok1&&h3.c1>h3.c0&&h3.back>=1&&h3.red>200&&h3.traded&&h3.car==='lambro','car purchase, curb appeal, drive-in cashback, garage+car drawn, trade-in '+JSON.stringify(h3));
 // H4 car sprites opaque
 const h4=await G(()=>{const bad=[];CARS.forEach(c=>{const cv=document.createElement('canvas');cv.width=200;cv.height=110;const x=cv.getContext('2d');drawCar(x,c.k,0,6,200,'#1e88e5');const d=x.getImageData(100,6+30*2,1,1).data;const w=x.getImageData(44,6+42*2,1,1).data;if(d[3]!==255||w[3]!==255)bad.push(c.k+[].slice.call(d)+'/'+[].slice.call(w))});return bad});
 ok(h4.length===0,'all 5 cars opaque '+JSON.stringify(h4));
 // H5 gym
 const h5=await G(async()=>{const S=__game.S;S.cash=100;S.fit={lvl:0,day:0,last:0};gymSheet();await new Promise(r=>setTimeout(r,100));const b=document.querySelector('#gymgo');b.click();const paid=S.cash===92;for(let i=0;i<6;i++)b.click();await new Promise(r=>setTimeout(r,50));const lvl=S.fit.lvl,done=S.fit.day===S.day;closeSheet();
   S.fit.lvl=100;const m=fitMult();S.fit.last=S.day-5;v12NewDay();const dec=S.fit.lvl;S.fit.lvl=lvl;return{paid,lvl,done,m,dec}});
 ok(h5.paid&&h5.lvl>=1&&h5.done&&h5.m===1.05&&h5.dec===98,'gym: day pass, reps raise fitness, pay ×≤1.05, decay '+JSON.stringify(h5));
 // H6 food court + buffs
 const h6=await G(async()=>{const S=__game.S;S.cash=100;S.meal={};foodSheet();document.querySelector('[data-food="pizza"]').click();await new Promise(r=>setTimeout(r,50));for(let i=0;i<6;i++)document.querySelector('#bite').click();
   const luck=buffOn('luck')&&clawResult(3,.7)&&!clawResult(3,.8);closeSheet();foodSheet();const dis=document.querySelector('[data-food]').disabled;closeSheet();S.meal={day:S.day,k:'cinna'};const ch=Object.assign({},S.char,{hair:S.char.hair==='afro'?'bun':'afro'});const sweet=barberCost(S.char,ch);S.meal={day:S.day,k:'pretzel'};
   const n=NEIGHBORS[0];const it=__game.ITEMS[0];const charm=giftScore(n,it,'bag');S.meal={};return{cash:S.cash,luck,dis,sweet,charm,base:giftScore(n,it,'bag')}});
 ok(h6.cash===94&&h6.luck&&h6.dis&&h6.sweet===16&&h6.charm===h6.base+1,'food court: one meal/day, eat minigame, buffs wired '+JSON.stringify(h6));
 const h6b=await G(()=>{const bad=[];FOODS.forEach(f=>{const c=document.createElement('canvas');c.width=c.height=100;const x=c.getContext('2d');drawFood(x,f.k,0,0,100,0);const d=x.getImageData(f.k==='pretzel'?20:50,f.k==='pretzel'?68:f.k==='cinna'?70:55,1,1).data;if(d[3]!==255)bad.push(f.k+[].slice.call(d))});return bad});
 ok(h6b.length===0,'food art opaque '+JSON.stringify(h6b));
 // H7 encounters
 const h7=await G(async()=>{const S=__game.S;let found=0;for(let d=1;d<40&&!found;d++){S.day=d;S.enc={};if(encToday())found=d}S.day=found;S.enc={};__game.go('mall');await new Promise(r=>setTimeout(r,200));const card=!!document.querySelector('#enccard'),av=!!document.querySelector('#encav canvas');
   const c0=S.cash;const o=encChoose(0,.1);__game.go('mall');await new Promise(r=>setTimeout(r,100));return{found,card,av,o:!!o&&typeof o.msg==='string',gone:!document.querySelector('#enccard'),n:S.stats12.enc}});
 ok(h7.found&&h7.card&&h7.av&&h7.o&&h7.gone&&h7.n===1,'daily mall NPC encounter with avatar + choice '+JSON.stringify(h7));
 // H8 accessibility
 const h8=await G(async()=>{openMore();document.querySelector('[data-ts="2"]').click();const ts=document.body.classList.contains('ts2');document.querySelector('#mRm').click();const rm=document.body.classList.contains('rm');
   const s=JSON.parse(JSON.stringify(__game.S.ui));document.querySelector('[data-ts="0"]').click();document.querySelector('#mRm').click();closeSheet();return{ts,rm,s,clean:!document.body.classList.contains('ts2')&&!document.body.classList.contains('rm')}});
 ok(h8.ts&&h8.rm&&h8.s.ts===2&&h8.s.rm&&h8.clean,'text size + reduce motion settings '+JSON.stringify(h8));
 if(SHOTS&&mode==='file'&&W===412){
   await G(()=>{const S=__game.S;S.car={k:'lambro',col:'#fdd835'};__game.go('room','outside');window.scrollTo(0,0)});await sleep(300);await shot('garage');
   await G(()=>{dealerSheet()});await sleep(200);await shot('dealer');
   await G(()=>{closeSheet();const S=__game.S;let d=S.day;for(let i=0;i<60;i++){S.enc={};if(encToday())break;S.day++}__game.go('mall');document.querySelector('#enccard').scrollIntoView({block:'center'});for(let i=0;i<3;i++)toast(i?'🏆 Got Wheels 🚗 (+$25)':'Bought something ✨')});await sleep(400);await shot('encounter');
   await G(()=>{__game.S.fit.day=0;gymSheet();document.querySelector('#gymgo').click()});await sleep(400);await shot('gym');
   await G(()=>{closeSheet();__game.S.meal={};foodSheet()});await sleep(200);await shot('food');
   await G(()=>{closeSheet();S.fitMood='love';fitCheck()});await sleep(300);await shot('fitemote');await G(()=>closeSheet())}
})()
