(async()=>{ await G(()=>{closeSheet();__game.go('mall')});
 const shot9=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v29_'+n+'.png'})};
 // Y1 dark mode menus
 const y1=await G(()=>{const S=__game.S;S.dark=false;applyTheme();openMore();const before=$('#mDark').textContent;S.dark=true;save();applyTheme();openMore();const after=$('#mDark').textContent;const theme=document.documentElement.getAttribute('data-theme');closeSheet();__game.go('mall');hubShow('today');
   const card=document.querySelector('.hub .card');const bg=getComputedStyle(card).backgroundColor;const qa=document.querySelector('.qa button');const qbg=getComputedStyle(qa).backgroundColor;const isDark=theme==='dark';
   /* restore light for later shots that need it? keep dark for one shot */
   return{before:/Dark mode/.test(before),after:/Light mode/.test(after),theme,isDark,cardBg:bg,qaBg:qbg,notWhite:!/^rgb\(255,\s*255,\s*255\)$/.test(bg)}});
 ok(y1.before&&y1.after&&y1.isDark&&y1.notWhite,'dark mode toggle remembered, menus not white '+JSON.stringify(y1));
 await G(()=>{__game.go('mall');openMore();window.scrollTo(0,0)});await sleep(250);await shot9('dark_menu');
 await G(()=>{const S=__game.S;S.dark=false;applyTheme();closeSheet();rerender()});
 // Y2 live mall ambience + open tap
 const y2=await G(async()=>{__game.go('mall');hubShow('today');const qa=document.querySelector('#qaMap');qa.click();await new Promise(r=>setTimeout(r,400));
   const cv=document.querySelector('#livemall');if(!cv)return{no:true};const R=cv.getBoundingClientRect();
   const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let op=0,non=0;for(let i=0;i<d.length;i+=4){if(d[i+3]===255)op++;if(d[i+3]>0)non++}
   const openSp=LM.st.spots.filter(s=>s.open);const closedSp=LM.st.spots.filter(s=>!s.open);
   const tip=/shutters|Live Mall|storefront/.test(document.querySelector('#sheet').textContent);
   return{has:!!cv,fit:R.left>=0&&R.right<=innerWidth+2,op:op/(d.length/4),openN:openSp.length,closedN:closedSp.length,tip,btn:!!document.querySelector('#lmclassic'),n:LM.st.n}});
 ok(y2.has&&y2.fit&&y2.op===1&&y2.openN>=4&&y2.closedN>=1&&y2.tip&&y2.btn,'live mall: opaque canvas, open+closed shops, tip '+JSON.stringify(y2));
 await sleep(300);await shot9('live_mall');
 // Y3 tap open storefront navigates; closed shows next day
 const y3=await G(async()=>{liveMallSheet();await new Promise(r=>setTimeout(r,200));
   const closed=LM.st.spots.filter(s=>!s.open)[0];const open=LM.st.spots.filter(s=>s.open&&!s.park)[0];
   const cv=document.querySelector('#livemall'),b=cv.getBoundingClientRect();
   const tap=sp=>{const cx=b.left+(sp.r[0]+sp.r[2]/2)*(b.width/cv.clientWidth),cy=b.top+(sp.r[1]+sp.r[3]/2)*(b.height/cv.clientHeight);cv.dispatchEvent(new MouseEvent('click',{clientX:cx,clientY:cy,bubbles:true}))};
   tap(closed);await new Promise(r=>setTimeout(r,150));
   const toastT=[...document.querySelectorAll('#toast .tq')].map(e=>e.textContent).join(' ');
   const still=!!document.querySelector('#livemall');
   const nd=nextOpenDay(closed.s.id);const ndOk=nd>__game.S.day&&closed.next===nd;
   tap(open);await new Promise(r=>setTimeout(r,200));
   const went=screen==='mall'&&sub===open.s.id;closeSheet();__game.go('mall');
   return{toast:/Opens Day|shutters/.test(toastT),still,ndOk,nd,went,id:open.s.id,sub}});
 ok(y3.toast&&y3.still&&y3.ndOk&&y3.went,'tap closed → next day toast; tap open → enter store '+JSON.stringify(y3));
 // Y4 closed shutters screenshot: force a closed store into view by opening sheet
 await G(()=>{liveMallSheet();const c=LM.st.spots.filter(s=>!s.open)[0];if(c){const cv=document.querySelector('#livemall');/* scroll nothing, just capture */}});
 await sleep(400);await shot9('shutters');await G(()=>closeSheet());
 // Y5 map buttons wired
 const y5=await G(()=>{__game.go('mall');hubShow('today');const m=document.querySelector('#mapbtn');const qa=document.querySelector('#qaMap');
   m.click();const a=!!document.querySelector('#livemall');closeSheet();qa.click();const b=!!document.querySelector('#livemall');closeSheet();
   return{map:/Live Mall/.test(m.textContent),a,b}});
 ok(y5.map&&y5.a&&y5.b,'Map + Live Mall buttons open the live view '+JSON.stringify(y5));
 // Y6 race hidden during truce
 const y6=await G(()=>{const S=__game.S;const f=feudT();f.peace=5;f.score=5;f.note='hi';f.pranked=true;const r=raceOpen();feudSheet();const t=document.querySelector('#racebox')?document.querySelector('#racebox').textContent:'';closeSheet();f.peace=0;return{r,paused:/Paused during the truce/.test(t)}});
 ok(y6.r===null&&y6.paused,'Brayden race hidden/paused during truce '+JSON.stringify(y6));
 const y7=await G(()=>{__game.go('mall');hubShow('today');return document.querySelector('#view').scrollHeight});ok(y7<3200,'page length ok '+y7);
})();
