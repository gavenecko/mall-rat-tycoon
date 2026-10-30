(async()=>{ await G(()=>{closeSheet();__game.go('mall')});
 const shotV6=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v26x_'+n+'.png'})};
 // V1 mystery bag
 const v1=await G(()=>{const S=__game.S;S.cash=100;const b=bagT();b.day=0;const sum=BAG.tiers.reduce((a,t)=>a+t.p,0);const c0=S.cash,a0=Object.keys(S.ach).length;const r=bagOpen(.999,0);const net=S.cash-c0-(Object.keys(S.ach).length-a0)*ACH_REWARD;const again=bagOpen(.1,0);b.day=0;const c1=S.cash;const j=bagOpen(.1,0);const jn=S.cash-c1;b.day=0;bagSheet();const odds=document.querySelector('#bagodds').textContent;
   return{sum:Math.round(sum*1000),leg:r&&r.t==='legend'&&r.it==='Signed Pretzel',net,again,jn,ach:!!S.ach.legend,odds:/62%/.test(odds)&&/2%/.test(odds),ev:bagEV(),sim:bagSim(200000)}});
 ok(v1.sum===1000&&v1.leg&&v1.net===35&&v1.again===null&&v1.jn===-5&&v1.ach&&v1.odds&&v1.ev<0&&v1.ev>-2&&v1.sim<0&&v1.sim>-2,'mystery bag: $5/day, odds shown, legendary, EV slightly negative '+JSON.stringify(v1));
 await G(()=>window.scrollTo(0,0));await sleep(250);await shotV6('bag');await G(()=>closeSheet());
 // V2 pigeon
 const v2=await G(()=>{const S=__game.S;const g=pigT();g.on=false;S.room=S.room||[];if(!S.room.length){const id=Object.keys(S.owned).filter(k=>ITEM[k]&&!ITEM[k].slot)[0];S.room.push({id,x:1,y:WALL+1})}const n0=S.room.length;const st=pigSteal(true);const n1=S.room.length;const id=g.id;__game.go('mall');hubShow('fun');const card=!!document.querySelector('#pigcard')&&document.querySelector('#pigcard').closest('.hubp').dataset.p==='fun';
   const wrong=PIG.spots.filter(s=>s[0]!==g.spot)[0][0];const c0=S.cash;const w=pigSearch(wrong);const right=g.spot;const a0=Object.keys(S.ach).length;const f=pigSearch(right);const restored=S.room.length===n0;const gain=S.cash-c0-(Object.keys(S.ach).length-a0)*ACH_REWARD;
   S.room.push({id,x:1,y:WALL+1});pigSteal(true);g.tryDay=S.day;g.tries=2;const tired=pigSearch(g.spot);const d0=S.day;S.day=g.day+3;const ret=pigDay();S.day=d0;return{restored,st,stole:n1===n0-1,card,w:w.found===false,f:f.found,gain,tired:!!tired.tired,ret,back:!g.on,ach:!!S.ach.pigeon}});
 ok(v2.restored&&v2.st&&v2.stole&&v2.card&&v2.w&&v2.f&&v2.gain===10&&v2.tired&&v2.ret==='returned'&&v2.back&&v2.ach,'pigeon steals, chase finds it (+$10), always returns '+JSON.stringify(v2));
 const v2b=await G(()=>{const S=__game.S;const id=Object.keys(S.owned).filter(k=>ITEM[k]&&!ITEM[k].slot)[0];S.room.push({id,x:1,y:WALL+1});pigSteal(true);pigSheet();const cv=document.querySelector('#pigcv');const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let op=0;for(let i=3;i<d.length;i+=4)if(d[i]===255)op++;return{op:op/(d.length/4)}});
 ok(v2b.op===1,'pigeon art opaque '+JSON.stringify(v2b));
 await sleep(250);await shotV6('pigeon');await G(()=>{pigReturn();closeSheet()});
 // V3 escalator
 const v3=await G(async()=>{const S=__game.S;const e=escT();e.day=0;e.best=0;const c0=S.cash,a0=Object.keys(S.ach).length;const r=escFinish(25,150);const pay=S.cash-c0-(Object.keys(S.ach).length-a0)*ACH_REWARD;const r2=escFinish(3,10);escSheet();document.querySelector('#escgo').click();await new Promise(r=>setTimeout(r,700));const cv=document.querySelector('#esccv');const R=cv.getBoundingClientRect();const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let op=0;for(let i=3;i<d.length;i+=4)if(d[i]===255)op++;
   return{pay,score:r.score,p2:r2.pay,best:e.best,ach:!!S.ach.escalator,fit:R.left>=0&&R.right<=innerWidth,op:op/(d.length/4),run:document.querySelector('#escgo').disabled}});
 ok(v3.pay===10&&v3.score===400&&v3.p2===0&&v3.best===400&&v3.ach&&v3.fit&&v3.op===1&&v3.run,'escalator run: daily coins capped $10, best score, opaque canvas '+JSON.stringify(v3));
 await sleep(400);await shotV6('escalator');await G(()=>closeSheet());
 const v4=await G(()=>{__game.go('mall');const t=id=>{const e=document.getElementById(id);const h=e&&e.closest('.hubp');return h&&h.dataset.p};hubShow('today');return{bag:t('bagcard'),esc:t('esccard'),H:document.querySelector('#view').scrollHeight}});
 ok(v4.bag==='fun'&&v4.esc==='fun'&&v4.H<3200,'new cards in Fun tab, page short '+JSON.stringify(v4));

 // V5 lock-in
 const v5=await G(()=>{const S=__game.S;S.cash=100;const l=lockT();l.day=-1;const off=lockChoose('fc',0);lockStart(true);__game.go('mall');const card=document.querySelector('#lockcard');const tab=card&&card.closest('.hubp').dataset.p;const c0=S.cash,a0=Object.keys(S.ach).length;const w=lockChoose('fc',.1);const gain=S.cash-c0-(Object.keys(S.ach).length-a0)*ACH_REWARD;const again=lockChoose('esc');lockStart(true);const c1=S.cash;lockChoose('fc',.9);const loss=S.cash-c1;lockStart(true);lockSheet();const cv=document.querySelector('#lockcv');const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let op=0;for(let i=3;i<d.length;i+=4)if(d[i]===255)op++;const btns=document.querySelectorAll('[data-lock]').length;closeSheet();
   let ev=0;for(let i=0;i<100000;i++)if(Math.random()<LOCKIN.chance)ev+=5;return{off,tab,gain,again,loss,ach:!!S.ach.lockin,op:op/(d.length/4),btns,evPerDay:ev/100000}});
 ok(v5.off===null&&v5.tab==='fun'&&v5.gain===20&&v5.again===null&&v5.loss===-10&&v5.ach&&v5.op===1&&v5.btns===3&&v5.evPerDay<1,'lock-in: rare, one choice, small stakes, opaque art '+JSON.stringify(v5));
 // V6 rival
 const v6=await G(()=>{const S=__game.S;S.cash=100;const r=feudT();r.next=S.day;const ok1=feudDay();__game.go('mall');const card=document.querySelector('#feudcard');const tab=card&&card.closest('.hubp').dataset.p;const c0=S.cash;const g=feudPrank('glitter');const paid=c0-S.cash;const twice=feudPrank('peace');feudDay(true);const c1=S.cash;feudPrank('yelp',.9);const back=S.cash-c1;feudDay(true);feudPrank('peace');const nf=feudDay();return{ok1,tab,paid,twice,back,score:r.score,peace:r.peace,copy:!!r.copy,nf,next:r.next-S.day}});
 ok(v6.ok1&&v6.tab==='social'&&v6.paid===8&&v6.twice===null&&v6.back===-5&&v6.score===1&&v6.peace===1&&v6.copy&&v6.nf===false&&v6.next===5,'rival feud: notes every 5 days, copycat, prank back '+JSON.stringify(v6));
 await G(()=>{feudDay(true);feudSheet();window.scrollTo(0,0)});await sleep(250);await shotV6('rival');await G(()=>closeSheet());
 // V7 hoarder
 const v7=await G(()=>{const n=hoardScore();hoardSheet();const t=document.querySelector('#sheet').textContent;closeSheet();__game.go('mall');const card=document.querySelector('#hoardcard');return{n,shown:t.includes(String(n)),tier:hoardTier(0)[1]==='Minimalist'&&hoardTier(300)[1]==='Reality Show Material',tab:card&&card.closest('.hubp').dataset.p}});
 ok(v7.n>0&&v7.shown&&v7.tier&&v7.tab==='fun','hoarder score + tiers in Fun tab '+JSON.stringify(v7));
 const v8=await G(()=>{__game.go('mall');hubShow('today');return document.querySelector('#view').scrollHeight});ok(v8<3200,'today page short with all v26 cards '+v8);
})();
