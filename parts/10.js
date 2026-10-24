/* ============================== v6 HOME: stores, surfaces, exterior, yard, plants ==============================
   All new items are generated HERE (after mall + online catalogs) with their own RNG so every older item id stays stable. */
const NEW_STORES=[
 {id:'harrodz',name:'Harrodz',tag:'Knightsbridge-ish. Dress code: money.',color:'#0b4f3c',emoji:'🎩',cats:['tops','accessories','furniture','outdoor'],tier:[1200,60000]},
 {id:'tesgo',name:'Tesgo',tag:'Every little helps (a bit)',color:'#00539f',emoji:'🛍️',cats:['tops','bottoms','decor','plants'],tier:[2,40]},
 {id:'unicloth',name:'Unicloth',tag:'LifeWear™ for your life, wear',color:'#e60012',emoji:'👕',cats:['tops','bottoms','hats'],tier:[10,90]},
 {id:'mooji',name:'Mooji',tag:'No brand. Very beige. Much calm.',color:'#7f0019',emoji:'📦',cats:['furniture','decor','plants'],tier:[12,350]},
 {id:'aldee',name:'Aldee',tag:'Bring a quarter for the cart',color:'#00205b',emoji:'🥫',cats:['shoes','hats','decor','outdoor'],tier:[1,30]},
 {id:'homedespot',name:'Home Despot',tag:'More saving. More doing. More aisles.',color:'#f96302',emoji:'🔨',cats:['surface','exterior','outdoor'],tier:[8,9000],park:true},
 {id:'lows',name:'Lows',tag:'Never stop impro… lowering',color:'#004990',emoji:'🧰',cats:['surface','exterior','outdoor','plants'],tier:[6,7000],park:true},
 {id:'plantdaddy',name:'Plant Daddy',tag:'He\'s not your dad. He is your plant dad.',color:'#2e7d32',emoji:'🌿',cats:['plants','outdoor'],tier:[4,4000],park:true}];
const HB=(key,name,mul,o)=>Object.assign({key:key,name:name,mul:mul},o||{});
const HOME_BASES={
 plants:[HB('pot','Potted Fern',.6,{w:1,h:1}),HB('cactus','Cactus',.5,{w:1,h:1,plain:1}),HB('monstera','Monstera',1.4,{w:1,h:1,plain:1}),HB('bonsai','Bonsai',3,{w:1,h:1,plain:1}),HB('hanging','Hanging Plant',.9,{w:1,h:1,layer:'wall',plain:1}),HB('succulent','Succulent Trio',.4,{w:1,h:1,plain:1}),HB('fiddle','Fiddle Leaf Fig',1.8,{w:1,h:2,plain:1})],
 outdoor:[HB('tree','Shade Tree',4,{w:2,h:2,plain:1,plant:1}),HB('bush','Round Shrub',1,{w:1,h:1,plain:1,plant:1}),HB('flowerbed','Flower Bed',1.2,{w:2,h:1,plant:1}),HB('gnome','Garden Gnome',.4,{w:1,h:1}),HB('flamingo','Lawn Flamingo',.3,{w:1,h:1,plain:1}),
  HB('bbq','BBQ Grill',3,{w:1,h:1,plain:1}),HB('patio','Patio Set',4,{w:2,h:2}),HB('pool','Swimming Pool',40,{w:3,h:2,plain:1}),HB('fountain','Fountain',12,{w:2,h:2,plain:1}),HB('shed','Garden Shed',10,{w:2,h:2}),
  HB('swing','Swing Set',5,{w:2,h:1}),HB('car','Car',60,{w:2,h:1}),HB('birdbath','Bird Bath',1.5,{w:1,h:1,plain:1})],
 surface:[HB('stripes','Striped Wallpaper',1,{surf:'wall'}),HB('damask','Damask Wallpaper',2.5,{surf:'wall'}),HB('brick','Exposed Brick',3,{surf:'wall'}),HB('paint','Paint',.4,{surf:'wall'}),HB('panel','Wood Paneling',2,{surf:'wall'}),HB('wdots','Polka Wallpaper',1,{surf:'wall'}),
  HB('wood','Hardwood Floor',3,{surf:'floor'}),HB('tile','Tile Floor',2,{surf:'floor'}),HB('marble','Marble Floor',8,{surf:'floor'}),HB('carpet','Wall-to-Wall Carpet',1.5,{surf:'floor'}),HB('checker','Checkerboard Floor',1.8,{surf:'floor'}),HB('herring','Herringbone Parquet',5,{surf:'floor'})],
 exterior:[HB('siding','Siding',3,{ext:'siding'}),HB('roof','Roof',4,{ext:'roof'}),HB('door','Front Door',1.2,{ext:'door'}),HB('windows','Window Trim',1,{ext:'windows'}),HB('fence','Picket Fence',2,{ext:'fence'}),
  HB('mailbox','Mailbox',.4,{ext:'mailbox'}),HB('path','Front Path',1.5,{ext:'path'}),HB('lights','Porch Lights',.6,{ext:'lights'})]};
const ROOF_STYLES=['Gable','Hip','Flat','Mansard'],EXT_STYLES={siding:['Clapboard','Shingle','Brick','Stucco'],door:['Panel','Arched','Glass','Barn'],windows:['Shutters','Bay','Round','Modern'],fence:['Picket','Hedge','Iron','Rail'],mailbox:['Classic','Modern','Fish','Castle'],path:['Stone','Brick','Gravel','Marble'],lights:['Lantern','Globe','String','Neon']};
Object.assign(CAT_LABEL,{plants:'🪴 Plants',outdoor:'🌳 Outdoor',surface:'🎨 Walls & Floors',exterior:'🏡 Exterior'});
const INDOOR=c=>c==='furniture'||c==='decor'||c==='electronics'||c==='plants';
(function genHome(){
  const r=rng(6060),names={};
  NEW_STORES.forEach(s=>{STORES.push(s);MALL_STORE[s.id]=1});
  function make(s,cat,base,rare){let it=null;
    for(let t=0;t<20&&!it;t++){const c=COLORS[Math.floor(r()*COLORS.length)],pat=base.plain||base.surf||base.ext?PATTERNS[0]:(rare?SPARKLE:PATTERNS[Math.floor(r()*PATTERNS.length)]);
      const st=base.key==='roof'?ROOF_STYLES[Math.floor(r()*4)]:EXT_STYLES[base.key]?EXT_STYLES[base.key][Math.floor(r()*4)]:'';
      const name=s.name+(rare?' Limited':'')+' '+c[0]+(pat.key?' '+pat.name:'')+(st?' '+st:'')+' '+base.name;if(names[name])continue;names[name]=1;
      const lo=s.tier[0],hi=s.tier[1];let p=lo*Math.pow(hi/lo,Math.pow(r(),1.6))*base.mul*.4;p=Math.min(Math.max(p,1),hi*2.5);if(rare)p*=3;
      if(base.key==='pool')p=Math.max(p,s.id==='harrodz'?52000:6500);if(base.key==='car')p=Math.max(p,s.id==='harrodz'?85000:4500);if(base.key==='paint')p=Math.min(p,40);
      it={id:'h6-'+s.id+'-'+cat+'-'+base.key+'-'+ITEMS.length,store:s.id,name:name,cat:cat,slot:null,shape:base.key,price:nicePrice(p),color:c[1],colorName:c[0],pattern:pat.key,rare:!!rare,stock:rare?3:0,
        w:base.w||1,h:base.h||1,layer:base.layer||(cat==='outdoor'?'yard':'floor'),surf:base.surf||null,ext:base.ext||null,style:st,plant:cat==='plants'||!!base.plant}}
    if(it){ITEMS.push(it);ITEM[it.id]=it}}
  NEW_STORES.forEach(s=>{s.cats.forEach(cat=>{const bs=HOME_BASES[cat]||BASES[cat];const n=cat==='surface'?bs.length:cat==='exterior'?bs.length:cat==='outdoor'?Math.min(bs.length,s.park?10:4):4;
      shuffle(bs,r).slice(0,n).forEach(b=>make(s,cat,b,false));if(cat==='surface'||cat==='exterior')shuffle(bs,r).slice(0,n).forEach(b=>make(s,cat,b,false))});
    const rc=s.cats[0];const bs=HOME_BASES[rc]||BASES[rc];make(s,rc,bs[Math.floor(r()*bs.length)],true)});
})();

