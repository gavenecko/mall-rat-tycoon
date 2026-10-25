(async()=>{
 await G(()=>{closeSheet();AV.mood='smile';if(__game.shift)__game.endShift()});
 // I1 shoot: brief phase pauses clock, ready, ramped limits, feedback
 const i1=await G(async()=>{const g=__game;g.S.shifts=Math.max(g.S.shifts,6);g.go('work');g.startShift(g.JOBS.filter(j=>j.id==='shoot')[0]);await new Promise(r=>setTimeout(r,100));
   const ph0=g.shift.game.phase(),e0=g.shift.end;await new Promise(r=>setTimeout(r,1200));const paused=g.shift.end-e0>=900;const ready=!document.querySelector('#sready').hidden;
   document.querySelector('#sready').click();const ph1=g.shift.game.phase();const icons=document.querySelectorAll('#pf img,#pp img').length;
   document.querySelectorAll('#pf button')[0].dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));document.querySelectorAll('#pp button')[0].dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));
   const ph2=g.shift.game.phase();const e2=g.shift.end;await new Promise(r=>setTimeout(r,600));const pausedRes=g.shift.end-e2>=400;await new Promise(r=>setTimeout(r,1100));const ph3=g.shift.game.phase();g.endShift();
   return{ph0,paused,ready,ph1,icons,ph2,pausedRes,ph3,l1:shootLimit(1),l12:shootLimit(12),old:5200}});
 ok(i1.ph0==='brief'&&i1.paused&&i1.ready&&i1.ph1==='play'&&i1.icons===8&&i1.ph2==='result'&&i1.pausedRes&&i1.ph3==='brief'&&i1.l1>=2*5200*.95&&i1.l12>=6000,'shoot: read-the-brief phase pauses clock, Ready starts, ~2x time with ramp, result feedback '+JSON.stringify(i1));
 const i1b=await G(async()=>{const g=__game;g.go('work');g.startShift(g.JOBS.filter(j=>j.id==='shoot')[0]);await new Promise(r=>setTimeout(r,100));const e=g.shift.end;window.__off=window.__off||0;
   const t0=gnow();while(gnow()-t0<4800)await new Promise(r=>setTimeout(r,200));const auto=g.shift.game.phase()==='play';
   const s0=g.S.stats9.shoots;for(let i=0;i<12;i++)g.shift.game.bot();const n=g.S.stats9.shoots-s0;const earned=g.shift?g.shift.earned:-1;await new Promise(r=>setTimeout(r,200));return{auto,n,ended:!g.shift,earned}});
 ok(i1b.auto&&i1b.n===12&&i1b.ended&&i1b.earned>0,'shoot auto-starts after ~4.5s, shift caps at 12 rounds '+JSON.stringify(i1b));
 const i1c=await G(()=>{const bad=[];SHOOT_F.concat(SHOOT_P).forEach(q=>{const c=document.createElement('canvas');c.width=c.height=80;const x=c.getContext('2d');shootIcon(x,q[0],40,40,70);const d=x.getImageData(40,q[0]==='peace'?52:q[0]==='flip'?32:40,1,1).data;if(d[3]!==255)bad.push(q[0]+[].slice.call(d))});return bad});
 ok(i1c.length===0,'8 shoot icons opaque '+JSON.stringify(i1c));
 // I2 first-time job hint pauses shift
 const i2=await G(async()=>{const g=__game;delete g.S.hints.burger;g.go('work');g.startShift(g.JOBS[0]);await new Promise(r=>setTimeout(r,100));const h=!!document.querySelector('#jhint'),e=g.shift.end;await new Promise(r=>setTimeout(r,700));const paused=g.shift.end-e>=500;
   document.querySelector('#jhok').click();const gone=!document.querySelector('#jhint')&&g.S.hints.burger===1;g.endShift();g.go('work');g.startShift(g.JOBS[0]);await new Promise(r=>setTimeout(r,100));const again=!!document.querySelector('#jhint');g.endShift();
   return{h,paused,gone,again,all:JOBS.every(j=>JOB_HINTS[j.id])}});
 ok(i2.h&&i2.paused&&i2.gone&&!i2.again&&i2.all,'first-time job hint, clock paused, shown once, all jobs covered '+JSON.stringify(i2));
 // I3 toast strip in flow
 const i3=await G(async()=>{for(let k=0;k<40&&document.querySelector('#toast').children.length;k++)await new Promise(r=>setTimeout(r,100));__game.go('mall');window.scrollTo(0,0);const h=document.querySelector('header').getBoundingClientRect();const v0=document.querySelector('#view').getBoundingClientRect().top;toast('Hello strip');toast('Second one');toast('third');
   await new Promise(r=>setTimeout(r,300));const t=document.querySelector('#toast').getBoundingClientRect(),v1=document.querySelector('#view').getBoundingClientRect().top;const n=document.querySelector('#toast').children.length;
   await new Promise(r=>setTimeout(r,2200));return{top:t.top,hb:h.bottom,pushed:v1>=t.bottom-1&&v1>v0,n,pos:getComputedStyle(document.querySelector('#toast')).position}});
 ok(i3.top>=i3.hb-1&&i3.pushed&&i3.n===2&&i3.pos==='sticky','toast strip sits under header and pushes content (covers no text) '+JSON.stringify(i3));
 // I4 seasonal encounters
 const i4=await G(()=>{const ks=SEASONS.map(s=>s.k),cov=ks.every(k=>ENC.some(e=>e.season===k));const pool=encPool();const sk=season().k;return{cov,has:pool.some(e=>e.season===sk),no:pool.every(e=>!e.season||e.season===sk)}});
 ok(i4.cov&&i4.has&&i4.no,'every season has a themed encounter in the pool '+JSON.stringify(i4));
 // I5 piercings + face tats
 const i5=await G(()=>{const bad=[];const mk=(p,t)=>{const c=document.createElement('canvas');c.width=400;c.height=500;const x=c.getContext('2d');x.translate(200,10);x.scale(4,4);drawAvatar(x,Object.assign({},defaultChar('nb'),{hair:'buzz',pierce:p,ftat:t}),{});return x};
   const P={studs:[29.5,57.5],hoops:[29.5,57.1],nose:[2.2,63.1],brow:[15.5,48.6],septum:[0,63.6]},T={star:[19,63],tear:[-13,65],heart:[19,63.5],dots:[17,62]};
   Object.keys(P).forEach(k=>{const d=mk(k,'none').getImageData(200+P[k][0]*4,10+P[k][1]*4,1,1).data;if(!(d[0]>200&&d[1]>150&&d[2]<80))bad.push(k+[].slice.call(d))});
   Object.keys(T).forEach(k=>{const d=mk('none',k).getImageData(200+T[k][0]*4,10+T[k][1]*4,1,1).data;if(!(d[3]===255&&(d[0]<80||k==='heart')))bad.push(k+[].slice.call(d))});return bad});
 ok(i5.length===0,'piercings + face tattoos drawn opaque '+JSON.stringify(i5));
 const i5b=await G(()=>{const S=__game.S;S.cash=100;S.meal={};barbDraft=null;barberSheet();document.querySelector('[data-bk13="pierce"][data-v="hoops"]').click();document.querySelector('[data-bk13="ftat"][data-v="star"]').click();const t=document.querySelector('#bpay').textContent;document.querySelector('#bpay').click();return{t,cash:S.cash,p:S.char.pierce,f:S.char.ftat}});
 ok(/\$45/.test(i5b.t)&&i5b.p==='hoops'&&i5b.f==='star','Ink & Stink options in Supercutz charge fee '+JSON.stringify(i5b));
 // I6 story cutscenes
 const i6=await G(async()=>{const S=__game.S;closeSheet();delete S.miles.firstk;S.earned=Math.max(S.earned,1000);const m=checkMiles();const cv=document.querySelector('#cutcv');const d=cv&&cv.getContext('2d').getImageData(cv.width/2,cv.height/2,1,1).data;
   const once=!!S.miles.firstk;closeSheet();const again=checkMiles();openMore();const st=!!document.querySelector('#mStory');document.querySelector('#mStory').click();const rows=document.querySelectorAll('#sheet .slot').length;closeSheet();
   return{m:m&&m.k,px:d&&d[3],once,again,st,rows}});
 ok(i6.m==='firstk'&&i6.px===255&&i6.once&&!i6.again&&i6.st&&i6.rows===7,'story milestone cutscene, shown once, replayable from menu '+JSON.stringify(i6));
 if(SHOTS&&mode==='file'&&W===412){
   await G(async()=>{const g=__game;g.go('work');g.startShift(g.JOBS.filter(j=>j.id==='shoot')[0]);window.scrollTo(0,0)});await sleep(300);await shot('shoot_brief');
   await G(()=>{document.querySelector('#sready').click();document.querySelectorAll('#pf button')[1].dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));document.querySelectorAll('#pp button')[2].dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));window.scrollTo(0,0)});await sleep(150);await shot('shoot_result');
   await G(()=>{__game.endShift();delete __game.S.hints.shelf;__game.go('work');__game.startShift(__game.JOBS.filter(j=>j.id==='shelf')[0])});await sleep(300);await shot('jobhint');await G(()=>{document.querySelector('#jhok').click();__game.endShift();__game.go('mall');window.scrollTo(0,0);toast('🏆 Main Character Lore 📖 (+$25)');toast('Bought Goochie Belt ✨')});await sleep(300);await shot('toaststrip');
   await G(()=>{const S=__game.S;S.char.pierce='hoops';S.char.ftat='star';S.char.beard='goatee';delete S.miles.car;S.car=S.car||{k:'teslow',col:'#e53935'};closeSheet();checkMiles()});await sleep(300);await shot('cutscene');
   await G(()=>{closeSheet();barbDraft=null;barberSheet();document.querySelector('#bpi').scrollIntoView({block:'center'})});await sleep(200);await shot('piercings');await G(()=>closeSheet())}
})()
