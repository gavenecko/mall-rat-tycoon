/* v30: parallax Live Mall View with detailed brand storefronts */
(function(){const st=document.createElement('style');st.textContent=
'#livemall{touch-action:none;border-radius:14px;border:3px solid #111;display:block;margin:0 auto;background:#1a237e;cursor:grab}'+
'#livemall.drag{cursor:grabbing}'+
'#livemallwrap{position:relative}'+
'#lmsbar{display:flex;gap:8px;margin-top:8px;align-items:center}'+
'#lmsbar .btn{flex:1}';document.head.appendChild(st)})();

const LM_SHOP_W=156,LM_GAP=18;
const LM_LOOK={
 frauda:{wall:'#1a1a1a',trim:'#d4af37',awn:'#111',win:'#2a2a2a',signBg:'#111',signInk:'#d4af37',motif:'bag'},
 goochie:{wall:'#0a6b3a',trim:'#c62828',awn:'#0a6b3a',win:'#e8f5e9',signBg:'#f5e6c8',signInk:'#0a6b3a',motif:'snake'},
 balence:{wall:'#37474f',trim:'#eceff1',awn:'#546e7a',win:'#cfd8dc',signBg:'#212121',signInk:'#fff',motif:'shoe'},
 vuitno:{wall:'#6b4a1e',trim:'#e7c48a',awn:'#5d4037',win:'#3e2723',signBg:'#6b4a1e',signInk:'#f4d9a8',motif:'mono'},
 shanel:{wall:'#111',trim:'#fff',awn:'#212121',win:'#fafafa',signBg:'#000',signInk:'#fff',motif:'bottle'},
 versnatchy:{wall:'#b8860b',trim:'#fff3c4',awn:'#8d6e00',win:'#fff8e1',signBg:'#b8860b',signInk:'#fff3c4',motif:'crown'},
 hermeez:{wall:'#e65100',trim:'#ffcc80',awn:'#bf360c',win:'#fff3e0',signBg:'#e65100',signInk:'#fff',motif:'orange'},
 dollar:{wall:'#2a9d3a',trim:'#ffeb3b',awn:'#1b5e20',win:'#fffde7',signBg:'#ffeb3b',signInk:'#1b5e20',motif:'tag'},
 wally:{wall:'#1f6fd1',trim:'#ffc220',awn:'#0d47a1',win:'#e3f2fd',signBg:'#1f6fd1',signInk:'#fff',motif:'cart'},
 ikeya:{wall:'#0051ba',trim:'#ffda1a',awn:'#003c8f',win:'#e3f2fd',signBg:'#ffda1a',signInk:'#0051ba',motif:'chair'},
 thrift:{wall:'#9b59b6',trim:'#f3e5f5',awn:'#6a1b9a',win:'#fce4ec',signBg:'#9b59b6',signInk:'#fff',motif:'hanger'},
 targit:{wall:'#cc0000',trim:'#fff',awn:'#8b0000',win:'#ffebee',signBg:'#cc0000',signInk:'#fff',motif:'bull'},
 worstbuy:{wall:'#0a2f8f',trim:'#ffe000',awn:'#061b54',win:'#e8eaf6',signBg:'#ffe000',signInk:'#0a2f8f',motif:'tv'},
 toysuhoh:{wall:'#e91e63',trim:'#fff',awn:'#ad1457',win:'#fce4ec',signBg:'#e91e63',signInk:'#fff',motif:'bear'},
 circlej:{wall:'#ff6f00',trim:'#212121',awn:'#e65100',win:'#fff8e1',signBg:'#212121',signInk:'#ff6f00',motif:'pump'},
 mattress:{wall:'#5c6bc0',trim:'#c5cae9',awn:'#3949ab',win:'#e8eaf6',signBg:'#5c6bc0',signInk:'#fff',motif:'bed'},
 clamazon:{wall:'#232f3e',trim:'#ff9900',awn:'#131a22',win:'#37475a',signBg:'#232f3e',signInk:'#ff9900',motif:'box'}
};
function lmLook(s){return LM_LOOK[s.id]||{wall:s.color||'#7c4dff',trim:'#fff',awn:s.color||'#7c4dff',win:'#fffde7',signBg:s.color||'#7c4dff',signInk:'#fff',motif:'star'}}

