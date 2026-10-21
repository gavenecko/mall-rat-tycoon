const {chromium}=require('playwright');const fs=require('fs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});let fail=0;const ok=(c,m)=>{console.log((c?'  PASS ':'  FAIL ')+m);if(!c)fail++};
const html=fs.readFileSync('index.html','utf8');
// legacy saves
async function legacy(file){const p=await b.newPage();await p.goto('file://'+file);await p.fill('#nm','Old');await p.click('#done');await sleep(200);
 const r=await p.evaluate(()=>{const g=__game;g.S.cash=99999;[5,60,90].forEach(i=>g.buy(g.ITEMS[i].id));g.S.cash=777;localStorage.setItem('mrt2_auto',JSON.stringify(g.S));return{save:localStorage.getItem('mrt2_auto'),n:Object.keys(g.S.owned).length}});await p.close();return r}
const L2=await legacy('/tmp/v2.html'),L3=await legacy('/tmp/v3.html');
async function run(label,vp,shots,setup){
 console.log('== '+label+' '+vp[0]+'x'+vp[1]);const p=await b.newPage({viewport:{width:vp[0],height:vp[1]},hasTouch:true,isMobile:true,deviceScaleFactor:2});const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const f=await setup(p);const shot=async n=>{if(shots){await sleep(350);await p.screenshot({path:'shots/v4_'+n+'.png'})}};const G=(fn,a)=>f.evaluate(fn,a);
 await f.fill('#nm','Tester');await f.click('#done');await sleep(300);
 // tutorial
 let steps=0;for(let i=0;i<12;i++){const t=await f.$eval('#overlay',e=>!e.hidden?e.textContent:'').catch(()=>'');if(!t)break;steps++;
   if(/Clamazon/.test(t)&&shots)await shot('02_tut_online');if(/Wallet/.test(t)&&shots)await shot('03_tut_wallet');
   const nx=await f.$('#tnext');if(!nx)break;await nx.click();await sleep(120)}
 ok(steps>=8,'tutorial steps '+steps);
 const ov=await G(()=>({sw:document.documentElement.scrollWidth,w:innerWidth,hh:document.querySelector('header').offsetHeight}));ok(ov.sw<=ov.w&&ov.hh<70,'header no overflow '+JSON.stringify(ov));
 await G(()=>{__game.S.cash=50000;__game.go('mall')});await shot('01_header_mall_'+vp[0]);
 await f.click('#more');await sleep(300);ok(await f.$('#mSnd'),'overflow menu');await shot('04_more_menu');await G(()=>closeSheet());await sleep(300);
 // shoplift success
 const sid=await G(()=>{const s=__game.openStores().filter(s=>s.id!=='worstbuy')[0];__game.go('mall',s.id);return s.id});
 ok(await f.$('[data-a=steal]'),'steal button in store');
 await f.click('[data-a=steal]');await sleep(500);await shot('05_steal_minigame');
 const own0=await G(()=>Object.values(__game.S.owned).reduce((a,b)=>a+b,0));await G(()=>window.__stealForce='win');await f.click('#grab');await sleep(200);
 ok(await G(o=>Object.values(__game.S.owned).reduce((a,b)=>a+b,0)===o+1&&__game.S.rap.stolen===1&&__game.S.rap.heat>0,own0),'successful steal adds item + heat');
 // caught #1 -> fine choice
 await G(()=>window.__stealForce='caught');await f.click('[data-a=steal]');await sleep(300);await f.click('#grab');await sleep(400);
 ok(await f.$('#payfine'),'1st catch offers fine');await shot('06_caught_choice');
 await f.click('#payfine');await sleep(300);await f.click('#sheet [data-m=cash]');await sleep(300);
 ok(await G(()=>__game.S.rap.cs===0&&__game.S.rap.finesPaid>0),'fine paid clears CS');
 // caught #2 -> CS + ban
 await G(()=>__game.go('mall',__game.openStores().filter(s=>s.id!=='worstbuy')[0].id));await f.click('[data-a=steal]');await sleep(300);await f.click('#grab');await sleep(400);
 await shot('07_caught_ban');await f.click('#docs');await sleep(300);
 ok(await G(s=>__game.S.rap.cs===3&&__game.S.rap.bans[s]>__game.S.day,sid),'2nd catch: 3 CS + ban');
 await G(()=>__game.go('mall'));await sleep(200);await shot('08_mall_banned');
 // 3rd -> forced
 const r3=await G(()=>{__game.courtCase({what:'Test offense',base:100});return!document.querySelector('#payfine')&&!!document.querySelector('#docs')});ok(r3,'3rd offense forces CS');await G(()=>closeSheet());
 await G(()=>__game.go('work'));await sleep(200);ok(await f.$('#csgo'),'CS card on Work');ok(await G(()=>/Finish community service/.test(document.body.textContent)),'paid jobs locked');await shot('09_work_cs');
 await f.click('#csgo');await sleep(1200);await shot('10_cs_minigame');
 const cs0=await G(()=>__game.S.rap.cs);await G(()=>{for(let i=0;i<11;i++)__game.shift.game.bot();__game.endShift();__game.render()});
 ok(await G(c=>__game.S.rap.cs===c-1&&__game.S.rap.csDone===1,cs0),'CS shift counted');
 await G(()=>{__game.S.rap.cs=1});await f.click('#csgo');await sleep(300);await G(()=>{for(let i=0;i<11;i++)__game.shift.game.bot();__game.endShift();__game.render()});

 // alley
 await G(()=>{__game.S.day=3;__game.go('mall','alley')});await sleep(200);ok((await f.$$('#ag .item')).length===8,'alley 8 items');await shot('11_back_alley');
 await f.click('#ag .item button');await sleep(300);await f.click('#sheet [data-m=cash]');await sleep(300);
 const fid=await G(()=>Object.keys(__game.S.owned).filter(id=>__game.ITEM[id].fake)[0]);ok(fid,'bought fake '+fid);
 await G(()=>{const id=__game.alleyStock()[1].id;__game.S.owned[id]=(__game.S.owned[id]||0)+3});
 // sell fake on facenook: no bust then bust
 await G(()=>{window.__bustForce=false;__game.go('online')});await f.click('[data-ot=fb]').catch(()=>{});await sleep(200);
 ok(await f.$('#fbsell'),'Facenook sell button');await f.click('#fbsell');await sleep(300);await shot('12_fb_sell');
 const fake2=await G(()=>Object.keys(__game.S.owned).filter(id=>__game.ITEM[id].fake)[0]);
 await f.click('#sheet [data-s="'+fake2+'"]');await sleep(300);const c0=await G(()=>__game.S.cash);await f.click('#sok');await sleep(300);
 ok(await G(c=>__game.S.cash>c&&__game.S.rap.fakesSold===1,c0),'fake sold unbusted');
 await G(()=>window.__bustForce=true);const fake3=await G(()=>Object.keys(__game.S.owned).filter(id=>__game.ITEM[id].fake)[0]);await f.click('#fbsell');await sleep(300);await f.click('#sheet [data-s="'+fake3+'"]');await sleep(300);await f.click('#sok');await sleep(500);
 ok(await G(()=>__game.S.rap.busted===1&&!!document.querySelector('#docs')),'fake sale busted -> court');await shot('13_fake_busted');await G(()=>closeSheet());
 // raid
 await G(()=>{window.__raidForce=true;__game.S.rap.heat=80;__game.crimeNewDay()});
 ok(await G(()=>__game.S.rap.raids===1&&!Object.keys(__game.S.owned).some(id=>__game.ITEM[id].fake)),'raid seizes fakes');
 await G(()=>{window.__raidForce=false;__game.nextDay()});ok(await G(()=>__game.S.rap.heat<80),'heat decays');
 await G(()=>{__game.S.rap.cs=0;__game.save&&0;__game.go('me')});await sleep(300);ok(await f.$eval('#v',e=>/Criminal record/.test(e.textContent)).catch(()=>G(()=>/Criminal record/.test(document.body.textContent))),'record on Me');
 await G(()=>{const el=[...document.querySelectorAll('.lbl')].find(e=>/Criminal/.test(e.textContent));el&&el.scrollIntoView()});await shot('14_me_record');
 const achs=await G(()=>JSON.stringify(__game.S.ach||__game.S.achievements||{}));console.log('   ach:',achs.slice(0,300));
 ok(errs.length===0,'no errors '+errs.join(' | '));await p.close()}
await run('file',[360,800],true,async p=>{await p.goto('file://'+process.cwd()+'/index.html');return p});
await run('file',[412,915],false,async p=>{await p.goto('file://'+process.cwd()+'/index.html');return p});
await run('sandbox',[412,915],false,async p=>{await p.setContent('<iframe sandbox="allow-scripts" style="width:100%;height:100vh;border:0"></iframe>');await p.$eval('iframe',(e,h)=>e.srcdoc=h,html);await sleep(800);return p.frames()[1]});
for(const [n,L] of [['v2',L2],['v3',L3]]){const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/index.html');await p.evaluate(s=>{localStorage.setItem('mrt2_auto',s)},L.save);await p.reload();await sleep(400);
 const r=await p.evaluate(()=>({cash:__game.S.cash,n:Object.keys(__game.S.owned).length,rap:!!__game.S.rap,nm:__game.S.char&&__game.S.char.name}));
 ok(r.cash===777&&r.n===L.n&&r.rap&&r.nm==='Old'&&!errs.length,n+' save migrates '+JSON.stringify(r)+errs);await p.close()}
await b.close();console.log(fail?'FAILURES: '+fail:'ALL PASS');process.exit(fail?1:0)})();
