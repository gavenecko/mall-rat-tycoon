(async()=>{
 await G(()=>{closeSheet();if(__game.shift)__game.endShift();window.__audit=function(tag){const iss=[];const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2&&getComputedStyle(e).visibility!=='hidden'};
   const root=document.querySelector('#sheet:not([hidden])')?'#sheet ':'#view ';const B=Array.prototype.filter.call(document.querySelectorAll(root+'button,'+root+'.btn'),vis);const R=B.map(b=>b.getBoundingClientRect());
   for(let i=0;i<B.length;i++){const a=R[i];const sc=(()=>{for(let e=B[i].parentElement;e;e=e.parentElement){const o=getComputedStyle(e).overflowX;if(o==='auto'||o==='scroll'||o==='hidden')return true}return false})();if(!sc&&(a.right>innerWidth+1||a.left<-1))iss.push(tag+' offscreen:'+B[i].textContent.trim().slice(0,20));
     for(let j=i+1;j<B.length;j++){if(B[i].contains(B[j])||B[j].contains(B[i]))continue;const b=R[j],w=Math.min(a.right,b.right)-Math.max(a.left,b.left),h=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);if(w>2&&h>2)iss.push(tag+' overlap:'+B[i].textContent.trim().slice(0,16)+'|'+B[j].textContent.trim().slice(0,16))}}
   const fl=Array.prototype.filter.call(document.querySelectorAll('body *'),e=>{const p=getComputedStyle(e).position;return(p==='fixed')&&vis(e)&&!e.closest('header,nav,#sheet,#overlay,#toast,.tabbar')});
   fl.forEach(f=>{const q=f.getBoundingClientRect();B.forEach((b,i)=>{if(f.contains(b))return;const a=R[i];if(a.bottom<0||a.top>innerHeight)return;const w=Math.min(a.right,q.right)-Math.max(a.left,q.left),h=Math.min(a.bottom,q.bottom)-Math.max(a.top,q.top);if(w>2&&h>2)iss.push(tag+' floating '+(f.id||f.className)+' covers '+b.textContent.trim().slice(0,16))})});return iss}});
 // J1 overlap audit across screens + sheets
 const j1=await G(async()=>{const g=__game,S=g.S,out=[];const w=ms=>new Promise(r=>setTimeout(r,ms));S.cash=Math.max(S.cash,300);
   for(const s of ['mall','closet','room','work','online','me']){g.go(s);await w(150);avMood('happy');toast('Audit toast');await w(80);window.scrollTo(0,0);out.push.apply(out,__audit(s+'@top'));window.scrollTo(0,99999);await w(60);out.push.apply(out,__audit(s+'@bottom'))}
   const sh=[['more',openMore],['gym',gymSheet],['food',foodSheet],['barber',()=>{barbDraft=null;barberSheet()}],['tonk',tonkSheet],['map',()=>{g.go('mall');mapSheet()}],['album',albumSheet],['career',careerSheet],['story',storySheet],['dealer',dealerSheet]];
   for(const q of sh){try{q[1]();await w(80);out.push.apply(out,__audit(q[0]))}catch(e){out.push(q[0]+' ERR '+e.message)}closeSheet()}
   S.shifts=Math.max(S.shifts,6);g.go('work');g.startShift(g.JOBS.filter(j=>j.id==='shoot')[0]);await w(100);document.querySelector('#sready').click();avMood('happy');await w(60);window.scrollTo(0,99999);await w(60);out.push.apply(out,__audit('shoot'));const pop=!!document.querySelector('#avpop');g.endShift();
   for(const j of g.JOBS.filter(j=>!j.cs)){try{g.go('work');g.startShift(j);await w(120);out.push.apply(out,__audit('job:'+j.id))}catch(e){out.push(j.id+' ERR '+e.message)}if(g.shift)g.endShift()}
   g.go('mall');return{out,pop}});
 ok(!j1.out.length&&!j1.pop,'automated overlap audit: no overlapping/offscreen buttons, no floating popup over buttons, all screens+sheets+jobs '+JSON.stringify(j1).slice(0,900));
 // J2 fitness tiers change avatar
 const j2=await G(()=>{const mk=(t,hat)=>{const c=document.createElement('canvas');c.width=300;c.height=400;const x=c.getContext('2d');x.translate(150,5);x.scale(2,2);drawAvatar(x,Object.assign({},defaultChar('male'),{hair:'buzz',fitT:t}),hat?{hats:Object.keys(ITEM).filter(k=>ITEM[k].slot==='hats')[0]}:{});return x};
   const px=(x,X,Y)=>[].slice.call(x.getImageData(150+X*2,5+Y*2,1,1).data);const sig=x=>{const d=x.getImageData(0,0,300,400).data;let s=0;for(let i=0;i<d.length;i+=16)s=(s*31+d[i])%1e9;return s};
   const a=[0,1,2,3].map(t=>sig(mk(t)));const band=px(mk(3),0,29),wr=px(mk(3),BODIES.male?0:0,0),t0band=px(mk(0),0,29);const sh=BODIES[defaultChar('male').body].sh;const wrist=px(mk(3),sh+2.7+6,113);
   const keys=Object.keys(BODIES).length;const S=__game.S;S.fit.lvl=85;const me=fitTier();S.fit.lvl=0;return{distinct:new Set(a).size,band,t0band,wrist,me,keys}});
 ok(j2.distinct===4&&j2.band[0]>200&&j2.band[1]<80&&j2.band[3]===255&&!(j2.t0band[0]>200&&j2.t0band[1]<80)&&j2.wrist[3]===255&&j2.wrist[0]>200&&j2.me===3&&j2.keys===5,'fitness tiers visibly change avatar (4 distinct looks, opaque sweatband/wristbands at top tier) '+JSON.stringify(j2));
 // J3 promotions + uniforms
 const j3=await G(async()=>{const g=__game,S=g.S;const j=g.JOBS[0];jobState(j.id).xp=159;const r0=rankOf(j.id);g.go('work');g.startShift(j);await new Promise(r=>setTimeout(r,100));for(let i=0;i<3;i++)g.shift.game.bot();g.endShift();const r1=rankOf(j.id);
   const c=document.createElement('canvas');c.width=300;c.height=400;const x=c.getContext('2d');x.translate(150,5);x.scale(2,2);drawAvatar(x,Object.assign({},defaultChar('male'),{_uni:{c:'#1e88e5',r:2}}),{});const v=[].slice.call(x.getImageData(150-12*2,5+100*2,1,1).data),tag=[].slice.call(x.getImageData(150+11*2,5+94*2,1,1).data);
   careerSheet();const rows=document.querySelectorAll('#carl .card').length,txt=document.querySelector('#carl').textContent;closeSheet();return{r0,r1,v,tag,rows,assoc:/Associate/.test(txt),saved:S.career[j.id]}});
 ok(j3.r0===0&&j3.r1>=1&&j3.v[2]>200&&j3.v[0]<80&&j3.tag[0]>240&&j3.rows>=1&&j3.assoc&&j3.saved>=1,'job promotion to Associate + drawn vest/name-tag uniform in Career '+JSON.stringify(j3));
 // J4 album
 const j4=await G(()=>{const S=__game.S;const n0=S.album.length;fitCheck();closeSheet();fitCheck();closeSheet();const n1=S.album.length;albumSheet();const th=document.querySelectorAll('#alb canvas').length;document.querySelector('#alb button').click();const big=!!document.querySelector('#albig canvas');const eq=JSON.stringify(S.equipped);S.equipped={};document.querySelector('#alwear').click();const back=JSON.stringify(S.equipped)===eq;closeSheet();return{n0,n1,th,big,back}});
 ok(j4.n1>=1&&j4.n1-j4.n0<=1&&j4.th===j4.n1&&j4.big&&j4.back,'fit album saves fit checks (deduped), gallery, re-wear '+JSON.stringify(j4));
 // J5 shark tonk
 const j5=await G(()=>{const S=__game.S;S.tonk.last=0;S.cash=200;const s0=S.spent;const ok1=tonkInvest(25,.99);const ok2=tonkInvest(25,.5);const due=S.tonk.inv[S.tonk.inv.length-1].due;const c0=S.cash;S.day=due-1;tonkResolve();const c1=S.cash;S.day=due;tonkResolve();const c2=S.cash;
   let ev=0;for(let i=0;i<1000;i++)ev+=tonkRoll(i/1000)[0];tonkSheet();const has=!!document.querySelector('#tkav canvas');closeSheet();return{ok1,ok2,spent:S.spent-s0,early:c1-c0,paid:c2-c1,ev:ev/1000,has}});
 ok(j5.ok1&&!j5.ok2&&j5.spent===25&&j5.early===0&&j5.paid===150&&j5.ev>.9&&j5.ev<1.02&&j5.has,'Shark Tonk: one deal/day, pays out after 3 days, EV<1 '+JSON.stringify(j5));
 // J6 map fast travel
 const j6=await G(async()=>{__game.go('mall');window.scrollTo(0,0);mapSheet();const T=window.__mapT;const q=T[2];const y0=q.e.getBoundingClientRect().top;mapGo(q);await new Promise(r=>setTimeout(r,100));const y=q.e.getBoundingClientRect().top;return{n:T.length,y,y0,sc:window.scrollY,h:innerHeight}});
 ok(j6.n>=5&&j6.y0>j6.y+100&&j6.y>0&&j6.y<300,'mall map lists wings and fast-travels '+JSON.stringify(j6));
 if(SHOTS&&mode==='file'&&W===412){
   await G(()=>{const S=__game.S;S.fit.lvl=90;S.char.ftat='none';__game.go('me');window.scrollTo(0,0)});await sleep(300);await shot('swole');
   await G(()=>{careerSheet()});await sleep(200);await shot('career');
   await G(()=>{closeSheet();albumSheet()});await sleep(200);await shot('album');
   await G(()=>{closeSheet();__game.S.tonk.last=0;tonkSheet()});await sleep(200);await shot('tonk');
   await G(()=>{closeSheet();__game.go('mall');mapSheet()});await sleep(200);await shot('map');
   await G(()=>{closeSheet();const g=__game;g.go('work');g.startShift(g.JOBS.filter(j=>j.id==='shoot')[0]);document.querySelector('#sready').click();avMood('happy');toast('📸 Nailed it!');window.scrollTo(0,99999)});await sleep(200);await shot('shoot_faces');
   await G(()=>{__game.endShift();__game.S.fit.lvl=0;closeSheet()})}
})()
