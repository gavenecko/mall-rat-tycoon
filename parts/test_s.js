(async()=>{ await G(()=>{closeSheet();__game.go('mall')});
 const shot23=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v23_'+n+'.png'})};
 // S1 pet performs trick in room
 const s1=await G(async()=>{const S=__game.S;S.pet={k:PETS[0].k,name:'Nugget',full:90,joy:90,acc:{},wear:null,day:1,fedDay:S.day,away:0,starve:0,x:2,y:WALL+1,tricks:{sit:2,dead:2},trickN:0};S.home.cur!=='bed'&&switchRoom('bed');__game.go('room');await new Promise(r=>setTimeout(r,200));
   petReact();const a=!!(PW.trick&&PW.trick.until>gnow());petReact();const b=PW.trick&&PW.trick.until>gnow()?PW.trick.k:null;await new Promise(r=>setTimeout(r,250));
   const cv=document.querySelector('#roomcv');const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let yel=0;for(let i=0;i<d.length;i+=4)if(d[i]===255&&d[i+1]===253&&d[i+2]===231)yel++;return{a,b,shows:S.pet.shows,bubble:yel}});
 ok(!s1.a&&(s1.b==='sit'||s1.b==='dead')&&s1.shows===1&&s1.bubble>20,'pet performs a learned trick in the room (bubble drawn) '+JSON.stringify(s1));
 await sleep(100);await shot23('pet_trick');
 // S2 portrait hangs in bedroom
 const s2=await G(()=>{const S=__game.S;S.portrait=null;const c=40;const b0=roomBg(c).getContext('2d').getImageData(0,0,c*COLS*(window.devicePixelRatio||1),c*WALL*(window.devicePixelRatio||1)).data;glamSheet('laser');document.querySelector('#glamhang').click();const hung=S.portrait==='laser'&&S.hung>=1&&/Hanging/.test(document.querySelector('#glamhang').textContent);closeSheet();
   const b1=roomBg(c).getContext('2d').getImageData(0,0,c*COLS*(window.devicePixelRatio||1),c*WALL*(window.devicePixelRatio||1)).data;let diff=0,op=0;for(let i=0;i<b1.length;i+=4){if(b1[i]!==b0[i]||b1[i+1]!==b0[i+1])diff++;if(b1[i+3]===255)op++}return{hung,diff,op:op/(b1.length/4)}});
 ok(s2.hung&&s2.diff>500&&s2.op===1,'glamour portrait hangs on the bedroom wall, opaque '+JSON.stringify(s2));
 await G(async()=>{__game.go('room');await new Promise(r=>setTimeout(r,250))});await shot23('portrait_room');
 // S3 new calls: scams lose/smart safe, conditional real calls
 const s3=await G(()=>{const S=__game.S;S.cash=1000;const c=callT();const r={};const ans=(k,i)=>{c.pend={k:k,d:S.day};return callAnswer(i).d};
   r.edu=ans('edu',0);r.edu2=ans('edu',1);r.pkg=ans('pkg',0);r.cereal=ans('cereal',0);const vb=S.vibeBest;S.vibeBest=10;r.magLow=ans('mag',0);S.vibeBest=80;r.magHi=ans('mag',0);S.vibeBest=vb;const f=S.lo.f;S.lo.f=5;r.recLow=ans('recruit',0);S.lo.f=150;r.recHi=ans('recruit',0);S.lo.f=f;r.n=CALLS.length;return r});
 ok(s3.edu===-250&&s3.edu2===0&&s3.pkg===-30&&s3.cereal===35&&s3.magLow===0&&s3.magHi===50&&s3.recLow===0&&s3.recHi===40&&s3.n===13,'new calls: scams cost, real ones pay, room/LinkedOut-gated payouts '+JSON.stringify(s3));
 const s4=await G(()=>({smart:callSim(520,'smart'),gul:callSim(520,'gullible')}));console.log('    calls23',JSON.stringify(s4));
 ok(s4.smart.maxIn7<=1&&s4.smart.netPerWeek>0&&s4.smart.netPerWeek<30&&s4.gul.netPerWeek<0,'call frequency still <=1/week, EV small '+JSON.stringify(s4));
 await G(()=>{const c=callT();c.pend={k:'mag',d:__game.S.day};callSheet()});await sleep(250);await shot23('magazine_call');await G(()=>{callAnswer(1);closeSheet()});
 const s5=await G(()=>{__game.go('mall');hubShow('today');return document.querySelector('#view').scrollHeight});ok(s5<3200,'page length ok '+s5);
})();
