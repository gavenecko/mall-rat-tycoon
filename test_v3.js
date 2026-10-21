const {chromium}=require('playwright');const fs=require('fs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'  PASS ':'  FAIL ')+m);if(!c)fail++};
let v2save,v2names;
{const p=await b.newPage({viewport:{width:412,height:915}});await p.goto('file:///tmp/v2.html');
 await p.fill('#nm','OldTimer');await p.click('#done');await sleep(200);
 v2names=await p.evaluate(()=>{const g=__game;g.S.cash=99999;const ids=[g.ITEMS[5].id,g.ITEMS[60].id,g.ITEMS.filter(i=>i.cat==='furniture')[3].id,g.ITEMS.filter(i=>i.rare)[2].id];ids.forEach(id=>g.buy(id));
   g.S.room.push({id:ids[2],x:2,y:5});g.S.jobs.burger={xp:300,shifts:4,best:80};g.S.shifts=4;g.S.day=5;localStorage.setItem('mrt2_auto',JSON.stringify(g.S));
   const o={};Object.keys(g.S.owned).forEach(id=>o[id]=g.ITEM[id].name);return o});
 v2save=await p.evaluate(()=>localStorage.getItem('mrt2_auto'));await p.close()}
console.log('v2 save items:',Object.keys(v2names).length);
async function run(label,shots,setup){
 console.log('== '+label);const p=await b.newPage({viewport:{width:412,height:915},hasTouch:true,isMobile:true,deviceScaleFactor:2});const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const f=await setup(p);const shot=async n=>{if(shots){await sleep(350);await p.screenshot({path:'shots/v3_'+n+'.png'})}};const G=(fn,a)=>f.evaluate(fn,a);
 const fresh=!(await G(()=>!!__game.S.char));
 if(fresh){await f.fill('#nm','Tester');await f.click('#g [data-k=female]');await f.click('#done');await sleep(200);await f.click('#tskip')}
 await G(()=>{__game.S.cash=5000;__game.render()});
 await f.click('nav [data-s=online]');ok(await f.$('#cq'),'Online tab -> Clamazon');ok(await G(()=>__game.CLAM.length)>=150,'Clamazon catalog '+await G(()=>__game.CLAM.length));
 await f.fill('#cq','hoodie');await sleep(100);const names=await f.$$eval('#cgrid .nm',e=>e.map(x=>x.textContent));ok(names.length>0&&names.every(n=>/hoodie/i.test(n)),'search "hoodie" -> '+names.length+' results');
 await shot('01_clamazon_search');
 await f.click('#cgrid [data-a=det]');ok((await f.$$('#sheet .stars')).length>=4,'detail sheet has ratings + reviews');await shot('02_clamazon_reviews');
 await f.click('#cbuy');await f.click('#sheet [data-m=cash]');await sleep(100);
 ok(await G(()=>__game.S.orders[0].status==='shipping'&&__game.S.orders[0].arrive===__game.S.day+1),'non-member order ships for next day');
 await f.click('.tabs [data-ot=orders]');await shot('03_orders_tracking');
 await G(()=>__game.nextDay());await sleep(100);ok(await G(()=>__game.S.orders[0].status==='delivered'),'order delivered next day');
 ok(await f.$eval('#mailb',e=>+e.textContent>0),'mailbox badge shows '+await f.$eval('#mailb',e=>e.textContent));
 await f.click('nav [data-s=room]');ok(await f.$('#collect'),'room shows package collect button');await shot('04_room_package');
 await f.click('#collect');ok(await G(()=>__game.S.orders[0].status==='collected'),'package collected into inventory');
 await f.click('#mail');await sleep(100);await shot('05_mailbox');await f.click('#shx');
 await f.click('nav [data-s=online]');await f.click('.tabs [data-ot=clam]');await f.fill('#cq','');await f.click('#crime');await f.click('#sheet [data-m=cash]');ok(await G(()=>__game.S.crime.active),'joined Clamazon Crime');
 await f.click('#cgrid [data-a=buy]');await f.click('#sheet [data-m=cash]');ok(await G(()=>__game.S.orders[0].status==='delivered'),'Crime order delivered instantly');await shot('06_clamazon_crime');
 await G(()=>{__game.S.cash=40;__game.render()});await f.click('#cgrid [data-a=buy]');await shot('07_pay_options');
 await f.click('#sheet [data-m=card]');const bal=await G(()=>__game.S.card.bal);ok(bal>0,'bought on card, balance '+bal);
 await G(()=>{__game.S.cash=200;__game.render()});await f.fill('#cq','sofa');await sleep(50);await f.click('#cgrid [data-a=buy]');await f.click('#sheet [data-m=bnpl]');ok(await G(()=>__game.S.bnpl.length===1&&__game.S.bnpl[0].left===3),'pay-in-4 plan created');
 await G(()=>{__game.S.card.bal=900});await G(()=>__game.nextDay());ok(await G(()=>__game.S.card.bal===927),'3% daily interest applied');ok(await G(()=>__game.S.bnpl[0].left===2),'pay-in-4 installment taken');
 await f.click('.tabs [data-ot=wallet]');await shot('08_wallet_debt');await f.click('#pay50');ok(await G(()=>__game.S.card.bal<927),'paid down card');
 await G(()=>{__game.S.cash=5000;__game.onlineTick()});await f.click('.tabs [data-ot=flea]');await f.click('[data-bid]');
 const aid=await G(()=>{const a=__game.S.flea.filter(a=>a.high==='you')[0];return a&&a.aid});const cbid=await G(()=>__game.S.cash);ok(!!aid,'placed bid (escrowed)');
 await G(aid=>{const a=__game.S.flea.filter(a=>a.aid===aid)[0];a.npcMax=a.bid*10;for(let i=0;i<400&&a.high==='you';i++)__game.onlineTick()},aid);
 ok(await G(aid=>__game.S.flea.filter(a=>a.aid===aid)[0].high!=='you',aid)&&await G(()=>__game.S.cash)>cbid,'NPC outbid me + escrow refunded');
 await G(()=>__game.render());await f.click('[data-bid="'+aid+'"]');await G(aid=>{const a=__game.S.flea.filter(a=>a.aid===aid)[0];a.npcMax=0;a.end=Date.now()-1;__game.onlineTick()},aid);
 ok(await G(()=>__game.S.stats3.won===1&&__game.S.orders[0].src==='Fleabay'),'won auction -> package');await G(()=>__game.render());await shot('09_fleabay');
 await f.click('#list');await f.click('#sheet [data-l]');await f.fill('#lstart','5');await f.click('#lgo');
 ok(await G(()=>__game.S.flea.some(a=>a.seller==='you')),'listed own item');const c1=await G(()=>__game.S.cash);
 await G(()=>{const a=__game.S.flea.filter(a=>a.seller==='you')[0];a.npcMax=Math.max(50,a.npcMax);for(let i=0;i<300&&a.bids<3;i++)__game.onlineTick();__game.render()});await shot('10_fleabay_listing');
 await G(()=>{const a=__game.S.flea.filter(a=>a.seller==='you')[0];a.end=Date.now()-1;__game.onlineTick()});
 ok(await G(()=>__game.S.stats3.flipped===1)&&await G(()=>__game.S.cash)>c1,'own auction sold, paid out');
 await f.click('.tabs [data-ot=fb]');ok((await f.$$('#fbg .item')).length===6,'6 Facenook listings');await shot('11_facenook');
 let bought=false;for(let i=0;i<6&&!bought;i++){
   await G(i=>{const l=__game.S.fb.list[i];l.status='open';l.chat=[];l.asked=false;l.tries=0;l.counter=0;l.scam=false},i);await G(()=>__game.render());
   await (await f.$$('#fbg .item button'))[i].click();await f.click('#ask');if(!(await f.$('#offer'))){await f.click('#shx');continue}
   const fl=await G(i=>__game.S.fb.list[i].floor,i);await f.fill('#offer',String(Math.round(fl*.8)));await f.click('#off');
   if(await f.$('#acc')){await shot('12_facenook_haggle');await f.click('#acc');await f.click('#sheet [data-m=cash]');bought=true}else await f.click('#shx')}
 ok(bought&&await G(()=>__game.S.stats3.haggled>=1),'haggled + bought on Facenook');
 const sc=await G(()=>{const g=__game,lux=Object.keys(g.KO_OF)[0];const l=g.S.fb.list[5];l.status='open';l.id=lux;l.scam=true;l.asked=true;l.counter=0;l.ask=50;g.render();return 5});
 await (await f.$$('#fbg .item button'))[sc].click();await f.click('#full');await f.click('#sheet [data-m=cash]');
 ok(await G(()=>__game.S.stats3.scammed===1&&Object.keys(__game.S.owned).some(id=>id.indexOf('ko-')===0)),'scam listing delivers a knockoff');await shot('13_scam');
 await G(()=>{const g=__game;const it=g.ITEMS.filter(i=>i.colorName==='Pink'&&i.store!=='knockoff')[0];g.S.wish={};g.S.wish[it.id]=1;g.S.day=13;g.S.inbox=[];g.nextDay();g.go('mall')});
 ok(await G(()=>__game.S.inbox.some(m=>/Wishlist alert/.test(m.msg))&&__game.S.inbox.some(m=>/Valentime/.test(m.msg))),'Valentime event + wishlist sale notification');
 ok(await f.$('.evt'),'event banner in mall');await shot('14_event_mall');
 await f.click('nav [data-s=online]');await f.click('.tabs [data-ot=wish]');ok((await f.$$('#wg .item')).length===1,'wishlist view');await shot('15_wishlist');
 await G(()=>{const g=__game;const el=g.ITEMS.filter(i=>i.cat==='electronics'&&i.store!=='knockoff');const L=['console','arcade','gamingpc','phone','vr','laptop','speaker'].map(s=>el.filter(i=>i.shape===s)[0]);
   g.S.room=[];L.forEach((it,k)=>{g.S.owned[it.id]=1;g.S.room.push({id:it.id,x:k%4*2,y:3+Math.floor(k/4)*3})});g.nextDay();g.go('room')});
 ok(await G(()=>__game.S.ach.gadget>0),'electronics owned + placed (Gadget achievement)');await f.evaluate(()=>scrollTo(0,0));await shot('16_room_electronics');
 await f.click('nav [data-s=me]');await f.click('#exp');const code=await f.$eval('#code',e=>e.value);ok(code.indexOf('MRT3:')===0,'export MRT3');
 await f.fill('#code',code.replace('MRT3:','MRT2:'));await f.click('#imp');ok(await G(()=>!!__game.S.char),'import accepts old MRT2 prefix');
 ok(errs.length===0,'no console errors '+JSON.stringify(errs));await p.close()}
await run('file:// fresh',true,async p=>{await p.goto('file:///workspace/shopgame/index.html');return p});
{console.log('== v2 save migration');const p=await b.newPage({viewport:{width:412,height:915}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(s=>{try{localStorage.setItem('mrt2_auto',s)}catch(e){}},v2save);await p.goto('file:///workspace/shopgame/index.html');await sleep(300);
 const r=await p.evaluate(n=>{const g=__game;return{name:g.S.char&&g.S.char.name,cash:g.S.cash,day:g.S.day,v:g.S.v,room:g.S.room.length,xp:g.S.jobs.burger.xp,same:Object.keys(n).every(id=>g.S.owned[id]&&g.ITEM[id].name===n[id])}},v2names);
 console.log('  ',JSON.stringify(r));ok(r.name==='OldTimer'&&r.same&&r.room===1&&r.xp===300&&r.day===5&&r.v===3,'v2 save loads without loss (items/ids/names/room/jobs/day)');
 await p.screenshot({path:'shots/v3_17_migrated.png'});ok(!errs.length,'no errors '+errs);await p.close()}
fs.writeFileSync('/tmp/host.html','<body style="margin:0"><iframe sandbox="allow-scripts" srcdoc="'+fs.readFileSync('index.html','utf8').replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'" style="width:412px;height:915px;border:0"></iframe></body>');
await run('sandboxed iframe',false,async p=>{await p.goto('file:///tmp/host.html');await sleep(600);return p.frames()[1]});
console.log(fail?'FAILURES: '+fail:'ALL PASS');await b.close()})();