function lmBuildWorld(){
  const open=openStores(),oids=open.map(s=>s.id);
  const list=[];
  open.forEach(s=>list.push({s:s,open:true}));
  STORES.filter(s=>s.park).forEach(s=>list.push({s:s,open:true,park:true}));
  STORES.filter(s=>!s.park&&!s.drop&&oids.indexOf(s.id)<0).forEach(s=>list.push({s:s,open:false,next:nextOpenDay(s.id)}));
  /* pad a bit so ends feel like a mall wing */
  const shops=list.map((q,i)=>{
    const x=40+i*(LM_SHOP_W+LM_GAP);
    return Object.assign({x:x,w:LM_SHOP_W},q);
  });
  const worldW=40+list.length*(LM_SHOP_W+LM_GAP)+40;
  return{shops:shops,worldW:worldW,openN:open.length+STORES.filter(s=>s.park).length}
}

function lmMotif(x,X,Y,w,h,kind,ink){
  x.save();x.strokeStyle=OUT;x.lineWidth=1.5;x.fillStyle=ink||'#212121';
  const cx=X+w/2,cy=Y+h/2;
  if(kind==='bag'){rr(x,cx-14,cy-6,28,22,4);x.fill();x.stroke();x.beginPath();x.moveTo(cx-8,cy-6);x.quadraticCurveTo(cx,cy-18,cx+8,cy-6);x.stroke()}
  else if(kind==='snake'){x.beginPath();x.moveTo(cx-16,cy+8);x.bezierCurveTo(cx-8,cy-14,cx+8,cy+14,cx+16,cy-6);x.strokeStyle=ink;x.lineWidth=4;x.stroke();x.fillStyle='#c62828';circ(x,cx+16,cy-6,4);x.fill()}
  else if(kind==='shoe'){x.beginPath();x.moveTo(cx-16,cy+4);x.lineTo(cx+10,cy+4);x.quadraticCurveTo(cx+18,cy+4,cx+16,cy-4);x.lineTo(cx-6,cy-6);x.closePath();x.fill();x.stroke()}
  else if(kind==='mono'){for(let i=0;i<3;i++)for(let j=0;j<2;j++){x.fillStyle=ink;x.font='800 9px serif';x.textAlign='center';x.fillText('LV',cx-12+i*12,cy-4+j*14)}}
  else if(kind==='bottle'){rr(x,cx-6,cy-4,12,20,2);x.fill();x.stroke();x.fillRect(cx-3,cy-12,6,8);x.strokeRect(cx-3,cy-12,6,8);x.fillStyle='#d4af37';circ(x,cx,cy+2,3);x.fill()}
  else if(kind==='crown'){x.beginPath();x.moveTo(cx-14,cy+8);x.lineTo(cx-14,cy-4);x.lineTo(cx-6,cy+2);x.lineTo(cx,cy-10);x.lineTo(cx+6,cy+2);x.lineTo(cx+14,cy-4);x.lineTo(cx+14,cy+8);x.closePath();x.fill();x.stroke()}
  else if(kind==='orange'){x.fillStyle='#ff9800';circ(x,cx,cy,12);x.fill();x.stroke();x.fillStyle='#2e7d32';x.fillRect(cx-2,cy-16,4,6)}
  else if(kind==='tag'){x.fillStyle='#ffeb3b';rr(x,cx-16,cy-10,32,20,3);x.fill();x.stroke();x.fillStyle='#c62828';x.font='800 11px system-ui';x.textAlign='center';x.fillText('$1',cx,cy+4)}
  else if(kind==='cart'){x.strokeStyle=ink;x.lineWidth=2;rr(x,cx-12,cy-2,24,14,2);x.stroke();circ(x,cx-6,cy+16,3);x.stroke();circ(x,cx+8,cy+16,3);x.stroke();line(x,cx-12,cy-2,cx-16,cy-12)}
  else if(kind==='chair'){x.fillStyle=ink;rr(x,cx-10,cy-8,20,6,2);x.fill();x.stroke();x.fillRect(cx-10,cy-2,4,16);x.fillRect(cx+6,cy-2,4,16);x.strokeRect(cx-10,cy-2,4,16);x.strokeRect(cx+6,cy-2,4,16)}
  else if(kind==='hanger'){x.beginPath();x.arc(cx,cy-8,6,Math.PI,0);x.stroke();line(x,cx-14,cy-8,cx+14,cy-8);line(x,cx,cy-14,cx,cy-18)}
  else if(kind==='bull'){x.strokeStyle='#cc0000';x.lineWidth=3;circ(x,cx,cy,14);x.stroke();circ(x,cx,cy,8);x.stroke();x.fillStyle='#cc0000';circ(x,cx,cy,3);x.fill()}
  else if(kind==='tv'){rr(x,cx-18,cy-12,36,24,3);x.fill();x.stroke();x.fillStyle='#90caf9';rr(x,cx-14,cy-8,28,16,2);x.fill();x.fillStyle=ink;x.fillRect(cx-4,cy+12,8,6)}
  else if(kind==='bear'){x.fillStyle='#ffcc80';circ(x,cx,cy+2,12);x.fill();x.stroke();circ(x,cx-10,cy-8,5);x.fill();x.stroke();circ(x,cx+10,cy-8,5);x.fill();x.stroke();x.fillStyle='#5d4037';circ(x,cx-4,cy,2);x.fill();circ(x,cx+4,cy,2);x.fill()}
  else if(kind==='pump'){x.fillStyle='#212121';rr(x,cx-8,cy-14,16,28,3);x.fill();x.stroke();x.fillStyle='#ff6f00';rr(x,cx-5,cy-10,10,10,2);x.fill();line(x,cx+8,cy-4,cx+16,cy-8)}
  else if(kind==='bed'){rr(x,cx-18,cy,36,12,3);x.fill();x.stroke();rr(x,cx-18,cy-10,12,10,2);x.fill();x.stroke()}
  else if(kind==='box'){x.fillStyle='#ff9900';rr(x,cx-14,cy-8,28,20,2);x.fill();x.stroke();x.fillStyle='#232f3e';x.font='800 8px system-ui';x.textAlign='center';x.fillText('box',cx,cy+5)}
  else{x.fillStyle=ink;x.font='800 22px system-ui';x.textAlign='center';x.fillText('★',cx,cy+8)}
  x.restore();
}