/* ---------- surfaces: wallpaper / flooring fill ---------- */
function drawSurface(x,it,X,Y,W,H,u){u=u||24;const c=it.color,dk=tint(c,.82),lt=tint(c,1.12),k=it.shape;x.save();x.beginPath();x.rect(X,Y,W,H);x.clip();
  x.fillStyle=c;x.fillRect(X,Y,W,H);
  if(k==='stripes'){x.fillStyle=lt;for(let i=X;i<X+W;i+=u)x.fillRect(i,Y,u*.45,H);x.fillStyle='rgba(255,255,255,.25)';for(let i=X+u*.5;i<X+W;i+=u)x.fillRect(i,Y,1.5,H)}
  else if(k==='damask'){x.fillStyle=dk;for(let yy=Y;yy<Y+H+u;yy+=u)for(let xx=X+((yy-Y)/u%2?u/2:0);xx<X+W+u;xx+=u){x.beginPath();x.moveTo(xx,yy-u*.32);x.quadraticCurveTo(xx+u*.28,yy,xx,yy+u*.32);x.quadraticCurveTo(xx-u*.28,yy,xx,yy-u*.32);x.fill();circ(x,xx,yy-u*.4,u*.06);x.fill()}}
  else if(k==='brick'){const bh=u*.42,bw=u*.9;for(let yy=Y,row=0;yy<Y+H;yy+=bh,row++)for(let xx=X-(row%2)*bw/2;xx<X+W;xx+=bw){x.fillStyle=tint(c,.85+((xx*7+yy*3)%11)/50);x.fillRect(xx+1,yy+1,bw-2,bh-2)}x.fillStyle='rgba(255,255,255,.08)';x.fillRect(X,Y,W,H)}
  else if(k==='paint'){const g=x.createLinearGradient(X,Y,X,Y+H);g.addColorStop(0,lt);g.addColorStop(1,c);x.fillStyle=g;x.fillRect(X,Y,W,H)}
  else if(k==='panel'){for(let i=X;i<X+W;i+=u*.7){x.fillStyle=tint(c,.9+((i*13)%7)/40);x.fillRect(i,Y,u*.7-1,H);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(i+u*.7-1.5,Y,1.5,H)}}
  else if(k==='wdots'){x.fillStyle=lum(c)>.6?'rgba(0,0,0,.15)':'rgba(255,255,255,.4)';for(let yy=Y;yy<Y+H+u;yy+=u*.5)for(let xx=X+((yy-Y)/(u*.5)%2?u*.25:0);xx<X+W;xx+=u*.5){circ(x,xx,yy,u*.08);x.fill()}}
  else if(k==='wood'||k==='herring'){if(k==='wood'){const ph=u*.5;for(let yy=Y,row=0;yy<Y+H;yy+=ph,row++)for(let xx=X-(row%3)*u*.6;xx<X+W;xx+=u*2.2){x.fillStyle=tint(c,.85+((xx+row*31)%9)/45);x.fillRect(xx,yy,u*2.2-1,ph-1);x.strokeStyle='rgba(0,0,0,.08)';x.lineWidth=1;line(x,xx+4,yy+ph*.5,xx+u*2,yy+ph*.45)}}
    else{const s=u*.5;for(let yy=Y-s;yy<Y+H+s;yy+=s)for(let xx=X-s*2;xx<X+W+s;xx+=s*2){x.fillStyle=tint(c,.88+((xx+yy)%5)/40);x.save();x.translate(xx+((yy/s)%2)*s,yy);x.rotate(Math.PI/4);x.fillRect(0,0,s*1.4,s*.5);x.strokeStyle='rgba(0,0,0,.15)';x.strokeRect(0,0,s*1.4,s*.5);x.restore()}}}
  else if(k==='tile'||k==='checker'){const s=k==='tile'?u*.6:u*.5;for(let yy=Y;yy<Y+H;yy+=s)for(let xx=X;xx<X+W;xx+=s){const odd=(Math.round((xx-X)/s)+Math.round((yy-Y)/s))%2;x.fillStyle=k==='checker'?(odd?'#fafafa':c):(odd?c:lt);x.fillRect(xx,yy,s,s);
      if(k==='tile'){x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=1.5;x.strokeRect(xx+.75,yy+.75,s-1.5,s-1.5)}}}
  else if(k==='marble'){const g=x.createLinearGradient(X,Y,X+W,Y+H);g.addColorStop(0,lt);g.addColorStop(1,c);x.fillStyle=g;x.fillRect(X,Y,W,H);const r=rng(c.length*99);x.strokeStyle='rgba(90,90,110,.25)';x.lineWidth=1.2;
    for(let i=0;i<W*H/(u*u)*.6;i++){let px=X+r()*W,py=Y+r()*H;x.beginPath();x.moveTo(px,py);for(let s=0;s<4;s++){px+=(r()-.3)*u;py+=(r()-.5)*u*.6;x.lineTo(px,py)}x.stroke()}
    x.strokeStyle='rgba(255,255,255,.35)';for(let i=X;i<X+W;i+=u*1.5)line(x,i,Y,i,Y+H)}
  else if(k==='carpet'){x.fillStyle='rgba(0,0,0,.06)';for(let yy=Y;yy<Y+H;yy+=3)for(let xx=X+(yy%6?0:1.5);xx<X+W;xx+=3)x.fillRect(xx,yy,1,1)}
  x.restore()}
