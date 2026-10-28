(async()=>{
 await G(()=>{closeSheet();if(__game.shift)__game.endShift()});
 const k1=await G(async()=>{__game.go('mall');window.scrollTo(0,99999);await new Promise(r=>setTimeout(r,100));toast('A very very long notification about something that happened in the mall today wow');toast('🏆 Second one (+$25)');await new Promise(r=>setTimeout(r,250));
   const h=document.querySelector('header').getBoundingClientRect(),T=[].map.call(document.querySelectorAll('#toast .tq'),t=>t.getBoundingClientRect());const el=document.elementFromPoint(innerWidth/2,h.bottom+8);
   return{n:T.length,maxB:Math.max.apply(null,T.map(t=>t.bottom)),hb:h.bottom,sy:window.scrollY,pe:getComputedStyle(document.querySelector('#toast')).pointerEvents,under:!!(el&&el.closest('#view'))}});
 ok(k1.n===2&&k1.maxB<=k1.hb+1&&k1.sy>200&&k1.pe==='none'&&k1.under,'scrolled: notifications overlay only the header, content below stays uncovered '+JSON.stringify(k1));
 const k2=await G(()=>{__game.go('mall');mapSheet();const T=window.__mapT;const r={n:T.length,bad:T.filter(q=>!q.fit).map(q=>q.t),labels:T.map(q=>q.t)};closeSheet();return r});
 ok(k2.n>=5&&!k2.bad.length&&k2.labels.every(l=>l.length<=26&&!/…/.test(l)),'mall map short labels all fit, none truncated '+JSON.stringify(k2));
 // K3 drag / rotate / flip
 const k3=await G(async()=>{const g=__game,S=g.S;const it=g.ITEMS.filter(i=>i.shape==='sofa'&&!i.fake)[0];S.owned[it.id]=(S.owned[it.id]||0)+1;S.room=[{id:it.id,x:1,y:WALL+1}];S.avatar={x:COLS-1,y:ROWS-1};room.placing=null;room.sel=-1;g.go('room');S.room=[{id:it.id,x:1,y:WALL+1}];g.go('room');await new Promise(r=>setTimeout(r,120));
   const cv=document.querySelector('#roomcv'),b=cv.getBoundingClientRect(),c=b.width/COLS;const ev=(t,gx,gy)=>cv.dispatchEvent(new PointerEvent(t,{bubbles:true,pointerId:1,clientX:b.left+(gx+.5)*c,clientY:b.top+(gy+.5)*c}));
   ev('pointerdown',1,WALL+1);ev('pointermove',2,WALL+2);ev('pointermove',3,WALL+3);const ghost=document.querySelector('#hint').textContent;ev('pointerup',3,WALL+3);const p=S.room[0],moved=p.x===3&&p.y===WALL+3;
   ev('pointerdown',3,WALL+3);ev('pointermove',3,0);ev('pointerup',3,0);const back=p.x===3&&p.y===WALL+3;
   const sig=()=>{const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let s=0;for(let i=0;i<d.length;i+=32)s=(s*31+d[i]+d[i+2])%1e9;return s};
   ev('pointerdown',3,WALL+3);ev('pointerup',3,WALL+3);for(let t=0;t<4&&!document.querySelector('#rot');t++){await new Promise(r=>setTimeout(r,80));ev('pointerdown',S.room[0].x,S.room[0].y);ev('pointerup',S.room[0].x,S.room[0].y)}const sel=!!document.querySelector('#rot')&&!!document.querySelector('#flip');const s0=sig();document.querySelector('#rot').click();const rot=p.r===1&&pdim(p).w===it.h&&pdim(p).h===it.w;const s1=sig();
   document.querySelector('#flip').click();const fl=p.f===1;const s2=sig();g.save();const saved=/"r":1/.test(store.get(KEY_AUTO)||'')&&/"f":1/.test(store.get(KEY_AUTO)||'');
   const blocked=!fits(it.id,p.x,p.y+(ROWS),0,p.r);return{moved,back,sel,rot,fl,changed:s0!==s1&&s1!==s2,saved,blocked,ta:cv.style.touchAction}});
 ok(k3.moved&&k3.back&&k3.sel&&k3.rot&&k3.fl&&k3.changed&&k3.saved&&k3.blocked&&k3.ta==='none','furniture drag (snap grid, invalid drop snaps back), rotate, flip, saved '+JSON.stringify(k3));
 const k3b=await G(async()=>{const S=__game.S;const a=JSON.stringify(S.room);switchRoom&&0;const ks=Object.keys(allRooms());return{a:a.length>0,rooms:ks.length,ok:allRooms()[S.home.cur||'bed'].room[0].r===1}});
 ok(k3b.ok,'rotation stored with the current room '+JSON.stringify(k3b));
 // K4 rival
 const k4=await G(async()=>{const g=__game,S=g.S;closeSheet();S.rival={wk:weekNo(),me:0,got:0,wins:0,losses:0,hist:[],taunt:''};const d=weeklyDrop();S.stock[d.id]=0;const l0=stockLeft(d);rivalDay(0);const got=S.rival.got>=1&&stockLeft(d)===l0-1;
   S.cash=99999;S.owned[d.id]=0;const s0=S.spent;buy(d);const me=S.rival.me;closeSheet();
   S.rival.me=3;S.rival.got=1;S.rival.wk=weekNo();const d0=S.day;S.day+=7;const c0=S.cash;rivalSettle();S.day=d0;S.rival.wk=weekNo();const won=S.rival.wins===1&&S.cash-c0===60&&S.rival.me===0&&S.rival.hist.length===1;
   g.go('mall');await new Promise(r=>setTimeout(r,1100));const card=!!document.querySelector('#rivalcard #rivav canvas');document.querySelector('#rivbtn').click();const sh=!!document.querySelector('#rivbig canvas')&&/1W/.test(document.querySelector('#sheet').textContent);closeSheet();
   return{got,me,won,card,sh,n:rivalNow().n}});
 ok(k4.got&&k4.me===1&&k4.won&&k4.card&&k4.sh,'weekly rival snags drops, you score by copping, beat them for $60, scoreboard '+JSON.stringify(k4));
 // K5 new stores/items
 const k5=await G(()=>{const wb=ITEMS.filter(i=>/^v15-wb/.test(i.id)),ty=ITEMS.filter(i=>i.toy);const bad=[];wb.concat(ty).forEach(it=>{const c=document.createElement('canvas');c.width=c.height=120;const x=c.getContext('2d');drawFurn(x,it,0,0,it.w*60,it.h*60);const d=x.getImageData(0,0,120,120).data;let op=0,semi=0;for(let i=3;i<d.length;i+=4){if(d[i]===255)op++;else if(d[i]>0)semi++}if(op<300||semi>op*.35)bad.push(it.shape+':'+op+'/'+semi)});
   const open=openStores().some(s=>s.id==='toysuhoh'),coll=collStores().some(s=>s.id==='toysuhoh'),idOK=ITEM['v15-toy-bear']&&ITEM['v15-toy-bear'].store==='toysuhoh';__game.go('mall');const front=/Toys R Uh-Oh/.test(document.querySelector('#view').textContent);return{wb:wb.length,ty:ty.length,bad,open,coll,idOK,front}});
 ok(k5.wb===8&&k5.ty===10&&!k5.bad.length&&k5.open&&k5.coll&&k5.idOK&&k5.front,'Worst Buy gadgets + Toys R Uh-Oh plush/figures, drawn opaque, in collection log '+JSON.stringify(k5));
 const k5b=await G(()=>{const S=__game.S;S.cash=99999;const it=ITEM['v15-toy-squish'];buy(it);closeSheet();return{own:S.owned[it.id]>0,coll:!!S.coll[it.id]}});
 ok(k5b.own&&k5b.coll,'buying a toy counts in collection log '+JSON.stringify(k5b));
 if(SHOTS&&mode==='file'&&W===412){
   await G(async()=>{__game.go('room');const cv=document.querySelector('#roomcv'),b=cv.getBoundingClientRect(),c=b.width/COLS;const p=__game.S.room[0];cv.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1,clientX:b.left+(p.x+.5)*c,clientY:b.top+(p.y+.5)*c}));cv.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:1,clientX:b.left+(p.x+1.5)*c,clientY:b.top+(p.y+1.5)*c}));window.scrollTo(0,0)});await sleep(150);await shot('room_drag');
   await G(()=>{const cv=document.querySelector('#roomcv');cv.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:1}));const S=__game.S;['v15-wb-bigtv','v15-toy-bear','v15-toy-labooboo','v15-wb-gstation','v15-toy-dream','v15-toy-dino'].forEach(id=>S.owned[id]=1);
     S.room.push({id:'v15-wb-bigtv',x:5,y:WALL+1},{id:'v15-toy-bear',x:0,y:WALL+4,f:1},{id:'v15-toy-labooboo',x:1,y:WALL+4},{id:'v15-wb-gstation',x:7,y:WALL+1},{id:'v15-toy-dream',x:4,y:WALL+4,r:0},{id:'v15-toy-dino',x:6,y:WALL+4});__game.go('room');window.scrollTo(0,0)});await sleep(200);await shot('room_toys');
   await G(()=>{__game.go('mall');document.querySelector('#rivalcard').scrollIntoView({block:'center'})});await sleep(200);await shot('rival_card');
   await G(()=>{rivalSheet()});await sleep(200);await shot('rival_sheet');
   await G(()=>{closeSheet();__game.go('mall','toysuhoh');window.scrollTo(0,0)});await sleep(300);await shot('toystore');
   await G(()=>{__game.go('mall','worstbuy');window.scrollTo(0,0)});await sleep(300);await shot('worstbuy');
   await G(()=>{__game.go('mall');window.scrollTo(0,1500);toast('🏆 Kidult 🧸 (+$25)');toast('Bought Labooboo Blind Box ✨')});await sleep(250);await shot('toast_header');
   await G(()=>{mapSheet()});await sleep(200);await shot('map');await G(()=>closeSheet())}
})()
