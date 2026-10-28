(async()=>{ await G(()=>{closeSheet();__game.go('mall')});
 const shot21=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v21_'+n+'.png'})};
 // Q1 pet tricks
 const q1=await G(()=>{const S=__game.S;S.pet={k:PETS[0].k,name:'Nugget',full:90,joy:90,acc:{},wear:null,day:1,fedDay:S.day,away:0,starve:0,x:2,y:WALL+1,tricks:{}};const c0=S.cash,a0=Object.keys(S.ach).length;const d0=S.day;
   petSheet();const box=!!document.querySelector('#trickbox');const a=petTrain(),b=petTrain();S.day++;petTrain();S.day=d0;const learned=petTricks().length;petSheet();const show=!document.querySelector('#showbtn').disabled;const sh=petShow();closeSheet();checkAch();
   return{box,a,b,learned,show,sh,cash:S.cash-c0===(Object.keys(S.ach).length-a0)*ACH_REWARD}});
 ok(q1.box&&q1.a==='sit'&&q1.b===null&&q1.learned===1&&q1.show&&q1.sh==='sit'&&q1.cash,'pet obedience school: 1 lesson/day, 2 lessons per trick, no cash '+JSON.stringify(q1));
 // Q2 vibe check
 const q2=await G(()=>{const S=__game.S;const save=S.room;S.room=[];const v0=roomVibe().score;const w=__game.ITEMS.filter(i=>i.layer==='wall'&&!i.fake)[0],r=__game.ITEMS.filter(i=>i.layer==='rug'&&!i.fake)[0],f=__game.ITEMS.filter(i=>i.layer!=='wall'&&i.layer!=='rug'&&!i.fake&&i.w).slice(0,6);
   S.room=[{id:w.id,x:0,y:0},{id:r.id,x:0,y:WALL}].concat(f.map((q,i)=>({id:q.id,x:i,y:WALL+1})));const v1=roomVibe();roomsSheet();const box=document.querySelector('#vibebox');const txt=box&&box.textContent;closeSheet();S.room=save;return{v0,v1:v1.score,tier:v1.tier,box:!!box&&/Vibe Check/.test(txt),best:S.vibeBest}});
 ok(q2.v0<=10&&q2.v1>=75&&q2.box&&q2.best>=75,'room vibe check scores decor variety '+JSON.stringify(q2));
 // Q3 performance review
 const q3=await G(()=>{const S=__game.S;const j=JOBS.filter(j=>!j.cs)[0];jobState(j.id).shifts=Math.max(jobState(j.id).shifts,10);const c0=S.cash,r0=S.reviews||0;careerSheet();const b=document.querySelector('#reviewbox');const t=b&&b.textContent;closeSheet();return{rev:!!b&&/Performance Review/.test(t)&&/★/.test(t),n:S.reviews-r0,cash:S.cash===c0}});
 ok(q3.rev&&q3.n===1&&q3.cash,'career performance review card '+JSON.stringify(q3));
 // Q4 glamour shots (opaque backdrop + menu button)
 const q4=await G(()=>{openMore();const b=document.querySelector('#mGlam');const order=b&&b.nextElementSibling&&b.nextElementSibling.id==='mAbout';b.click();const out={order,cv:!!document.querySelector('#glamcv')};['laser','mall','sunset'].forEach(k=>{glamSheet(k);const d=document.querySelector('#glamcv').getContext('2d').getImageData(0,0,240,300).data;let op=0;for(let i=3;i<d.length;i+=4)if(d[i]===255)op++;out[k]=op/(240*300)});closeSheet();out.n=Object.keys(__game.S.glam).length;return out});
 ok(q4.order&&q4.cv&&q4.laser===1&&q4.mall===1&&q4.sunset===1&&q4.n===3,'glamour shots: menu button, fully opaque portraits '+JSON.stringify(q4));
 // Q5 page length still tidy
 const q5=await G(()=>{__game.go('mall');hubShow('today');return document.querySelector('#view').scrollHeight});ok(q5<3200,'mall page still under length limit '+q5);
 await G(()=>{petSheet();document.querySelector('#trickbox').scrollIntoView()});await sleep(250);await shot21('pet_tricks');
 await G(()=>{closeSheet();roomsSheet()});await sleep(250);await shot21('vibe');
 await G(()=>{closeSheet();glamSheet('sunset')});await sleep(250);await shot21('glamour');
 await G(()=>{closeSheet();careerSheet()});await sleep(250);await shot21('review');await G(()=>closeSheet());
})();
