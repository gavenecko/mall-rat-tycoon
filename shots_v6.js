const {chromium}=require('playwright');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const [file,W,H]=[process.argv[2],+(process.argv[3]||412),+(process.argv[4]||915)];const sfx='_'+W;
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});const p=await b.newPage({viewport:{width:W,height:H},hasTouch:true,isMobile:true,deviceScaleFactor:2});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const shot=async n=>{await sleep(450);await p.screenshot({path:'shots/v6_'+n+sfx+'.png'})};const G=(f,a)=>p.evaluate(f,a);
 await p.goto('file://'+file);await sleep(300);await p.fill('#nm','Rory');await p.click('#done');await sleep(300);await G(()=>{document.querySelector('#overlay').hidden=true;__game.S.tutDone=true});
 const info=await G(()=>{const g=__game,S=g.S;S.cash=2e6;const I=g.ITEMS.filter(i=>i.id.indexOf('h6-')===0);
  const one=f=>I.filter(f)[0];const take=it=>{if(it){S.owned[it.id]=(S.owned[it.id]||0)+1}return it};
  ['siding','roof','door','windows','fence','mailbox','path','lights'].forEach(k=>{const it=take(I.filter(i=>i.ext===k)[1]||one(i=>i.ext===k));if(it)S.home.ext[k]=it.id});
  const wall=take(one(i=>i.shape==='damask')),floor=take(one(i=>i.shape==='herring'||i.shape==='marble'));take(one(i=>i.shape==='brick'));take(one(i=>i.shape==='checker'));take(one(i=>i.shape==='tile'));take(one(i=>i.shape==='stripes'));
  const yardSet=[['pool',0,3],['tree',0,0],['tree',6,0],['flowerbed',5,2],['gnome',3,4],['flamingo',4,4],['bbq',6,3],['patio',6,4],['car',0,2],['bush',2,1],['fountain',3,1]];
  yardSet.forEach(a=>{const it=take(one(i=>i.shape===a[0]));if(it&&g.fitsYard(it.id,a[1],a[2]))S.home.yard.push({id:it.id,x:a[1],y:a[2]})});
  const plants=['monstera','cactus','bonsai','fiddle','succulent','pot'].map(k=>take(one(i=>i.shape===k&&i.cat==='plants'))).filter(Boolean);
  [[0,4],[7,4],[0,8],[7,8],[3,9],[5,3]].forEach((q,i)=>{const it=plants[i];if(it&&g.fits(it.id,q[0],q[1]))S.room.push({id:it.id,x:q[0],y:q[1]})});
  const hang=take(one(i=>i.shape==='hanging'));if(hang&&g.fits(hang.id,1,1))S.room.push({id:hang.id,x:1,y:1});
  const bed=g.ITEMS.filter(i=>i.shape==='bed')[3];take(bed);if(g.fits(bed.id,2,4))S.room.push({id:bed.id,x:2,y:4});const sofa=g.ITEMS.filter(i=>i.shape==='sofa')[2];take(sofa);if(g.fits(sofa.id,4,7))S.room.push({id:sofa.id,x:4,y:7});
  // clothes
  ['tops','bottoms','shoes'].forEach(sl=>{const it=g.ITEMS.filter(i=>i.slot===sl)[11];S.owned[it.id]=1;S.equipped[sl]=it.id});
  g.save();return{n:I.length,stores:g.STORES.length,pool:I.filter(i=>i.shape==='pool').map(i=>i.price)}});
 console.log(JSON.stringify(info));
 await G(()=>__game.go('mall'));await sleep(200);await G(()=>{const e=document.querySelector('#park');e&&e.scrollIntoView()});await shot('mall_retailpark');
 for(const s of ['homedespot','plantdaddy','lows','harrodz','tesgo','unicloth','mooji','aldee']){await G(s=>{const g=__game,d0=g.S.day;if(!g.STORES.filter(q=>q.id===s)[0].park){for(let d=1;d<400;d++){g.S.day=d;if(g.openStores().some(q=>q.id===s))break}}g.go('mall',s)},s);await shot('store_'+s)}
 await G(()=>{__game.S.day=1});
 await G(()=>__game.go('room','outside'));await shot('outside_day');
 await G(()=>{__game.S.dayAt=Date.now()-600000*.72;__game.render()});await shot('outside_night');await G(()=>{__game.S.dayAt=Date.now();__game.render()});
 await p.click('#yext');await shot('exterior_sheet');await G(()=>closeSheet());await sleep(300);
 await G(()=>{__game.S.home.wall=null;__game.S.home.floor=null;__game.go('room')});await shot('room_before_remodel');
 await p.click('#remodel');await shot('remodel_sheet');
 await p.click('#sheet [data-s=wall][data-i^="h6-"]');await sleep(200);await p.click('#sheet [data-s=floor][data-i^="h6-"]');await sleep(200);await G(()=>closeSheet());await sleep(300);await shot('room_remodeled');
 await G(()=>{const g=__game;Object.keys(g.S.home.water).forEach(k=>g.S.home.water[k]=g.S.day-5);g.render()});await shot('room_wilted');await p.click('#homeout');await sleep(200);await p.click('#ywater');await shot('outside_watered');
 await G(()=>{__game.go('closet')});await shot('closet_clothing');
 await G(()=>{__game.go('closet');window.__f='plants'});
 const jobs=await G(()=>__game.JOBS.map(j=>j.id));for(const j of jobs){await G(id=>{const g=__game;g.S.shifts=999;g.go('work');g.startShift(g.JOBS.filter(x=>x.id===id)[0])},j);await sleep(1500);await G(()=>{const s=__game.shift;if(s&&s.game&&s.game.bot)for(let i=0;i<4;i++)s.game.bot()});await shot('job_'+j);await G(()=>{__game.endShift();__game.go('mall')})}
 for(const t of ['clam','flea','fb','orders','wish','wallet']){await G(()=>__game.go('online'));const bt=await p.$('[data-ot='+t+']');if(bt){await bt.click();await shot('online_'+t)}}
 await G(()=>__game.go('me'));await G(()=>{const e=[...document.querySelectorAll('.lbl')].find(e=>/Home/.test(e.textContent));e&&e.scrollIntoView()});await shot('me_home');
 await G(()=>{__game.go('mall');__game.buy(__game.ITEMS.filter(i=>i.store==='dollar')[0].id)});await sleep(300);await shot('avatar_happy');
 console.log('errors:',errs.length?errs:'none');await b.close()})();
