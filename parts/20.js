/* ===== v15: header-only toasts, map labels, drag/rotate/flip furniture, rival shopper, Worst Buy gadgets, Toys R Uh-Oh ===== */
(function(){const st=document.createElement('style');st.textContent='html body #toast,html body #toast.tqtop,html body #toast.tqmid{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:auto!important;height:var(--hh,60px)!important;margin:0!important;padding:3px 10px!important;z-index:1000!important;pointer-events:none!important;justify-content:center!important;gap:2px!important;background:var(--hdr,#ff4f9a)!important;border-radius:0 0 18px 18px!important;overflow:hidden!important;box-sizing:border-box!important;transform:none!important;max-width:none!important;width:auto!important}'+
 'html body #toast:empty{display:none!important}html body #toast .tq{max-height:22px;box-sizing:border-box;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px;padding:3px 10px!important;animation:tq15 .2s ease-out!important;transform:none!important;line-height:1.2;flex:0 0 auto}html body @keyframes tq15{from{opacity:0}to{opacity:1}}html body #toast .tq.out{opacity:0}html body #toast .tq canvas{display:inline-block;width:16px!important;height:20px!important;margin:-4px 4px -4px 0!important}';document.head.appendChild(st);
 const fx=()=>{const h=document.querySelector('header');if(h)document.documentElement.style.setProperty('--hh',h.offsetHeight+'px')};
 toastPlace=function(e){fx();e.classList.remove('tqtop','tqmid');while(e.children.length>2)e.removeChild(e.firstChild);const H=e.clientHeight-6;let t=0;for(const k of e.children)t+=k.offsetHeight+2;if(e.children.length>1&&t>H)e.removeChild(e.firstChild)}})();
