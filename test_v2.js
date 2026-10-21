const {chromium}=require('playwright');const fs=require('fs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();let fail=0;
const ok=(c,m)=>{console.log((c?'  PASS ':'  FAIL ')+m);if(!c)fail++};
async function run(label,shots,setup){
 console.log('== '+label);
 const p=await b.newPage({viewport:{width:412,height:915},hasTouch:true,isMobile:true,deviceScaleFactor:2});const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const f=await setup(p);const shot=async n=>{if(shots)await p.screenshot({path:'shots/v2_'+n+'.png'})};
 const G=(fn,a)=>f.evaluate(fn,a);
 ok(await f.$('#nm'),'character creator shown on first launch');
 const banner=await f.$eval('#banner',e=>!e.hidden);console.log('  storage banner visible:',banner);
 await f.fill('#nm','Lord Will');await f.click('#g [data-k=male]');await f.click('#hs [data-k=spiky]');await f.click('#sk .sw:nth-child(4)');await f.click('#hc .sw:nth-child(3)');
 await shot('01_creator');
 await f.click('#done');await sleep(300);
 ok(await f.$('#overlay:not([hidden]) #tnext'),'tutorial shown');await shot('02_mall_tutorial');await f.click('#tskip');
 ok(await G(()=>__game.S.char.name)==='Lord Will','character saved');
 ok(await G(()=>Object.keys(__game.S.equipped).length)===3,'starter outfit equipped');
 await shot('03_mall');
 await f.click('#stores .store');await sleep(200);ok((await f.$$('.grid .item img')).length>5,'store shows thumbnails');await shot('04_store');
 // buy one via UI (cheapest affordable)
 const c0=await G(()=>__game.S.cash);const btns=await f.$$('.grid .item button:not([disabled])');if(btns.length){await btns[0].click();ok(await G(()=>__game.S.spent)>0,'UI buy works (spent>0)')}
 // rich buy for outfit + room
 await G(()=>{const g=__game;g.S.cash=500000;const pk=(sh)=>g.ITEMS.filter(i=>i.shape===sh&&!i.rare).sort((a,b)=>b.price-a.price)[1].id;
   ['crown','puffer','skirt','boots','handbag','bed','sofa','rug','painting','curtains','plant','lamp','bookshelf','clock'].forEach(s=>g.buy(pk(s)));
   ['hats','tops','bottoms','shoes','accessories'].forEach(sl=>{const id=Object.keys(g.S.owned).filter(i=>g.ITEM[i].slot===sl).sort((a,b)=>g.ITEM[b].price-g.ITEM[a].price)[0];g.S.equipped[sl]=id})});
 await G(()=>__game.go('closet'));await sleep(200);ok(await G(()=>Object.keys(__game.S.equipped).length)===5,'5 slots equipped');await shot('05_closet_outfit');
 // room placement via UI taps
 await G(()=>__game.go('room'));const pos={bed:[0,3],sofa:[3,8],rug:[3,5],painting:[0,1],curtains:[3,0],plant:[7,3],lamp:[6,3],bookshelf:[7,7],clock:[6,1]};
 for(const k in pos){const id=await G(k=>Object.keys(__game.S.owned).filter(i=>__game.ITEM[i].shape===k)[0],k);
   const cards=await f.$$('#plist .item');for(const c of cards){if((await c.innerText()).includes(await G(id=>__game.ITEM[id].name,id))){await (await c.$('button')).click();break}}
   const box=await (await f.$('#view canvas')).boundingBox();const t=box.width/8;await f.click('#view canvas',{position:{x:pos[k][0]*t+t/2,y:pos[k][1]*t+t/2}});}
 ok(await G(()=>__game.S.room.length)===9,'9 furniture/decor placed (incl. wall + 2x2)');
 // move: select sofa then tap new spot
 const box=await (await f.$('#view canvas')).boundingBox();const t=box.width/8;
 await f.click('#view canvas',{position:{x:3*t+5,y:8*t+5}});await f.click('#view canvas',{position:{x:5*t+5,y:9*t+5}});
 ok(await G(()=>{const s=__game.S.room.filter(p=>__game.ITEM[p.id].shape==='sofa')[0];return s.x===5&&s.y===9}),'moved sofa');
 await f.click('#view canvas',{position:{x:2*t+5,y:7*t+5}});
 await f.evaluate(()=>window.scrollTo(0,0));await shot('06_room');
 // jobs
 await G(()=>{__game.S.shifts=6});
 for(const j of ['burger','cashier','shelf','barista','dog','pizza']){
   await G(()=>__game.go('work'));await f.click('[data-job='+j+']');const cash0=await G(()=>__game.S.cash);
   for(let i=0;i<12;i++){await G(()=>__game.shift.game.bot());await sleep(j==='dog'?120:40)}
   await sleep(150);await shot('07_job_'+j);
   const earned=await G(()=>__game.shift.earned);
   await G(()=>{__game.shift.end=Date.now()-1});await sleep(200);
   const cash1=await G(()=>__game.S.cash);ok(earned>0&&cash1>=cash0+earned,j+' playable & pays ($'+earned+')');
 }
 await shot('08_work_result');
 // saves
 await G(()=>__game.go('me'));await f.click('[data-save="1"]');const saved=await G(()=>__game.S.cash);
 await G(()=>{__game.S.cash=3});await f.click('[data-load="1"]');ok(await G(()=>__game.S.cash)===saved,'slot save/load round trip');
 await f.click('#exp');const code=await f.$eval('#code',e=>e.value);ok(code.startsWith('MRT2:'),'export code generated ('+code.length+' chars)');
 await G(()=>{__game.S.cash=7;__game.S.room=[]});await f.fill('#code',code);await f.click('#imp');
 ok(await G(()=>__game.S.cash)===saved&&await G(()=>__game.S.room.length)===9,'import restores cash+room');
 await f.fill('#code','garbage');await f.click('#imp');ok(await G(()=>__game.S.cash)===saved,'bad code rejected safely');
 await shot('09_me');
 // nav every tab
 for(const s of ['mall','closet','room','work','me']){await f.click('nav [data-s='+s+']');ok(await f.$eval('nav .on',e=>e.dataset.s)===s,'nav '+s)}
 // achievements
 console.log('  achievements:',await G(()=>Object.keys(__game.S.ach).join(',')));
 ok(errs.length===0,'no console errors '+JSON.stringify(errs));await p.close();
}
await run('file://',true,async p=>{await p.goto('file:///workspace/shopgame/index.html');return p});
await run('storage disabled',false,async p=>{await p.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('denied','SecurityError')}}));await p.goto('file:///workspace/shopgame/index.html');return p});
fs.writeFileSync('/tmp/host.html','<body style="margin:0"><iframe sandbox="allow-scripts" srcdoc="'+fs.readFileSync('index.html','utf8').replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'" style="width:412px;height:915px;border:0"></iframe></body>');
await run('sandboxed iframe',false,async p=>{await p.goto('file:///tmp/host.html');await sleep(600);return p.frames()[1]});
console.log(fail?'FAILURES: '+fail:'ALL PASS');await b.close()})();