function lmDrawShop(x,sp,baseY,t){
  const L=lmLook(sp.s),X=sp.x,W=sp.w,H=150,Y=baseY-H;
  sp.r=[X,Y,W,H];
  /* building body */
  x.fillStyle=L.wall;x.strokeStyle=OUT;x.lineWidth=2;rr(x,X,Y,W,H,6);x.fill();x.stroke();
  /* upper trim / cornice */
  x.fillStyle=L.trim;x.fillRect(X,Y,W,8);x.strokeRect(X,Y,W,8);
  /* awning */
  x.fillStyle=L.awn;x.beginPath();x.moveTo(X-4,Y+28);x.lineTo(X+W+4,Y+28);x.lineTo(X+W-6,Y+42);x.lineTo(X+6,Y+42);x.closePath();x.fill();x.stroke();
  for(let i=0;i<5;i++){x.fillStyle=i%2?L.trim:L.awn;x.fillRect(X+8+i*((W-16)/5),Y+28,(W-16)/5,3)}
  /* sign band */
  x.fillStyle=L.signBg;rr(x,X+8,Y+10,W-16,16,3);x.fill();x.stroke();
  x.fillStyle=L.signInk;x.font='800 11px system-ui';x.textAlign='center';x.fillText((sp.s.emoji||'')+' '+(sp.s.name||'').slice(0,12),X+W/2,Y+22,W-22);
  /* window */
  const wx=X+10,wy=Y+48,ww=W-20,wh=70;
  if(sp.open){
    x.fillStyle=L.win;rr(x,wx,wy,ww,wh,4);x.fill();x.stroke();
    /* window frame mullion */
    x.strokeStyle=OUT;x.lineWidth=1.5;line(x,wx+ww/2,wy,wx+ww/2,wy+wh);line(x,wx,wy+wh/2,wx+ww,wy+wh/2);
    lmMotif(x,wx,wy,ww/2,wh/2,L.motif,L.signInk==='#fff'?L.wall:L.signInk);
    /* second display item */
    x.fillStyle=L.trim;rr(x,wx+ww/2+8,wy+wh/2+8,ww/2-16,wh/2-16,3);x.fill();x.stroke();
    x.fillStyle=L.signInk==='#fff'?L.wall:L.signInk;x.font='800 10px system-ui';x.textAlign='center';x.fillText(sp.s.emoji||'•',wx+ww*3/4,wy+wh/2+28);
    /* door */
    x.fillStyle='#5d4037';rr(x,X+W/2-12,Y+H-32,24,30,3);x.fill();x.stroke();
    x.fillStyle='#ffd54f';circ(x,X+W/2+6,Y+H-16,2);x.fill();
    /* OPEN / 24-7 badge */
    const blink=Math.floor(t*3)%2===0;x.fillStyle=blink?'#69f0ae':'#00c853';rr(x,X+W-36,Y+H-22,28,14,4);x.fill();x.stroke();
    x.fillStyle='#1b5e20';x.font='800 8px system-ui';x.fillText(sp.park?'24/7':'OPEN',X+W-22,Y+H-12);
  }else{
    /* shutters */
    x.fillStyle='#455a64';rr(x,wx,wy,ww,wh+18,3);x.fill();x.stroke();
    x.strokeStyle='#263238';x.lineWidth=1.2;for(let yy=wy+4;yy<wy+wh+14;yy+=6){line(x,wx+2,yy,wx+ww-2,yy)}
    x.fillStyle='#ffcc80';x.font='800 10px system-ui';x.textAlign='center';x.fillText('CLOSED',X+W/2,wy+wh/2);
    x.font='700 9px system-ui';x.fillStyle='#fffde7';x.fillText('Opens Day '+sp.next,X+W/2,wy+wh/2+14,ww-8);
  }
  /* planter under window */
  x.fillStyle='#6d4c41';rr(x,X+6,Y+H-8,22,8,2);x.fill();x.stroke();
  x.fillStyle='#43a047';ell(x,X+17,Y+H-12,8,6);x.fill();x.stroke();
}

