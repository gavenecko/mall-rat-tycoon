const {chromium}=require('playwright');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});let fail=0;const ok=(c,m)=>{console.log((c?'  PASS ':'  FAIL ')+m);if(!c)fail++};const html=fs.readFileSync('index.html','utf8');
for(const [mode,W,H] of [['file',360,800],['file',412,915],['sandbox',360,800],['sandbox',412,915]]){console.log('== '+mode+' '+W+'x'+H);
 const p=await b.newPage({viewport:{width:W,height:H},hasTouch:true,isMobile:true,deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 let f=p;if(mode==='file')await p.goto('file://'+process.cwd()+'/index.html');else{await p.setContent('<iframe sandbox="allow-scripts" style="width:100%;height:100vh;border:0"></iframe>');await p.$eval('iframe',(e,h)=>e.srcdoc=h,html);await sleep(800);f=p.frames()[1]}
 const G=(fn,a)=>f.evaluate(fn,a);await f.fill('#nm','T');await f.click('#done');await sleep(200);await G(()=>{document.querySelector('#overlay').hidden=true;__game.S.cash=1e6});
 const st=await G(()=>{const g=__game;return{n:g.STORES.length,park:g.STORES.filter(s=>s.park).length,home:g.ITEMS.filter(i=>i.id.indexOf('h6-')===0).length,cheapPaint:Math.min.apply(0,g.ITEMS.filter(i=>i.shape==='paint').map(i=>i.price)),pool:Math.max.apply(0,g.ITEMS.filter(i=>i.shape==='pool').map(i=>i.price))}});
 ok(st.n===21&&st.park===3&&st.home>150&&st.cheapPaint<=40&&st.pool>=50000,'stores/items '+JSON.stringify(st));
 await G(()=>__game.go('mall'));ok(await G(()=>document.querySelectorAll('#park .front').length===3),'retail park fronts');
 await G(()=>__game.go('mall','plantdaddy'));ok(await G(()=>document.querySelectorAll('#view .item').length>5),'plant daddy store opens');
 await f.click('#view .item [data-a=buy]');await sleep(300);if(await G(()=>!document.querySelector('#sheet').hidden))await f.click('#sheet [data-m=cash]').catch(()=>{});await sleep(200);
 // yard place via tap
 const out=await G(()=>{const g=__game;const it=g.ITEMS.filter(i=>i.cat==='outdoor'&&i.w===1)[0];g.S.owned[it.id]=1;g.go('room','outside');return it.id});await sleep(200);
 ok(await f.$('#yardcv'),'outside view');await f.click('#ylist .btn.green');await sleep(100);
 const box=await f.$eval('#yardcv',c=>{const r=c.getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height}});await f.mouse?0:0;
 await G(b=>{const c=document.querySelector('#yardcv');const ev=new PointerEvent('pointerdown',{clientX:b.x+b.w/8*.5,clientY:b.y+b.h*.95,bubbles:true});c.dispatchEvent(ev)},box);await sleep(100);
 ok(await G(id=>__game.S.home.yard.some(p=>p.id===id),out),'yard item placed by tap');
 // exterior apply
 await G(()=>{const g=__game;const it=g.ITEMS.filter(i=>i.ext==='roof')[0];g.S.owned[it.id]=1});await f.click('#yext');await sleep(300);await f.click('#sheet [data-k=roof][data-i^="h6-"]');await sleep(200);ok(await G(()=>!!__game.S.home.ext.roof),'roof applied');await G(()=>closeSheet());
 // remodel
 await G(()=>{const g=__game;['wall','floor'].forEach(k=>{const it=g.ITEMS.filter(i=>i.surf===k)[0];g.S.owned[it.id]=1});g.go('room')});await f.click('#remodel');await sleep(300);
 await f.click('#sheet [data-s=wall][data-i^="h6-"]');await sleep(150);await f.click('#sheet [data-s=floor][data-i^="h6-"]');await sleep(150);ok(await G(()=>!!(__game.S.home.wall&&__game.S.home.floor)&&!!__game.S.ach.remodel),'remodel + achievement');await G(()=>closeSheet());
 // plants wilt + water
 const pl=await G(()=>{const g=__game;const it=g.ITEMS.filter(i=>i.cat==='plants'&&i.layer==='floor'&&i.h===1)[0];g.S.owned[it.id]=1;g.S.room.push({id:it.id,x:0,y:9});g.S.home.water[it.id]=g.S.day-4;return it.id});
 ok(await G(id=>wiltOf(__game.ITEM[id])===1,pl),'plant wilts when dry');await G(()=>waterAll());ok(await G(id=>wiltOf(__game.ITEM[id])===0,pl),'watering revives');
 // upgrade
 await G(()=>{__game.go('room')});await f.click('#homeup');await sleep(300);await f.click('#sheet [data-u="1"]');await sleep(300);await f.click('#sheet [data-m=cash]');await sleep(300);ok(await G(()=>__game.S.home.size===1&&ROWS===12),'house upgrade grows room');
 // sell yard item cleans up
 await G(id=>{__game.sell(__game.ITEM[id])},out);await sleep(50);ok(await G(id=>!__game.S.home.yard.some(p=>p.id===id),out),'selling removes from yard');
 await G(()=>__game.go('me'));ok(await G(()=>/House value/.test(document.body.textContent)),'Me shows house value');
 await G(()=>__game.go('online'));ok(await f.$('.bhead'),'online brand header');
 await G(()=>{__game.go('mall');__game.buy(__game.ITEMS.filter(i=>i.store==='dollar')[0].id)});await sleep(200);ok(await G(()=>!!document.getElementById('avpop')&&AV.mood==='happy'),'happy face on purchase');
 ok(errs.length===0,'no errors '+errs.join('|'));await p.close()}
for(const n of ['v2','v3','v41','v5']){const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file:///tmp/'+n+'.html');await p.fill('#nm','Old');await p.click('#done');await sleep(200);
 const sv=await p.evaluate(()=>{const g=__game;g.S.cash=99999;[5,60].forEach(i=>g.buy(g.ITEMS[i].id));const f=g.ITEMS.filter(i=>!i.slot)[2];g.buy(f.id);g.S.room=[{id:f.id,x:0,y:5}];g.S.cash=321;localStorage.setItem('mrt2_auto',JSON.stringify(g.S));return localStorage.getItem('mrt2_auto')});
 await p.goto('file://'+process.cwd()+'/index.html');await p.evaluate(s=>localStorage.setItem('mrt2_auto',s),sv);await p.reload();await sleep(400);
 const r=await p.evaluate(()=>({c:__game.S.cash,n:Object.keys(__game.S.owned).length,nm:__game.S.char.name,home:!!__game.S.home&&Array.isArray(__game.S.home.yard),room:__game.S.room.length}));
 await p.evaluate(()=>{__game.go('room');__game.go('room','outside');__game.go('me')});
 ok(r.c===321&&r.n>=3&&r.nm==='Old'&&r.home&&r.room===1&&!errs.length,n+' save loads '+JSON.stringify(r)+errs);await p.close()}
await b.close();console.log(fail?'FAILURES '+fail:'ALL PASS');process.exit(fail?1:0)})();
