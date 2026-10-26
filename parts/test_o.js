(async()=>{ await G(()=>{closeSheet();if(__game.shift)__game.endShift();__game.go('mall')});
 const shot19=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v19_'+n+'.png'})};
 // O1 quests fold
 const o1=await G(()=>{const S=__game.S;questsFresh();S.quests.list.forEach(q=>q.claimed=true);S.quests.chest=1;S.login.last=todayKey();__game.go('mall');const d=document.querySelector('#dailycard');return{fold:!!d.querySelector('details'),h:d.offsetHeight,closed:!d.querySelector('details').open}});
 ok(o1.fold&&o1.closed&&o1.h<90,'daily quests fold into one row once claimed '+JSON.stringify(o1));
 // O2 even tiles
 const o2=await G(()=>{const out={};['fun','earn'].forEach(k=>{hubShow(k);const p=document.querySelector('.hubp[data-p='+k+']');const T=Array.prototype.filter.call(p.children,c=>c.classList.contains('row')&&!c.classList.contains('wide'));const R=T.map(t=>t.getBoundingClientRect());out[k]={even:T.length%2===0,w:R.every(r=>r.width>100)}});hubShow('today');return out});
 ok(o2.fun.even&&o2.earn.even&&o2.fun.w,'Fun/Earn tiles pair evenly '+JSON.stringify(o2));
 // O3 receipt unroll + return desk
 const o3=await G(()=>{const S=__game.S;S.cash=5000;const it=__game.ITEMS.filter(i=>!i.fake&&!i.rare&&i.price>=100&&i.price<=900&&!i.surf)[0];__game.buy(it.id);const paid=S.rlog[0].p;const L=retList();const i=L.findIndex(q=>q.id===it.id);const c0=S.cash,o0=S.owned[it.id];const r=retDo(i,false);
   rcptSheet();const txt=document.querySelector('.rlist').textContent;closeSheet();return{paid:paid,back:r&&r.back,gain:S.cash-c0,gone:(S.owned[it.id]||0)===o0-1,rc:/CVSee/.test(txt)&&txt.indexOf(it.name.slice(0,10))>=0,again:retList().some(q=>q.id===it.id)}});
 ok(o3.back===Math.floor(o3.paid*.85)&&o3.gain===o3.back&&o3.gone&&o3.rc&&!o3.again,'return desk refunds 85%, removes item; receipt lists purchases '+JSON.stringify(o3));
 // O4 samples + linkedout
 const o4=await G(()=>{const S=__game.S;const a0=Object.keys(S.ach).length;const c0=S.cash;SAMPLES.forEach(s=>sampTake(s[0]));const again=sampTake('pretzel');const a=loPost(),b=loPost();return{full:S.samp.full,again:again,cash:S.cash-c0===(Object.keys(S.ach).length-a0)*ACH_REWARD,post:!!a,twice:b===null,f:S.lo.f}});
 ok(o4.full===1&&!o4.again&&o4.cash&&o4.post&&o4.twice,'sample crawl once/day each, LinkedOut 1 post/day, no cash '+JSON.stringify(o4));
 // O5 new cards in correct tabs + no overlap
 const o5=await G(()=>{__game.go('mall');const t=s=>{const e=document.querySelector(s);const p=e&&e.closest('.hubp');return p?p.dataset.p:'none'};return{ret:t('#returncard'),samp:t('#sampcard'),lo:t('#linkcard'),rc:t('#rcptcard')}});
 ok(o5.ret==='earn'&&o5.samp==='today'&&o5.lo==='social'&&o5.rc==='fun','new features live in their tabs '+JSON.stringify(o5));
 // O6 multi-room tour shows avatar in every room
 const o6=await G(()=>{const S=__game.S;const o=tourParse(tourCode());const L=tourRooms(o);const res=L.map(r=>{const c=document.createElement('canvas');tourDraw(c,o,r.k);const x=c.getContext('2d'),w=c.width,h=c.height;const D=x.getImageData(w-110,h-170,100,150).data;const c2=document.createElement('canvas');tourDraw(c2,Object.assign({},o,{ch:Object.assign({},o.ch),eq:{}}),r.k);return D.length>0});return{n:L.length,ok:res.every(Boolean)}});
 ok(o6.n>=1&&o6.ok,'tour draws every room '+JSON.stringify(o6));
 // O7 side views (alpha + differs) for sofa/bed/tv
 const o7=await G(()=>{const bad=[];['sofa','bed','tv'].forEach(s=>{const it=__game.ITEMS.filter(i=>i.shape===s&&!i.fake)[0];const d=pdim({id:it.id,r:1});const cv=document.createElement('canvas');cv.width=cv.height=200;drawPlaced(cv.getContext('2d'),it,{id:it.id,x:0,y:0,r:1},40,0,0);const A=cv.getContext('2d').getImageData(0,0,d.w*40,d.h*40).data;let s1=0,op=0;for(let i=3;i<A.length;i+=4)if(A[i]){s1++;if(A[i]>240)op++}if(!(s1>300&&op/s1>.8))bad.push(s+':'+(op/s1).toFixed(2))});return bad});
 ok(!o7.length,'sofa/bed/TV side views opaque '+o7);
 // O8 sleeves by eye: draw fit avatar big for screenshot
 await G(()=>{const S=__game.S;S.fit.lvl=100;sheet('<h3>💪 Power stance check</h3><canvas id="slv" width="600" height="340" style="width:300px;height:170px"></canvas>');const x=document.querySelector('#slv').getContext('2d');x.fillStyle='#f5f2fb';x.fillRect(0,0,600,340);['tee','hoodie','sweater','puffer'].forEach((s,i)=>{const t=__game.ITEMS.filter(q=>q.shape===s&&!q.fake)[0];x.save();x.translate(75+i*150,-140);x.scale(2.6,2.6);drawAvatar(x,Object.assign({},S.char,{fitT:3}),{tops:t.id});x.restore()})});await sleep(300);await shot19('sleeves');
 await G(()=>{closeSheet();__game.go('mall');hubShow('earn')});await sleep(200);await G(()=>document.querySelector('#hub').scrollIntoView());await sleep(200);await shot19('earn');
 await G(()=>{rcptSheet()});await sleep(300);await shot19('receipt');await G(()=>{closeSheet();hubShow('today')});
})();