/* map: short labels that always fit (shrink, then wrap to 2 lines) */
function mapShort(t){t=t.replace(/[^\w\s&'$·:—–\-]/g,'').replace(/\s+/g,' ').trim();t=t.split(/ · | — | – | - |:/)[0].trim();return t||'Section'}
function mapFit(x,t,w){for(let fs=13;fs>=9;fs--){x.font='bold '+fs+'px sans-serif';if(x.measureText(t).width<=w)return{fs,lines:[t]}}
  const ws=t.split(' ');for(let fs=12;fs>=8;fs--){x.font='bold '+fs+'px sans-serif';for(let k=1;k<ws.length;k++){const a=ws.slice(0,k).join(' '),b=ws.slice(k).join(' ');if(x.measureText(a).width<=w&&x.measureText(b).width<=w)return{fs,lines:[a,b]}}}
  x.font='bold 8px sans-serif';return{fs:8,lines:[t]}}
mapSheet=function(){const T=mapTargets().map(q=>({e:q.e,t:mapShort(q.t)}));window.__mapT=T;const W=Math.min(330,window.innerWidth-50),cols=2,rh=42,H=Math.ceil(T.length/cols)*rh+40;
  sheet('<h3>🗺️ Mall map</h3><div class="small">Tap a wing to fast-travel there.</div><div class="center"><canvas id="mapcv" style="border-radius:12px"></canvas></div>');
  const cv=$('#mapcv'),x=setupCanvas(cv,W,H);oRect(x,1,1,W-2,H-2,12,'#fff3e0');x.fillStyle='#8d6e63';x.font='bold 11px sans-serif';x.textAlign='center';x.fillText('ENTRANCE',W/2,H-10);
  const cw=(W-24)/cols;T.forEach((q,i)=>{const cx=10+(i%cols)*(cw+4),cy=10+Math.floor(i/cols)*rh;oRect(x,cx,cy,cw,rh-6,6,['#bbdefb','#f8bbd0','#c8e6c9','#ffe0b2','#d1c4e9'][i%5]);
    const f=mapFit(x,q.t,cw-10);x.font='bold '+f.fs+'px sans-serif';x.fillStyle='#3b2730';x.textAlign='center';x.textBaseline='middle';
    f.lines.forEach((l,k)=>x.fillText(l,cx+cw/2,cy+(rh-6)/2+(k-(f.lines.length-1)/2)*(f.fs+2)));q.r=[cx,cy,cw,rh-6];q.fit=f.lines.every(l=>x.measureText(l).width<=cw-10)&&f.lines.join(' ')===q.t});
  x.textBaseline='alphabetic';cv.onclick=ev=>{const b=cv.getBoundingClientRect(),px=ev.clientX-b.left,py=ev.clientY-b.top;const q=T.filter(q=>px>=q.r[0]&&px<=q.r[0]+q.r[2]&&py>=q.r[1]&&py<=q.r[1]+q.r[3])[0];if(q)mapGo(q)}};
/* ---------- furniture: drag, rotate, flip ---------- */
function pdim(p){const it=ITEM[p.id];return(p.r&1)?{w:it.h,h:it.w}:{w:it.w,h:it.h}}
fits=function(id,X,Y,ignore,r){const it=ITEM[id];const w=(r&1)?it.h:it.w,h=(r&1)?it.w:it.h;
  if(X<0||X+w>COLS||Y+h>ROWS)return false;if(it.layer==='wall'){if(Y<0||Y+h>WALL)return false}else if(Y<WALL)return false;
  return S.room.every((p,i)=>{if(i===ignore)return true;const q=ITEM[p.id];if(q.layer!==it.layer)return true;const d=pdim(p);return X+w<=p.x||p.x+d.w<=X||Y+h<=p.y||p.y+d.h<=Y})};
function drawPlaced(x,it,p,c,X,Y){X=X==null?p.x:X;Y=Y==null?p.y:Y;const W=it.w*c,H=it.h*c;if(!p.r&&!p.f){drawFurn(x,it,X*c,Y*c,W,H);return}
  const d=pdim(p);x.save();x.translate((X+d.w/2)*c,(Y+d.h/2)*c);x.rotate((p.r||0)*Math.PI/2);if(p.f)x.scale(-1,1);drawFurn(x,it,-W/2,-H/2,W,H);x.restore()}
const drag={i:-1};
renderRoom=function(v){
  if(sub==='outside')return renderOutside(v);syncRows();
  const placeable=Object.keys(S.owned).map(id=>ITEM[id]).filter(i=>i&&!i.slot&&INDOOR(i.cat));
  v.innerHTML=homeSeg('in')+roomSwitcher()+'<div class="card small" id="hint"></div>';bindSeg();bindSwitcher();
  const c=Math.floor(Math.min(window.innerWidth-24,560)/COLS),cv=document.createElement('canvas'),x=setupCanvas(cv,c*COLS,c*ROWS);cv.id='roomcv';cv.style.touchAction='none';v.appendChild(cv);
  v.insertAdjacentHTML('beforeend','<div class="row" style="margin-top:8px;flex-wrap:wrap;gap:6px" id="ctl"></div>'+emoteBar()+'<div class="lbl">'+svgI('sofa')+' Your furniture & decor</div><div class="grid" id="plist"></div>');
  function draw(){
    x.clearRect(0,0,c*COLS,c*ROWS);x.drawImage(roomBg(c),0,0,c*COLS,c*ROWS);
    if(room.placing||room.sel>=0){x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=1;for(let i=1;i<COLS;i++)line(x,i*c,0,i*c,ROWS*c);for(let j=1;j<ROWS;j++)line(x,0,j*c,COLS*c,j*c)}
    const order=S.room.map((p,i)=>({p:p,i:i,it:ITEM[p.id]})).filter(o=>!(drag.i===o.i&&drag.moved));const lay=l=>order.filter(o=>o.it.layer===l);
    lay('wall').concat(lay('rug')).forEach(o=>drawPlaced(x,o.it,o.p,c));
    const objs=lay('floor').map(o=>{const d=pdim(o.p);return{z:o.p.y+d.h,f:()=>{furnShadow(x,o.p.x*c,o.p.y*c,d.w*c,d.h*c);drawPlaced(x,o.it,o.p,c)}}});
    objs.push({z:S.avatar.y+1.01,f:()=>{const sc=c*2.2/170;x.fillStyle='rgba(30,10,30,.22)';ell(x,(S.avatar.x+.5)*c,(S.avatar.y+.92)*c,c*.42,c*.12);x.fill();x.save();x.translate((S.avatar.x+.5)*c,(S.avatar.y+.92)*c-162*sc);x.scale(sc,sc);drawAvatar(x,S.char,S.equipped);x.restore()}});
    {const po=petObj(x,c);if(po)objs.push(po)}
    objs.sort((a,b)=>a.z-b.z).forEach(o=>o.f());
    x.drawImage(roomLight(c),0,0,c*COLS,c*ROWS);drawDoorstep(x,c);seasonFX(x,c);
    if(drag.i>=0&&drag.moved){const p=S.room[drag.i],it=ITEM[p.id],d=pdim(p),okk=fits(p.id,drag.gx,drag.gy,drag.i,p.r);x.save();x.globalAlpha=1;drawPlaced(x,it,p,c,drag.gx,drag.gy);x.restore();
      x.strokeStyle=okk?'#00c853':'#ff1744';x.lineWidth=3;x.setLineDash([6,4]);x.strokeRect(drag.gx*c+2,drag.gy*c+2,d.w*c-4,d.h*c-4);x.setLineDash([])}
    else if(room.sel>=0&&S.room[room.sel]){const p=S.room[room.sel],d=pdim(p);x.strokeStyle='#ff1493';x.lineWidth=3;x.setLineDash([6,4]);x.strokeRect(p.x*c+2,p.y*c+2,d.w*c-4,d.h*c-4);x.setLineDash([])}
    const P=room.placing&&ITEM[room.placing];
    $('#hint').innerHTML=P?'Tap a spot to place <b>'+esc(P.name)+'</b> ('+P.w+'×'+P.h+(P.layer==='wall'?', goes on the wall':P.layer==='rug'?', rug: furniture can sit on it':'')+')':
      room.sel>=0&&S.room[room.sel]?'<b>'+esc(ITEM[S.room[room.sel].id].name)+'</b>: drag it, or tap a spot to move it. 🔄 rotates, ↔️ flips.':'Drag furniture to move it · tap it for rotate/flip · tap the floor to walk · 💤 Sleep starts a new day';
    const ctl=$('#ctl');const pk=packagesReady().length;const sp=room.sel>=0&&S.room[room.sel],wl=sp&&ITEM[sp.id].layer==='wall';
    ctl.innerHTML=(pk?'<button class="btn green" id="collect">📦 Bring in '+pk+' package'+(pk>1?'s':'')+'</button>':'')+(sp?(wl?'':'<button class="btn" id="rot">🔄 Rotate</button>')+'<button class="btn" id="flip">↔️ Flip</button><button class="btn" id="rm">Remove</button>':'')+(room.placing||sp?'<button class="btn alt" id="cx">'+(sp?'Done':'Cancel')+'</button>':'')+'<button class="btn" id="remodel">🎨 Remodel</button><button class="btn alt" id="rphoto" aria-label="Room photo">📸</button><button class="btn alt" id="sleep" style="margin-left:auto">💤 Sleep (next day)</button>';
    if($('#collect'))$('#collect').onclick=()=>{collect()};
    if($('#rm'))$('#rm').onclick=()=>{S.room.splice(room.sel,1);room.sel=-1;sfx('click');save();draw();list()};
    if($('#rot'))$('#rot').onclick=()=>{roomRotate(room.sel);draw()};if($('#flip'))$('#flip').onclick=()=>{roomFlip(room.sel);draw()};
    if($('#cx'))$('#cx').onclick=()=>{room.sel=-1;room.placing=null;draw();list()};
    $('#remodel').onclick=remodelSheet;$('#rphoto').onclick=()=>roomPhoto(cv);
    $('#sleep').onclick=()=>{nextDay();sfx('level');toast('☀️ Good morning! Day '+S.day+': new stores & deals');draw()};
  }
  function list(){const pl=$('#plist');pl.innerHTML='';
    if(!placeable.length){pl.innerHTML='<div class="card">No furniture yet. Try Ikeya, Targit, Thrift Shift or Wally\'s Mart!</div>';return}
    placeable.forEach(it=>{const left=S.owned[it.id]-placedCount(it.id);const b=document.createElement('div');b.className='item';
      b.innerHTML='<img alt="" src="'+thumb(it)+'"><div class="nm">'+esc(it.name)+'</div><div class="small">'+it.w+'×'+it.h+(it.layer==='wall'?' wall':'')+' · '+left+' to place</div><button class="btn" '+(left?'':'disabled')+'>'+(room.placing===it.id?'Placing…':'Place')+'</button>';
      b.querySelector('button').onclick=()=>{room.placing=it.id;room.sel=-1;sfx('click');draw();list();window.scrollTo(0,0)};pl.appendChild(b)})}
  const cell=e=>{const r=cv.getBoundingClientRect();return[Math.floor((e.clientX-r.left)/c),Math.floor((e.clientY-r.top)/c)]};
  cv.addEventListener('pointerdown',e=>{drag.i=-1;drag.moved=false;const g=cell(e),gx=g[0],gy=g[1];
    const hits=S.room.map((p,i)=>i).filter(i=>{const p=S.room[i],d=pdim(p);return gx>=p.x&&gx<p.x+d.w&&gy>=p.y&&gy<p.y+d.h}).sort((a,b)=>(ITEM[S.room[a].id].layer==='rug')-(ITEM[S.room[b].id].layer==='rug'));
    if(room.placing){const it=ITEM[room.placing];
      if(fits(room.placing,gx,gy,-1,0)){S.room.push({id:room.placing,x:gx,y:gy});sfx('buy');if(placedCount(room.placing)>=S.owned[room.placing])room.placing=null;save()}
      else{sfx('bad');toast(it.layer==='wall'&&gy>=WALL?'Wall decor goes on the wall (top area)':it.layer!=='wall'&&gy<WALL?'Put that on the floor':'Doesn\'t fit there')}}
    else if(hits.length){const h=hits.indexOf(room.sel)>=0?room.sel:hits[0],p=S.room[h];drag.was=room.sel===h;room.sel=h;drag.i=h;drag.ox=gx-p.x;drag.oy=gy-p.y;drag.gx=p.x;drag.gy=p.y;try{cv.setPointerCapture(e.pointerId)}catch(_){}sfx('click')}
    else if(room.sel>=0){const p=S.room[room.sel];if(fits(p.id,gx,gy,room.sel,p.r)){p.x=gx;p.y=gy;sfx('click');save()}else{sfx('bad');toast('Doesn\'t fit there')}}
    else if(gy>=WALL){S.avatar={x:gx,y:gy};save()}
    draw();list()});
  cv.addEventListener('pointermove',e=>{if(drag.i<0)return;const g=cell(e),nx=g[0]-drag.ox,ny=g[1]-drag.oy;if(nx!==drag.gx||ny!==drag.gy){drag.gx=nx;drag.gy=ny;drag.moved=true;draw()}});
  const up=e=>{if(drag.i<0)return;const i=drag.i,p=S.room[i];if(drag.moved){if(fits(p.id,drag.gx,drag.gy,i,p.r)){p.x=drag.gx;p.y=drag.gy;S.stats15=S.stats15||{};S.stats15.drags=(S.stats15.drags||0)+1;sfx('buy');save()}else{sfx('bad');toast('Doesn\'t fit there, snapped back')}}
    drag.i=-1;drag.moved=false;draw();list()};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',()=>{drag.i=-1;drag.moved=false;draw()});
  draw();list();petLoop(draw,cv,c);bindEmotes(draw);
};
function roomRotate(i){const p=S.room[i];if(!p)return false;const it=ITEM[p.id];if(it.layer==='wall')return false;const r=((p.r||0)+1)%4;
  const tries=[[0,0],[-1,0],[0,-1],[-1,-1],[1,0],[0,1]];for(const t of tries){if(fits(p.id,p.x+t[0],p.y+t[1],i,r)){p.x+=t[0];p.y+=t[1];p.r=r;S.stats15.flips++;sfx('click');save();return true}}
  sfx('bad');toast('No room to rotate here');return false}
function roomFlip(i){const p=S.room[i];if(!p)return false;p.f=p.f?0:1;S.stats15.flips++;sfx('click');save();return true}
/* ---------- new items: Worst Buy gadgets + Toys R Uh-Oh ---------- */
STORES.push({id:'toysuhoh',name:'Toys R Uh-Oh',tag:'Where grown-ups buy plushies "for a nephew"',color:'#e53935',emoji:'🧸',cats:['decor'],tier:[8,300]});MALL_STORE.toysuhoh=1;
BRAND.toysuhoh={font:SANS,ls:'.02em',sign:'#ffeb3b',ink:'#e53935',pat:'repeating-linear-gradient(45deg,#ffeb3b 0 3px,transparent 3px 14px)'};
const V15_ITEMS=[
 ['wb-pphone','worstbuy','Pear Phone 17 Pro Max Ultra+','electronics','pphone',1199,'#b0bec5',1,1],
 ['wb-gstation','worstbuy','GameStation 6 (games sold separately)','electronics','gstation',499,'#fafafa',1,1],
 ['wb-xboxx','worstbuy','XBoxx Series Why','electronics','xboxx',449,'#263238',1,1],
 ['wb-bigtv','worstbuy','Samsong 98" TV (fits in no car)','electronics','bigtv',2299,'#29b6f6',2,1],
 ['wb-nswitch','worstbuy','Nintendont Switch 2','electronics','nswitch',349,'#e53935',1,1],
 ['wb-alexuh','worstbuy','Alexuh Speaker (always listening)','electronics','alexuh',49,'#37474f',1,1],
 ['wb-roomburr','worstbuy','Roomburr Robot Vac','electronics','roomburr',299,'#78909c',1,1],
 ['wb-goldphone','worstbuy','Pear Phone 24K "Flex" Edition','electronics','pphone',4999,'#ffd54f',1,1,1],
 ['toy-bear','toysuhoh','Teddy Ruxpain Plush','decor','plushbear',24,'#a1887f',1,1],
 ['toy-squish','toysuhoh','Squishmellow (peach)','decor','squish',18,'#ffab91',1,1],
 ['toy-squish2','toysuhoh','Squishmellow (frog)','decor','squish',18,'#9ccc65',1,1],
 ['toy-pope','toysuhoh','Funko Pope Figure','decor','funko',15,'#7e57c2',1,1],
 ['toy-labooboo','toysuhoh','Labooboo Blind Box','decor','labooboo',29,'#f48fb1',1,1],
 ['toy-wheelz','toysuhoh','Hot Wheelz 5-pack','decor','wheelz',12,'#ff7043',1,1],
 ['toy-dino','toysuhoh','T-Rex Plush "Kevin"','decor','dino',34,'#66bb6a',1,1],
 ['toy-dream','toysuhoh','Barbee Dreamhouse','decor','dreamhouse',199,'#f06292',2,1],
 ['toy-chase','toysuhoh','Labooboo GOLD Chase Variant','decor','labooboo',299,'#ffd54f',1,1,1],
 ['toy-bearchase','toysuhoh','Teddy Ruxpain Holo Chase','decor','plushbear',249,'#4dd0e1',1,1,1]];
V15_ITEMS.forEach(d=>{const it={id:'v15-'+d[0],store:d[1],name:d[2],cat:d[3],slot:null,shape:d[4],price:d[5],color:d[6],colorName:'',pattern:'',rare:!!d[9],stock:d[9]?3:0,w:d[7],h:d[8],layer:'floor',toy:d[1]==='toysuhoh'};ITEMS.push(it);ITEM[it.id]=it});
const _openStores15=openStores;openStores=function(){const o=_openStores15();const t=STORES.filter(s=>s.id==='toysuhoh')[0];if(o.indexOf(t)<0)o.push(t);return o};
(function(){const D=HOME_DRAW,face=(x,cx,cy,s)=>{x.fillStyle=OUT;circ(x,cx-s,cy,s*.45);x.fill();circ(x,cx+s,cy,s*.45);x.fill();x.strokeStyle=OUT;x.lineWidth=Math.max(1,s*.35);x.beginPath();x.arc(cx,cy+s*.6,s*.7,.15*Math.PI,.85*Math.PI);x.stroke()};
 const B=(X,Y,W,H)=>({cx:X+W/2,by:Y+H*.94,u:Math.min(W,H)});
 D.pphone=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u;oRect(x,b.cx-u*.18,b.by-u*.78,u*.36,u*.74,u*.06,it.color);oRect(x,b.cx-u*.14,b.by-u*.72,u*.28,u*.6,u*.04,'#1a237e');x.fillStyle='#4fc3f7';x.fillRect(b.cx-u*.12,b.by-u*.66,u*.24,u*.12);oCirc(x,b.cx-u*.08,b.by-u*.74,u*.03,'#212121');oCirc(x,b.cx,b.by-u*.74,u*.03,'#212121')};
 D.gstation=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u;oRect(x,b.cx-u*.2,b.by-u*.8,u*.4,u*.78,u*.08,'#fafafa');oRect(x,b.cx-u*.05,b.by-u*.78,u*.1,u*.74,u*.03,'#212121');oRect(x,b.cx+u*.12,b.by-u*.2,u*.28,u*.16,u*.07,'#eceff1');oCirc(x,b.cx+u*.2,b.by-u*.12,u*.03,'#1e88e5');oCirc(x,b.cx+u*.32,b.by-u*.12,u*.03,'#e53935')};
 D.xboxx=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u;oRect(x,b.cx-u*.24,b.by-u*.7,u*.48,u*.68,u*.06,it.color);oCirc(x,b.cx,b.by-u*.56,u*.1,'#76ff03');x.strokeStyle='#263238';x.lineWidth=u*.03;line(x,b.cx-u*.06,b.by-u*.62,b.cx+u*.06,b.by-u*.5);line(x,b.cx+u*.06,b.by-u*.62,b.cx-u*.06,b.by-u*.5)};
 D.bigtv=(x,it,X,Y,W,H)=>{oRect(x,X+W*.47,Y+H*.75,W*.06,H*.15,2,'#424242');oRect(x,X+W*.3,Y+H*.88,W*.4,H*.07,3,'#424242');oRect(x,X+W*.03,Y+H*.08,W*.94,H*.7,6,'#111111');x.fillStyle=it.color;x.fillRect(X+W*.06,Y+H*.13,W*.88,H*.6);x.fillStyle='#66bb6a';x.fillRect(X+W*.06,Y+H*.55,W*.88,H*.18);oCirc(x,X+W*.75,Y+H*.3,H*.1,'#fff176')};
 D.nswitch=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u;oRect(x,b.cx-u*.42,b.by-u*.46,u*.16,u*.36,u*.06,'#29b6f6');oRect(x,b.cx+u*.26,b.by-u*.46,u*.16,u*.36,u*.06,it.color);oRect(x,b.cx-u*.27,b.by-u*.46,u*.54,u*.36,u*.03,'#212121');x.fillStyle='#ffca28';x.fillRect(b.cx-u*.22,b.by-u*.42,u*.44,u*.28)};
 D.alexuh=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u;oRect(x,b.cx-u*.16,b.by-u*.6,u*.32,u*.58,u*.1,it.color);oRect(x,b.cx-u*.16,b.by-u*.62,u*.32,u*.08,u*.04,'#29b6f6');x.fillStyle='#546e7a';for(let i=0;i<4;i++)x.fillRect(b.cx-u*.1,b.by-u*(.45-i*.1),u*.2,u*.03)};
 D.roomburr=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u;x.fillStyle=it.color;ell(x,b.cx,b.by-u*.12,u*.4,u*.14);x.fill();x.strokeStyle=OUT;x.lineWidth=1.4;x.stroke();x.fillStyle='#37474f';ell(x,b.cx,b.by-u*.16,u*.26,u*.08);x.fill();x.stroke();oCirc(x,b.cx,b.by-u*.17,u*.04,'#76ff03')};
 D.plushbear=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u,c=it.color;oCirc(x,b.cx,b.by-u*.22,u*.22,c);oCirc(x,b.cx-u*.17,b.by-u*.72,u*.09,c);oCirc(x,b.cx+u*.17,b.by-u*.72,u*.09,c);oCirc(x,b.cx,b.by-u*.56,u*.2,c);oCirc(x,b.cx,b.by-u*.49,u*.08,tint(c,1.3));face(x,b.cx,b.by-u*.6,u*.05);oRect(x,b.cx-u*.08,b.by-u*.38,u*.16,u*.05,u*.02,'#e53935')};
 D.squish=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u;x.fillStyle=it.color;ell(x,b.cx,b.by-u*.28,u*.36,u*.28);x.fill();x.strokeStyle=OUT;x.lineWidth=1.5;x.stroke();face(x,b.cx,b.by-u*.32,u*.05);oCirc(x,b.cx-u*.2,b.by-u*.24,u*.045,'#f48fb1');oCirc(x,b.cx+u*.2,b.by-u*.24,u*.045,'#f48fb1')};
 D.funko=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u;oRect(x,b.cx-u*.13,b.by-u*.36,u*.26,u*.34,u*.05,it.color);oRect(x,b.cx-u*.26,b.by-u*.84,u*.52,u*.48,u*.12,'#ffe0bd');oRect(x,b.cx-u*.28,b.by-u*.9,u*.56,u*.16,u*.08,'#5d4037');x.fillStyle=OUT;circ(x,b.cx-u*.11,b.by-u*.58,u*.06);x.fill();circ(x,b.cx+u*.11,b.by-u*.58,u*.06);x.fill()};
 D.labooboo=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u,c=it.color;oRect(x,b.cx-u*.2,b.by-u*.9,u*.1,u*.3,u*.05,c);oRect(x,b.cx+u*.1,b.by-u*.9,u*.1,u*.3,u*.05,c);oCirc(x,b.cx,b.by-u*.25,u*.2,c);oCirc(x,b.cx,b.by-u*.52,u*.24,c);oCirc(x,b.cx,b.by-u*.5,u*.17,'#ffe0bd');
   x.fillStyle=OUT;circ(x,b.cx-u*.07,b.by-u*.54,u*.04);x.fill();circ(x,b.cx+u*.07,b.by-u*.54,u*.04);x.fill();oRect(x,b.cx-u*.09,b.by-u*.44,u*.18,u*.05,u*.01,'#ffffff');x.strokeStyle=OUT;x.lineWidth=.8;for(let i=1;i<4;i++)line(x,b.cx-u*.09+i*u*.045,b.by-u*.44,b.cx-u*.09+i*u*.045,b.by-u*.39)};
 D.wheelz=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u;oRect(x,b.cx-u*.38,b.by-u*.5,u*.76,u*.48,u*.04,'#1e88e5');oRect(x,b.cx-u*.3,b.by-u*.42,u*.6,u*.3,u*.03,'#e3f2fd');oRect(x,b.cx-u*.22,b.by-u*.32,u*.44,u*.1,u*.04,it.color);oCirc(x,b.cx-u*.13,b.by-u*.2,u*.05,'#212121');oCirc(x,b.cx+u*.13,b.by-u*.2,u*.05,'#212121');x.fillStyle='#ffeb3b';x.font='bold '+Math.round(u*.1)+'px sans-serif';x.textAlign='center';x.fillText('HOT WHEELZ',b.cx,b.by-u*.06)};
 D.dino=(x,it,X,Y,W,H)=>{const b=B(X,Y,W,H),u=b.u,c=it.color;poly(x,[b.cx+u*.15,b.by-u*.2,b.cx+u*.45,b.by-u*.08,b.cx+u*.15,b.by-u*.05]);x.fillStyle=c;x.fill();x.strokeStyle=OUT;x.lineWidth=1.4;x.stroke();oRect(x,b.cx-u*.2,b.by-u*.45,u*.4,u*.42,u*.15,c);oRect(x,b.cx-u*.28,b.by-u*.8,u*.44,u*.32,u*.12,c);face(x,b.cx-u*.08,b.by-u*.68,u*.045);x.fillStyle='#ffffff';for(let i=0;i<3;i++){poly(x,[b.cx-u*(.22-i*.08),b.by-u*.52,b.cx-u*(.18-i*.08),b.by-u*.47,b.cx-u*(.14-i*.08),b.by-u*.52]);x.fill()}};
 D.dreamhouse=(x,it,X,Y,W,H)=>{oRect(x,X+W*.1,Y+H*.35,W*.8,H*.58,4,it.color);poly(x,[X+W*.05,Y+H*.38,X+W*.5,Y+H*.06,X+W*.95,Y+H*.38]);x.fillStyle='#ad1457';x.fill();x.strokeStyle=OUT;x.lineWidth=1.5;x.stroke();
   [.2,.62].forEach(f=>oRect(x,X+W*f,Y+H*.45,W*.18,H*.18,2,'#b3e5fc'));oRect(x,X+W*.43,Y+H*.65,W*.14,H*.28,2,'#fff59d')}})();
