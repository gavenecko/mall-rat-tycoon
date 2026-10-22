// usage: node shots_v5.js <html> <prefix> [width height]
const {chromium}=require('playwright');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const [file,prefix,W,H]=[process.argv[2],process.argv[3],+(process.argv[4]||412),+(process.argv[5]||915)];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});const p=await b.newPage({viewport:{width:W,height:H},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const shot=async n=>{await sleep(450);await p.screenshot({path:'shots/'+prefix+n+'.png'})};const G=(f,a)=>p.evaluate(f,a);
 await p.goto('file://'+file);await sleep(300);await shot('creator');
 await p.fill('#nm','Rory');await p.click('#done');await sleep(300);await G(()=>{const o=document.querySelector('#overlay');o.hidden=true;__game.S.tutDone=true});
 await G(()=>{const g=__game;g.S.cash=250000;g.S.day=4;
   const pick=(slot,n)=>g.ITEMS.filter(i=>i.slot===slot)[n];['tops','bottoms','shoes','hats','accessories'].forEach((s,k)=>{const it=pick(s,7+k*3);if(it){g.S.owned[it.id]=1;g.S.equipped[s]=it.id}});
   const furn=g.ITEMS.filter(i=>!i.slot);[3,10,25,40,60,80,100].forEach(n=>{const it=furn[n];if(it)g.S.owned[it.id]=1});g.go('mall')});
 await shot('mall');
 await G(()=>{const g=__game;g.go('mall',g.openStores()[1].id)});await shot('store');
 await G(()=>{const g=__game;g.go('mall',g.openStores()[2].id)});await shot('store2');
 const det=await p.$('#view .item img');if(det){await det.click();await sleep(300)}
 if(!(await G(()=>!document.querySelector('#sheet').hidden))){await G(()=>__game.go('online'));const d=await p.$('[data-a=det]');if(d)await d.click()}
 await shot('item_detail');await G(()=>{if(typeof closeSheet==='function')closeSheet()});await sleep(300);
 await G(()=>__game.go('closet'));await shot('closet');
 await G(()=>{const g=__game;Object.keys(g.S.owned).filter(id=>!g.ITEM[id].slot).forEach(id=>{for(let Y=0;Y<10;Y++)for(let X=0;X<8;X++){if(g.S.room.some(q=>q.id===id))return;if(fits(id,X,Y))g.S.room.push({id:id,x:X,y:Y})}});g.go('room')});await shot('room');
 const jobs=await G(()=>__game.JOBS.map(j=>j.id));
 for(const j of jobs){await G(id=>{const g=__game;g.S.shifts=999;g.go('work');g.startShift(g.JOBS.filter(x=>x.id===id)[0])},j);await sleep(1800);
   await G(()=>{const s=__game.shift;if(s&&s.game&&s.game.bot)for(let i=0;i<3;i++)s.game.bot()});await shot('job_'+j);await G(()=>{__game.endShift();__game.go('mall')})}
 await G(()=>__game.go('work'));await shot('work');
 for(const t of ['clam','flea','fb','orders','wallet']){await G(()=>__game.go('online'));const bt=await p.$('[data-ot='+t+']');if(bt){await bt.click();await shot('online_'+t)}}
 await G(()=>__game.go('mall','alley'));await shot('alley');
 await G(()=>__game.go('me'));await shot('me');
 console.log('errors:',errs.length?errs:'none');await b.close()})();
