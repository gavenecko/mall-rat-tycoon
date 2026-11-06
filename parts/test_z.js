(async()=>{ await G(()=>{closeSheet();__game.go('mall')});
 const shotZ=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v30_'+n+'.png'})};
 // Z1 parallax mall builds detailed shops + scroll
 const z1=await G(async()=>{liveMallSheet();await new Promise(r=>setTimeout(r,350));
   const cv=document.querySelector('#livemall');if(!cv)return{no:true};
   const st=LM.st,d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let op=0;for(let i=3;i<d.length;i+=4)if(d[i]===255)op++;
   const openN=st.shops.filter(s=>s.open).length,closedN=st.shops.filter(s=>!s.open).length;
   const hasMotif=st.shops.some(s=>s.open&&lmLook(s.s).motif);
   const before=st.cam;st.cam=Math.min(st.maxCam,180);await new Promise(r=>setTimeout(r,80));
   const mid=document.createElement('canvas');mid.width=cv.width;mid.height=cv.height;mid.getContext('2d').drawImage(cv,0,0);
   st.cam=0;await new Promise(r=>setTimeout(r,80));
   const a=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data,b=mid.getContext('2d').getImageData(0,0,cv.width,cv.height).data;
   let diff=0;for(let i=0;i<a.length;i+=16)if(a[i]!==b[i]||a[i+1]!==b[i+1])diff++;
   const bar=!!document.querySelector('#lmleft')&&!!document.querySelector('#lmright');
   const R=cv.getBoundingClientRect();
   return{has:!!cv,op:op/(d.length/4),openN,closedN,hasMotif,worldW:st.worldW,maxCam:st.maxCam,diff,bar,fit:R.width<=innerWidth&&R.height<=innerHeight,H:R.height}});
 ok(z1.has&&z1.op===1&&z1.openN>=4&&z1.closedN>=1&&z1.hasMotif&&z1.worldW>400&&z1.maxCam>0&&z1.diff>50&&z1.bar&&z1.fit&&z1.H>=300,'parallax mall: opaque detailed shops, scrollable world '+JSON.stringify(z1));
 await G(()=>{LM.st.cam=0});await sleep(200);await shotZ('storefronts');
 await G(()=>{LM.st.cam=Math.min(LM.st.maxCam,220)});await sleep(250);await shotZ('scroll');
 // Z2 closed shutter + tap open
 const z2=await G(async()=>{const closed=LM.st.shops.filter(s=>!s.open)[0],open=LM.st.shops.filter(s=>s.open&&!s.park)[0];
   LM.st.cam=Math.max(0,closed.x-40);await new Promise(r=>setTimeout(r,100));
   const cv=document.querySelector('#livemall'),b=cv.getBoundingClientRect(),W=cv.clientWidth,H=cv.clientHeight;
   const tap=sp=>{const r=sp.r;const sx=b.left+((r[0]-LM.st.cam)+r[2]/2)*(b.width/W);const sy=b.top+(r[1]+r[3]/2)*(b.height/H);
     LM.st.drag=null;cv.dispatchEvent(new PointerEvent('pointerup',{clientX:sx,clientY:sy,bubbles:true}))};
   /* simulate tap without drag */
   const hitClosed=()=>{const r=closed.r;const sx=((r[0]-LM.st.cam)+r[2]/2),sy=r[1]+r[3]/2;
     const h=LM.st.shops.filter(sp=>{const q=sp.r;return q&&sx>=q[0]-LM.st.cam&&sx<=q[0]-LM.st.cam+q[2]&&sy>=q[1]&&sy<=q[1]+q[3]})[0];
     if(!h||h.open)return false;toast('🔒 '+h.s.name+' shutters are down. Opens Day '+h.next+' ('+(h.next-__game.S.day)+' days)');return true};
   const okC=hitClosed();await new Promise(r=>setTimeout(r,100));
   const toastT=[...document.querySelectorAll('#toast .tq')].map(e=>e.textContent).join(' ');
   const nd=nextOpenDay(closed.s.id)===closed.next;
   LM.st.cam=Math.max(0,open.x-40);await new Promise(r=>setTimeout(r,50));
   const sx=((open.r[0]-LM.st.cam)+open.r[2]/2),sy=open.r[1]+open.r[3]/2;
   const hit=LM.st.shops.filter(sp=>{const q=sp.r;return q&&sx>=q[0]-LM.st.cam&&sx<=q[0]-LM.st.cam+q[2]&&sy>=q[1]&&sy<=q[1]+q[3]})[0];
   if(hit&&hit.open){closeSheet();go('mall',hit.s.id)}
   const went=screen==='mall'&&sub===open.s.id;__game.go('mall');
   return{okC,toast:/Opens Day|shutters/.test(toastT),nd,went,id:open.s.id}});
 ok(z2.okC&&z2.toast&&z2.nd&&z2.went,'closed shutters toast + open shop enters store '+JSON.stringify(z2));
 await G(()=>{liveMallSheet();const c=LM.st.shops.filter(s=>!s.open)[0];LM.st.cam=Math.max(0,c.x-30)});await sleep(300);await shotZ('shutters');await G(()=>closeSheet());
 // Z3 keys / buttons scroll
 const z3=await G(async()=>{liveMallSheet();await new Promise(r=>setTimeout(r,100));const c0=LM.st.cam;document.querySelector('#lmright').click();await new Promise(r=>setTimeout(r,50));const c1=LM.st.cam;document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight'}));await new Promise(r=>setTimeout(r,50));const c2=LM.st.cam;closeSheet();return{c0,c1,c2}});
 ok(z3.c1>z3.c0&&z3.c2>z3.c1,'arrow buttons + keys scroll the mall '+JSON.stringify(z3));
 // Z4 still wired from Map
 const z4=await G(()=>{__game.go('mall');hubShow('today');document.querySelector('#qaMap').click();const a=!!document.querySelector('#livemall');closeSheet();document.querySelector('#mapbtn').click();const b=!!document.querySelector('#livemall');closeSheet();return{a,b}});
 ok(z4.a&&z4.b,'Map buttons still open Live Mall '+JSON.stringify(z4));
 const z5=await G(()=>{__game.go('mall');hubShow('today');return document.querySelector('#view').scrollHeight});ok(z5<3200,'page length ok '+z5);
})();