/* ---------- weekly rival shopper ---------- */
const RIVALS=[
 {k:'chad',n:'Chad Brokeley',ch:{gender:'male',body:'broad',skin:'#ffdbac',hair:'spiky',hairColor:'#e6c27a',beard:'stubble'},tops:'#ff6d00',t:['Too slow, peasant. 💅','I bought two. One to wear, one to flex.','My dad owns the mall. Jk. Kinda.']},
 {k:'tiff',n:'Tiffani Cartwright',ch:{gender:'female',body:'slim',skin:'#f1c27d',hair:'long',hairColor:'#fff176',beard:'none'},tops:'#ec407a',t:['Ew, you shop HERE?','Already posted it. 2M likes. Bye.','Cute that you tried.']},
 {k:'brayd',n:'Braydyn Bezos III',ch:{gender:'male',body:'slim',skin:'#c68642',hair:'curly',hairColor:'#2b1b14',beard:'none'},tops:'#7c4dff',t:['I have a guy at the warehouse.','Imagine paying retail. 😂','Bought it with my allowance.']},
 {k:'kayl',n:'Kayleigh Kloutsworth',ch:{gender:'female',body:'curvy',skin:'#8d5524',hair:'afro',hairColor:'#2b1b14',beard:'none'},tops:'#00bfa5',t:['Link in bio for my haul.','Sorry, my followers needed it.','You can borrow it… for $500.']}];
