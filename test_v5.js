const {chromium}=require('playwright');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});let fail=0;const ok=(c,m)=>{console.log((c?'  PASS ':'  FAIL ')+m);if(!c)fail++};
const html=fs.readFileSync('index.html','utf8');
for(const [mode,W,H] of [['file',360,800],['file',412,915],['sandbox',360,800],['sandbox',412,915]]){console.log('== '+mode+' '+W+'x'+H);
 const p=await b.newPage({viewport:{width:W,height:H},hasTouch:true,isMobile:true,deviceScaleFactor:2,reducedMotion:W===360?'reduce':'no-preference'});const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 let f=p;if(mode==='file')await p.goto('file://'+process.cwd()+'/index.html');else{await p.setContent('<iframe sandbox="allow-scripts" style="width:100%;height:100vh;border:0"></iframe>');await p.$eval('iframe',(e,h)=>e.srcdoc=h,html);await sleep(800);f=p.frames()[1]}
 const G=(fn,a)=>f.evaluate(fn,a);
 await f.fill('#nm','T');await f.click('#done');await sleep(200);await G(()=>{document.querySelector('#overlay').hidden=true;__game.S.cash=99999});
 const navOk=await G(()=>[...document.querySelectorAll('nav button')].every(b=>b.getBoundingClientRect().height>=44&&b.querySelector('svg')));ok(navOk,'nav buttons svg + >=44px');
 for(const s of ['mall','closet','room','work','online','me']){await G(s=>__game.go(s),s);await sleep(80);const o=await G(()=>document.documentElement.scrollWidth-innerWidth);ok(o<=0,'no h-overflow '+s+' ('+o+')')}
 await G(()=>__game.go('mall'));ok(await G(()=>document.querySelectorAll('.front').length>=3),'storefront concourse');
 const sid=await G(()=>document.querySelector('.front').dataset.store);await f.click('.front');await sleep(200);ok(await G(()=>!!document.querySelector('.hero')),'branded store hero');
 await f.click('#view .item img');await sleep(350);ok(await G(()=>!document.querySelector('#sheet').hidden&&!!document.querySelector('.detail-img')),'item detail sheet');
 await G(()=>closeSheet());
 const btn=await G(()=>{const b=document.querySelector('#view .item .btn');return b.getBoundingClientRect().height});ok(btn>=44,'buy btn height '+btn);
 await f.click('#more');await sleep(300);await f.click('#mDark');await sleep(200);ok(await G(()=>document.documentElement.dataset.theme==='dark'&&__game.S.dark),'dark mode on');
 await G(()=>closeSheet());await G(()=>__game.go('room'));await sleep(200);
 if(mode==='file'&&W===412){await sleep(300);await p.screenshot({path:'shots/v5_after_dark_room.png'});await G(()=>__game.go('mall'));await sleep(400);await p.screenshot({path:'shots/v5_after_dark_mall.png'})}
 const bg=await G(()=>getComputedStyle(document.body).color);ok(/241|242/.test(bg),'dark text color '+bg);
 await G(()=>{__game.go('work');__game.startShift(__game.JOBS[0])});await sleep(500);await G(()=>{for(let i=0;i<40;i++)__game.shift.game.bot()});ok(await G(()=>__game.shift.combo>=3),'combo counter');await G(()=>{__game.endShift();__game.go('me')});
 ok(errs.length===0,'no errors '+errs.join('|'));await p.close()}
// old saves
for(const n of ['v2','v3','v41']){const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file:///tmp/'+n+'.html');await p.fill('#nm','Old');await p.click('#done');await sleep(200);
 const sv=await p.evaluate(()=>{const g=__game;g.S.cash=99999;[5,60].forEach(i=>g.buy(g.ITEMS[i].id));g.S.cash=321;g.save&&g.save();localStorage.setItem('mrt2_auto',JSON.stringify(g.S));return localStorage.getItem('mrt2_auto')});
 await p.goto('file://'+process.cwd()+'/index.html');await p.evaluate(s=>localStorage.setItem('mrt2_auto',s),sv);await p.reload();await sleep(400);
 const r=await p.evaluate(()=>({c:__game.S.cash,n:Object.keys(__game.S.owned).length,nm:__game.S.char.name,dark:__game.S.dark}));ok(r.c===321&&r.n>=2&&r.nm==='Old'&&r.dark===false&&!errs.length,n+' save loads '+JSON.stringify(r)+errs);await p.close()}
await b.close();console.log(fail?'FAILURES '+fail:'ALL PASS');process.exit(fail?1:0)})();
