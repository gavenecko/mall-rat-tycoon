/* ====================== DRAWING: PRIMITIVES ====================== */
function rr(x,X,Y,W,H,R){R=Math.max(0,Math.min(R,W/2,H/2));x.beginPath();x.moveTo(X+R,Y);x.arcTo(X+W,Y,X+W,Y+H,R);x.arcTo(X+W,Y+H,X,Y+H,R);x.arcTo(X,Y+H,X,Y,R);x.arcTo(X,Y,X+W,Y,R);x.closePath()}
function circ(x,cx,cy,r){x.beginPath();x.arc(cx,cy,r,0,Math.PI*2)}
function ell(x,cx,cy,rx,ry){x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,Math.PI*2)}
function poly(x,p){x.beginPath();x.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)x.lineTo(p[i],p[i+1]);x.closePath()}
function line(x,a,b,c,d){x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()}
function lum(h){const n=parseInt(h.slice(1),16);return((n>>16&255)*.299+(n>>8&255)*.587+(n&255)*.114)/255}
function tint(h,f){const n=parseInt(h.slice(1),16);const c=v=>Math.max(0,Math.min(255,Math.round(v*f)));return'rgb('+c(n>>16&255)+','+c(n>>8&255)+','+c(n&255)+')'}
const PAT={};
function fillOf(x,it){
  if(!it.pattern)return it.color;
  const k=it.color+it.pattern;
  if(!PAT[k]){const c=document.createElement('canvas');c.width=c.height=12;const g=c.getContext('2d');g.fillStyle=it.color;g.fillRect(0,0,12,12);
    g.fillStyle=lum(it.color)>.6?'rgba(0,0,0,.3)':'rgba(255,255,255,.6)';
    if(it.pattern==='stripes')g.fillRect(0,0,12,4);
    else if(it.pattern==='dots'){circ(g,3,3,1.8);g.fill();circ(g,9,9,1.8);g.fill()}
    else if(it.pattern==='checks'){g.fillRect(0,0,6,6);g.fillRect(6,6,6,6)}
    else if(it.pattern==='sparkle'){g.fillStyle='#fff';g.fillRect(2.5,1,1,5);g.fillRect(1,3,5,1);g.fillStyle='#ffe066';g.fillRect(8.5,6,1,5);g.fillRect(6.5,8,5,1)}
    PAT[k]=c}
  return x.createPattern(PAT[k],'repeat');
}
function shadeGrad(x){const g=x.createLinearGradient(-30,40,30,150);g.addColorStop(0,'rgba(255,255,255,.2)');g.addColorStop(.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.22)');return g}
function paint(x,it,noShade){x.fillStyle=fillOf(x,it);x.fill();if(!noShade){x.fillStyle=shadeGrad(x);x.fill()}x.lineWidth=1.2;x.strokeStyle='rgba(0,0,0,.45)';x.stroke()}

/* ================== DRAWING: AVATAR (layered chibi) ==================
   Avatar space: x centered on 0, y 0 (hat top) .. 162 (soles). Head center (0,48) r30.
   These same layer functions draw the shop thumbnails, so items always look like their names. */
const UNDIES={color:'#8fb3e0',pattern:'',shape:'shorts'}, UNDERSHIRT={color:'#ffffff',pattern:'',shape:'tank'};
const torsoPts=(b,e)=>[-b.sh+2-e,81,b.sh-2+e,81,b.sh+1+e,88,b.sh-1+e,106,b.hip+1+e,121,-b.hip-1-e,121,-b.sh+1-e,106,-b.sh-1-e,88];
function drawBody(x,b,skin){
  x.lineCap='round';const lw=b.hip-2.5;x.fillStyle=skin;
  rr(x,-b.hip+.5,114,lw,40,4);x.fill();rr(x,2,114,lw,40,4);x.fill();
  [-1,1].forEach(f=>{x.strokeStyle=tint(skin,.82);x.lineWidth=10;line(x,f*(b.sh+1),89,f*(b.sh+6),117);x.strokeStyle=skin;x.lineWidth=8;line(x,f*(b.sh+1),89,f*(b.sh+6),117);
    x.fillStyle=skin;circ(x,f*(b.sh+6.5),120,4.8);x.fill()});
  x.fillStyle=tint(skin,.88);x.fillRect(-6,70,12,14);
  x.fillStyle=skin;poly(x,torsoPts(b,0));x.fill();
}
function drawBottom(x,it,b){
  const h=b.hip,s=it.shape;
  if(s==='skirt'){poly(x,[-h+1,113,h-1,113,h+9,141,-h-9,141]);paint(x,it);x.strokeStyle='rgba(0,0,0,.2)';x.lineWidth=1;[-.5,0,.5].forEach(t=>line(x,t*h*.6,116,t*(h+9)*.9,140))}
  else if(s==='shorts'){poly(x,[-h,113,h,113,h+2,134,1.5,134,0,125,-1.5,134,-h-2,134]);paint(x,it)}
  else{poly(x,[-h,113,h,113,h+1,154,1.5,154,0,127,-1.5,154,-h-1,154]);paint(x,it);x.lineWidth=1;
    if(s==='jeans'){x.strokeStyle='rgba(255,220,120,.8)';x.beginPath();x.arc(-h+3,117,5,0,Math.PI/2);x.stroke();x.beginPath();x.arc(h-3,117,5,Math.PI/2,Math.PI);x.stroke();line(x,0,117,0,126)}
    if(s==='joggers'){x.fillStyle='rgba(0,0,0,.25)';x.fillRect(-h-1,149,h-.5,5);x.fillRect(1.5,149,h-.5,5);x.strokeStyle='#fff';line(x,-2,117,-3,124);line(x,2,117,3,124)}}
  x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=1.2;line(x,-h+1,117,h-1,117);
}
function drawShoes(x,it,b,skin){
  [-1,1].forEach(f=>{const cx=f*(b.hip+1.5)/2;
    if(!it){x.fillStyle=skin;ell(x,cx,156,8,4.5);x.fill();return}
    const s=it.shape;
    if(s==='boots'){rr(x,cx-7,134,14,22,3);paint(x,it);rr(x,cx-9,150,18,10,4);paint(x,it);x.fillStyle='#3a2a1a';x.fillRect(cx-9,158,18,3)}
    else if(s==='heels'){x.fillStyle=skin;ell(x,cx,151,6,4);x.fill();poly(x,[cx-7,152,cx+7,152,cx+9,158,cx-9,158]);paint(x,it,true);x.strokeStyle=it.color;x.lineWidth=2;line(x,cx-6,148,cx+6,148);
      x.fillStyle=tint(it.color,.7);x.fillRect(cx+f*6-1.2,157,2.4,6)}
    else if(s==='slides'){x.fillStyle=skin;ell(x,cx,156,8,4.5);x.fill();rr(x,cx-9,150,18,6,2);paint(x,it,true);x.fillStyle='#777';x.fillRect(cx-9,159,18,2)}
    else if(s==='loafers'){rr(x,cx-8,151,16,9,4);paint(x,it);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(cx-4,153,8,2);x.fillStyle='#2a1a10';x.fillRect(cx-8,158.5,16,2)}
    else{rr(x,cx-9,150,18,10,4);paint(x,it);x.fillStyle='#fff';x.fillRect(cx-9,157,18,3);x.fillRect(cx-3,152,6,1);x.fillRect(cx-3,154,6,1)}
  });
}
function sleeves(x,it,b,t,w){[-1,1].forEach(f=>{const x1=f*(b.sh+1),y1=88,x2=x1+(f*(b.sh+6)-x1)*t,y2=y1+(117-y1)*t;
  x.lineCap='round';x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=w+1.5;line(x,x1,y1,x2,y2);x.strokeStyle=fillOf(x,it);x.lineWidth=w;line(x,x1,y1,x2,y2)})}
function drawTop(x,it,b,skin){
  const s=it.shape;
  if(s==='tank'){poly(x,[-b.sh+4,81,-b.sh+8,81,-4,90,4,90,b.sh-8,81,b.sh-4,81,b.sh-1,96,b.sh-1,106,b.hip+1,121,-b.hip-1,121,-b.sh+1,106,-b.sh+1,96]);paint(x,it);return}
  if(s==='hoodie'){x.fillStyle=tint(it.color,.75);ell(x,0,80,17,7);x.fill()}
  sleeves(x,it,b,s==='tee'?.38:.9,s==='puffer'?13:10.5);
  poly(x,torsoPts(b,s==='puffer'?2.5:0));paint(x,it);
  x.lineWidth=1;
  if(s==='tee'||s==='sweater'){x.fillStyle=skin;x.beginPath();x.ellipse(0,81,7,5,0,0,Math.PI);x.fill();x.strokeStyle='rgba(0,0,0,.35)';x.stroke()}
  if(s==='sweater'){x.strokeStyle='rgba(0,0,0,.25)';for(let i=-b.hip;i<=b.hip;i+=3)line(x,i,116,i,121)}
  if(s==='hoodie'){rr(x,-10,103,20,10,3);x.strokeStyle='rgba(0,0,0,.35)';x.stroke();x.strokeStyle='#fff';line(x,-3,83,-3,96);line(x,3,83,3,96)}
  if(s==='blazer'){x.fillStyle='#fff';poly(x,[-6,81,6,81,0,104]);x.fill();x.fillStyle=tint(it.color,.7);poly(x,[-7,81,-1,103,-9,93]);x.fill();poly(x,[7,81,1,103,9,93]);x.fill();
    x.fillStyle='#222';circ(x,0,109,1.6);x.fill();circ(x,0,115,1.6);x.fill()}
  if(s==='puffer'){x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1.5;for(let y=89;y<120;y+=8)line(x,-b.sh-2,y,b.sh+2,y);x.strokeStyle='#ccc';line(x,0,82,0,120)}
}
const AV={blink:false,mood:'smile'};
function drawHead(x,ch){
  const sk=ch.skin;x.fillStyle=sk;circ(x,-29,53,5);x.fill();circ(x,29,53,5);x.fill();x.fillStyle=tint(sk,.85);circ(x,-29,53,2.4);x.fill();circ(x,29,53,2.4);x.fill();x.fillStyle=sk;
  circ(x,0,48,30);x.fill();x.strokeStyle='rgba(0,0,0,.2)';x.lineWidth=1;x.stroke();
  const g=x.createRadialGradient(-8,38,4,0,48,31);g.addColorStop(0,'rgba(255,255,255,.28)');g.addColorStop(1,'rgba(0,0,0,.12)');x.fillStyle=g;circ(x,0,48,30);x.fill();
  const iris=ch.eyeColor||'#5b3a29';[-1,1].forEach(f=>{const ex=f*11;
    if(AV.blink||AV.mood==='happy'){x.strokeStyle='#2b2b2b';x.lineWidth=2;x.lineCap='round';x.beginPath();if(AV.blink)x.arc(ex,54,4.4,.15*Math.PI,.85*Math.PI);else x.arc(ex,58,4.4,1.15*Math.PI,1.85*Math.PI);x.stroke()}
    else{x.fillStyle='#fff';ell(x,ex,56,4.8,6.2);x.fill();x.fillStyle=iris;ell(x,ex+.4,56.8,3.8,5);x.fill();x.fillStyle='#1b1b1b';ell(x,ex+.4,57.4,2.1,2.9);x.fill();
      x.strokeStyle='#2b2b2b';x.lineWidth=1.6;x.beginPath();x.ellipse(ex,56,4.8,6.2,0,Math.PI*1.05,Math.PI*1.95);x.stroke();
      x.fillStyle='#fff';circ(x,ex+2,53.6,1.7);x.fill();circ(x,ex-1.4,59,.9);x.fill()}
    x.strokeStyle=ch.hairColor;x.lineWidth=2;x.lineCap='round';line(x,f*7,46,f*15,45);
    if(ch.gender==='female'){x.strokeStyle='#2b2b2b';x.lineWidth=1.3;line(x,f*14.5,52,f*17,49.5)}
    x.fillStyle='rgba(255,100,120,.33)';ell(x,f*19,64,5,3);x.fill()});
  x.lineCap='round';if(AV.mood==='wow'){x.fillStyle='#7a2b25';ell(x,0,66,3.2,4);x.fill()}else if(AV.mood==='happy'){x.fillStyle='#7a2b25';x.beginPath();x.arc(0,63,5.5,0,Math.PI);x.closePath();x.fill();x.fillStyle='#ff8a80';ell(x,0,66.5,2.8,1.4);x.fill()}
  else{x.strokeStyle='#8a3b2b';x.lineWidth=1.8;x.beginPath();x.arc(0,63,4.5,.2*Math.PI,.8*Math.PI);x.stroke()}
  x.fillStyle='rgba(0,0,0,.08)';ell(x,0,60.5,1.6,1);x.fill();
}
function hairBack(x,ch){
  x.fillStyle=ch.hairColor;x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1;const h=ch.hair;
  if(h==='long')rr(x,-34,30,68,88,24);else if(h==='bob')rr(x,-35,28,70,52,22);else if(h==='afro')circ(x,0,40,44);
  else if(h==='ponytail'){x.beginPath();x.ellipse(34,64,8,22,-.25,0,Math.PI*2)}else if(h==='bun')circ(x,0,15,12);else return;
  x.fill();x.stroke();
}
function hairFront(x,ch){
  const h=ch.hair;x.fillStyle=ch.hairColor;x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1;x.beginPath();
  if(h==='buzz'){x.arc(0,48,31,Math.PI*1.1,Math.PI*1.9)}
  else if(h==='afro'){x.arc(0,46,34,Math.PI*.96,Math.PI*2.04);x.quadraticCurveTo(0,26,-34,48)}
  else if(h==='bob'||h==='long'||h==='ponytail'||h==='bun'){x.arc(0,48,31.5,Math.PI*.97,Math.PI*2.03);x.lineTo(30,58);x.quadraticCurveTo(22,36,-4,35);x.quadraticCurveTo(-22,38,-30,58)}
  else{x.arc(0,48,31.5,Math.PI,Math.PI*2);x.lineTo(31,44);x.quadraticCurveTo(24,32,14,40);x.quadraticCurveTo(6,30,-2,39);x.quadraticCurveTo(-12,30,-20,40);x.quadraticCurveTo(-27,34,-31,46)}
  x.closePath();x.fill();x.stroke();
  if(h==='spiky'){poly(x,[-22,26,-16,4,-8,20]);x.fill();poly(x,[-8,20,0,0,8,20]);x.fill();poly(x,[8,20,16,4,22,26]);x.fill()}
  x.strokeStyle='rgba(255,255,255,.3)';x.lineWidth=3;x.beginPath();x.arc(0,48,25,Math.PI*1.25,Math.PI*1.45);x.stroke();
}
function drawAcc(x,it,b){
  const s=it.shape;x.lineCap='round';
  if(s==='sunglasses'){rr(x,-19,50,15,11,4);x.fillStyle='#1b1b1b';x.fill();x.strokeStyle=it.color;x.lineWidth=2.5;x.stroke();rr(x,4,50,15,11,4);x.fill();x.stroke();line(x,-4,54,4,54);
    x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=1.5;line(x,-16,53,-12,53);line(x,7,53,11,53)}
  else if(s==='chain'){x.strokeStyle=it.color;x.lineWidth=2.6;x.beginPath();x.arc(0,80,13,.15*Math.PI,.85*Math.PI);x.stroke();x.fillStyle=it.color;circ(x,0,94,3.6);x.fill();x.strokeStyle='rgba(0,0,0,.4)';x.lineWidth=1;x.stroke()}
  else if(s==='handbag'){x.strokeStyle=tint(it.color,.6);x.lineWidth=2;line(x,b.sh-3,85,b.sh+8,110);line(x,b.sh-3,85,b.sh+20,110);rr(x,b.sh+1,108,24,18,4);paint(x,it);
    x.strokeStyle='rgba(0,0,0,.3)';line(x,b.sh+1,114,b.sh+25,114);x.fillStyle='#ffd54f';circ(x,b.sh+13,115,2);x.fill()}
  else if(s==='watch'){const wx=-(b.sh+6);rr(x,wx-5,112,10,6,2);x.fillStyle=it.color;x.fill();x.fillStyle='#fff';circ(x,wx,115,3.6);x.fill();x.strokeStyle=it.color;x.lineWidth=1.5;x.stroke();x.strokeStyle='#222';x.lineWidth=.8;line(x,wx,115,wx,113)}
  else if(s==='scarf'){rr(x,-17,75,34,10,4);paint(x,it);rr(x,5,82,9,24,3);paint(x,it);x.strokeStyle=tint(it.color,.7);x.lineWidth=1;for(let i=6;i<14;i+=2)line(x,i,106,i,110)}
}
function drawHat(x,it){
  const s=it.shape;x.lineWidth=1.2;
  if(s==='cap'){x.beginPath();x.arc(0,46,32,Math.PI,0);x.closePath();paint(x,it);ell(x,20,45,22,5);paint(x,it);x.fillStyle=tint(it.color,.7);circ(x,0,14,3);x.fill()}
  else if(s==='beanie'){x.beginPath();x.arc(0,44,32,Math.PI,0);x.closePath();paint(x,it);rr(x,-34,34,68,13,5);paint(x,it);x.strokeStyle='rgba(0,0,0,.2)';for(let i=-30;i<32;i+=5)line(x,i,36,i,45);circ(x,0,11,8);paint(x,it)}
  else if(s==='tophat'){rr(x,-22,-6,44,34,3);paint(x,it);x.fillStyle=tint(it.color,.6);x.fillRect(-22,16,44,7);ell(x,0,29,42,6);paint(x,it)}
  else if(s==='bucket'){x.beginPath();x.arc(0,42,30,Math.PI,0);x.closePath();paint(x,it);poly(x,[-41,49,41,49,31,36,-31,36]);paint(x,it)}
  else if(s==='crown'){poly(x,[-24,30,-24,6,-12,18,0,0,12,18,24,6,24,30]);paint(x,it);x.fillStyle='#e53935';circ(x,-12,24,3);x.fill();x.fillStyle='#1e88e5';circ(x,0,24,3.5);x.fill();x.fillStyle='#43a047';circ(x,12,24,3);x.fill()}
  else if(s==='cowboy'){x.beginPath();x.moveTo(-21,30);x.quadraticCurveTo(-25,2,-8,6);x.quadraticCurveTo(0,13,8,6);x.quadraticCurveTo(25,2,21,30);x.closePath();paint(x,it);
    x.fillStyle=tint(it.color,.6);x.fillRect(-21,22,42,5);x.beginPath();x.moveTo(-52,22);x.quadraticCurveTo(0,50,52,22);x.quadraticCurveTo(0,36,-52,22);x.closePath();paint(x,it)}
}
function drawAvatar(x,ch,eq){
  const b=BODIES[ch.body]||BODIES.average, g=s=>eq&&eq[s]&&ITEM[eq[s]]?ITEM[eq[s]]:null;
  hairBack(x,ch);drawBody(x,b,ch.skin);
  drawBottom(x,g('bottoms')||UNDIES,b);drawShoes(x,g('shoes'),b,ch.skin);drawTop(x,g('tops')||UNDERSHIRT,b,ch.skin);
  drawHead(x,ch);hairFront(x,ch);
  const a=g('accessories');if(a)drawAcc(x,a,b);const h=g('hats');if(h)drawHat(x,h);
}
/* outlined avatar: draw once to an offscreen canvas, stamp a dark silhouette around it for a clean sticker outline */
function outlinedAvatar(x,ch,eq,sc,blink){const d=window.devicePixelRatio||1,W=Math.ceil(150*sc*d),H=Math.ceil(200*sc*d),o=document.createElement('canvas');o.width=W;o.height=H;const g=o.getContext('2d');
  g.translate(W/2,8*sc*d);g.scale(sc*d,sc*d);const pb=AV.blink;AV.blink=!!blink;drawAvatar(g,ch,eq);AV.blink=pb;
  const s=document.createElement('canvas');s.width=W;s.height=H;const q=s.getContext('2d');q.drawImage(o,0,0);q.globalCompositeOperation='source-in';q.fillStyle='#2a2238';q.fillRect(0,0,W,H);
  const k=Math.max(1.2,2*sc)*d;x.save();x.setTransform(1,0,0,1,0,0);return{o:o,s:s,k:k,W:W,H:H}}
function avatarCanvas(w,h,ch,eq,bg){
  const c=document.createElement('canvas'),x=setupCanvas(c,w,h),d=window.devicePixelRatio||1;ch=ch||S.char;eq=eq||S.equipped;
  const sc=h/195;
  c._draw=blink=>{x.save();x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);
    if(bg!==false){const gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,S&&S.dark?'#2a2340':'#ffe3f1');gr.addColorStop(1,S&&S.dark?'#1b2a40':'#d6ecff');x.fillStyle=gr;x.fillRect(0,0,w,h);
      const rg=x.createRadialGradient(w/2,h*.45,10,w/2,h*.45,h*.6);rg.addColorStop(0,'rgba(255,255,255,.55)');rg.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=rg;x.fillRect(0,0,w,h)}
    x.fillStyle='rgba(30,10,40,.18)';ell(x,w/2,h*.93,52*sc,6.5*sc);x.fill();
    const A=outlinedAvatar(x,ch,eq,sc,blink),ox=Math.round((w/2)*d-A.W/2),oy=Math.round((h*.93-162*sc)*d-8*sc*d);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;x.drawImage(A.s,ox+Math.cos(a)*A.k,oy+Math.sin(a)*A.k)}x.drawImage(A.o,ox,oy);x.restore();x.restore()};
  c._draw(false);c.classList.add('blinky');return c;
}
