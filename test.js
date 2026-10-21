const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file:///workspace/shopgame/index.html');
console.log('items',await p.evaluate(()=>__game.ITEMS.length),'range',await p.evaluate(()=>{const a=__game.ITEMS.map(i=>i.price);return[Math.min(...a),Math.max(...a)]}));
await p.screenshot({path:'shots/1_mall.png'});
await p.click('.store');await p.screenshot({path:'shots/2_store.png'});
await p.evaluate(()=>{const g=__game;g.S.cash=200000;['hats','tops','bottoms','shoes','accessories','furniture','decor'].forEach(c=>{g.buy(g.ITEMS.filter(i=>i.cat===c).sort((a,b)=>b.price-a.price)[3].id)});g.buy(g.ITEMS.find(i=>i.cat==='furniture'&&i.store==='ikeya').id)});
await p.click('nav button[data-s=closet]');await p.screenshot({path:'shots/3_closet.png'});
await p.click('nav button[data-s=room]');
const btns=await p.$$('.item .btn');for(let k=0;k<btns.length;k++){await (await p.$$('.item .btn'))[k].click();await p.click('canvas',{position:{x:40+k*90,y:200+k*40}})}
await p.screenshot({path:'shots/4_room.png'});
await p.click('nav button[data-s=work]');await p.screenshot({path:'shots/5_work_start.png'});
await p.click('#go');
for(let r=0;r<3;r++){const ord=await p.evaluate(()=>__game.burger.order.slice());for(const o of ord){await p.evaluate(o=>{[...document.querySelectorAll('.ing')].find(b=>b.textContent.includes(o)).dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))},o)}}
await p.evaluate(()=>{const o=__game.burger.order;[...document.querySelectorAll('.ing')].find(b=>b.textContent.includes(o[0])).dispatchEvent(new PointerEvent('pointerdown'));});
await p.screenshot({path:'shots/6_work_play.png'});
console.log('orders',await p.evaluate(()=>__game.burger.orders),'score',await p.evaluate(()=>__game.burger.score));
await p.evaluate(()=>__game.burger.shiftEnd=Date.now());await p.waitForTimeout(400);await p.screenshot({path:'shots/7_work_paid.png'});
console.log('saved',await p.evaluate(()=>!!localStorage.getItem('mallrat_v1')));
await p.setViewportSize({width:1280,height:800});await p.click('nav button[data-s=mall]');await p.screenshot({path:'shots/8_desktop_mall.png'});
console.log('ERRORS',errs);await b.close()})();
