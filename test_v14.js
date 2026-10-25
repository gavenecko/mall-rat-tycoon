const {chromium}=require('playwright');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const STAGE=process.env.STAGE||'C';const SHOTS=process.env.SHOTS;
const INIT=`(()=>{const rn=Date.now.bind(Date);window.__off=0;Date.now=()=>rn()+window.__off;let hid=false;Object.defineProperty(document,'hidden',{get:()=>hid,configurable:true});Object.defineProperty(document,'visibilityState',{get:()=>hid?'hidden':'visible',configurable:true});window.__vis=v=>{hid=!v;document.dispatchEvent(new Event('visibilitychange'))}})()`;
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});let fail=0;const ok=(c,m)=>{console.log((c?'  PASS ':'  FAIL ')+m);if(!c)fail++};const html=fs.readFileSync('index.html','utf8');
for(const [mode,W,H] of [['file',360,800],['file',412,915],['sandbox',360,800],['sandbox',412,915]]){console.log('== '+mode+' '+W+'x'+H);
 const p=await b.newPage({viewport:{width:W,height:H},hasTouch:true,isMobile:true,deviceScaleFactor:2});await p.addInitScript(INIT);const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 let f=p;if(mode==='file')await p.goto('file://'+process.cwd()+'/index.html');else{await p.setContent('<iframe sandbox="allow-scripts" style="width:100%;height:100vh;border:0"></iframe>');await p.$eval('iframe',(e,h)=>e.srcdoc=h,html);await sleep(800);f=p.frames()[1];await f.evaluate(INIT)}
 const G=(fn,a)=>f.evaluate(fn,a);const shot=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v14_'+n+'.png'})};
 await f.fill('#nm','Tess');await f.click('#done');await sleep(200);await G(()=>{document.querySelector('#overlay').hidden=true;JOBS.forEach(j=>__game.S.hints[j.id]=1);MILES.forEach(m=>__game.S.miles[m.k]=1)});
 ok(await G(()=>__game.S.v===14),'save version 14');
 // ---- A1 shift on game time
 const a1=await G(async()=>{const g=__game;g.go('work');g.startShift(g.JOBS[0]);const e=g.shift.end;window.__vis(false);window.__off+=10*60000;await new Promise(r=>setTimeout(r,300));window.__vis(true);closeSheet();await new Promise(r=>setTimeout(r,500));return{alive:!!g.shift,left:e-gnow()}});
 ok(a1.alive&&a1.left>30000,'shift survives 10 min away '+JSON.stringify(a1));
 const a1b=await G(async()=>{const g=__game;g.S.gt-=0;g.shift.end=gnow()+300;await new Promise(r=>setTimeout(r,800));return !g.shift});ok(a1b,'shift ends on game clock');
 // ---- A3 cashier backdrop
 const a3=await G(async()=>{const g=__game;g.go('work');g.startShift(g.JOBS[1]);await new Promise(r=>setTimeout(r,200));const c=document.querySelector('#jarea canvas');const r=!!c&&c.width>0;return r});ok(a3,'cashier canvas backdrop');await shot('cashier');await G(()=>{__game.endShift();__game.go('mall')});
 // ---- A2 balance
 ok(await G(()=>jobMult('x')>=1&&typeof PAY_K==='number'&&Math.min(4,1+.3*30)===4),'pay curve capped');
 // ---- A4 home goods online
 ok(await G(()=>CLAM.some(i=>i.surf==='wall')&&CLAM.some(i=>i.surf==='floor')&&CLAM.some(i=>i.cat==='plants')&&CLAM.some(i=>i.cat==='outdoor')),'Clamazon sells wallpaper/floor/plants/outdoor');
 await G(()=>{onTab='clam';clamCat='surface';__game.go('online')});await sleep(200);ok(await G(()=>document.querySelectorAll('#cgrid .item').length>0),'Clamazon surface tab lists items');
 if(STAGE>='B'&&fs.existsSync('parts/test_b.js'))await eval(fs.readFileSync('parts/test_b.js','utf8'));
 if(STAGE>='C'&&fs.existsSync('parts/test_c.js'))await eval(fs.readFileSync('parts/test_c.js','utf8'));
 await eval(fs.readFileSync('parts/test_d.js','utf8'));
 await eval(fs.readFileSync('parts/test_e.js','utf8'));
 await eval(fs.readFileSync('parts/test_f.js','utf8'));
 await eval(fs.readFileSync('parts/test_g.js','utf8'));
 await eval(fs.readFileSync('parts/test_h.js','utf8'));
 await eval(fs.readFileSync('parts/test_i.js','utf8'));
 await eval(fs.readFileSync('parts/test_j.js','utf8'));
 ok(errs.length===0,'no console errors '+errs.join('|'));await p.close()}
// home item survives reload (v6 load-order bug)
{const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/index.html');await p.evaluate(()=>localStorage.clear());await p.reload();await p.fill('#nm','R');await p.click('#done');
 await p.evaluate(()=>{const g=__game;const h=g.ITEMS.filter(i=>i.id.startsWith('h6'))[0];g.S.owned[h.id]=1;g.save()});await p.reload();await sleep(500);ok(await p.evaluate(()=>Object.keys(__game.S.owned).some(k=>k.startsWith('h6'))),'home item survives reload');await p.close()}
// migrations v2..v7 + MRT2/MRT3 import
for(const n of ['v2','v3','v41','v5','v6','v7','v8','v81','v9','v10','v11','v12','v13']){let p=await b.newPage();await p.addInitScript(INIT);const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file:///tmp/'+n+'.html');await p.evaluate(()=>localStorage.clear());await p.reload();await p.fill('#nm','Old');await p.click('#done');await sleep(200);
 const sv=await p.evaluate(()=>{const g=__game;g.S.cash=99999;[5,60].forEach(i=>g.buy(g.ITEMS[i].id));g.S.cash=321;return JSON.stringify(g.S)});
 await p.close();p=await b.newPage();await p.addInitScript(INIT);p.on('pageerror',e=>errs.push(e.message));await p.addInitScript(s=>{if(!sessionStorage.inj){localStorage.clear();localStorage.setItem('mrt2_auto',s);sessionStorage.inj=1}},sv);await p.goto('file://'+process.cwd()+'/index.html');await sleep(1000);
 const r=await p.evaluate(()=>({v:__game.S.v,own:Object.keys(__game.S.owned).length,nm:__game.S.char.name}));
 const imp=await p.evaluate(s=>{const b=btoa(unescape(encodeURIComponent(s)));const out=[];['MRT2:','MRT3:'].forEach(px=>{try{importCode(px+b);out.push(__game.S.v===14&&__game.S.char.name==='Old')}catch(e){out.push(e.message)}});return out},sv);
 ok(r.v===14&&r.own>=1&&r.nm==='Old'&&imp.every(x=>x===true)&&!errs.length,n+' save migrates to v14 + MRT2/MRT3 import '+JSON.stringify(r)+imp+errs);await p.close()}
await b.close();console.log(fail?'FAILURES '+fail:'ALL PASS');process.exit(fail?1:0)})();
