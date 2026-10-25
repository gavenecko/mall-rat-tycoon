(async()=>{
 await G(()=>{closeSheet();if(__game.shift)__game.endShift()});
 // M1 notification log + tap to expand
 const m1=await G(async()=>{const S=__game.S;__game.go('mall');await new Promise(r=>setTimeout(r,1700));S.nunread=0;toast('🏆 An extremely long notification text that will absolutely not fit on one line of the header strip (+$25)');await new Promise(r=>setTimeout(r,60));
   await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const d=[].filter.call(document.querySelectorAll('#toast .tq'),q=>/absolutely/.test(q.textContent))[0],bell=document.querySelector('#bell'),bd=bell&&bell.querySelector('.bdg');const tx=!!d&&d.classList.contains('tqx')&&getComputedStyle(d).pointerEvents==='auto';d.click();const op=/Notifications/.test(document.querySelector('#sheet').textContent)&&/absolutely not fit/.test(document.querySelector('#sheet').textContent);
   const unread=S.nunread;closeSheet();const hb=document.querySelector('header').getBoundingClientRect(),br=bell.getBoundingClientRect();return{tx:tx,op:op,unread:unread,bell:!!bell&&br.right<=innerWidth&&br.bottom<=hb.bottom,log:S.nlog.length}});
 ok(m1.tx&&m1.op&&m1.unread===0&&m1.bell&&m1.log>=1,'truncated notification taps open the full log; bell in header '+JSON.stringify(m1));
 // M2 side view art
 const m2=await G(()=>{const it=__game.ITEMS.filter(i=>i.shape==='sofa'&&!i.fake)[0],c=40;const mk=r=>{const cv=document.createElement('canvas');cv.width=cv.height=200;const x=cv.getContext('2d');drawPlaced(x,it,{id:it.id,x:0,y:0,r:r},c,0,0);return cv};const a=mk(1),b=document.createElement('canvas');b.width=b.height=200;const y=b.getContext('2d');
   y.save();y.translate(20,40);y.rotate(Math.PI/2);drawFurn(y,it,-40,-20,80,40);y.restore();const A=a.getContext('2d').getImageData(0,0,40,80).data,B=y.getImageData(0,0,40,80).data;let diff=0,op=0,s=0;for(let i=3;i<A.length;i+=4){if(A[i]){s++;if(A[i]>240)op++}if(Math.abs(A[i]-B[i])>60)diff++}return{diff:diff,s:s,op:op/s,sh:Object.keys(SIDE).length}});
 ok(m2.diff>200&&m2.op>.85&&m2.sh>=8,'rotated furniture uses dedicated side-view art (not a turned sprite) '+JSON.stringify(m2));
 await G(async()=>{const g=__game,S=g.S;const its=['sofa','bed','bookshelf','tv'].map(s=>g.ITEMS.filter(i=>i.shape===s&&!i.fake)[0]);its.forEach(i=>S.owned[i.id]=(S.owned[i.id]||0)+1);S.room=[{id:its[0].id,x:0,y:WALL+1,r:1},{id:its[1].id,x:2,y:WALL+1,r:1},{id:its[2].id,x:5,y:WALL+1,r:1},{id:its[3].id,x:6,y:WALL+4,r:1}];S.avatar={x:3,y:ROWS-1};g.go('room');await new Promise(r=>setTimeout(r,200))});await shot('side_view');
 // M3 power stance
 const m3=await G(()=>{const S=__game.S;const ch=S.char;const draw=t=>{const c=document.createElement('canvas');c.width=150;c.height=200;const x=c.getContext('2d');x.translate(75,4);drawAvatar(x,Object.assign({},ch,{fitT:t}),{});return x.getImageData(0,0,150,200).data};const a=draw(2),b=draw(3);let d=0,legW2=0,legW3=0;for(let i=3;i<a.length;i+=4)if(Math.abs(a[i]-b[i])>100)d++;
   const span=(D)=>{let best=0;for(let y=140;y<200;y++)best=Math.max(best,sp1(D,y));return best},sp1=(D,y)=>{let l=999,r=-1;for(let xx=0;xx<150;xx++)if(D[(y*150+xx)*4+3]>100){l=Math.min(l,xx);r=Math.max(r,xx)}return r-l};return{d:d,l2:span(a),l3:span(b)}});
 ok(m3.d>300&&m3.l3>m3.l2,'top fitness tier gets a real power stance (wider legs, hands on hips) '+JSON.stringify(m3));
 await G(()=>{__game.S.fit=__game.S.fit||{};__game.S.fit.lvl=90;__game.go('closet')});await sleep(200);await shot('power_stance');
 // M4 rotation ETA
 const m4=await G(async()=>{const g=__game,S=g.S;g.go('mall');sub='circlej';rerender();await new Promise(r=>setTimeout(r,100));const t=[].map.call(document.querySelectorAll('#view [data-a=buy]'),b=>b.textContent);return{back:t.filter(x=>/^Back in \d+d$/.test(x)).length,ns:g.ITEMS.filter(i=>i.rot).map(rotBackIn)}});
 ok(m4.back===2&&m4.ns.filter(n=>n===0).length===1&&m4.ns.every(n=>n>=0&&n<=14),'off-rotation merch shows "Back in Nd" '+JSON.stringify(m4));
 // M5 weather
 const m5=await G(async()=>{const g=__game,S=g.S;const cnt={};for(let d=1;d<=400;d++){const w=wxOf(d);cnt[w]=(cnt[w]||0)+1}const u=g.ITEMS.filter(i=>i.umb)[0];S.wxOverride='sun';const p0=priceOf(u);S.wxOverride='rain';const p1=priceOf(u);
   const run=w=>{S.wxOverride=w;S.mm.buff=0;g.startShift(g.JOBS[0]);g.shift.earned=100;const c0=S.cash;g.endShift();return S.cash-c0};run('sun');run('sun');const gs=run('sun'),gr=run('rain'),gain=Math.round(gr/gs*100);S.wxOverride='rain';g.go('mall');sub=null;rerender();await new Promise(r=>setTimeout(r,150));const card=!!document.querySelector('#wxcard canvas');
   const avg=(cnt.rain*.1-cnt.snow*.1+cnt.heat*.05)/400;return{cnt:cnt,p0:p0,p1:p1,gain:gain,card:card,avg:+avg.toFixed(3)}});
 ok(m5.p1===Math.round(m5.p0*1.5)&&m5.gain===110&&m5.card&&Object.keys(m5.cnt).length===4&&m5.avg<.04,'weather: rain umbrella surge, pay modifier, animated card, small avg pay effect '+JSON.stringify(m5));
 await G(()=>{document.querySelector('#wxcard').scrollIntoView({block:'center'})});await sleep(300);await shot('weather');await G(()=>{delete __game.S.wxOverride});
 // M6 pawn haggle
 const m6=await G(()=>{const g=__game,S=g.S;const it=g.ITEMS.filter(i=>!i.fake&&i.price>=200&&!i.rare)[0];S.owned[it.id]=(S.owned[it.id]||0)+1;const n0=S.owned[it.id];pawnSheet();document.querySelector('[data-pw="'+it.id+'"]').click();const p=pawnSt,o0=p.offer,mx=p.max;
   const r1=pawnCounter(it.price);const o1=pawnSt&&pawnSt.offer;const c0=S.cash;pawnCounter(mx);return{o0:o0,mx:mx,price:it.price,r1:r1,raised:o1>o0,paid:S.cash-c0,left:S.owned[it.id]||0,n0:n0}});
 ok(m6.o0<m6.mx&&m6.mx<=m6.price*.7&&m6.r1===false&&m6.raised&&m6.paid===m6.mx&&m6.left===m6.n0-1,'Pawn Scars: lowball, counter raises offer, deal ≤70% retail '+JSON.stringify(m6));
 const m6b=await G(()=>{const g=__game,S=g.S;const it=g.ITEMS.filter(i=>!i.fake&&i.price>=200&&!i.rare)[1];S.owned[it.id]=(S.owned[it.id]||0)+1;pawnSheet();document.querySelector('[data-pw="'+it.id+'"]').click();for(let i=0;i<3;i++)pawnCounter(it.price);return{pat:pawnSt.pat,counter:!!document.querySelector('#pwcounter'),take:!!document.querySelector('#pwtake'),offer:pawnSt.offer<=pawnSt.max}});
 ok(m6b.pat===0&&!m6b.counter&&m6b.take&&m6b.offer,'Rick runs out of patience: take-it-or-leave-it '+JSON.stringify(m6b));await shot('pawn');
 // M7 tour code read-only
 const m7=await G(()=>{const S=__game.S;closeSheet();openMore();document.querySelector('#mTour').click();const code=document.querySelector('#tmine').value;const before=JSON.stringify(S);const o=JSON.parse(JSON.stringify(tourParse(code)));o.n='Friend';o.room=o.room.slice(0,3);const fc='MRTH:'+b64e(JSON.stringify(o));document.querySelector('#tin').value=fc;document.querySelector('#tview').click();
   const after=JSON.stringify(S);const bad=tourView('MRT3:abc');document.querySelector('#tin').value=fc;document.querySelector('#tview').click();return{pre:/^MRTH:/.test(code),drawn:!!document.querySelector('#tcv')&&document.querySelector('#tcv').width>0,same:before===after,bad:bad,cnt:document.querySelector('#tcount').textContent}});
 ok(m7.pre&&m7.drawn&&m7.same&&m7.bad===-1,'house tour code: share + read-only viewer, rejects bad code '+JSON.stringify(m7));await shot('tour');
 await G(()=>{closeSheet();__game.go('mall')});
})();