/* ---------- plants & outdoor sprites ---------- */
function leaf(x,cx,cy,len,ang,col){x.save();x.translate(cx,cy);x.rotate(ang);x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(len*.5,-len*.35,len,0);x.quadraticCurveTo(len*.5,len*.35,0,0);x.fillStyle=col;x.fill();x.strokeStyle='rgba(0,40,0,.35)';x.lineWidth=1;x.stroke();line(x,0,0,len*.85,0);x.restore()}
function potAt(x,cx,by,w,col){x.beginPath();x.moveTo(cx-w/2,by-w*.75);x.lineTo(cx+w/2,by-w*.75);x.lineTo(cx+w*.38,by);x.lineTo(cx-w*.38,by);x.closePath();x.fillStyle=col||'#c8693a';x.fill();x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=1.2;x.stroke();x.fillStyle='rgba(255,255,255,.18)';x.fillRect(cx-w/2,by-w*.75,w,w*.14)}
const HOME_DRAW={};
function wiltOf(it){if(!it.plant||typeof S==='undefined'||!S.home||!S.owned[it.id])return 0;const w=S.home.water;if(w[it.id]===undefined)w[it.id]=S.day;return S.day-w[it.id]>=3?1:0}
function greens(it){const w=wiltOf(it);return w?['#9e9d24','#827717','#afb42b']:['#43a047','#2e7d32','#66bb6a']}
HOME_DRAW.pot=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.95,g=greens(it),dr=wiltOf(it)?.5:0;potAt(x,cx,by,W*.42,it.color);for(let i=0;i<7;i++)leaf(x,cx,by-W*.32,W*.36,-Math.PI/2+(i-3)*.38+dr*(i<3?-.6:.6)+(dr?.9*(i%2?1:-1)*0:0),g[i%3])};
HOME_DRAW.cactus=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.95;potAt(x,cx,by,W*.4,'#d84315');x.fillStyle=wiltOf(it)?'#9e9d24':'#558b2f';rr(x,cx-W*.1,by-W*.85,W*.2,W*.55,W*.1);x.fill();rr(x,cx-W*.28,by-W*.68,W*.12,W*.22,W*.06);x.fill();rr(x,cx+W*.16,by-W*.75,W*.12,W*.25,W*.06);x.fill();x.strokeStyle='rgba(0,0,0,.3)';x.lineWidth=1;line(x,cx,by-W*.8,cx,by-W*.35);x.fillStyle='#f48fb1';circ(x,cx,by-W*.86,W*.05);x.fill()};
HOME_DRAW.monstera=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.95,g=greens(it);potAt(x,cx,by,W*.4,'#eeeeee');[[-1.9,.42],[-1.3,.46],[-.9,.4],[-2.3,.38],[-1.6,.36]].forEach((a,i)=>{x.save();x.translate(cx,by-W*.3);x.rotate(a[0]+(wiltOf(it)?.35:0));x.fillStyle=g[i%3];ell(x,W*a[1]*.6,0,W*a[1]*.55,W*a[1]*.38);x.fill();x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=1.4;for(let k=-1;k<=1;k++)line(x,W*a[1]*.4,k*W*.07,W*a[1]*.95,k*W*.14);x.restore()})};
HOME_DRAW.bonsai=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.95,g=greens(it);rr(x,cx-W*.3,by-W*.14,W*.6,W*.14,3);x.fillStyle='#37474f';x.fill();x.strokeStyle='#5d4037';x.lineWidth=W*.06;x.lineCap='round';x.beginPath();x.moveTo(cx,by-W*.14);x.quadraticCurveTo(cx-W*.15,by-W*.4,cx+W*.08,by-W*.55);x.stroke();
  [[-.18,-.6,.17],[.15,-.62,.15],[0,-.75,.16]].forEach((p,i)=>{x.fillStyle=g[i%3];ell(x,cx+W*p[0],by+W*p[1],W*p[2],W*p[2]*.6);x.fill()})};
HOME_DRAW.hanging=(x,it,X,Y,W,H)=>{const cx=X+W/2,g=greens(it);x.strokeStyle='#8d6e63';x.lineWidth=1.5;line(x,cx-W*.2,Y+H*.48,cx,Y+H*.05);line(x,cx+W*.2,Y+H*.48,cx,Y+H*.05);x.fillStyle=it.color;ell(x,cx,Y+H*.55,W*.26,H*.13);x.fill();x.strokeStyle='rgba(0,0,0,.3)';x.stroke();
  for(let i=0;i<5;i++){const lx=cx+(i-2)*W*.12;for(let j=0;j<4;j++){x.fillStyle=g[(i+j)%3];ell(x,lx+(j%2?2:-2),Y+H*.6+j*H*.09*(wiltOf(it)?1.3:1),W*.06,H*.04);x.fill()}}};
HOME_DRAW.succulent=(x,it,X,Y,W,H)=>{const by=Y+H*.95;[.25,.5,.75].forEach((f,i)=>{const cx=X+W*f;potAt(x,cx,by,W*.24,i===1?it.color:'#e0e0e0');for(let k=0;k<6;k++)leaf(x,cx,by-W*.18,W*.13,-Math.PI/2+(k-2.5)*.5,wiltOf(it)?'#afb42b':['#80cbc4','#a5d6a7','#81c784'][(k+i)%3])})};
HOME_DRAW.fiddle=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.97,g=greens(it);potAt(x,cx,by,W*.5,it.color);x.strokeStyle='#6d4c41';x.lineWidth=3;line(x,cx,by-W*.35,cx,Y+H*.15);for(let i=0;i<9;i++){const yy=Y+H*.15+i*H*.07;x.save();x.translate(cx,yy);x.rotate((i%2?1:-1)*(.9+(wiltOf(it)?.6:0)));x.fillStyle=g[i%3];ell(x,W*.18,0,W*.2,W*.12);x.fill();x.restore()}};
HOME_DRAW.tree=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.95,g=greens(it);x.fillStyle='rgba(0,0,0,.18)';ell(x,cx,by,W*.4,H*.08);x.fill();x.fillStyle='#6d4c41';rr(x,cx-W*.07,by-H*.45,W*.14,H*.45,3);x.fill();
  [[0,-.62,.36],[-.22,-.5,.26],[.22,-.5,.26],[0,-.82,.26]].forEach((p,i)=>{x.fillStyle=g[i%3];circ(x,cx+W*p[0],by+H*p[1],W*p[2]);x.fill()});x.fillStyle='rgba(255,255,255,.18)';circ(x,cx-W*.1,by-H*.78,W*.1);x.fill()};
HOME_DRAW.bush=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.92,g=greens(it);x.fillStyle='rgba(0,0,0,.15)';ell(x,cx,by,W*.4,H*.08);x.fill();[[-.18,-.3,.22],[.18,-.3,.22],[0,-.45,.26]].forEach((p,i)=>{x.fillStyle=g[i%3];circ(x,cx+W*p[0],by+H*p[1],W*p[2]);x.fill()})};
HOME_DRAW.flowerbed=(x,it,X,Y,W,H)=>{rr(x,X+2,Y+H*.45,W-4,H*.5,6);x.fillStyle='#6d4c41';x.fill();for(let i=0;i<9;i++){const fx=X+W*(.08+i*.105),fy=Y+H*(.45+(i%2)*.15);x.strokeStyle='#388e3c';x.lineWidth=1.5;line(x,fx,fy+H*.2,fx,fy);x.fillStyle=wiltOf(it)?'#bcaaa4':[it.color,'#fff176','#f06292'][i%3];circ(x,fx,fy,W*.035);x.fill()}};
HOME_DRAW.gnome=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.92;x.fillStyle='#1565c0';rr(x,cx-W*.16,by-H*.42,W*.32,H*.42,6);x.fill();x.fillStyle='#ffe0c4';circ(x,cx,by-H*.5,W*.12);x.fill();x.fillStyle='#fff';x.beginPath();x.moveTo(cx-W*.13,by-H*.48);x.lineTo(cx+W*.13,by-H*.48);x.lineTo(cx,by-H*.2);x.fill();
  x.fillStyle=it.color;x.beginPath();x.moveTo(cx-W*.15,by-H*.56);x.lineTo(cx+W*.15,by-H*.56);x.lineTo(cx+W*.04,by-H*.92);x.fill()};