function lmDrawWorld(x,W,H,st){
  const cam=st.cam,t=st.t,floorY=H*0.72;
  x.save();x.globalAlpha=1;
  /* ---- FAR layer (parallax 0.25): night/day atrium sky + distant structure ---- */
  const far=cam*0.25;
  x.fillStyle='#1a237e';x.fillRect(0,0,W,floorY);
  x.fillStyle='#283593';x.fillRect(0,0,W,36);
  for(let i=-1;i<10;i++){const lx=((i*70-far)%(W+70));x.fillStyle=(Math.floor(t*2)+i)%4===0?'#fff59d':'#ffe082';x.strokeStyle=OUT;x.lineWidth=1.5;circ(x,lx,16,5);x.fill();x.stroke()}
  /* skylight panes */
  x.fillStyle='#4fc3f7';x.strokeStyle=OUT;x.lineWidth=2;
  for(let i=-1;i<6;i++){const sx=i*90-far*0.5;rr(x,sx,4,70,28,4);x.fill();x.stroke()}

  /* ---- MID-BACK (parallax 0.5): second-story railing ---- */
  const mid=cam*0.5;
  x.fillStyle='#3949ab';x.fillRect(0,36,W,40);
  x.strokeStyle='#c5cae9';x.lineWidth=2;for(let i=-1;i<20;i++){const rx=i*28-mid;line(x,rx,40,rx,72);line(x,rx,40,rx+28,40)}
  x.fillStyle='#5c6bc0';x.fillRect(0,72,W,6);

  /* ---- STOREFRONT layer (parallax 1.0) ---- */
  x.save();x.translate(-cam,0);
  st.shops.forEach(sp=>lmDrawShop(x,sp,floorY,t));
  /* benches between shops */
  st.shops.forEach((sp,i)=>{if(i%2)return;const bx=sp.x+sp.w+4;x.fillStyle='#8d6e63';x.strokeStyle=OUT;x.lineWidth=1.5;rr(x,bx,floorY-18,LM_GAP-8,10,2);x.fill();x.stroke();x.fillRect(bx+2,floorY-8,3,8);x.fillRect(bx+LM_GAP-15,floorY-8,3,8)});
  x.restore();

  /* ---- FLOOR (parallax 1.05) ---- */
  const fl=cam*1.05;
  x.fillStyle='#b0bec5';x.fillRect(0,floorY,W,H-floorY);
  x.strokeStyle='#78909c';x.lineWidth=1;
  for(let i=-1;i<30;i++){const xx=i*32-(fl%32);line(x,xx,floorY,xx,H)}
  for(let y=floorY;y<H;y+=24)line(x,0,y,W,y);
  /* center strip */
  x.fillStyle='#90a4ae';x.fillRect(0,floorY+H*0.12,W,10);

  /* fountain (screen-fixed landmark near start) */
  if(cam<W){const fx=W*0.5-cam*0.15,fy=floorY+22;x.fillStyle='#4fc3f7';x.strokeStyle=OUT;x.lineWidth=2;circ(x,fx,fy,14);x.fill();x.stroke();x.fillStyle='#81d4fa';circ(x,fx,fy-6-Math.sin(t*3)*3,4);x.fill()}

  /* ---- FOREGROUND actors (parallax 1.2) ---- */
  const fg=cam*1.2;
  st.npcs.forEach(n=>{
    n.wx+=n.vx;if(n.wx<-40)n.wx=st.worldW+40;if(n.wx>st.worldW+40)n.wx=-40;
    const sx=n.wx-fg,bob=Math.sin(t*6+n.ph)*2;if(sx<-20||sx>W+20)return;
    x.fillStyle=n.c;x.strokeStyle=OUT;x.lineWidth=1.5;rr(x,sx-7,floorY+28+bob,14,18,4);x.fill();x.stroke();
    x.fillStyle=n.skin;circ(x,sx,floorY+22+bob,6);x.fill();x.stroke();
  });
  st.birds.forEach(b=>{
    b.wx+=b.vx;if(b.wx>st.worldW+40)b.wx=-20;
    const sx=b.wx-cam*0.9,sy=50+Math.sin(t*3+b.ph)*8;if(sx<-20||sx>W+20)return;
    x.fillStyle='#90a4ae';x.strokeStyle=OUT;x.lineWidth=1.5;ell(x,sx,sy,9,5);x.fill();x.stroke();
    x.fillStyle='#7e57c2';circ(x,sx+6,sy-2,4);x.fill();x.stroke();
    const flap=Math.sin(t*10+b.ph)>0?7:-2;x.strokeStyle='#e65100';x.lineWidth=2;line(x,sx-4,sy,sx-11,sy-flap);line(x,sx+2,sy,sx+9,sy-flap);
  });

  /* HUD chrome */
  x.fillStyle='rgba(29,26,43,.88)';rr(x,8,H-30,W-16,24,8);x.fill();
  x.fillStyle='#fff';x.font='700 11px system-ui';x.textAlign='center';
  x.fillText('⟷ Drag / swipe to walk the mall · '+st.openN+' open · tap a shop',W/2,H-14,W-24);
  /* edge fade hints */
  if(cam>4){x.fillStyle='#1a237e';x.globalAlpha=.35;x.fillRect(0,0,18,H);x.globalAlpha=1}
  if(cam<st.worldW-W-4){x.fillStyle='#1a237e';x.globalAlpha=.35;x.fillRect(W-18,0,18,H);x.globalAlpha=1}
  x.restore();
}