function rivalNow(){return RIVALS[weekNo()%RIVALS.length]}
function rivalChar(r){return Object.assign({name:r.n,lip:'',pierce:'none',ftat:'none'},r.ch)}
function rivalSettle(){const R=S.rival;if(R.wk===weekNo())return;if(R.wk>=0&&(R.me||R.got)){const rv=RIVALS[R.wk%RIVALS.length],won=R.me>R.got;
   R.hist=(R.hist||[]).concat([{wk:R.wk,n:rv.n,me:R.me,got:R.got}]).slice(-8);if(won){R.wins++;S.cash+=60;S.earned+=60;toast('🏆 You beat '+rv.n+' '+R.me+'–'+R.got+' this week! +$60');sfx('level')}else if(R.got>R.me){R.losses++;toast('😤 '+rv.n+' won the week '+R.got+'–'+R.me+'. Revenge next drop!')}}
  R.wk=weekNo();R.me=0;R.got=0}
function rivalDay(roll){rivalSettle();const r=rivalNow();weeklyDrops().forEach((it,i)=>{if(stockLeft(it)>0&&(roll==null?Math.random():roll)<.45){S.stock[it.id]=(S.stock[it.id]||0)+1;S.rival.got++;S.rival.taunt=r.t[(S.day+i)%r.t.length];toast('😈 '+r.n+' snagged a '+it.name+'! "'+S.rival.taunt+'"')}})}
const _v10NewDay15=v10NewDay;v10NewDay=function(){_v10NewDay15();try{rivalDay()}catch(e){}};
const _buy15=buy;buy=function(it){const o=it&&S.owned[it.id]||0;const r=_buy15.apply(this,arguments);try{if(it&&(S.owned[it.id]||0)>o&&weeklyDrops().some(d=>d.id===it.id)){rivalSettle();S.rival.me++;const rv=rivalNow();toast('🥊 Point to you! '+S.rival.me+'–'+S.rival.got+' vs '+rv.n);save()}}catch(e){}return r};
function rivalCard(){const r=rivalNow(),R=S.rival;return'<div class="card row" id="rivalcard" style="gap:10px;border:3px solid '+r.tops+'"><div id="rivav"></div><div style="flex:1"><b>⚔️ Rival: '+esc(r.n)+'</b><div class="small">"'+esc(R.taunt||r.t[0])+'"</div><div style="font-weight:800">This week: You '+R.me+' – '+R.got+' Them</div></div><button class="btn alt" id="rivbtn">Scoreboard</button></div>'}
function rivalSheet(){const r=rivalNow(),R=S.rival;sheet('<h3>⚔️ Rivalry scoreboard</h3><div class="small">Each week a rival hunts the Weekly Drop. Cop more drops than them by Sunday to win $60.</div><div class="card row" style="gap:10px"><div id="rivbig"></div><div style="flex:1"><b style="font-size:17px">'+esc(r.n)+'</b><div>"'+esc(R.taunt||r.t[1])+'"</div><div class="small">Week '+(weekNo()+1)+' · ends in '+(7-((S.day-1)%7))+'d</div></div></div>'+
  '<div class="row" style="gap:8px;justify-content:center;font-size:22px;font-weight:900"><span>You '+R.me+'</span><span>–</span><span>'+R.got+' '+esc(r.n.split(' ')[0])+'</span></div><div class="slot"><span>All-time record</span><b>'+R.wins+'W – '+R.losses+'L</b></div>'+
  ((R.hist||[]).length?'<div class="lbl">Past weeks</div>'+R.hist.slice().reverse().map(h=>'<div class="slot"><span>Wk '+(h.wk+1)+' vs '+esc(h.n)+'</span><b style="color:'+(h.me>h.got?'#2e7d32':'#c62828')+'">'+h.me+'–'+h.got+'</b></div>').join(''):''));
  $('#rivbig').appendChild(rivalAv(r,84,108))}
function rivalAv(r,w,h){const eq={};const c=avatarCanvas(w,h,rivalChar(r),eq);return c}
const _v12Cards15=v12Cards;v12Cards=function(){return _v12Cards15()+rivalCard()};
const _bindV13_15=bindV13;bindV13=function(){_bindV13_15();const a=$('#rivav');if(a&&!a.firstChild)a.appendChild(rivalAv(rivalNow(),56,72));const b=$('#rivbtn');if(b)b.onclick=rivalSheet};
function v15Fix(s){if(!s.rival)s.rival={wk:-1,me:0,got:0,wins:0,losses:0,hist:[],taunt:''};if(!s.stats15)s.stats15={drags:0,flips:0}}
ACH.push(['rivalwin','Main Character Energy ⚔️','Beat a weekly rival',s=>s.rival&&s.rival.wins>=1],['toybox','Kidult 🧸','Own 5 different toys',s=>Object.keys(s.owned).filter(id=>ITEM[id]&&ITEM[id].toy).length>=5],['feng','Feng Shui Master 🔄','Rotate or flip furniture 3 times',s=>s.stats15&&s.stats15.flips>=3]);
