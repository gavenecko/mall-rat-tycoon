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
function roomBg(c){const k='bg'+c+(S.dark?'d':'');if(ROOMC[k])return ROOMC[k];const d=window.devicePixelRatio||1,W=c*COLS,H=c*ROWS,cv=document.createElement('canvas');cv.width=W*d;cv.height=H*d;const x=cv.getContext('2d');x.scale(d,d);
  const wh=WALL*c,r=rng(7);
  // wallpaper: base gradient + soft stripes + tiny motifs
  let g=x.createLinearGradient(0,0,0,wh);g.addColorStop(0,S.dark?'#3a2b4a':'#f3d3e4');g.addColorStop(1,S.dark?'#4a3858':'#fde8f1');x.fillStyle=g;x.fillRect(0,0,W,wh);
  for(let i=0;i<W;i+=c*.5){x.fillStyle=(i/(c*.5))%2?'rgba(255,255,255,.18)':'rgba(255,255,255,0)';x.fillRect(i,0,c*.5,wh)}
  x.fillStyle=S.dark?'rgba(255,255,255,.07)':'rgba(194,24,91,.10)';for(let yy=c*.4;yy<wh-c*.3;yy+=c*.55)for(let xx=(yy/(c*.55))%2?c*.25:c*.5;xx<W;xx+=c*.5){x.save();x.translate(xx,yy);x.rotate(Math.PI/4);x.fillRect(-2.5,-2.5,5,5);x.restore()}
  // crown molding
  x.fillStyle=S.dark?'#5c4a6c':'#fff';x.fillRect(0,0,W,6);x.fillStyle='rgba(0,0,0,.08)';x.fillRect(0,6,W,2);
  // floor planks
  const fy=wh;g=x.createLinearGradient(0,fy,0,H);g.addColorStop(0,S.dark?'#5a4130':'#d9b48a');g.addColorStop(1,S.dark?'#3e2c20':'#b98d62');x.fillStyle=g;x.fillRect(0,fy,W,H-fy);
  const ph=c*.5;for(let y=fy,row=0;y<H;y+=ph,row++){let xx=-(row%3)*c*.7;while(xx<W){const len=c*(1.6+r()*1.4);x.fillStyle='rgba('+(r()<.5?'255,255,255':'0,0,0')+','+(.03+r()*.06)+')';x.fillRect(xx,y,len,ph);
      x.strokeStyle='rgba(60,30,10,.10)';x.lineWidth=1;for(let k=0;k<2;k++){const gy=y+ph*(.3+r()*.4);x.beginPath();x.moveTo(xx+4,gy);x.bezierCurveTo(xx+len*.3,gy-2,xx+len*.6,gy+2,xx+len-4,gy);x.stroke()}
      x.fillStyle='rgba(60,30,10,.22)';x.fillRect(xx,y,1.2,ph);xx+=len}
    x.fillStyle='rgba(60,30,10,.18)';x.fillRect(0,y+ph-1,W,1)}
  // baseboard + floor contact shadow
  x.fillStyle=S.dark?'#6d5b7a':'#ffffff';x.fillRect(0,fy-7,W,7);x.fillStyle='rgba(0,0,0,.10)';x.fillRect(0,fy-7,W,1.5);
  g=x.createLinearGradient(0,fy,0,fy+c*.6);g.addColorStop(0,'rgba(40,20,10,.22)');g.addColorStop(1,'rgba(40,20,10,0)');x.fillStyle=g;x.fillRect(0,fy,W,c*.6);
  return ROOMC[k]=cv}
function roomLight(c){const k='l'+c+(S.dark?'d':'');if(ROOMC[k])return ROOMC[k];const d=window.devicePixelRatio||1,W=c*COLS,H=c*ROWS,cv=document.createElement('canvas');cv.width=W*d;cv.height=H*d;const x=cv.getContext('2d');x.scale(d,d);
  let g=x.createRadialGradient(W*.2,H*.15,10,W*.2,H*.15,W*.9);g.addColorStop(0,S.dark?'rgba(255,200,120,.10)':'rgba(255,240,200,.22)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  g=x.createRadialGradient(W/2,H/2,Math.min(W,H)*.4,W/2,H/2,Math.max(W,H)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,S.dark?'rgba(0,0,0,.35)':'rgba(60,20,40,.16)');x.fillStyle=g;x.fillRect(0,0,W,H);
  return ROOMC[k]=cv}
function furnShadow(x,X,Y,W,H){x.save();x.fillStyle='rgba(40,15,20,.20)';ell(x,X+W/2,Y+H-2,W*.48,Math.max(4,H*.12));x.fill();x.restore()}