HOME_DRAW.flamingo=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.95;x.strokeStyle='#ad1457';x.lineWidth=1.5;line(x,cx,by,cx,by-H*.4);x.fillStyle='#f48fb1';ell(x,cx+W*.05,by-H*.48,W*.2,H*.12);x.fill();x.strokeStyle='#f48fb1';x.lineWidth=3;x.beginPath();x.moveTo(cx-W*.1,by-H*.5);x.quadraticCurveTo(cx-W*.25,by-H*.85,cx-W*.05,by-H*.85);x.stroke();x.fillStyle='#212121';circ(x,cx,by-H*.83,2);x.fill()};
HOME_DRAW.bbq=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.92;x.strokeStyle='#424242';x.lineWidth=2;line(x,cx-W*.2,by,cx-W*.1,by-H*.4);line(x,cx+W*.2,by,cx+W*.1,by-H*.4);x.fillStyle='#212121';x.beginPath();x.arc(cx,by-H*.45,W*.3,0,Math.PI);x.fill();x.beginPath();x.arc(cx,by-H*.47,W*.3,Math.PI,0);x.fillStyle='#d32f2f';x.fill();x.fillStyle='#9e9e9e';x.fillRect(cx-W*.05,by-H*.8,W*.1,H*.06)};
HOME_DRAW.patio=(x,it,X,Y,W,H)=>{const cx=X+W/2,cy=Y+H*.55;x.fillStyle='rgba(0,0,0,.15)';ell(x,cx,cy+H*.25,W*.35,H*.1);x.fill();x.strokeStyle='#795548';x.lineWidth=3;line(x,cx,cy-H*.38,cx,cy+H*.25);x.fillStyle=it.color;x.beginPath();x.moveTo(cx-W*.4,cy-H*.25);x.quadraticCurveTo(cx,cy-H*.55,cx+W*.4,cy-H*.25);x.fill();
  x.fillStyle='#eceff1';ell(x,cx,cy+H*.05,W*.25,H*.1);x.fill();x.strokeStyle='#90a4ae';x.stroke();[-1,1].forEach(f=>{x.fillStyle=it.color;rr(x,cx+f*W*.38-W*.08,cy,W*.16,H*.22,4);x.fill()})};
HOME_DRAW.pool=(x,it,X,Y,W,H)=>{rr(x,X+3,Y+3,W-6,H-6,14);x.fillStyle='#eceff1';x.fill();rr(x,X+9,Y+9,W-18,H-18,10);const g=x.createLinearGradient(X,Y,X,Y+H);g.addColorStop(0,'#4fc3f7');g.addColorStop(1,'#0288d1');x.fillStyle=g;x.fill();
  x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=2;for(let i=0;i<5;i++){const yy=Y+H*(.25+i*.13);x.beginPath();x.moveTo(X+W*.15,yy);x.quadraticCurveTo(X+W*.35,yy-4,X+W*.55,yy);x.quadraticCurveTo(X+W*.7,yy+4,X+W*.85,yy);x.stroke()}x.fillStyle=it.color;circ(x,X+W*.75,Y+H*.4,H*.1);x.fill();x.fillStyle='#4fc3f7';circ(x,X+W*.75,Y+H*.4,H*.05);x.fill()};
HOME_DRAW.fountain=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.85;x.fillStyle='#b0bec5';ell(x,cx,by,W*.45,H*.14);x.fill();x.fillStyle='#4fc3f7';ell(x,cx,by-2,W*.38,H*.09);x.fill();x.fillStyle='#cfd8dc';rr(x,cx-W*.06,by-H*.5,W*.12,H*.5,3);x.fill();ell(x,cx,by-H*.5,W*.2,H*.06);x.fill();
  x.strokeStyle='rgba(79,195,247,.8)';x.lineWidth=2;[-1,1].forEach(f=>{x.beginPath();x.moveTo(cx,by-H*.62);x.quadraticCurveTo(cx+f*W*.2,by-H*.8,cx+f*W*.28,by-H*.15);x.stroke()})};
HOME_DRAW.shed=(x,it,X,Y,W,H)=>{const by=Y+H*.95;x.fillStyle=it.color;x.fillRect(X+W*.1,by-H*.55,W*.8,H*.55);x.fillStyle=tint(it.color,.7);x.beginPath();x.moveTo(X+W*.02,by-H*.55);x.lineTo(X+W/2,by-H*.92);x.lineTo(X+W*.98,by-H*.55);x.fill();x.fillStyle='#5d4037';x.fillRect(X+W*.38,by-H*.4,W*.24,H*.4);x.strokeStyle='rgba(0,0,0,.3)';x.strokeRect(X+W*.1,by-H*.55,W*.8,H*.55)};
HOME_DRAW.swing=(x,it,X,Y,W,H)=>{const by=Y+H*.95;x.strokeStyle=it.color;x.lineWidth=4;line(x,X+W*.08,by,X+W*.2,Y+H*.1);line(x,X+W*.32,by,X+W*.2,Y+H*.1);line(x,X+W*.92,by,X+W*.8,Y+H*.1);line(x,X+W*.68,by,X+W*.8,Y+H*.1);line(x,X+W*.2,Y+H*.1,X+W*.8,Y+H*.1);
  x.strokeStyle='#616161';x.lineWidth=1.2;[.42,.58].forEach(f=>{line(x,X+W*(f-.04),Y+H*.1,X+W*(f-.04),by-H*.3);line(x,X+W*(f+.04),Y+H*.1,X+W*(f+.04),by-H*.3);x.fillStyle='#5d4037';x.fillRect(X+W*(f-.06),by-H*.32,W*.12,4)})};
HOME_DRAW.car=(x,it,X,Y,W,H)=>{const by=Y+H*.85;x.fillStyle='rgba(0,0,0,.2)';ell(x,X+W/2,by+2,W*.45,H*.08);x.fill();rr(x,X+W*.06,by-H*.45,W*.88,H*.35,8);x.fillStyle=it.color;x.fill();x.strokeStyle='rgba(0,0,0,.4)';x.stroke();x.beginPath();x.moveTo(X+W*.25,by-H*.45);x.lineTo(X+W*.35,by-H*.75);x.lineTo(X+W*.68,by-H*.75);x.lineTo(X+W*.8,by-H*.45);x.fill();x.stroke();
  x.fillStyle='#b3e5fc';x.fillRect(X+W*.38,by-H*.7,W*.13,H*.22);x.fillRect(X+W*.54,by-H*.7,W*.13,H*.22);[.25,.75].forEach(f=>{x.fillStyle='#212121';circ(x,X+W*f,by-H*.08,H*.13);x.fill();x.fillStyle='#bdbdbd';circ(x,X+W*f,by-H*.08,H*.05);x.fill()});x.fillStyle='#fff59d';circ(x,X+W*.9,by-H*.32,3);x.fill()};
HOME_DRAW.birdbath=(x,it,X,Y,W,H)=>{const cx=X+W/2,by=Y+H*.92;x.fillStyle='#bdbdbd';rr(x,cx-W*.07,by-H*.45,W*.14,H*.45,3);x.fill();ell(x,cx,by,W*.2,H*.06);x.fill();ell(x,cx,by-H*.48,W*.32,H*.1);x.fill();x.fillStyle='#81d4fa';ell(x,cx,by-H*.5,W*.25,H*.06);x.fill();x.fillStyle='#795548';circ(x,cx+W*.12,by-H*.62,W*.06);x.fill()};

