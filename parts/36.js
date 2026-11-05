/* v29: menu dark-mode polish, Live Mall View, hide Brayden race during truce */
(function(){const st=document.createElement('style');st.textContent=
'[data-theme=dark] .qa button,[data-theme=dark] .daybar,[data-theme=dark] .hubtabs button.on,[data-theme=dark] .hubp>.small{background:var(--card)!important;color:var(--ink)!important;box-shadow:0 2px 8px #0006!important}'+
'[data-theme=dark] .hub .card{background:var(--card)!important;color:var(--ink)!important;box-shadow:0 2px 8px #0006!important}'+
'[data-theme=dark] .hubtabs button{color:var(--muted)}[data-theme=dark] .hubtabs button.on{color:var(--ink)!important}'+
'[data-theme=dark] .closed-row span{background:var(--chip);color:var(--ink);border-color:var(--line)}'+
'[data-theme=dark] .sheetbox{background:var(--card);color:var(--ink)}'+
'[data-theme=dark] .btn.alt{background:var(--chip);color:var(--ink)}'+
'#livemall{touch-action:none;border-radius:14px;border:3px solid #111;display:block;margin:0 auto;background:#1a237e}'+
'#livemallwrap .small{margin-top:6px}';document.head.appendChild(st)})();

/* Apply theme on boot + keep Menu toggle wording clear */
const _applyTheme29=applyTheme;applyTheme=function(){_applyTheme29();document.body.classList.toggle('dark',!!(S&&S.dark))};
const _openMore29=openMore;openMore=function(){_openMore29();const b=$('#mDark');if(b)b.textContent=S.dark?'☀️ Light mode (menus)':'🌙 Dark mode (menus)'};

/* Next day a closed store reopens (deterministic from openStores rotation) */
function nextOpenDay(sid){
  const s=STORES.filter(q=>q.id===sid)[0];if(!s)return S.day;if(s.park||s.drop)return S.day;
  const day0=S.day;for(let d=day0;d<day0+180;d++){S.day=d;const ok=openStores().some(q=>q.id===sid);if(ok){S.day=day0;return d}}S.day=day0;return day0+180}

