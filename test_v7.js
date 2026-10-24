const {chromium}=require('playwright');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const INIT=`(()=>{const rn=Date.now.bind(Date);window.__off=0;Date.now=()=>rn()+window.__off;let hid=false;Object.defineProperty(document,'hidden',{get:()=>hid,configurable:true});Object.defineProperty(document,'visibilityState',{get:()=>hid?'hidden':'visible',configurable:true});window.__vis=v=>{hid=!v;document.dispatchEvent(new Event('visibilitychange'))}})()`;
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});let fail=0;const ok=(c,m)=>{console.log((c?'  PASS ':'  FAIL ')+m);if(!c)fail++};const html=fs.readFileSync('index.html','utf8');
for(const [mode,W,H] of [['file',360,800],['file',412,915],['sandbox',360,800],['sandbox',412,915]]){console.log('== '+mode+' '+W+'x'+H);
 const p=await b.newPage({viewport:{width:W,height:H},hasTouch:true,isMobile:true});await p.addInitScript(INIT);const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 let f=p;if(mode==='file')await p.goto('file://'+process.cwd()+'/index.html');else{await p.setContent('<iframe sandbox="allow-scripts" style="width:100%;height:100vh;border:0"></iframe>');await p.$eval('iframe',(e,h)=>e.srcdoc=h,html);await sleep(800);f=p.frames()[1];await f.evaluate(INIT)}
 const G=(fn,a)=>f.evaluate(fn,a);await f.fill('#nm','T');await f.click('#done');await sleep(200);await G(()=>{document.querySelector('#overlay').hidden=true});
 const d0=await G(()=>__game.S.day);
 // hidden for 3 real days: no day advance, no gt advance
 const r1=await G(async()=>{const g=__game,gt=g.S.gt;window.__vis(false);window.__off+=3*864e5;await new Promise(r=>setTimeout(r,1500));const mid={day:g.S.day,dgt:g.S.gt-gt};window.__vis(true);await new Promise(r=>setTimeout(r,1500));return Object.assign(mid,{day2:g.S.day,dgt2:g.S.gt-gt,cash:g.S.cash,sheet:document.querySelector('#sheet').textContent})});
 ok(r1.day===d0&&r1.day2===d0&&r1.dgt<5000&&r1.dgt2<5000,'no days pass while hidden '+JSON.stringify({d0,day:r1.day2,dgt:r1.dgt2}));
 ok(/Welcome back/.test(r1.sheet)&&/mystery package/.test(r1.sheet),'welcome-back modal w/ package');
 const cash1=r1.cash;await G(()=>closeSheet());
 // visible but timer gap (device sleep, no event) -> ignored
 const r2=await G(async()=>{const g=__game,gt=g.S.gt,d=g.S.day;window.__off+=5*864e5;await new Promise(r=>setTimeout(r,1500));return{dd:g.S.day-d,dgt:g.S.gt-gt}});ok(r2.dd===0&&r2.dgt<5000,'sleep gap ignored '+JSON.stringify(r2));
 // game time does advance while visible
 const r3=await G(async()=>{const g=__game,d=g.S.day;g.S.dayAt=g.S.gt-599000;await new Promise(r=>setTimeout(r,2500));return g.S.day-d});ok(r3===1,'day advances with play time');
 // short away (<30m) no bonus
 const r4=await G(async()=>{const c=__game.S.cash;window.__vis(false);window.__off+=10*60000;window.__vis(true);await new Promise(r=>setTimeout(r,300));return{dc:__game.S.cash-c,open:!document.querySelector('#sheet').hidden}});ok(r4.dc===0&&!r4.open,'no bonus under 30 min');
 // reward cap
 const rw=await G(()=>[awayReward(60*60000),awayReward(864e5),awayReward(30*864e5)]);ok(rw[1]===rw[2]&&rw[1]>=50&&rw[1]<=150&&rw[0]<rw[1],'reward capped '+rw);
 // auction timer uses game time
 const r5=await G(async()=>{const g=__game;const a=g.S.flea[0];if(!a)return 'none';const e=a.end;window.__vis(false);window.__off+=864e5;window.__vis(true);closeSheet();await new Promise(r=>setTimeout(r,1200));return g.S.flea.some(x=>x.aid===a.aid)});ok(r5===true||r5==='none','auctions frozen while away ('+r5+')');
 ok(errs.length===0,'no errors '+errs.join('|'));await p.close()}
// old saves (including a 300-day jumped v6 save) load + time-travel fix
for(const n of ['v2','v3','v41','v5','v6']){let p=await b.newPage();await p.addInitScript(INIT);const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file:///tmp/'+n+'.html');await p.fill('#nm','Old');await p.click('#done');await sleep(200);
 const sv=await p.evaluate(n=>{const g=__game;g.S.cash=99999;[5,60].forEach(i=>g.buy(g.ITEMS[i].id));g.S.cash=321;if(n==='v6'){g.S.day=340;g.S.card.bal=5000;g.S.bnpl=[{label:'x',amt:50,left:3}];g.S.home.water={a:20};g.S.rap.heat=0.5;}g.S.savedAt=Date.now()-2*864e5;localStorage.setItem('mrt2_auto',JSON.stringify(g.S));return localStorage.getItem('mrt2_auto')},n);
 await p.close();p=await b.newPage();await p.addInitScript(INIT);p.on('pageerror',e=>errs.push(e.message));await p.addInitScript(s=>{if(!sessionStorage.inj){localStorage.setItem('mrt2_auto',s);sessionStorage.inj=1}},sv);await p.goto('file://'+process.cwd()+'/index.html');await sleep(1200);
 const r=await p.evaluate(()=>({c:__game.S.cash,day:__game.S.day,nm:__game.S.char.name,gt:!!__game.S.gt,offer:__game.S.ttOffer,fixBtn:!!document.querySelector('#ttfix'),wb:/Welcome back/.test(document.querySelector('#sheet').textContent)}));
 ok(r.c>321&&r.c<=321+150&&r.nm==='Old'&&r.gt&&r.wb&&!errs.length,n+' save loads + bonus '+JSON.stringify(r)+errs);
 if(n==='v6'){ok(r.day===340&&r.fixBtn,'ttfix offered, day kept');await p.click('#ttfix');await sleep(300);const x=await p.evaluate(()=>({bal:__game.S.card.bal,b:__game.S.bnpl.length,w:__game.S.home.water.a,day:__game.S.day,o:__game.S.ttOffer}));ok(x.bal===0&&x.b===0&&x.w===340&&x.day===340&&x.o===false,'ttfix applied '+JSON.stringify(x));
  await p.reload();await sleep(1200);ok(!(await p.$('#ttfix')),'ttfix one-time')}
 await p.close()}
await b.close();console.log(fail?'FAILURES '+fail:'ALL PASS');process.exit(fail?1:0)})();