/* ---------- house exterior ---------- */
const EXT_DEF={siding:{color:'#e8d9c4',style:'Clapboard'},roof:{color:'#6d4c41',style:'Gable'},door:{color:'#8d6e63',style:'Panel'},windows:{color:'#ffffff',style:'Shutters'},fence:null,mailbox:{color:'#607d8b',style:'Classic'},path:{color:'#bdbdbd',style:'Stone'},lights:null};
function extPart(k){const id=S.home.ext[k];const it=id&&ITEM[id];return it?{color:it.color,style:it.style}:EXT_DEF[k]}
function skyAt(f){// f: 0..1 through the in-game day
  const P=[[0,'#1a237e','#3949ab',.55],[.18,'#ff8a65','#ffe0b2',.15],[.3,'#4fc3f7','#e1f5fe',0],[.7,'#4fc3f7','#e1f5fe',0],[.82,'#ff7043','#ffcc80',.2],[.92,'#283593','#5c6bc0',.5],[1,'#1a237e','#3949ab',.55]];
  for(let i=1;i<P.length;i++)if(f<=P[i][0])return P[i-1];return P[0]}
function dayFrac(){return (Math.min(1,Math.max(0,(gnow()-S.dayAt)/DAY_MS))+.35)%1}// each in-game day starts mid-morning
const YROWS=6,HROWS=4;
function drawHouse(x,c){const W=c*COLS,gy=HROWS*c,sid=extPart('siding'),roof=extPart('roof'),door=extPart('door'),win=extPart('windows'),lights=extPart('lights');
  const hx=W*.14,hw=W*.72,hy=gy-c*2.3,hh=c*2.3;
  // siding
  x.fillStyle=sid.color;x.fillRect(hx,hy,hw,hh);
  if(sid.style==='Clapboard'){x.fillStyle='rgba(0,0,0,.07)';for(let y=hy+6;y<gy;y+=7)x.fillRect(hx,y,hw,1.5)}
  else if(sid.style==='Shingle'){x.fillStyle='rgba(0,0,0,.08)';for(let y=hy,r=0;y<gy;y+=8,r++)for(let xx=hx+(r%2)*6;xx<hx+hw;xx+=12)x.fillRect(xx,y,1.2,8);for(let y=hy+8;y<gy;y+=8)x.fillRect(hx,y,hw,1)}
  else if(sid.style==='Brick')drawSurface(x,{shape:'brick',color:sid.color},hx,hy,hw,hh,c*.5);
  else{x.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<60;i++)x.fillRect(hx+((i*37)%hw),hy+((i*53)%hh),2,2)}
  x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1.5;x.strokeRect(hx,hy,hw,hh);
  // roof
  x.fillStyle=roof.color;x.beginPath();const rt=hy-c*1.25;
  if(roof.style==='Flat'){x.rect(hx-8,hy-c*.3,hw+16,c*.32)}
  else if(roof.style==='Hip'){x.moveTo(hx-12,hy+2);x.lineTo(hx+hw*.22,rt);x.lineTo(hx+hw*.78,rt);x.lineTo(hx+hw+12,hy+2)}
  else if(roof.style==='Mansard'){x.moveTo(hx-10,hy+2);x.lineTo(hx+8,rt+c*.25);x.lineTo(hx+hw-8,rt+c*.25);x.lineTo(hx+hw+10,hy+2)}
  else{x.moveTo(hx-14,hy+2);x.lineTo(hx+hw/2,rt);x.lineTo(hx+hw+14,hy+2)}
  x.closePath();x.fill();x.strokeStyle='rgba(0,0,0,.3)';x.stroke();x.fillStyle='rgba(0,0,0,.12)';for(let y=rt+8;y<hy;y+=9){x.fillRect(hx-14,y,hw+28,1)}
  x.fillStyle='rgba(255,255,255,.08)';x.fillRect(hx-14,hy-4,hw+28,4);
  // chimney
  x.fillStyle=tint(roof.color,.75);x.fillRect(hx+hw*.72,rt+c*.15,c*.3,c*.6);
  // door
  const dw=c*.62,dh=c*1.15,dx=hx+hw/2-dw/2,dy=gy-dh;x.fillStyle=door.color;
  if(door.style==='Arched'){x.beginPath();x.moveTo(dx,gy);x.lineTo(dx,dy+dw/2);x.arc(dx+dw/2,dy+dw/2,dw/2,Math.PI,0);x.lineTo(dx+dw,gy);x.fill()}else x.fillRect(dx,dy,dw,dh);
  if(door.style==='Glass'){x.fillStyle='rgba(179,229,252,.85)';x.fillRect(dx+5,dy+5,dw-10,dh*.6)}else if(door.style==='Barn'){x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;line(x,dx+3,dy+3,dx+dw-3,gy-3);line(x,dx+dw-3,dy+3,dx+3,gy-3)}else{x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1;x.strokeRect(dx+5,dy+6,dw-10,dh*.35);x.strokeRect(dx+5,dy+dh*.5,dw-10,dh*.4)}
  x.fillStyle='#ffd54f';circ(x,dx+dw-7,dy+dh*.55,2.5);x.fill();
  // windows
  const night=skyAt(dayFrac())[3]>.3;[hx+hw*.18,hx+hw*.82].forEach(cx=>{const ww=c*.7,wh=c*.62,wx=cx-ww/2,wy=hy+c*.55;
    x.fillStyle=night?'#ffe082':'#b3e5fc';if(win.style==='Round'){circ(x,cx,wy+wh/2,wh/2);x.fill();x.strokeStyle=win.color;x.lineWidth=4;x.stroke()}
    else{const bw=win.style==='Bay'?ww*1.2:ww;x.fillRect(cx-bw/2,wy,bw,wh);x.strokeStyle=win.color;x.lineWidth=win.style==='Modern'?2:4;x.strokeRect(cx-bw/2,wy,bw,wh);if(win.style!=='Modern'){line(x,cx,wy,cx,wy+wh);line(x,cx-bw/2,wy+wh/2,cx+bw/2,wy+wh/2)}
      if(win.style==='Shutters'){x.fillStyle=tint(door.color,.9);x.fillRect(cx-bw/2-10,wy,8,wh);x.fillRect(cx+bw/2+2,wy,8,wh)}}
    x.fillStyle='rgba(255,255,255,.35)';x.fillRect(cx-ww/2+4,wy+4,6,wh*.4)});
  // porch lights
  if(lights){const on=night;[dx-9,dx+dw+9].forEach(lx=>{if(on){const g=x.createRadialGradient(lx,dy+8,1,lx,dy+8,c*.9);g.addColorStop(0,'rgba(255,224,130,.7)');g.addColorStop(1,'rgba(255,224,130,0)');x.fillStyle=g;x.fillRect(lx-c,dy-c,c*2,c*2)}
    x.fillStyle=lights.color;if(lights.style==='Globe'){circ(x,lx,dy+8,5);x.fill()}else if(lights.style==='String'){}else{x.fillRect(lx-4,dy+2,8,11)}x.fillStyle=on?'#fff59d':'#fffde7';circ(x,lx,dy+8,2.5);x.fill()});
    if(lights.style==='String'||lights.style==='Neon'){for(let i=0;i<12;i++){x.fillStyle=on?['#ff8a80','#ffe57f','#80d8ff','#b9f6ca'][i%4]:'#eee';circ(x,hx+hw*(i+.5)/12,hy+4+Math.sin(i)*3,2.5);x.fill()}}}
  // step
  x.fillStyle='#9e9e9e';x.fillRect(dx-8,gy-4,dw+16,6);
  return{dx:dx,dw:dw,gy:gy}}
