const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();
async function run(label,setup){const p=await b.newPage({viewport:{width:412,height:915},hasTouch:true,isMobile:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const f=await setup(p);
 const navs=['closet','room','work','mall'],res=[];
 for(const n of navs){await f.click(`nav button[data-s=${n}]`);res.push(n+':'+(await f.$eval('nav .on',e=>e.dataset.s)))}
 await f.click('.store');res.push('store:'+(await f.$$('.item')).length+'items');
 await f.click('nav button[data-s=work]');await f.click('#go');res.push('burger:'+!!(await f.$('.ing')));
 await f.click('nav button[data-s=closet]');await f.click('#reset');await f.click('#reset');
 res.push('cash:'+await f.$eval('#cash',e=>e.textContent));
 await p.screenshot({path:`shots/robust_${label}.png`});console.log(label,res.join(' '),'ERR',errs);await p.close()}
await run('file',async p=>{await p.goto('file:///workspace/shopgame/index.html');return p});
await run('nostorage',async p=>{await p.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('denied','SecurityError')}}));await p.goto('file:///workspace/shopgame/index.html');return p});
fs.writeFileSync('/tmp/host.html',`<iframe sandbox="allow-scripts" srcdoc="${fs.readFileSync('index.html','utf8').replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" style="width:400px;height:880px;border:0"></iframe>`);
await run('sandbox',async p=>{await p.goto('file:///tmp/host.html');await p.waitForTimeout(500);const f=p.frames()[1];
 console.log('sandbox storage throws:',await f.evaluate(()=>{try{localStorage;return false}catch(e){return e.name}}));return f});
await b.close()})();