function liveMallSheet(){
  lmStop();
  const W=Math.min(380,window.innerWidth-28),H=Math.min(460,Math.floor(window.innerHeight*.68));
  const world=lmBuildWorld();
  sheet('<h3>🏬 Live Mall View</h3><div class="small">Walk the concourse — drag to scroll. Parallax layers + real storefronts. Closed shops show shutters &amp; the next day they open.</div><div id="livemallwrap" class="center"><canvas id="livemall"></canvas></div><div id="lmsbar"><button class="btn alt" id="lmleft">◀</button><button class="btn alt big" id="lmclassic">🗺️ Classic map</button><button class="btn alt" id="lmright">▶</button></div>');
  const cv=$('#livemall'),x=setupCanvas(cv,W,H);
  const skins=['#f5c6a5','#c68642','#8d5524','#ffe0bd'],cols=['#ff8a80','#81d4fa','#a5d6a7','#ce93d8','#ffd54f','#ff4f9a','#80cbc4'];
  LM.st={t:0,cam:0,maxCam:Math.max(0,world.worldW-W),worldW:world.worldW,shops:world.shops,openN:world.openN,drag:null,vel:0,
    npcs:Array.from({length:7},(_,i)=>({wx:40+i*90+Math.random()*40,vx:(Math.random()<.5?-1:1)*(.35+Math.random()*.6),c:cols[i%cols.length],skin:skins[i%skins.length],ph:Math.random()*6})),
    birds:Array.from({length:4},(_,i)=>({wx:60+i*120,vx:.7+Math.random()*.5,ph:Math.random()*6}))};
  function frame(){if(!document.body.contains(cv)){lmStop();return}
    LM.st.t+=1/60;if(!LM.st.drag&&LM.st.vel){LM.st.cam=Math.max(0,Math.min(LM.st.maxCam,LM.st.cam+LM.st.vel));LM.st.vel*=.92;if(Math.abs(LM.st.vel)<.05)LM.st.vel=0}
    lmDrawWorld(x,W,H,LM.st);LM.iv=requestAnimationFrame(frame)}
  frame();
  const clamp=()=>{LM.st.cam=Math.max(0,Math.min(LM.st.maxCam,LM.st.cam))};
  cv.addEventListener('pointerdown',ev=>{cv.setPointerCapture(ev.pointerId);LM.st.drag={x:ev.clientX,cam:LM.st.cam,moved:0};LM.st.vel=0;cv.classList.add('drag')});
  cv.addEventListener('pointermove',ev=>{if(!LM.st.drag)return;const dx=ev.clientX-LM.st.drag.x;LM.st.drag.moved+=Math.abs(dx);LM.st.cam=LM.st.drag.cam-dx;clamp();LM.st.drag.x=ev.clientX;LM.st.drag.cam=LM.st.cam;LM.st.vel=-dx});
  const up=ev=>{if(!LM.st.drag)return;const moved=LM.st.drag.moved;cv.classList.remove('drag');LM.st.drag=null;if(moved>8){LM.st._skipClick=1;return}
    const b=cv.getBoundingClientRect(),sx=(ev.clientX-b.left)*(W/b.width),sy=(ev.clientY-b.top)*(H/b.height);
    const hit=LM.st.shops.filter(sp=>{const r=sp.r;return r&&sx>=r[0]-LM.st.cam&&sx<=r[0]-LM.st.cam+r[2]&&sy>=r[1]&&sy<=r[1]+r[3]})[0];
    if(!hit)return;sfx('click');
    if(!hit.open){toast('🔒 '+hit.s.name+' shutters are down. Opens Day '+hit.next+(hit.next===S.day?' (today!)':hit.next===S.day+1?' (tomorrow)':' ('+(hit.next-S.day)+' days)'));return}
    if(typeof isBanned==='function'&&isBanned(hit.s.id)){sfx('bad');toast('🚫 Banned from '+hit.s.name);return}
    closeSheet();go('mall',hit.s.id)};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',()=>{LM.st.drag=null;cv.classList.remove('drag')});cv.addEventListener('click',ev=>{if(LM.st&&LM.st._skipClick){LM.st._skipClick=0;return}up(ev)});
  const key=ev=>{if(!document.body.contains(cv)){document.removeEventListener('keydown',key);return}
    if(ev.key==='ArrowLeft'||ev.key==='a'){LM.st.cam-=40;clamp();ev.preventDefault()}
    if(ev.key==='ArrowRight'||ev.key==='d'){LM.st.cam+=40;clamp();ev.preventDefault()}};
  document.addEventListener('keydown',key);
  $('#lmleft').onclick=()=>{LM.st.cam-=80;clamp();sfx('click')};
  $('#lmright').onclick=()=>{LM.st.cam+=80;clamp();sfx('click')};
  $('#lmclassic').onclick=()=>{sfx('click');mapSheet()};
}
function v30Fix(s){}