function drawPath(x,c,dx,dw,gy){const p=extPart('path');if(!p)return;const W=c*COLS,H=c*(HROWS+YROWS);const pw=dw+10;x.fillStyle=p.color;
  if(p.style==='Gravel'){x.fillRect(dx-5,gy+2,pw,H-gy);x.fillStyle='rgba(0,0,0,.12)';for(let i=0;i<120;i++)x.fillRect(dx-5+((i*29)%pw),gy+((i*47)%(H-gy)),2,2)}
  else if(p.style==='Marble')drawSurface(x,{shape:'marble',color:p.color},dx-5,gy+2,pw,H-gy,c*.6);
  else if(p.style==='Brick')drawSurface(x,{shape:'brick',color:p.color},dx-5,gy+2,pw,H-gy,c*.45);
  else for(let y=gy+6;y<H;y+=c*.42){x.fillStyle=tint(p.color,.92+((y|0)%5)/40);ell(x,dx+dw/2+((y/7|0)%2?6:-6),y,pw*.32,c*.15);x.fill()}}
function drawFence(x,c){const f=extPart('fence');if(!f)return;const W=c*COLS,y=c*(HROWS+YROWS)-c*.55;x.fillStyle=f.color;x.strokeStyle=f.color;
  if(f.style==='Hedge'){for(let i=0;i<W;i+=c*.4){circ(x,i,y,c*.3);x.fill()}return}
  x.lineWidth=f.style==='Iron'?2:4;line(x,0,y-c*.15,W,y-c*.15);line(x,0,y+c*.12,W,y+c*.12);
  for(let i=4;i<W;i+=f.style==='Rail'?c:c*.28){if(Math.abs(i-W/2)<c*.45)continue;if(f.style==='Picket'){x.fillRect(i-4,y-c*.4,8,c*.6);x.beginPath();x.moveTo(i-4,y-c*.4);x.lineTo(i,y-c*.52);x.lineTo(i+4,y-c*.4);x.fill()}else{x.lineWidth=f.style==='Iron'?2:6;line(x,i,y-c*.45,i,y+c*.2)}}}
function drawMailbox(x,c){const m=extPart('mailbox');if(!m)return;const mx=c*COLS*.66,my=c*(HROWS+YROWS)-c*1.1,n=packagesReady().length;x.fillStyle='#5d4037';x.fillRect(mx-2,my,4,c*.7);x.fillStyle=m.color;
  if(m.style==='Fish'){ell(x,mx,my-4,c*.32,c*.15);x.fill();poly(x,[mx+c*.28,my-4,mx+c*.45,my-14,mx+c*.45,my+6]);x.fill()}else if(m.style==='Castle'){x.fillRect(mx-c*.25,my-c*.35,c*.5,c*.35);for(let i=0;i<3;i++)x.fillRect(mx-c*.25+i*c*.2,my-c*.45,c*.1,c*.12)}
  else if(m.style==='Modern'){x.fillRect(mx-c*.18,my-c*.5,c*.36,c*.5)}else{rr(x,mx-c*.28,my-c*.3,c*.56,c*.3,c*.14);x.fill()}
  x.fillStyle=n?'#e53935':'#9e9e9e';x.fillRect(mx+c*.22,my-c*.42,3,c*.22)}
function drawYardPkgs(x,c,dx,dw,gy){const n=packagesReady().length;for(let i=0;i<Math.min(n,4);i++){const bx=dx+dw+6+i*c*.3,by=gy-c*.35-(i%2)*c*.18;x.fillStyle='#c68a4c';x.fillRect(bx,by,c*.34,c*.3);x.strokeStyle='#8d5a2b';x.strokeRect(bx,by,c*.34,c*.3);x.fillStyle='#f5deb3';x.fillRect(bx+c*.14,by,c*.06,c*.3)}}
function fitsYard(id,X,Y,ignore){const it=ITEM[id];if(X<0||Y<0||X+it.w>COLS||Y+it.h>YROWS)return false;const cx=COLS/2;if(Y<1&&X<cx+1&&X+it.w>cx-1)return false;
  return S.home.yard.every((p,i)=>{if(i===ignore)return true;const q=ITEM[p.id];return X+it.w<=p.x||p.x+q.w<=X||Y+it.h<=p.y||p.y+q.h<=Y})}