/* ---- Live Mall View ---- */
const LM={iv:null,cv:null,st:null};
function lmStores(){
  const open=openStores(),ids=open.map(s=>s.id);
  const parks=STORES.filter(s=>s.park);
  const closed=STORES.filter(s=>!s.park&&!s.drop&&ids.indexOf(s.id)<0);
  /* layout: up to 4 open on left/right of corridor, parks at end, closed as shuttered side pods */
  const L=[],R=[],spots=[];
  open.forEach((s,i)=>{(i%2?R:L).push({s:s,open:true})});
  parks.forEach((s,i)=>{(i%2?R:L).push({s:s,open:true,park:true})});
  closed.slice(0,8).forEach((s,i)=>{(i%2?R:L).push({s:s,open:false,next:nextOpenDay(s.id)})});
  const n=Math.max(L.length,R.length,1);
  for(let i=0;i<n;i++){if(L[i])spots.push(Object.assign({side:0,i:i},L[i]));if(R[i])spots.push(Object.assign({side:1,i:i},R[i]))}
  return{spots:spots,n:n,openN:open.length}
}
function lmStop(){if(LM.iv){cancelAnimationFrame(LM.iv);LM.iv=null}LM.st=null}
function lmDraw(x,W,H,st){
  const t=st.t,floorY=H*.62;x.save();x.globalAlpha=1;
  /* atrium ceiling + sky lights */
  x.fillStyle='#1a237e';x.fillRect(0,0,W,floorY);
  x.fillStyle='#283593';x.fillRect(0,0,W,28);
  for(let i=0;i<6;i++){const lx=20+i*(W/6);x.fillStyle=(Math.floor(t*2)+i)%5===0?'#fff59d':'#ffe082';x.strokeStyle=OUT;x.lineWidth=1.5;circ(x,lx,14,5);x.fill();x.stroke()}
  /* skylight */
  x.fillStyle='rgba(255,255,255,.12)';rr(x,W*.25,6,W*.5,22,6);x.fill();x.strokeStyle=OUT;x.lineWidth=1.5;x.stroke();
  /* floor tiles */
  x.fillStyle='#cfd8dc';x.fillRect(0,floorY,W,H-floorY);
  x.strokeStyle='#90a4ae';x.lineWidth=1;
  const scroll=(t*40)%28;for(let y=floorY-scroll;y<H;y+=28){x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}
  for(let xx=0;xx<W;xx+=28){x.beginPath();x.moveTo(xx,floorY);x.lineTo(xx,H);x.stroke()}
  /* center fountain */
  const fx=W/2,fy=floorY+18;x.fillStyle='#4fc3f7';x.strokeStyle=OUT;x.lineWidth=2;circ(x,fx,fy,16);x.fill();x.stroke();
  x.fillStyle='#81d4fa';circ(x,fx,fy-8-Math.sin(t*3)*3,5);x.fill();x.stroke();
  x.fillStyle='#fff';for(let i=0;i<4;i++){const a=t*2+i*1.5;circ(x,fx+Math.cos(a)*10,fy+Math.sin(a)*4-6,1.5);x.fill()}
  /* escalator in the back */
  const ex=W/2-30,ey=floorY-70;x.fillStyle='#607d8b';x.strokeStyle=OUT;x.lineWidth=2;rr(x,ex,ey,60,50,4);x.fill();x.stroke();
  x.fillStyle='#455a64';const off=(t*60)%10;for(let y=0;y<50;y+=10)x.fillRect(ex+4,ey+y+off,52,5);
  x.fillStyle='#ff8a80';rr(x,ex+22,ey+18+Math.sin(t*2)*6,16,20,4);x.fill();x.stroke();
  /* storefronts */
  const rowH=Math.min(70,(floorY-40)/Math.max(st.n,1));
  st.spots.forEach(sp=>{
    const w=78,h=rowH-6,X=sp.side?W-w-8:8,Y=36+sp.i*rowH;sp.r=[X,Y,w,h];
    x.fillStyle=sp.open?(sp.s.color||'#7c4dff'):'#546e7a';x.strokeStyle=OUT;x.lineWidth=2;rr(x,X,Y,w,h,6);x.fill();x.stroke();
    /* awning */
    x.fillStyle=sp.open?'#ef5350':'#78909c';x.beginPath();x.moveTo(X,Y);x.lineTo(X+w,Y);x.lineTo(X+w-4,Y-8);x.lineTo(X+4,Y-8);x.closePath();x.fill();x.stroke();
    if(sp.open){
      x.fillStyle='#fffde7';rr(x,X+6,Y+14,w-12,h-28,3);x.fill();x.stroke();
      x.fillStyle='#212121';x.font='800 10px system-ui';x.textAlign='center';x.fillText((sp.s.emoji||'🏪')+' '+(sp.s.name||'').slice(0,9),X+w/2,Y+28,w-10);
      x.font='700 8px system-ui';x.fillStyle='#5d4037';x.fillText(sp.park?'24/7':'OPEN',X+w/2,Y+h-8);
      /* blinking OPEN light */
      if(Math.floor(t*3)%2===0){x.fillStyle='#69f0ae';circ(x,X+w-10,Y+10,3);x.fill()}
    }else{
      /* shutters */
      x.fillStyle='#37474f';rr(x,X+5,Y+12,w-10,h-20,2);x.fill();x.stroke();
      x.strokeStyle='#263238';x.lineWidth=1;for(let yy=Y+16;yy<Y+h-10;yy+=5){x.beginPath();x.moveTo(X+6,yy);x.lineTo(X+w-6,yy);x.stroke()}
      x.fillStyle='#eceff1';x.font='800 9px system-ui';x.textAlign='center';x.fillText((sp.s.name||'').slice(0,10),X+w/2,Y+28,w-8);
      x.font='700 8px system-ui';x.fillStyle='#ffcc80';x.fillText('Opens Day '+sp.next,X+w/2,Y+h-8,w-8);
    }
  });
  /* walking NPCs on the concourse */
  st.npcs.forEach(n=>{
    n.x+=n.vx;if(n.x<-20)n.x=W+20;if(n.x>W+20)n.x=-20;
    const bob=Math.sin(t*6+n.ph)*2;x.fillStyle=n.c;x.strokeStyle=OUT;x.lineWidth=1.5;
    rr(x,n.x-6,floorY+30+bob,12,16,4);x.fill();x.stroke();
    x.fillStyle=n.skin;circ(x,n.x,floorY+24+bob,6);x.fill();x.stroke();
  });
  /* pigeons */
  st.birds.forEach(b=>{
    b.x+=b.vx;b.y+=Math.sin(t*3+b.ph)*.4;if(b.x>W+30){b.x=-20;b.y=40+Math.random()*80}
    x.fillStyle='#90a4ae';x.strokeStyle=OUT;x.lineWidth=1.5;ell(x,b.x,b.y,8,5);x.fill();x.stroke();
    x.fillStyle='#7e57c2';circ(x,b.x+6,b.y-2,4);x.fill();x.stroke();
    x.strokeStyle='#e65100';x.lineWidth=2;const flap=Math.sin(t*10+b.ph)>0?6:-2;line(x,b.x-4,b.y,b.x-10,b.y-flap);line(x,b.x+2,b.y,b.x+8,b.y-flap);
  });
  /* tip strip */
  x.fillStyle='rgba(29,26,43,.85)';rr(x,8,H-28,W-16,22,8);x.fill();
  x.fillStyle='#fff';x.font='700 11px system-ui';x.textAlign='center';x.fillText('Tap a storefront · '+st.openN+' open today · shutters show next open day',W/2,H-13,W-24);
  x.restore();
}
function liveMallSheet(){
  lmStop();
  const W=Math.min(360,window.innerWidth-36),H=Math.min(420,Math.floor(window.innerHeight*.62));
  const data=lmStores();
  sheet('<h3>🏬 Live Mall View</h3><div class="small">A living concourse. Watch the ambience, or tap a storefront to shop. Closed shops show shutters + the next day they open.</div><div id="livemallwrap" class="center"><canvas id="livemall"></canvas></div><button class="btn alt big" id="lmclassic">🗺️ Classic wing map</button>');
  const cv=$('#livemall'),x=setupCanvas(cv,W,H);
  const skins=['#f5c6a5','#c68642','#8d5524','#ffe0bd'],cols=['#ff8a80','#81d4fa','#a5d6a7','#ce93d8','#ffd54f','#ff4f9a'];
  LM.st={t:0,n:data.n,spots:data.spots,openN:data.openN,
    npcs:Array.from({length:5},(_,i)=>({x:Math.random()*W,vx:(Math.random()<.5?-1:1)*(0.4+Math.random()*0.7),c:cols[i%cols.length],skin:skins[i%skins.length],ph:Math.random()*6})),
    birds:Array.from({length:3},(_,i)=>({x:Math.random()*W,y:40+i*30,vx:.8+Math.random()*.6,ph:Math.random()*6}))};
  function frame(){if(!document.body.contains(cv)){lmStop();return}LM.st.t+=1/60;lmDraw(x,W,H,LM.st);LM.iv=requestAnimationFrame(frame)}
  frame();
  cv.onclick=ev=>{
    const b=cv.getBoundingClientRect(),sx=(ev.clientX-b.left)*(W/b.width),sy=(ev.clientY-b.top)*(H/b.height);
    const hit=LM.st.spots.filter(sp=>sx>=sp.r[0]&&sx<=sp.r[0]+sp.r[2]&&sy>=sp.r[1]&&sy<=sp.r[1]+sp.r[3])[0];
    if(!hit)return;sfx('click');
    if(!hit.open){toast('🔒 '+hit.s.name+' shutters are down. Opens Day '+hit.next+(hit.next===S.day?' (today!)':hit.next===S.day+1?' (tomorrow)':' ('+(hit.next-S.day)+' days)'));return}
    if(isBanned&&isBanned(hit.s.id)){sfx('bad');toast('🚫 Banned from '+hit.s.name);return}
    closeSheet();go('mall',hit.s.id);
  };
  $('#lmclassic').onclick=()=>{sfx('click');mapSheet()};
}
/* Wire Map quick button + atrium map button to Live Mall */
const _bindV13_29=bindV13;bindV13=function(){_bindV13_29();const m=$('#mapbtn');if(m){m.textContent='🏬 Live Mall';m.onclick=()=>{sfx('click');liveMallSheet()}}const q=$('#qaMap');if(q)q.onclick=()=>{sfx('click');liveMallSheet()}};

/* Hide Brayden Escalator Race during truce (keep friendly note) */
const _raceOpen29=raceOpen;raceOpen=function(){if(typeof truceOn==='function'&&truceOn())return null;return _raceOpen29()};
const _feudSheet29=feudSheet;feudSheet=function(){_feudSheet29();if(!(typeof truceOn==='function'&&truceOn()))return;const box=$('#racebox');if(box)box.innerHTML='<b>🏁 Escalator Race</b><div class="small">Paused during the truce. Brayden is being nice for once.</div>'};

function v29Fix(s){if(s.dark==null)s.dark=false}
