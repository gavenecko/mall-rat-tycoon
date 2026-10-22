/* ================ DRAWING: FURNITURE & DECOR (box space) ================ */
function pb(x,it,lw){x.fillStyle=fillOf(x,it);x.fill();x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=lw||1.2;x.stroke()}
function drawFurn(x,it,X,Y,W,H){
  if(it.surf){drawSurface(x,it,X,Y,W,H,W/4);return}if(it.ext){drawExtThumb(x,it,X,Y,W,H);return}if(HOME_DRAW[it.shape]){HOME_DRAW[it.shape](x,it,X,Y,W,H);return}
  const s=it.shape,u=Math.min(W,H),lw=Math.max(1,u/60);x.lineWidth=lw;x.lineCap='round';
  const dark=a=>{x.fillStyle='rgba(0,0,0,'+a+')';x.fill()};
  switch(s){
  case 'sofa':rr(x,X+.06*W,Y+.12*H,.88*W,.5*H,u*.12);pb(x,it,lw);rr(x,X+.06*W,Y+.52*H,.88*W,.32*H,u*.08);pb(x,it,lw);dark(.12);
    rr(x,X,Y+.32*H,.13*W,.55*H,u*.08);pb(x,it,lw);rr(x,X+.87*W,Y+.32*H,.13*W,.55*H,u*.08);pb(x,it,lw);x.strokeStyle='rgba(0,0,0,.3)';line(x,X+W/2,Y+.55*H,X+W/2,Y+.82*H);
    x.fillStyle='#4e342e';x.fillRect(X+.1*W,Y+.86*H,.05*W,.1*H);x.fillRect(X+.85*W,Y+.86*H,.05*W,.1*H);break;
  case 'bed':rr(x,X+.04*W,Y+.02*H,.92*W,.24*H,u*.06);x.fillStyle='#8d6e63';x.fill();x.stroke();rr(x,X+.08*W,Y+.14*H,.84*W,.82*H,u*.06);x.fillStyle='#fff';x.fill();x.stroke();
    rr(x,X+.13*W,Y+.18*H,.32*W,.16*H,u*.05);x.fillStyle='#f3f3f3';x.fill();x.stroke();rr(x,X+.55*W,Y+.18*H,.32*W,.16*H,u*.05);x.fill();x.stroke();
    rr(x,X+.08*W,Y+.42*H,.84*W,.54*H,u*.06);pb(x,it,lw);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(X+.08*W,Y+.42*H,.84*W,.06*H);break;
  case 'chair':rr(x,X+.25*W,Y+.08*H,.5*W,.5*H,u*.08);pb(x,it,lw);rr(x,X+.18*W,Y+.52*H,.64*W,.16*H,u*.05);pb(x,it,lw);dark(.15);
    x.strokeStyle='#4e342e';x.lineWidth=u*.05;line(x,X+.24*W,Y+.68*H,X+.22*W,Y+.95*H);line(x,X+.76*W,Y+.68*H,X+.78*W,Y+.95*H);break;
  case 'table':x.strokeStyle=tint(it.color,.6);x.lineWidth=u*.08;line(x,X+.12*W,Y+.45*H,X+.12*W,Y+.95*H);line(x,X+.88*W,Y+.45*H,X+.88*W,Y+.95*H);
    rr(x,X+.03*W,Y+.3*H,.94*W,.2*H,u*.05);pb(x,it,lw);break;
  case 'bookshelf':rr(x,X+.06*W,Y+.02*H,.88*W,.96*H,u*.04);pb(x,it,lw);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(X+.14*W,Y+.06*H,.72*W,.88*H);
    for(let r=0;r<4;r++){const sy=Y+.06*H+r*.22*H;['#e53935','#1e88e5','#fdd835','#43a047','#8e24aa'].forEach((c,i)=>{x.fillStyle=c;x.fillRect(X+.16*W+i*.13*W,sy+.04*H,.1*W,.16*H)});x.fillStyle=it.color;x.fillRect(X+.12*W,sy+.2*H,.76*W,.02*H)}break;
  case 'bathtub':rr(x,X+.04*W,Y+.25*H,.92*W,.6*H,u*.25);pb(x,it,lw);rr(x,X+.1*W,Y+.3*H,.8*W,.2*H,u*.1);x.fillStyle='#b3e5fc';x.fill();
    x.fillStyle='#fff';circ(x,X+.3*W,Y+.33*H,u*.06);x.fill();circ(x,X+.4*W,Y+.31*H,u*.05);x.fill();x.strokeStyle='#9e9e9e';x.lineWidth=u*.06;line(x,X+.88*W,Y+.3*H,X+.88*W,Y+.08*H);line(x,X+.88*W,Y+.08*H,X+.78*W,Y+.12*H);
    x.fillStyle='#9e9e9e';x.fillRect(X+.12*W,Y+.85*H,.06*W,.1*H);x.fillRect(X+.82*W,Y+.85*H,.06*W,.1*H);break;
  case 'plant':x.fillStyle='#43a047';[[-.2,-.1],[.2,-.1],[0,-.25],[-.12,-.3],[.14,-.32]].forEach(p=>{x.beginPath();x.ellipse(X+(.5+p[0])*W,Y+(.5+p[1])*H,u*.1,u*.22,p[0]*3,0,Math.PI*2);x.fill()});
    poly(x,[X+.25*W,Y+.55*H,X+.75*W,Y+.55*H,X+.66*W,Y+.95*H,X+.34*W,Y+.95*H]);pb(x,it,lw);break;
  case 'lamp':{const g=x.createRadialGradient(X+.5*W,Y+.3*H,1,X+.5*W,Y+.3*H,u*.5);g.addColorStop(0,'rgba(255,240,150,.7)');g.addColorStop(1,'rgba(255,240,150,0)');x.fillStyle=g;x.fillRect(X,Y,W,H);
    x.strokeStyle='#555';x.lineWidth=u*.04;line(x,X+.5*W,Y+.35*H,X+.5*W,Y+.92*H);x.fillStyle='#555';ell(x,X+.5*W,Y+.93*H,u*.18,u*.04);x.fill();
    poly(x,[X+.32*W,Y+.08*H,X+.68*W,Y+.08*H,X+.8*W,Y+.38*H,X+.2*W,Y+.38*H]);pb(x,it,lw);break}
  case 'rug':rr(x,X+.06*W,Y+.06*H,.88*W,.88*H,u*.1);pb(x,it,lw);rr(x,X+.14*W,Y+.14*H,.72*W,.72*H,u*.06);x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=u*.02;x.stroke();
    x.strokeStyle=tint(it.color,.7);x.lineWidth=lw;for(let i=.1;i<.92;i+=.06){line(x,X+i*W,Y+.06*H,X+i*W,Y+.01*H);line(x,X+i*W,Y+.94*H,X+i*W,Y+.99*H)}break;
  case 'tv':x.strokeStyle='#333';x.lineWidth=u*.06;line(x,X+.35*W,Y+.8*H,X+.3*W,Y+.97*H);line(x,X+.65*W,Y+.8*H,X+.7*W,Y+.97*H);rr(x,X+.08*W,Y+.05*H,.84*W,.78*H,u*.06);pb(x,it,lw);
    {const g=x.createLinearGradient(0,Y+.12*H,0,Y+.75*H);g.addColorStop(0,'#4fc3f7');g.addColorStop(1,'#81c784');x.fillStyle=g;x.fillRect(X+.13*W,Y+.12*H,.74*W,.63*H);
    x.fillStyle='#fdd835';circ(x,X+.72*W,Y+.28*H,u*.1);x.fill()}break;
  case 'fishtank':rr(x,X+.1*W,Y+.65*H,.8*W,.3*H,u*.04);pb(x,it,lw);rr(x,X+.08*W,Y+.12*H,.84*W,.55*H,u*.05);x.fillStyle='rgba(129,212,250,.85)';x.fill();x.strokeStyle='#607d8b';x.stroke();
    x.fillStyle='#ff9800';[[.35,.35],[.62,.5]].forEach(p=>{const fx=X+p[0]*W,fy=Y+p[1]*H;ell(x,fx,fy,u*.08,u*.05);x.fill();poly(x,[fx+u*.07,fy,fx+u*.13,fy-u*.05,fx+u*.13,fy+u*.05]);x.fill()});break;
  case 'painting':rr(x,X+.1*W,Y+.12*H,.8*W,.7*H,u*.03);pb(x,it,lw);x.fillStyle='#fff8e1';x.fillRect(X+.18*W,Y+.2*H,.64*W,.54*H);
    x.fillStyle='#ffb300';circ(x,X+.65*W,Y+.33*H,u*.07);x.fill();x.fillStyle='#5c6bc0';poly(x,[X+.18*W,Y+.74*H,X+.4*W,Y+.38*H,X+.6*W,Y+.74*H]);x.fill();x.fillStyle='#7986cb';poly(x,[X+.45*W,Y+.74*H,X+.62*W,Y+.5*H,X+.82*W,Y+.74*H]);x.fill();break;
  case 'clock':circ(x,X+.5*W,Y+.45*H,u*.36);pb(x,it,lw*2);circ(x,X+.5*W,Y+.45*H,u*.29);x.fillStyle='#fff';x.fill();x.strokeStyle='#222';x.lineWidth=u*.04;
    line(x,X+.5*W,Y+.45*H,X+.5*W,Y+.25*H);line(x,X+.5*W,Y+.45*H,X+.64*W,Y+.5*H);break;
  case 'curtains':rr(x,X+.12*W,Y+.1*H,.76*W,.8*H,u*.04);x.fillStyle='#b3e5fc';x.fill();x.strokeStyle='#fff';x.lineWidth=u*.06;x.stroke();line(x,X+.5*W,Y+.1*H,X+.5*W,Y+.9*H);line(x,X+.12*W,Y+.5*H,X+.88*W,Y+.5*H);
    x.fillStyle='#555';x.fillRect(X+.02*W,Y+.04*H,.96*W,.05*H);
    poly(x,[X+.04*W,Y+.08*H,X+.24*W,Y+.08*H,X+.16*W,Y+.95*H,X+.04*W,Y+.95*H]);pb(x,it,lw);poly(x,[X+.96*W,Y+.08*H,X+.76*W,Y+.08*H,X+.84*W,Y+.95*H,X+.96*W,Y+.95*H]);pb(x,it,lw);break;
  case 'poster':rr(x,X+.18*W,Y+.08*H,.64*W,.8*H,u*.02);pb(x,it,lw);x.fillStyle=lum(it.color)>.6?'#222':'#fff';x.font='bold '+(u*.34)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('★',X+.5*W,Y+.45*H);break;
  case 'console':x.fillStyle='#6d4c41';rr(x,X+.05*W,Y+.55*H,.9*W,.4*H,u*.04);x.fill();rr(x,X+.2*W,Y+.62*H,.6*W,.14*H,u*.03);pb(x,it,lw);x.fillStyle='#00e5ff';x.fillRect(X+.25*W,Y+.68*H,.2*W,.02*H);
    rr(x,X+.22*W,Y+.22*H,.56*W,.22*H,u*.1);pb(x,it,lw);x.fillStyle='#222';circ(x,X+.35*W,Y+.33*H,u*.045);x.fill();x.fillStyle='#e53935';circ(x,X+.62*W,Y+.3*H,u*.03);x.fill();x.fillStyle='#43a047';circ(x,X+.69*W,Y+.36*H,u*.03);x.fill();break;
  case 'phone':x.fillStyle='#bdbdbd';rr(x,X+.28*W,Y+.78*H,.44*W,.17*H,u*.03);x.fill();rr(x,X+.33*W,Y+.1*H,.34*W,.66*H,u*.08);pb(x,it,lw);x.fillStyle='#1a237e';rr(x,X+.37*W,Y+.16*H,.26*W,.52*H,u*.04);x.fill();
    ['#ff5252','#ffd740','#69f0ae','#40c4ff'].forEach((c,i)=>{x.fillStyle=c;x.fillRect(X+(.4+(i%2)*.11)*W,Y+(.22+Math.floor(i/2)*.12)*H,.08*W,.08*H)});break;
  case 'speaker':rr(x,X+.28*W,Y+.08*H,.44*W,.87*H,u*.08);pb(x,it,lw);x.fillStyle='#222';circ(x,X+.5*W,Y+.32*H,u*.11);x.fill();circ(x,X+.5*W,Y+.7*H,u*.16);x.fill();x.fillStyle='#666';circ(x,X+.5*W,Y+.7*H,u*.06);x.fill();x.fillStyle='#40c4ff';x.fillRect(X+.4*W,Y+.12*H,.2*W,.02*H);break;
  case 'arcade':rr(x,X+.1*W,Y+.04*H,.8*W,.92*H,u*.06);pb(x,it,lw);x.fillStyle='#111';rr(x,X+.18*W,Y+.12*H,.64*W,.3*H,u*.04);x.fill();x.fillStyle='#76ff03';
    [[1,0],[4,0],[0,1],[1,1],[2,1],[3,1],[4,1],[0,2],[2,2],[4,2]].forEach(p=>x.fillRect(X+(.32+p[0]*.07)*W,Y+(.2+p[1]*.04)*H,.06*W,.035*H));
    x.fillStyle='#333';x.fillRect(X+.06*W,Y+.47*H,.88*W,.1*H);x.fillStyle='#e53935';circ(x,X+.3*W,Y+.5*H,u*.07);x.fill();x.fillStyle='#ffeb3b';circ(x,X+.6*W,Y+.52*H,u*.05);x.fill();x.fillStyle='#2196f3';circ(x,X+.75*W,Y+.52*H,u*.05);x.fill();break;
  case 'laptop':x.fillStyle='#8d6e63';x.fillRect(X+.08*W,Y+.62*H,.84*W,.08*H);x.fillRect(X+.12*W,Y+.7*H,.06*W,.26*H);x.fillRect(X+.82*W,Y+.7*H,.06*W,.26*H);
    poly(x,[X+.24*W,Y+.18*H,X+.76*W,Y+.18*H,X+.73*W,Y+.55*H,X+.27*W,Y+.55*H]);pb(x,it,lw);x.fillStyle='#4fc3f7';poly(x,[X+.29*W,Y+.23*H,X+.71*W,Y+.23*H,X+.69*W,Y+.5*H,X+.31*W,Y+.5*H]);x.fill();rr(x,X+.18*W,Y+.55*H,.64*W,.07*H,u*.02);pb(x,it,lw);break;
  case 'vr':x.strokeStyle='#555';x.lineWidth=u*.05;line(x,X+.5*W,Y+.5*H,X+.5*W,Y+.92*H);x.fillStyle='#555';ell(x,X+.5*W,Y+.93*H,u*.2,u*.05);x.fill();
    x.strokeStyle='#333';x.lineWidth=u*.05;x.beginPath();x.arc(X+.5*W,Y+.38*H,u*.3,Math.PI,0);x.stroke();rr(x,X+.2*W,Y+.25*H,.6*W,.28*H,u*.1);pb(x,it,lw);x.fillStyle='#111';rr(x,X+.26*W,Y+.31*H,.48*W,.14*H,u*.06);x.fill();x.fillStyle='rgba(120,200,255,.6)';x.fillRect(X+.3*W,Y+.33*H,.15*W,.03*H);break;
  case 'gamingpc':rr(x,X+.28*W,Y+.08*H,.44*W,.86*H,u*.05);pb(x,it,lw);x.fillStyle='#111';rr(x,X+.33*W,Y+.14*H,.34*W,.72*H,u*.03);x.fill();
    {const g=x.createLinearGradient(X+.33*W,0,X+.67*W,0);['#ff1744','#ffea00','#00e676','#2979ff','#d500f9'].forEach((c,i)=>g.addColorStop(i/4,c));x.strokeStyle=g;x.lineWidth=u*.03;x.strokeRect(X+.35*W,Y+.16*H,.3*W,.68*H);
    x.strokeStyle='#888';x.lineWidth=u*.015;[.35,.6].forEach(f=>{circ(x,X+.5*W,Y+f*H,u*.09);x.stroke()})}break;
  case 'wallshelf':rr(x,X+.05*W,Y+.62*H,.9*W,.12*H,u*.03);pb(x,it,lw);x.fillStyle='#795548';poly(x,[X+.15*W,Y+.74*H,X+.22*W,Y+.74*H,X+.15*W,Y+.9*H]);x.fill();poly(x,[X+.85*W,Y+.74*H,X+.78*W,Y+.74*H,X+.85*W,Y+.9*H]);x.fill();
    ['#e53935','#1e88e5','#fdd835'].forEach((c,i)=>{x.fillStyle=c;x.fillRect(X+(.15+i*.07)*W,Y+.3*H,.06*W,.32*H)});x.fillStyle='#8d6e63';x.fillRect(X+.62*W,Y+.45*H,.14*W,.17*H);x.fillStyle='#43a047';circ(x,X+.69*W,Y+.4*H,u*.12);x.fill();break;
  }
}
/* thumbnails reuse the exact avatar/room draw code, cached as data URLs */
const BBOX={hats:[-52,-10,104,60],tops:[-36,72,72,52],bottoms:[-30,110,60,46],shoes:[-24,132,48,32],sunglasses:[-24,44,48,22],chain:[-18,74,36,26],handbag:[6,80,40,50],watch:[-35,108,24,16],scarf:[-20,72,40,40]};
const THUMB={};
function thumb(it){
  if(THUMB[it.id])return THUMB[it.id];
  const N=160,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');
  const RB=RAR_BG[rarity(it)],gb=x.createRadialGradient(N/2,N*.42,8,N/2,N/2,N*.75);gb.addColorStop(0,lum(it.color)>.85?'#e4e2ee':RB[0]);gb.addColorStop(1,RB[1]);x.fillStyle=gb;rr(x,0,0,N,N,26);x.fill();
  x.fillStyle='rgba(255,255,255,.45)';ell(x,N*.3,N*.18,N*.28,N*.08);x.fill();
  x.fillStyle='rgba(40,20,60,.16)';ell(x,N/2,N*.9,N*.3,N*.045);x.fill();
  x.save();x.shadowColor='rgba(40,20,60,.28)';x.shadowBlur=8;x.shadowOffsetY=4;
  if(it.slot){const bb=BBOX[it.slot==='accessories'?it.shape:it.slot],sc=Math.min(N/bb[2],N/bb[3])*.8,b=BODIES.average,sk='#f6c89f';
    x.translate(N/2,N/2);x.scale(sc,sc);x.translate(-(bb[0]+bb[2]/2),-(bb[1]+bb[3]/2));
    if(it.slot==='hats')drawHat(x,it);else if(it.slot==='tops')drawTop(x,it,b,sk);else if(it.slot==='bottoms')drawBottom(x,it,b);else if(it.slot==='shoes')drawShoes(x,it,b,sk);else drawAcc(x,it,b)}
  else{const u=N*.82/Math.max(it.w,it.h),W=u*it.w,H=u*it.h;drawFurn(x,it,(N-W)/2,(N-H)/2,W,H)}
  x.restore();return THUMB[it.id]=c.toDataURL();
}