/* ---------- Outside view ---------- */
const yard={placing:null,sel:-1};
function renderOutside(v){
  v.innerHTML=homeSeg('out')+'<div class="card small" id="yhint"></div>';
  const c=Math.floor(Math.min(window.innerWidth-24,560)/COLS),W=c*COLS,H=c*(HROWS+YROWS),cv=document.createElement('canvas'),x=setupCanvas(cv,W,H);cv.id='yardcv';v.appendChild(cv);
  v.insertAdjacentHTML('beforeend','<div class="row" style="margin-top:8px" id="yctl"></div><div class="lbl">'+svgI('tree')+' Yard items</div><div class="grid" id="ylist"></div>');
  function draw(){const sk=skyAt(dayFrac());let g=x.createLinearGradient(0,0,0,HROWS*c);g.addColorStop(0,sk[1]);g.addColorStop(1,sk[2]);x.fillStyle=g;x.fillRect(0,0,W,HROWS*c);
    if(sk[3]>.3){x.fillStyle='#fff';for(let i=0;i<24;i++){circ(x,(i*97)%W,(i*41)%(HROWS*c*.7),1.2);x.fill()}x.fillStyle='#fff8e1';circ(x,W*.85,c*.6,c*.3);x.fill()}else{x.fillStyle='#fff59d';circ(x,W*.12+dayFrac()*W*.7,c*.6,c*.32);x.fill();x.fillStyle='rgba(255,255,255,.85)';[[.3,.5],[.62,.35]].forEach(p=>{ell(x,W*p[0],c*p[1]+c*.4,c*.6,c*.2);x.fill();ell(x,W*p[0]+c*.3,c*p[1]+c*.3,c*.4,c*.22);x.fill()})}
    x.fillStyle='#7cb342';x.fillRect(0,HROWS*c,W,H-HROWS*c);x.fillStyle='rgba(255,255,255,.06)';for(let j=HROWS;j<HROWS+YROWS;j++)if(j%2)x.fillRect(0,j*c,W,c);
    x.fillStyle='rgba(0,60,0,.18)';for(let i=0;i<160;i++){const gx=(i*53)%W,gy2=HROWS*c+((i*71)%(H-HROWS*c));x.fillRect(gx,gy2,1.5,4)}
    const hp=drawHouse(x,c);drawPath(x,c,hp.dx,hp.dw,hp.gy);drawYardPkgs(x,c,hp.dx,hp.dw,hp.gy);
    if(yard.placing||yard.sel>=0){x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1;for(let i=1;i<COLS;i++)line(x,i*c,HROWS*c,i*c,H);for(let j=HROWS+1;j<HROWS+YROWS;j++)line(x,0,j*c,W,j*c)}
    S.home.yard.map((p,i)=>({p:p,i:i,it:ITEM[p.id]})).sort((a,b)=>(a.p.y+a.it.h)-(b.p.y+b.it.h)).forEach(o=>{const X=o.p.x*c,Y=(o.p.y+HROWS)*c;if(o.it.shape!=='pool')furnShadow(x,X,Y,o.it.w*c,o.it.h*c);drawFurn(x,o.it,X,Y,o.it.w*c,o.it.h*c)});
    drawFence(x,c);drawMailbox(x,c);
    if(sk[3]>0){x.fillStyle='rgba(20,20,70,'+sk[3]*.6+')';x.fillRect(0,0,W,H)}
    if(yard.sel>=0){const p=S.home.yard[yard.sel],it=ITEM[p.id];x.strokeStyle='#ff1493';x.lineWidth=3;x.setLineDash([6,4]);x.strokeRect(p.x*c+2,(p.y+HROWS)*c+2,it.w*c-4,it.h*c-4);x.setLineDash([])}
    const P=yard.placing&&ITEM[yard.placing];
    $('#yhint').innerHTML=P?'Tap the lawn to place <b>'+esc(P.name)+'</b> ('+P.w+'×'+P.h+')':yard.sel>=0?'Tap a new spot to move it, or remove it.':'🌞 '+timeOfDay()+' · Curb appeal <b>'+curbAppeal()+'</b>/100 · tap a yard item to move it';
    const pk=packagesReady().length,ctl=$('#yctl');
    ctl.innerHTML=(pk?'<button class="btn green" id="ycollect">📦 Bring in '+pk+'</button>':'')+(yard.sel>=0?'<button class="btn" id="yrm">Remove</button>':'')+(yard.placing||yard.sel>=0?'<button class="btn alt" id="ycx">Cancel</button>':'')+
      '<button class="btn" id="yext">'+svgI('home',18)+' Exterior</button><button class="btn alt" id="ywater">'+svgI('drop',18)+' Water plants</button>';
    if($('#ycollect'))$('#ycollect').onclick=()=>{collect();draw()};
    if($('#yrm'))$('#yrm').onclick=()=>{S.home.yard.splice(yard.sel,1);yard.sel=-1;save();draw();list()};
    if($('#ycx'))$('#ycx').onclick=()=>{yard.sel=-1;yard.placing=null;draw();list()};
    $('#yext').onclick=exteriorSheet;$('#ywater').onclick=()=>{waterAll();draw()}}
  function list(){const l=$('#ylist');l.innerHTML='';const own=Object.keys(S.owned).map(id=>ITEM[id]).filter(i=>i.cat==='outdoor');
    if(!own.length){l.innerHTML='<div class="card small">No yard stuff yet. Try 🔨 Home Despot, Lows or 🌿 Plant Daddy in the Retail Park.</div>';return}
    own.forEach(it=>{const placed=S.home.yard.filter(q=>q.id===it.id).length,d=document.createElement('div');d.className='item';
      d.innerHTML='<img alt="" src="'+thumb(it)+'"><div class="nm">'+esc(it.name)+'</div><div class="small">'+it.w+'×'+it.h+' · '+placed+'/'+S.owned[it.id]+' placed</div><button class="btn green"'+(placed>=S.owned[it.id]?' disabled':'')+'>Place</button>';
      d.querySelector('button').onclick=()=>{yard.placing=it.id;yard.sel=-1;draw();window.scrollTo(0,0)};l.appendChild(d)})}
  cv.addEventListener('pointerdown',e=>{const r=cv.getBoundingClientRect(),X=Math.floor((e.clientX-r.left)/c),Y=Math.floor((e.clientY-r.top)/c)-HROWS;if(Y<0)return;
    if(yard.placing){const it=ITEM[yard.placing],px=Math.min(X,COLS-it.w),py=Math.min(Y,YROWS-it.h);if(fitsYard(it.id,px,py)){S.home.yard.push({id:it.id,x:px,y:py});yard.placing=null;sfx('buy');burst(10);save();list()}else{sfx('bad');toast('Doesn\'t fit there')}draw();return}
    if(yard.sel>=0){const p=S.home.yard[yard.sel],it=ITEM[p.id];const hit=S.home.yard.findIndex(q=>X>=q.x&&X<q.x+ITEM[q.id].w&&Y>=q.y&&Y<q.y+ITEM[q.id].h);if(hit===yard.sel){yard.sel=-1;draw();return}
      const px=Math.min(X,COLS-it.w),py=Math.min(Y,YROWS-it.h);if(fitsYard(it.id,px,py,yard.sel)){p.x=px;p.y=py;yard.sel=-1;save()}else toast('Doesn\'t fit there');draw();return}
    const hit=S.home.yard.findIndex(q=>X>=q.x&&X<q.x+ITEM[q.id].w&&Y>=q.y&&Y<q.y+ITEM[q.id].h);if(hit>=0){yard.sel=hit;sfx('click');draw()}});
  $('#homein').onclick=()=>go('room');draw();list();
}
function timeOfDay(){const f=dayFrac();return f<.18?'Night':f<.3?'Sunrise':f<.7?'Daytime':f<.85?'Sunset':'Night'}
function homeSeg(on){return'<div class="tabs" style="margin-bottom:10px"><button id="homein" class="'+(on==='in'?'on':'')+'">'+svgI('sofa',16)+' Inside</button><button id="homeout" class="'+(on==='out'?'on':'')+'">'+svgI('home',16)+' Outside</button><button id="homeup">'+svgI('up',16)+' Rooms</button><button id="homeblock">🏘️ Block</button></div>'}
function bindSeg(){if($('#homeout'))$('#homeout').onclick=()=>{sfx('click');go('room','outside')};if($('#homein')&&!$('#yardcv'))$('#homein').onclick=()=>go('room');if($('#homeup'))$('#homeup').onclick=upgradeSheet;if($('#homeblock'))$('#homeblock').onclick=neighborSheet}

/* ---------- exterior + remodel sheets ---------- */
function exteriorSheet(){const parts=Object.keys(EXT_DEF);
  sheet('<h3>🏡 Exterior</h3><div class="small">Apply exterior parts you own. Swap freely; buy more at Home Despot & Lows.</div>'+parts.map(k=>{const own=Object.keys(S.owned).map(id=>ITEM[id]).filter(i=>i.ext===k);
    return'<div class="lbl" style="font-size:14px;text-transform:capitalize">'+k+'</div><div class="chips">'+(EXT_DEF[k]?'<button class="chip'+(!S.home.ext[k]?' on':'')+'" data-k="'+k+'" data-i="">Default</button>':'<button class="chip'+(!S.home.ext[k]?' on':'')+'" data-k="'+k+'" data-i="">None</button>')+
      own.map(i=>'<button class="chip'+(S.home.ext[k]===i.id?' on':'')+'" data-k="'+k+'" data-i="'+i.id+'"><i style="display:inline-block;width:12px;height:12px;border-radius:50%;background:'+i.color+';vertical-align:-1px"></i> '+esc(i.colorName+' '+i.style)+'</button>').join('')+'</div>'}).join(''));
  onAll($('#sheet'),'[data-k]',b=>{S.home.ext[b.dataset.k]=b.dataset.i||null;if(!b.dataset.i)delete S.home.ext[b.dataset.k];sfx('click');save();exteriorSheet();if(screen==='room')rerender()})}
function remodelSheet(){const own=k=>Object.keys(S.owned).map(id=>ITEM[id]).filter(i=>i.surf===k);
  const row=k=>'<div class="lbl" style="font-size:14px">'+(k==='wall'?'🧱 Walls':'🪵 Floor')+'</div><div class="grid">'+['default'].concat(own(k)).map(i=>{const on=i==='default'?!S.home[k]:S.home[k]===i.id;
    return'<div class="item'+(on?' eq':'')+'"><img alt="" src="'+(i==='default'?defaultSurfThumb(k):thumb(i))+'"><div class="nm">'+(i==='default'?'Original':esc(i.name))+'</div><button class="btn '+(on?'alt':'green')+'" data-s="'+k+'" data-i="'+(i==='default'?'':i.id)+'">'+(on?'Applied':'Apply')+'</button></div>'}).join('')+'</div>';
  sheet('<h3>🎨 Remodel</h3><div class="small">Wallpapers & flooring you own. Swap any time, free.</div>'+row('wall')+row('floor'));
  onAll($('#sheet'),'[data-s]',b=>{S.home[b.dataset.s]=b.dataset.i||null;S.home.remodels++;sfx('buy');burst(12);save();remodelSheet();if(screen==='room')rerender()})}
