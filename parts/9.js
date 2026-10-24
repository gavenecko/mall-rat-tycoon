/* ============================== v5 UI LAYER ==============================
   Icons (inline SVG), store branding, rarity, item detail, juice (particles/combos/shake),
   theme (dark mode), avatar blink loop, page transitions. */
const SVGP={
 mall:'<path d="M3 10l1.5-5h15L21 10"/><path d="M4 10v10h16V10"/><path d="M3 10h18"/><path d="M9 20v-5h6v5"/>',
 closet:'<path d="M12 4a2 2 0 0 1 2 2c0 1-1 1.6-2 2.2L3.5 14a1.4 1.4 0 0 0 .8 2.5h15.4a1.4 1.4 0 0 0 .8-2.5L12 8.2"/>',
 room:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
 work:'<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 12.5h18"/>',
 online:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
 me:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'};
Object.assign(SVGP,{tree:'<circle cx="12" cy="9" r="6"/><path d="M12 15v6"/>',home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',drop:'<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',sofa:'<path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M2 12a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v6H2z"/>',up:'<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>',
 flame:'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 2 1 3 3 3 3s1-3 0-7z"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11l2-8H6"/>',box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',card:'<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20M6 15h4"/>',heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
 gavel:'<path d="M14 4l6 6-3 3-6-6zM11 7l-7 7 3 3 7-7M3 21h9"/>',tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',truck:'<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',park:'<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/>'});
function svgI(k,sz){return'<span class="si">'+icon(k,sz||20)+'</span>'}
function icon(k,sz){return'<svg viewBox="0 0 24 24" width="'+(sz||24)+'" height="'+(sz||24)+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+SVGP[k]+'</svg>'}
const TITLES={mall:'The Mall',closet:'Closet',room:'My Room',work:'Work',online:'Online',me:'Me',create:'Create your rat'};

/* ---- rarity (by retail price) ---- */
function rarity(it){const p=it.price;return p<50?'common':p<500?'uncommon':p<3000?'rare':p<15000?'epic':'legendary'}
const RAR_BG={common:['#f4f2f8','#e3e0ec'],uncommon:['#ecfbf1','#c9efd8'],rare:['#eaf2ff','#c7dbff'],epic:['#f5ecff','#dcc6ff'],legendary:['#fff6e0','#ffd29a']};

/* ---- store branding: sign font + hero pattern ---- */
const SERIF='Didot,"Bodoni 72","Bodoni MT","Playfair Display",Georgia,serif',SANS='"Helvetica Neue",Arial,sans-serif';
const BRAND={
 frauda:{font:SERIF,ls:'.2em',up:1,pat:'repeating-linear-gradient(45deg,#fff 0 2px,transparent 2px 14px)'},
 goochie:{font:SERIF,ls:'.12em',pat:'linear-gradient(90deg,transparent 40%,#c62828 40% 47%,#2e7d32 47% 53%,#c62828 53% 60%,transparent 60%)',sign:'#f5e6c8',ink:'#0a6b3a'},
 balence:{font:SANS,ls:'-.04em',up:1,pat:'repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 8px)'},
 vuitno:{font:SERIF,ls:'.06em',it:1,pat:'radial-gradient(circle at 25% 25%,#e7c48a 0 3px,transparent 4px) 0 0/22px 22px',ink:'#f4d9a8'},
 shanel:{font:SANS,ls:'.3em',up:1,pat:'repeating-linear-gradient(45deg,#fff 0 1px,transparent 1px 10px),repeating-linear-gradient(-45deg,#fff 0 1px,transparent 1px 10px)'},
 versnatchy:{font:SERIF,ls:'.16em',up:1,pat:'repeating-linear-gradient(90deg,#fff 0 3px,transparent 3px 9px,#fff 9px 10px,transparent 10px 18px)',ink:'#fff3c4'},
 hermeez:{font:SERIF,ls:'.22em',up:1,pat:'radial-gradient(circle,#fff 0 2px,transparent 3px) 0 0/16px 16px'},
 dollar:{font:'Impact,"Arial Black",sans-serif',ls:'.02em',pat:'repeating-linear-gradient(-45deg,#fff 0 8px,transparent 8px 16px)'},
 wally:{font:SANS,ls:'0',pat:'radial-gradient(circle,#ffc220 0 3px,transparent 4px) 0 0/26px 26px',ink:'#fff'},
 ikeya:{font:'Verdana,'+SANS,ls:'.02em',up:1,sign:'#ffda1a',ink:'#0051ba',pat:'linear-gradient(0deg,transparent 46%,#ffda1a 46% 54%,transparent 54%)'},
 thrift:{font:'"Comic Sans MS","Chalkboard SE",cursive',ls:'0',pat:'radial-gradient(circle,#fff 0 4px,transparent 5px) 0 0/24px 24px'},
 targit:{font:SANS,ls:'-.02em',pat:'radial-gradient(circle,transparent 0 10px,#fff 10px 15px,transparent 15px 22px,#fff 22px 26px,transparent 26px) 100% 50%/80px 80px no-repeat'},
 worstbuy:{font:SANS,ls:'-.02em',sign:'#ffe000',ink:'#0a2f8f',pat:'repeating-linear-gradient(135deg,#ffe000 0 2px,transparent 2px 16px)'}};
function signStyle(s){const b=BRAND[s.id]||{};return'font-family:'+(b.font||SANS)+';letter-spacing:'+(b.ls||'0')+';'+(b.up?'text-transform:uppercase;':'')+(b.it?'font-style:italic;':'')+(b.sign?'background:'+b.sign+';text-shadow:none;':'')+(b.ink?'color:'+b.ink+';':'')}
function storeHero(s){const b=BRAND[s.id]||{};
  return'<div class="hero" style="--sc:'+s.color+';--pat:'+(b.pat||'none')+'"><div class="hl"><div class="em">'+s.emoji+'</div><div style="min-width:0"><h2 style="'+signStyle(s).replace(/background:[^;]*;/,'')+'">'+esc(s.name)+'</h2><p>'+esc(s.tag)+' · '+money(s.tier[0])+'–'+money(s.tier[1])+'</p></div></div></div>'}
function storefront(s,o){o=o||{};const b=BRAND[s.id]||{};
  return'<div class="front'+(o.banned?' banned':'')+'" data-store="'+s.id+'" role="button" tabindex="0" style="--sc:'+s.color+'"><div class="awn"></div>'+
    '<div class="sign" style="'+signStyle(s)+'">'+esc(s.name)+'</div><div class="win" style="background-color:rgba(255,255,255,.12)">'+s.emoji+(o.flag?'<span class="flag">'+o.flag+'</span>':'')+'</div><div class="tag">'+esc(s.tag)+'<br><b>'+money(s.tier[0])+'–'+money(s.tier[1])+'</b></div></div>'}

/* ---- item detail sheet (tap a thumbnail) ---- */
function itemDetail(it){const r=rarity(it),p=priceOf(it),off=offOf(it),own=S.owned[it.id]||0,st=STORES.filter(s=>s.id===it.store)[0];
  let prev='';if(it.slot){const eq=Object.assign({},S.equipped);eq[it.slot]=it.id;prev='<div class="lbl">👀 Try it on</div><div class="avwrap" id="dav"></div>'}
  sheet('<img class="detail-img" src="'+thumb(it)+'" alt=""><div style="margin-top:10px"><span class="rar rar-'+r+'">'+r.toUpperCase()+'</span>'+(it.rare?' <span class="rar" style="background:linear-gradient(90deg,#7b1fa2,#d4af37)">LIMITED</span>':'')+(it.fake?' <span class="rar" style="background:#455a64">COUNTERFEIT</span>':'')+
    '</div><h3 style="margin:6px 0 2px">'+esc(it.name)+'</h3><div class="small">'+(st?esc(st.name)+' · ':'')+esc(it.cat)+(it.w?' · '+it.w+'×'+it.h+' tiles':'')+'</div>'+
    '<div style="margin:8px 0;font-size:20px">'+(off?'<span class="was">'+money(it.price)+'</span>':'')+'<span class="pr" style="font-size:22px">'+money(p)+'</span>'+(own?' <span class="small">· you own ×'+own+'</span>':'')+'</div>'+prev);
  if(it.slot){const eq=Object.assign({},S.equipped);eq[it.slot]=it.id;const c=avatarCanvas(150,190,S.char,eq);c.classList.add('idle');$('#dav').appendChild(c)}}

/* ---- juice ---- */
const RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastPtr={x:innerWidth/2,y:innerHeight/2};
document.addEventListener('pointerdown',e=>{lastPtr={x:e.clientX,y:e.clientY}},true);
function burst(n,colors){if(RM)return;const cols=colors||['#ff3d81','#ffc107','#7c4dff','#22c06a','#29b6f6'];
  for(let i=0;i<n;i++){const d=document.createElement('i');d.className='pt';const a=Math.random()*Math.PI*2,r=40+Math.random()*60;
    d.style.left=lastPtr.x+'px';d.style.top=lastPtr.y+'px';d.style.background=cols[i%cols.length];d.style.setProperty('--dx',Math.cos(a)*r+'px');d.style.setProperty('--dy',Math.sin(a)*r-20+'px');
    document.body.appendChild(d);setTimeout(()=>d.remove(),720)}}
function comboText(t){const e=document.createElement('div');e.className='combo';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),720)}
function shake(el){if(!el||RM)return;el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake')}
const JOB_BG={burger:'linear-gradient(180deg,#fff3e0,#ffe0b2)',cashier:'linear-gradient(180deg,#e3f2fd,#d1e6ff)',shelf:'linear-gradient(180deg,#f1f8e9,#dcedc8)',barista:'linear-gradient(180deg,#efebe9,#d7ccc8)',dog:'linear-gradient(180deg,#e8f5e9,#c8e6c9)',pizza:'linear-gradient(180deg,#fff8e1,#ffe082)',cs:'linear-gradient(180deg,#e0f2f1,#b2dfdb)'};
const JOB_HEAD={burger:'#ff7043,#e53935',cashier:'#42a5f5,#1e63c4',shelf:'#7cb342,#2e7d32',barista:'#8d6e63,#5d4037',dog:'#26a69a,#00796b',pizza:'#ffb300,#e65100',cs:'#78909c,#455a64'};

/* ---- theme ---- */
function applyTheme(){document.documentElement.setAttribute('data-theme',S&&S.dark?'dark':'light');const m=document.querySelector('meta[name=theme-color]');if(m)m.content=S.dark?'#13111c':'#ff3d81'}

/* ---- avatar blink loop: only redraws visible avatar canvases, ~every 3.5s, for 140ms ---- */
setInterval(()=>{if(document.hidden||RM)return;const cs=document.querySelectorAll('canvas.blinky');if(!cs.length)return;
  Array.prototype.forEach.call(cs,c=>{if(c._draw){c._draw(true);setTimeout(()=>c._draw(false),140)}})},3600);

/* ---- room art (cached per tile size + theme) ---- */
const ROOMC={};
function roomBg(c){const k='bg'+c+(S.dark?'d':'')+ROWS+S.home.wall+S.home.floor+S.home.cur;const PL=roomDef(S.home.cur).pal||['#f3d3e4','#fde8f1','#d9b48a','#b98d62'];if(ROOMC[k])return ROOMC[k];const d=window.devicePixelRatio||1,W=c*COLS,H=c*ROWS,cv=document.createElement('canvas');cv.width=W*d;cv.height=H*d;const x=cv.getContext('2d');x.scale(d,d);
  const wh=WALL*c,r=rng(7);
  // wallpaper: base gradient + soft stripes + tiny motifs
  let g=x.createLinearGradient(0,0,0,wh);g.addColorStop(0,S.dark?'#3a2b4a':PL[0]);g.addColorStop(1,S.dark?'#4a3858':PL[1]);x.fillStyle=g;x.fillRect(0,0,W,wh);
  for(let i=0;i<W;i+=c*.5){x.fillStyle=(i/(c*.5))%2?'rgba(255,255,255,.18)':'rgba(255,255,255,0)';x.fillRect(i,0,c*.5,wh)}
  x.fillStyle=S.dark?'rgba(255,255,255,.07)':'rgba(194,24,91,.10)';for(let yy=c*.4;yy<wh-c*.3;yy+=c*.55)for(let xx=(yy/(c*.55))%2?c*.25:c*.5;xx<W;xx+=c*.5){x.save();x.translate(xx,yy);x.rotate(Math.PI/4);x.fillRect(-2.5,-2.5,5,5);x.restore()}
  if(S.home.wall)drawSurface(x,ITEM[S.home.wall],0,0,W,wh,c*.5);
  // crown molding
  x.fillStyle=S.dark?'#5c4a6c':'#fff';x.fillRect(0,0,W,6);x.fillStyle='rgba(0,0,0,.08)';x.fillRect(0,6,W,2);
  // floor planks
  const fy=wh;g=x.createLinearGradient(0,fy,0,H);g.addColorStop(0,S.dark?'#5a4130':PL[2]);g.addColorStop(1,S.dark?'#3e2c20':PL[3]);x.fillStyle=g;x.fillRect(0,fy,W,H-fy);
  const ph=c*.5;for(let y=fy,row=0;y<H;y+=ph,row++){let xx=-(row%3)*c*.7;while(xx<W){const len=c*(1.6+r()*1.4);x.fillStyle='rgba('+(r()<.5?'255,255,255':'0,0,0')+','+(.03+r()*.06)+')';x.fillRect(xx,y,len,ph);
      x.strokeStyle='rgba(60,30,10,.10)';x.lineWidth=1;for(let k=0;k<2;k++){const gy=y+ph*(.3+r()*.4);x.beginPath();x.moveTo(xx+4,gy);x.bezierCurveTo(xx+len*.3,gy-2,xx+len*.6,gy+2,xx+len-4,gy);x.stroke()}
      x.fillStyle='rgba(60,30,10,.22)';x.fillRect(xx,y,1.2,ph);xx+=len}
    x.fillStyle='rgba(60,30,10,.18)';x.fillRect(0,y+ph-1,W,1)}
  if(S.home.floor)drawSurface(x,ITEM[S.home.floor],0,fy,W,H-fy,c*.6);
  // baseboard + floor contact shadow
  x.fillStyle=S.dark?'#6d5b7a':'#ffffff';x.fillRect(0,fy-7,W,7);x.fillStyle='rgba(0,0,0,.10)';x.fillRect(0,fy-7,W,1.5);
  g=x.createLinearGradient(0,fy,0,fy+c*.6);g.addColorStop(0,'rgba(40,20,10,.22)');g.addColorStop(1,'rgba(40,20,10,0)');x.fillStyle=g;x.fillRect(0,fy,W,c*.6);
  return ROOMC[k]=cv}
function roomLight(c){const k='l'+c+(S.dark?'d':'')+ROWS;if(ROOMC[k])return ROOMC[k];const d=window.devicePixelRatio||1,W=c*COLS,H=c*ROWS,cv=document.createElement('canvas');cv.width=W*d;cv.height=H*d;const x=cv.getContext('2d');x.scale(d,d);
  let g=x.createRadialGradient(W*.2,H*.15,10,W*.2,H*.15,W*.9);g.addColorStop(0,S.dark?'rgba(255,200,120,.10)':'rgba(255,240,200,.22)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  g=x.createRadialGradient(W/2,H/2,Math.min(W,H)*.4,W/2,H/2,Math.max(W,H)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,S.dark?'rgba(0,0,0,.35)':'rgba(60,20,40,.16)');x.fillStyle=g;x.fillRect(0,0,W,H);
  return ROOMC[k]=cv}
function furnShadow(x,X,Y,W,H){x.save();x.fillStyle='rgba(40,15,20,.20)';ell(x,X+W/2,Y+H-2,W*.48,Math.max(4,H*.12));x.fill();x.restore()}

/* ---- avatar expressions: happy on purchase/payday, surprised when caught ---- */
function avMood(m,ms){if(typeof AV==='undefined')return;AV.mood=m;const rd=()=>Array.prototype.forEach.call(document.querySelectorAll('canvas.blinky'),c=>{if(c._draw)c._draw(false)});rd();let p=document.getElementById('avpop');if(p)p.remove();if(S&&S.char&&screen!=='closet'){p=document.createElement('div');p.id='avpop';p.className='avpop';const c=avatarCanvas(84,108,S.char,S.equipped);c.classList.remove('blinky');p.appendChild(c);p.insertAdjacentHTML('beforeend','<b>'+(m==='happy'?'Yay!':m==='wow'?'Uh-oh!':'')+'</b>');document.body.appendChild(p)}
  clearTimeout(avMood.t);avMood.t=setTimeout(()=>{AV.mood='smile';rd();const q=document.getElementById('avpop');if(q)q.remove()},ms||2200)}
/* ---- online brand headers (v6) ---- */
const BH={
 clam:{bg:'linear-gradient(135deg,#131a22,#232f3e 60%,#37475a)',logo:'<span style="font-weight:900;font-size:24px;letter-spacing:-.03em">clamazon</span>',smile:1,tag:'Everything. Eventually.',ic:'cart',ac:'#ff9900'},
 flea:{bg:'linear-gradient(135deg,#ffffff,#f3f6fb)',ink:'#222',logo:'<span style="font-weight:900;font-size:26px;letter-spacing:-.05em"><i style="color:#e53238;font-style:normal">f</i><i style="color:#0064d2;font-style:normal">l</i><i style="color:#f5af02;font-style:normal">e</i><i style="color:#86b817;font-style:normal">a</i><i style="color:#e53238;font-style:normal">bay</i></span>',tag:'Bid. Win. Regret.',ic:'gavel',ac:'#0064d2'},
 fb:{bg:'linear-gradient(135deg,#1877f2,#3b5998)',logo:'<span style="font-weight:900;font-size:22px">facenook</span> <span style="font-weight:700;opacity:.9">Marketplace</span>',tag:'Used goods, unused judgment',ic:'tag',ac:'#fff'},
 orders:{bg:'linear-gradient(135deg,#6d4c41,#a1887f)',logo:'<b style="font-size:20px">Orders &amp; tracking</b>',tag:'Where is my stuff?',ic:'truck',ac:'#ffe0b2'},
 wish:{bg:'linear-gradient(135deg,#ff3d81,#ff80ab)',logo:'<b style="font-size:20px">Wishlist</b>',tag:'We\'ll mail you when it\'s on sale',ic:'heart',ac:'#fff'},
 wallet:{bg:'linear-gradient(135deg,#2b2840,#5f5b73)',logo:'<b style="font-size:20px">Mall Rat Card</b>',tag:'Buy now. Cry later.',ic:'card',ac:'#ffd54f'}};
function brandHead(k){const b=BH[k];return'<div class="bhead" style="background:'+b.bg+';color:'+(b.ink||'#fff')+'"><div class="bic" style="background:'+(b.ink?'#eef3fb':'rgba(255,255,255,.16)')+';color:'+b.ac+'">'+icon(b.ic,26)+'</div><div style="min-width:0"><div>'+b.logo+(b.smile?'<svg width="86" height="10" viewBox="0 0 86 10" style="display:block;margin-top:-3px"><path d="M4 2q38 10 76 0" fill="none" stroke="#ff9900" stroke-width="3" stroke-linecap="round"/><path d="M74 0l7 2-5 5" fill="none" stroke="#ff9900" stroke-width="2.5" stroke-linecap="round"/></svg>':'')+'</div><div class="btag">'+b.tag+'</div></div></div>'}
/* ---- themed job backdrops (prerendered once per size; blitted each frame) ---- */
const JBG={};
function jobBg(k,x,W,H){const key=k+W+'x'+H;let cv=JBG[key];if(!cv){const d=window.devicePixelRatio||1;cv=document.createElement('canvas');cv.width=W*d;cv.height=H*d;const g=cv.getContext('2d');g.scale(d,d);JBG_DRAW[k](g,W,H);JBG[key]=cv}
  x.save();x.setTransform(1,0,0,1,0,0);x.drawImage(cv,0,0,x.canvas.width,x.canvas.height);x.restore()}
const JBG_DRAW={
 kitchen(g,W,H){g.fillStyle='#f4f1ec';g.fillRect(0,0,W,H);g.strokeStyle='#ddd6cc';g.lineWidth=1;for(let y=0;y<H;y+=18)line(g,0,y,W,y);for(let y=0,r=0;y<H;y+=18,r++)for(let xx=(r%2)*9;xx<W;xx+=18)line(g,xx,y,xx,y+18);
  g.fillStyle='#b0bec5';g.fillRect(0,H-26,W,26);g.fillStyle='rgba(255,255,255,.5)';g.fillRect(0,H-26,W,3);g.fillStyle='#90a4ae';g.fillRect(0,H-6,W,6);
  g.fillStyle='#78909c';g.fillRect(W*.06,10,W*.88,4);[.2,.45,.7].forEach(f=>{g.fillStyle='#fffde7';g.fillRect(W*f,14,26,30);g.strokeStyle='#e0c97a';g.strokeRect(W*f,14,26,30)});
  const gr=g.createRadialGradient(W/2,0,10,W/2,0,H);gr.addColorStop(0,'rgba(255,240,200,.35)');gr.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=gr;g.fillRect(0,0,W,H)},
 aisle(g,W,H){g.fillStyle='#eef3f7';g.fillRect(0,0,W,H);for(let s=0;s<3;s++){const y=10+s*((H-40)/3);g.fillStyle='#cfd8dc';g.fillRect(0,y+26,W,5);for(let i=4;i<W;i+=13){g.fillStyle=['#ef9a9a','#90caf9','#a5d6a7','#ffe082','#ce93d8'][(i+s*3)%5];g.globalAlpha=.55;g.fillRect(i,y+8+((i*7)%6),10,18-((i*7)%6));g.globalAlpha=1}}
  g.fillStyle='#b0bec5';g.fillRect(0,H-22,W,22);g.strokeStyle='rgba(255,255,255,.4)';for(let i=0;i<W;i+=24)line(g,i,H-22,i,H)},
 cafe(g,W,H){drawSurface(g,{shape:'brick',color:'#a1665e'},0,0,W,H,34);g.fillStyle='rgba(30,20,15,.35)';g.fillRect(0,0,W,H);
  rr(g,W-96,10,84,56,6);g.fillStyle='#263238';g.fill();g.strokeStyle='#8d6e63';g.lineWidth=4;g.stroke();g.fillStyle='rgba(255,255,255,.8)';g.font='bold 10px sans-serif';['MENU','latte 4','mocha 5','???  9'].forEach((t,i)=>g.fillText(t,W-88,24+i*12));
  g.fillStyle='#6d4c41';g.fillRect(0,H-14,W,14);g.fillStyle='rgba(255,255,255,.15)';g.fillRect(0,H-14,W,2);
  const gr=g.createRadialGradient(W*.3,0,10,W*.3,0,H*1.2);gr.addColorStop(0,'rgba(255,214,140,.4)');gr.addColorStop(1,'rgba(255,214,140,0)');g.fillStyle=gr;g.fillRect(0,0,W,H)},
 park(g,W,H){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#9ccc65');gr.addColorStop(1,'#7cb342');g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle='rgba(0,60,0,.18)';for(let i=0;i<220;i++)g.fillRect((i*53)%W,(i*97)%H,1.5,4);
  for(let i=0;i<14;i++){g.fillStyle=['#fff176','#f48fb1','#fff'][i%3];circ(g,(i*71)%W,(i*131)%H,2.2);g.fill()}},
 street(g,W,H){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#81d4fa');gr.addColorStop(1,'#e1f5fe');g.fillStyle=gr;g.fillRect(0,0,W,H);
  g.fillStyle='rgba(120,144,156,.35)';for(let i=0;i<W;i+=26){const h=30+((i*37)%50);g.fillRect(i,H-50-h,22,h)}g.fillStyle='rgba(255,255,255,.9)';[[.2,.15],[.7,.1]].forEach(p=>{ell(g,W*p[0],H*p[1]+10,26,9);g.fill();ell(g,W*p[0]+14,H*p[1]+4,16,10);g.fill()})}};
