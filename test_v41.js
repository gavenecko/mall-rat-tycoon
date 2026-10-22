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
 const f=await setup(p);const shot=async n=>{if(shots){await sleep(350);await p.screenshot({path:'shots/v41_'+n.replace(/^\d+b?_/,'')+'_'+vp[0]+'.png'})}};const G=(fn,a)=>f.evaluate(fn,a);
 await f.fill('#nm','Tester');await f.click('#done');await sleep(300);
 // tutorial
 let steps=0;for(let i=0;i<12;i++){const t=await f.$eval('#overlay',e=>!e.hidden?e.textContent:'').catch(()=>'');if(!t)break;steps++;
   
   const nx=await f.$('#tnext');if(!nx)break;await nx.click();await sleep(120)}
 ok(steps>=8,'tutorial steps '+steps);
 const ov=await G(()=>({sw:document.documentElement.scrollWidth,w:innerWidth,hh:document.querySelector('header').offsetHeight}));ok(ov.sw<=ov.w&&ov.hh<70,'header no overflow '+JSON.stringify(ov));
 await G(()=>{__game.S.cash=50000;__game.go('mall')});await shot('header_'+vp[0]);
 await f.click('#more');await sleep(300);ok(await f.$('#mSnd'),'overflow menu');await shot('04_more_menu');await G(()=>closeSheet());await sleep(300);

 // opt-in gate
 const sid=await G(()=>{const s=__game.openStores().filter(s=>s.tier[1]<2000).sort((a,b)=>a.tier[1]-b.tier[1])[0];__game.go('mall',s.id);return s.id});
 ok(!(await f.$('[data-a=steal]')),'steal hidden by default');
 await G(()=>__game.go('mall','alley'));await sleep(200);ok(await f.$('#shadyT'),'shady toggle in Back Alley on day 1');await shot('02b_alley_toggle_off');
 await f.click('#shadyT');await sleep(400);ok(await G(()=>/permanent criminal record/.test(document.querySelector('#sheet').textContent)&&!__game.S.rap.optin),'disclaimer shown, not yet enabled');await shot('disclaimer');
 await f.click('#dok');await sleep(400);ok(await G(()=>__game.S.rap.optin),'I understand enables');await shot('toggle_on');
 await f.click('#shadyT');await sleep(200);ok(await G(()=>!__game.S.rap.optin),'toggle off works');await f.click('#shadyT');await sleep(300);await f.click('#dok');await sleep(300);
 await G(s=>__game.go('mall',s),sid);await sleep(200);ok(await f.$('[data-a=steal]'),'steal button after opt-in');
 const cheap=await G(s=>__game.ITEMS.filter(i=>i.store===s&&!i.rare).sort((a,b)=>a.price-b.price)[0].id,sid);
 const steal=async()=>{await G(id=>__game.stealAttempt(__game.ITEM[id]),cheap);await sleep(400);await f.click('#grab');await sleep(400)};
 await G(()=>window.__stealForce='win');await steal();
 ok(await G(id=>__game.S.rap.stolen===1&&__game.S.rap.hot[id]===1&&__game.S.rap.heat>0,cheap),'steal success flags item stolen');
 await G(s=>{__game.go('mall',s)},sid);await sleep(300);ok(!(await f.$('[data-a=steal]'))&&await G(()=>/try again in 7d/.test(document.body.textContent)),'cooldown: try again in 7d');await shot('cooldown_store');
 // pawn the stolen item: 10%
 const c1=await G(()=>__game.S.cash);await G(id=>{window.__bustForce=false;__game.sell(__game.ITEM[id])},cheap);
 ok(await G(([c,id])=>{const d=__game.S.cash-c;return d===Math.floor(__game.ITEM[id].price*.1)&&!__game.S.rap.hot[id]},[c1,cheap]),'stolen item pawns for 10%');
 // caught #1 (petty) -> choice
 await G(()=>{__game.S.day+=7;window.__stealForce='caught'});await steal();
 ok(await f.$('#payfine'),'1st petty catch offers fine/CS');await shot('caught');
 const fineTxt=await G(()=>document.querySelector('#payfine').textContent);console.log('   ',fineTxt);
 await f.click('#payfine');await sleep(300);await f.click('#sheet [data-m=cash]');await sleep(300);
 ok(await G(id=>__game.S.rap.cs===0&&__game.S.rap.finesPaid>=__game.ITEM[id].price*3+100,cheap),'fine >= 3x price + fee');
 // caught #2 -> CS + ban
 await G(()=>{__game.S.day+=7});await steal();await shot('caught_ban');
 if(await f.$('#docs'))await f.click('#docs');await sleep(300);
 ok(await G(s=>__game.S.rap.cs>=6&&__game.S.rap.bans[s]>=__game.S.day+5,sid),'2nd catch: 6+ CS shifts + 5-day ban');
 // luxury first catch -> ban, fine-only
 const lux=await G(()=>{const s=__game.STORES.filter(s=>s.tier[1]>=20000)[0];__game.courtCase({what:'Lux test',base:5000,store:s.id});return s.id});
 ok(await G(s=>__game.S.rap.bans[s]>=__game.S.day+7&&!document.querySelector('#payfine'),lux),'luxury first catch: 7-day ban, no CS option');await G(()=>closeSheet());await sleep(300);
 await G(()=>__game.go('mall'));await sleep(200);await shot('mall_banned');
 await G(()=>__game.go('work'));await sleep(200);ok(await f.$('#csgo'),'CS card on Work');ok(await G(()=>/Finish community service/.test(document.body.textContent)),'paid jobs locked');
 await f.click('#csgo');await sleep(1200);await shot('cs_minigame');
 const cs0=await G(()=>__game.S.rap.cs);await G(()=>{for(let i=0;i<11;i++)__game.shift.game.bot();__game.endShift();__game.render()});
 ok(await G(c=>__game.S.rap.cs===c,cs0),'11 pieces no longer counts');
 await f.click('#csgo');await sleep(300);await G(()=>{for(let i=0;i<16;i++)__game.shift.game.bot();__game.endShift();__game.render()});
 ok(await G(c=>__game.S.rap.cs===c-1,cs0),'16 pieces counts');
 await G(()=>{__game.S.rap.cs=1});await f.click('#csgo');await sleep(300);await G(()=>{for(let i=0;i<16;i++)__game.shift.game.bot();__game.endShift();__game.render()});
 // arrest
 await G(id=>{const g=__game;g.S.owned[id]=2;g.S.rap.hot[id]=2;g.S.rap.heat=90;window.__arrestForce=true;window.__raidForce=false;g.crimeNewDay();window.__arrestForce=false},cheap);
 ok(await G(id=>__game.S.rap.arrests===1&&!__game.S.owned[id]&&!Object.keys(__game.S.rap.hot).length,cheap),'arrest confiscates stolen items');
 await G(()=>{__game.S.rap.cs=0});
 // counterfeit selling gated
 await G(()=>{__game.S.rap.optin=false;const id=__game.alleyStock()[0].id;__game.S.owned[id]=1;__game.fbSell()});await sleep(300);
 ok(await G(()=>!document.querySelector('#sheet [data-s^="ko-"]')),'fakes not sellable when opted out');await G(()=>{closeSheet();__game.S.rap.optin=true});await sleep(300);

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
await run('file',[412,915],true,async p=>{await p.goto('file://'+process.cwd()+'/index.html');return p});
await run('sandbox',[412,915],false,async p=>{await p.setContent('<iframe sandbox="allow-scripts" style="width:100%;height:100vh;border:0"></iframe>');await p.$eval('iframe',(e,h)=>e.srcdoc=h,html);await sleep(800);return p.frames()[1]});
for(const [n,L] of [['v2',L2],['v3',L3]]){const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/index.html');await p.evaluate(s=>{localStorage.setItem('mrt2_auto',s)},L.save);await p.reload();await sleep(400);
 const r=await p.evaluate(()=>({cash:__game.S.cash,n:Object.keys(__game.S.owned).length,rap:!!__game.S.rap,nm:__game.S.char&&__game.S.char.name}));
 ok(r.cash===777&&r.n===L.n&&r.rap&&r.nm==='Old'&&!errs.length,n+' save migrates '+JSON.stringify(r)+errs);await p.close()}
await b.close();console.log(fail?'FAILURES: '+fail:'ALL PASS');process.exit(fail?1:0)})();