function defaultSurfThumb(k){const c=document.createElement('canvas');c.width=c.height=120;const x=c.getContext('2d');drawSurface(x,{shape:k==='wall'?'wdots':'wood',color:k==='wall'?'#f3d3e4':'#d9b48a'},0,0,120,120,30);return c.toDataURL()}
function upgradeSheet(){return roomsSheet()}
function oldUpgradeSheet(){const U=[[1,25000,'Expansion: +2 rows of floor space'],[2,120000,'Grand expansion: +2 more rows'],[3,450000,'Mansion wing: +2 rows & marble bragging rights']];
  sheet('<h3>⬆️ House upgrades</h3><div class="small">Late-game money sinks. Your room grows downward.</div>'+U.map(u=>'<div class="slot"><span>'+u[2]+'<br><span class="small">'+money(u[1])+'</span></span>'+(S.home.size>=u[0]?'<b>✅ Owned</b>':S.home.size===u[0]-1?'<button class="btn" data-u="'+u[0]+'">Buy</button>':'<span class="small">🔒</span>')+'</div>').join(''));
  onAll($('#sheet'),'[data-u]',b=>{const u=U[+b.dataset.u-1];openPay(u[2],u[1],()=>{S.home.size=u[0];syncRows();sfx('level');burst(24);toast('🏗️ Construction complete!');save();rerender()})})}
function syncRows(){ROWS=(!S.home||!S.home.cur||S.home.cur==='bed')?10+2*(S.home?S.home.size:0):roomDef(S.home.cur).rows||10}
function waterAll(){let n=0;const ids={};S.room.concat(S.home.yard).forEach(p=>{const it=ITEM[p.id];if(it&&it.plant)ids[it.id]=1});Object.keys(ids).forEach(id=>{S.home.water[id]=S.day;n++});
  if(n){S.home.waters++;sfx('coin');burst(10,['#4fc3f7','#81d4fa','#b3e5fc']);toast('💧 Watered '+n+' plant type'+(n>1?'s':'')+'. They look perkier!')}else toast('No placed plants to water');save()}
/* ---------- scores ---------- */
function curbAppeal(){let s=0;const ext=Object.keys(S.home.ext).length;s+=ext*5;const yi=S.home.yard.map(p=>ITEM[p.id]);
  s+=Math.min(30,yi.length*4);s+=Math.min(20,Math.round(yi.reduce((a,i)=>a+Math.log10(1+i.price),0)*1.5));const pl=yi.filter(i=>i.plant);s+=Math.min(10,pl.filter(i=>!wiltOf(i)).length*3)-pl.filter(i=>wiltOf(i)).length*2;
  return Math.max(0,Math.min(100,s))}
function houseValue(){const base=180000+[0,25000,120000,450000][S.home.size||0]*1.1+roomsValue();const fixtures=S.room.concat(S.home.yard).reduce((a,p)=>a+ITEM[p.id].price*.5,0)+Object.keys(S.home.ext).reduce((a,k)=>a+ITEM[S.home.ext[k]].price*.8,0)+(S.home.wall?ITEM[S.home.wall].price:0)+(S.home.floor?ITEM[S.home.floor].price:0);
  return Math.round((base+fixtures)*(1+curbAppeal()/250))}
function homeCard(){return'<div class="card"><div class="lbl" style="margin-top:0">'+svgI('home')+' Home</div><div class="slot"><span>House value</span><b>'+money(houseValue())+'</b></div><div class="slot"><span>Curb appeal</span><b>'+curbAppeal()+'/100</b></div><div class="bar"><div style="width:'+curbAppeal()+'%"></div></div><div class="slot"><span>Upgrades</span><b>'+(S.home.size||0)+'/3</b></div><div class="slot"><span>Plants watered</span><b>'+S.home.waters+'×</b></div></div>'}
function homeClean(id){if(S.owned[id])return;S.home.yard=S.home.yard.filter(p=>p.id!==id);if(S.home.wall===id)S.home.wall=null;if(S.home.floor===id)S.home.floor=null;Object.keys(S.home.ext).forEach(k=>{if(S.home.ext[k]===id)delete S.home.ext[k]})}
function homeFix(s){const f={wall:null,floor:null,ext:{},yard:[],water:{},size:0,waters:0,remodels:0};s.home=Object.assign(f,s.home||{});s.home.yard=(s.home.yard||[]).filter(p=>ITEM[p.id]&&s.owned[p.id]);
  ['wall','floor'].forEach(k=>{if(s.home[k]&&!(ITEM[s.home[k]]&&s.owned[s.home[k]]))s.home[k]=null});Object.keys(s.home.ext).forEach(k=>{const id=s.home.ext[k];if(!(ITEM[id]&&s.owned[id]))delete s.home.ext[k]})}
function useHomeItem(it){if(it.cat==='outdoor'){yard.placing=it.id;yard.sel=-1;go('room','outside');return true}
  if(it.surf){S.home[it.surf]=it.id;S.home.remodels++;save();toast('🎨 Applied '+it.name);go('room');return true}
  if(it.ext){S.home.ext[it.ext]=it.id;save();toast('🏡 Installed '+it.name);go('room','outside');return true}return false}
ACH.push(['curb','Curb Appeal 🏡','Reach 50 curb appeal',s=>s.home&&typeof curbAppeal==='function'&&curbAppeal()>=50],['green','Green Thumb 🌱','Water your plants 5 times',s=>s.home&&s.home.waters>=5],
 ['remodel','Remodeler 🎨','Apply a wallpaper and a floor',s=>s.home&&!!(s.home.wall&&s.home.floor)],['mansion','Moving On Up ⬆️','Buy a house upgrade',s=>s.home&&s.home.size>0],['poolside','Poolside 🏊','Put a pool in your yard',s=>s.home&&s.home.yard.some(p=>ITEM[p.id]&&ITEM[p.id].shape==='pool')]);
function drawExtThumb(x,it,X,Y,W,H){const sv=S.home.ext;S.home.ext={};S.home.ext[it.ext]=it.id;const c=W/COLS*1.6;x.save();x.beginPath();x.rect(X,Y,W,H);x.clip();
  const g=x.createLinearGradient(0,Y,0,Y+H);g.addColorStop(0,'#bbdefb');g.addColorStop(1,'#e3f2fd');x.fillStyle=g;x.fillRect(X,Y,W,H);
  x.translate(X+W/2-c*COLS/2,Y+H*.62-HROWS*c);x.fillStyle='#8bc34a';x.fillRect(-W,HROWS*c,W*4,H);
  const _f=dayFrac;try{const hp=drawHouse(x,c);if(it.ext==='path')drawPath(x,c,hp.dx,hp.dw,hp.gy);if(it.ext==='fence'){x.translate(0,-(YROWS-1.4)*c);drawFence(x,c)}if(it.ext==='mailbox'){x.translate(-c*1.2,-(YROWS-1.8)*c);drawMailbox(x,c)}}finally{S.home.ext=sv;x.restore()}}
