/* ============================== SCREENS ============================== */
const TABS=[['mall','🏬','Mall'],['closet','👗','Closet'],['room','🏠','Room'],['work','💼','Work'],['online','📱','Online'],['me','⭐','Me']];
let screen='mall',sub=null,filter='all',jobTick=null;
function nav(){const n=$('#nav');n.style.display=screen==='create'?'none':'flex';
  n.innerHTML=TABS.map(t=>'<button data-s="'+t[0]+'" aria-label="'+t[2]+'" class="'+(t[0]===screen?'on':'')+'">'+icon(t[0])+t[2]+'<i class="nb" data-nb="'+t[0]+'"></i></button>').join('');
  onAll(n,'button',b=>{sfx('click');go(b.dataset.s)});mailHud()}
function go(s,sb){if(shift&&s!=='work')endShift();screen=s;sub=sb||null;filter='all';nav();render();window.scrollTo(0,0)}
function render(){
  clearInterval(jobTick);jobTick=null;hud();applyTheme();const v=$('#view');v.innerHTML='';const tt=$('#ttl');if(tt)tt.textContent=sub==='alley'?'Back Alley':sub&&STORES.filter(q=>q.id===sub)[0]?STORES.filter(q=>q.id===sub)[0].name:TITLES[screen]||'';
  if(render.last!==screen+sub){render.last=screen+sub;v.classList.remove('enter');void v.offsetWidth;v.classList.add('enter')}
  try{({mall:renderMall,closet:renderCloset,room:renderRoom,work:renderWork,me:renderMe,create:renderCreate,online:renderOnline})[screen](v)}catch(e){showError(e)}
}
function rerender(){const y=window.scrollY;render();window.scrollTo(0,y)}

function itemCard(it,mode){
  const owned=S.owned[it.id]||0,eq=S.equipped[it.slot]===it.id,off=offOf(it),p=priceOf(it),left=stockLeft(it);
  const shopM=mode==='shop'||mode==='store';const d=document.createElement('div');d.className='item'+(eq&&!shopM?' eq':'');
  const rr_=rarity(it);let h='<img alt="'+esc(it.name)+'" src="'+thumb(it)+'" data-a="det">'+(it.rare?'<span class="badge r">LIMITED · '+left+' left</span>':off?'<span class="badge sale">-'+off+'% SALE</span>':'')+'<button class="heart" data-a="wish" aria-label="wishlist">'+(S.wish[it.id]?'❤️':'🤍')+'</button><span class="rar rar-'+rr_+'">'+rr_.toUpperCase()+'</span><div class="nm">'+esc(it.name)+'</div>';
  if(shopM){h+='<div>'+(off?'<span class="was">'+money(it.price)+'</span>':'')+'<span class="pr">'+money(p)+'</span></div><div class="small">'+(owned?'Owned ×'+owned:'&nbsp;')+'</div><button class="btn" data-a="buy">'+(left<=0?'Sold out':'Buy')+'</button>'+(mode==='store'&&left>0&&canSteal(it.store)?'<button class="btn" data-a="steal" style="padding:6px;font-size:12px;background:#7b1fa2;box-shadow:0 2px 0 #4a148c">🤏 Five-finger discount</button>':'')}
  else{const placed=S.room.filter(q=>q.id===it.id).length;
    h+='<div class="small">×'+owned+(it.slot?'':' · '+placed+' placed')+' · worth '+money(it.price)+'</div><div class="row"><button class="btn '+(eq?'alt':'green')+'" style="flex:1" data-a="use">'+(it.slot?(eq?'Take off':'Wear'):'Place')+'</button><button class="btn alt" style="flex:0 0 46px" data-a="sell" title="Sell for half">💲</button></div>'}
  d.innerHTML=h;
  onAll(d,'[data-a]',b=>{const a=b.dataset.a;
    if(a==='det'){sfx('click');itemDetail(it)}
    else if(a==='wish'){toggleWish(it);b.textContent=S.wish[it.id]?'❤️':'🤍'}
    else if(a==='buy')buy(it);
    else if(a==='steal')stealAttempt(it);
    else if(a==='sell')sell(it);
    else if(it.slot){if(eq)delete S.equipped[it.slot];else S.equipped[it.slot]=it.id;sfx('click');save();rerender()}
    else{room.placing=it.id;room.sel=-1;go('room')}});
  if(shopM)d.querySelector('[data-a=buy]').disabled=left<=0;
  return d;
}
function buy(it){
  const p=priceOf(it);
  if(stockLeft(it)<=0){toast('Sold out!');sfx('bad');return}
  if(S.cash<p){openPay(it.name,p,()=>grant(it,p));return}
  S.cash-=p;S.spent+=p;grant(it,p);
}
function grant(it,p){
  S.owned[it.id]=(S.owned[it.id]||0)+1;if(it.rare)S.stock[it.id]=(S.stock[it.id]||0)+1;if(offOf(it))S.dealsBought++;
  if(it.slot&&!S.equipped[it.slot])S.equipped[it.slot]=it.id;
  sfx('buy');floatText('-'+money(p),'#d32f2f');bumpCash();toast('Bought '+it.name+' ✨');save();rerender();
}
function sell(it){
  const hot=hotTake(it.id);if(hot&&hotBust(it,it.price,'a pawn shop')){removeOne(it.id);hotClamp(it.id);save();rerender();return}
  const v=Math.floor(it.price*(hot?.1:.5));S.owned[it.id]--;S.cash+=v;if(hot)toast('🧾 Pawn shop paid '+money(v)+' for "no receipt" goods');
  if(!S.owned[it.id]){delete S.owned[it.id];Object.keys(S.equipped).forEach(k=>{if(S.equipped[k]===it.id)delete S.equipped[k]});S.room=S.room.filter(q=>q.id!==it.id)}
  else{const pl=S.room.filter(q=>q.id===it.id);if(pl.length>S.owned[it.id])S.room.splice(S.room.indexOf(pl[0]),1)}
  sfx('coin');floatText('+'+money(v));toast('Sold for '+money(v));save();rerender();
}
function tabsBar(cats,onPick){const t=document.createElement('div');t.className='tabs';
  cats.forEach(c=>{const b=document.createElement('button');b.textContent=c==='all'?'All':CAT_LABEL[c];b.className=c===filter?'on':'';b.onclick=()=>{filter=c;sfx('click');onPick()};t.appendChild(b)});return t}

/* ---------- MALL ---------- */
function renderMall(v){
  checkDay();const open=openStores();
  if(sub==='alley')return renderAlley(v);
  if(sub&&isBanned(sub)){sub=null;toast('🚫 You\'re banned from that store');return renderMall(v)}
  if(sub){const s=STORES.filter(q=>q.id===sub)[0];
    if(!s||open.indexOf(s)<0){sub=null;toast('That store just closed!');return renderMall(v)}
    v.innerHTML=storeHero(s)+
      '<div class="subbar"><button class="btn alt" id="back">← Mall</button>'+heatPill()+(S.rap.optin&&stealWait(s.id)?'<span class="heat" style="background:#607d8b">🤏 try again in '+stealWait(s.id)+'d</span> ':'')+'<span class="small">Closes in <b class="cd">'+timeLeft()+'</b></span></div>';
    v.querySelector('#back').onclick=()=>{sfx('click');go('mall')};
    v.appendChild(tabsBar(['all'].concat(s.cats),rerender));
    const g=document.createElement('div');g.className='grid';v.appendChild(g);
    ITEMS.filter(i=>i.store===s.id&&(filter==='all'||i.cat===filter)).sort((a,b)=>(b.rare-a.rare)||(a.price-b.price)).forEach(i=>g.appendChild(itemCard(i,'store')));
    return;
  }
  v.innerHTML='<div class="card row sp"><div><b>📅 Day '+S.day+'</b> · new day in <b class="cd" style="font-size:18px">'+timeLeft()+'</b></div><span class="small">'+STORES.length+' stores · '+ITEMS.length+' items</span></div>'+
    '<div class="lbl">🔥 Daily Deals</div><div class="hs" id="deals"></div><div class="concourse"><div class="ctitle"><span>🏬 Main Concourse</span><span class="small">'+open.length+' open</span></div><div class="fronts" id="stores"></div></div>';
  deals().forEach(d=>v.querySelector('#deals').appendChild(itemCard(ITEM[d.id],'shop')));
  v.insertAdjacentHTML('afterbegin',eventBanner());
  open.forEach(s=>{const rare=ITEMS.filter(i=>i.store===s.id&&i.rare&&stockLeft(i)>0).length,bn=isBanned(s.id);
    v.querySelector('#stores').insertAdjacentHTML('beforeend',storefront(s,{banned:bn,flag:bn?'🚫 BANNED':rare?'✨ LIMITED':''}));const d=v.querySelector('#stores').lastChild;
    d.onclick=()=>{if(isBanned(s.id)){sfx('bad');toast('🚫 Security remembers your face. Banned until Day '+S.rap.bans[s.id]);return}sfx('click');go('mall',s.id)}});
  v.insertAdjacentHTML('beforeend','<div class="lbl" style="font-size:14px">🔒 Shutters down today</div><div class="closed-row">'+STORES.filter(s=>open.indexOf(s)<0).map(s=>'<span>'+esc(s.name)+'</span>').join('')+'</div>');v.appendChild(alleyCard());
}

/* ---------- CLOSET ---------- */
function renderCloset(v){
  const top=document.createElement('div');top.className='card center';
  const av=avatarCanvas(200,250);av.classList.add('idle');top.appendChild(av);
  top.insertAdjacentHTML('beforeend','<div style="font-weight:800;margin-top:4px">'+esc(S.char.name)+'</div><div class="small">Outfit: <b>'+money(SLOTS.reduce((t,k)=>t+(S.equipped[k]?ITEM[S.equipped[k]].price:0),0))+'</b> · Closet: <b>'+money(closetValue(S))+'</b> · Net worth: <b>'+money(netWorth(S))+'</b></div>');
  v.appendChild(top);v.appendChild(tabsBar(['all'].concat(SLOTS,ROOM_CATS),rerender));
  const mine=Object.keys(S.owned).map(id=>ITEM[id]).filter(i=>filter==='all'||i.cat===filter).sort((a,b)=>(a.slot?0:1)-(b.slot?0:1)||b.price-a.price);
  if(!mine.length){v.insertAdjacentHTML('beforeend','<div class="card">Nothing here yet. Hit the 🏬 Mall!</div>');return}
  const g=document.createElement('div');g.className='grid';mine.forEach(i=>g.appendChild(itemCard(i,'closet')));v.appendChild(g);
}

/* ---------- ROOM ---------- */
const COLS=8,ROWS=10,WALL=3;
const room={placing:null,sel:-1};
function fits(id,X,Y,ignore){const it=ITEM[id];
  if(X<0||X+it.w>COLS||Y+it.h>ROWS)return false;
  if(it.layer==='wall'){if(Y<0||Y+it.h>WALL)return false}else if(Y<WALL)return false;
  return S.room.every((p,i)=>{if(i===ignore)return true;const q=ITEM[p.id];if(q.layer!==it.layer)return true;return X+it.w<=p.x||p.x+q.w<=X||Y+it.h<=p.y||p.y+q.h<=Y});
}
function renderRoom(v){
  const placeable=Object.keys(S.owned).map(id=>ITEM[id]).filter(i=>!i.slot);
  v.innerHTML='<div class="card small" id="hint"></div>';
  const c=Math.floor(Math.min(window.innerWidth-24,560)/COLS),cv=document.createElement('canvas'),x=setupCanvas(cv,c*COLS,c*ROWS);v.appendChild(cv);
  v.insertAdjacentHTML('beforeend','<div class="row" style="margin-top:8px" id="ctl"></div><div class="lbl">Your furniture & decor</div><div class="grid" id="plist"></div>');
  function draw(){
    x.clearRect(0,0,c*COLS,c*ROWS);
    x.drawImage(roomBg(c),0,0,c*COLS,c*ROWS);
    if(room.placing||room.sel>=0){x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=1;for(let i=1;i<COLS;i++)line(x,i*c,0,i*c,ROWS*c);for(let j=1;j<ROWS;j++)line(x,0,j*c,COLS*c,j*c)}
    const order=S.room.map((p,i)=>({p:p,i:i,it:ITEM[p.id]}));
    const lay=l=>order.filter(o=>o.it.layer===l);
    lay('wall').concat(lay('rug')).forEach(o=>drawFurn(x,o.it,o.p.x*c,o.p.y*c,o.it.w*c,o.it.h*c));
    const objs=lay('floor').map(o=>({z:o.p.y+o.it.h,f:()=>{furnShadow(x,o.p.x*c,o.p.y*c,o.it.w*c,o.it.h*c);drawFurn(x,o.it,o.p.x*c,o.p.y*c,o.it.w*c,o.it.h*c)}}));
    objs.push({z:S.avatar.y+1.01,f:()=>{const sc=c*2.2/170;x.fillStyle='rgba(30,10,30,.22)';ell(x,(S.avatar.x+.5)*c,(S.avatar.y+.92)*c,c*.42,c*.12);x.fill();x.save();x.translate((S.avatar.x+.5)*c,(S.avatar.y+.92)*c-162*sc);x.scale(sc,sc);drawAvatar(x,S.char,S.equipped);x.restore()}});
    objs.sort((a,b)=>a.z-b.z).forEach(o=>o.f());
    x.drawImage(roomLight(c),0,0,c*COLS,c*ROWS);drawDoorstep(x,c);
    if(room.sel>=0){const p=S.room[room.sel],it=ITEM[p.id];x.strokeStyle='#ff1493';x.lineWidth=3;x.setLineDash([6,4]);x.strokeRect(p.x*c+2,p.y*c+2,it.w*c-4,it.h*c-4);x.setLineDash([])}
    const P=room.placing&&ITEM[room.placing];
    $('#hint').innerHTML=P?'Tap a spot to place <b>'+esc(P.name)+'</b> ('+P.w+'×'+P.h+(P.layer==='wall'?', goes on the wall':P.layer==='rug'?', rug: furniture can sit on it':'')+')':
      room.sel>=0?'Tap a new spot to move <b>'+esc(ITEM[S.room[room.sel].id].name)+'</b>, or remove it.':'Tap furniture to move it · tap the floor to walk · 💤 Sleep starts a new day';
    const ctl=$('#ctl');const pk=packagesReady().length;ctl.innerHTML=(pk?'<button class="btn green" id="collect">📦 Bring in '+pk+' package'+(pk>1?'s':'')+'</button>':'')+(room.sel>=0?'<button class="btn" id="rm">Remove</button>':'')+(room.placing||room.sel>=0?'<button class="btn alt" id="cx">Cancel</button>':'')+'<button class="btn alt" id="sleep" style="margin-left:auto">💤 Sleep (next day)</button>';
    if($('#collect'))$('#collect').onclick=()=>{collect()};
    if($('#rm'))$('#rm').onclick=()=>{S.room.splice(room.sel,1);room.sel=-1;sfx('click');save();draw();list()};
    if($('#cx'))$('#cx').onclick=()=>{room.sel=-1;room.placing=null;draw();list()};
    $('#sleep').onclick=()=>{nextDay();sfx('level');toast('☀️ Good morning! Day '+S.day+': new stores & deals');draw()};
  }
  function list(){const pl=$('#plist');pl.innerHTML='';
    if(!placeable.length){pl.innerHTML='<div class="card">No furniture yet. Try Ikeya, Targit, Thrift Shift or Wally\'s Mart!</div>';return}
    placeable.forEach(it=>{const left=S.owned[it.id]-S.room.filter(p=>p.id===it.id).length;const b=document.createElement('div');b.className='item';
      b.innerHTML='<img alt="" src="'+thumb(it)+'"><div class="nm">'+esc(it.name)+'</div><div class="small">'+it.w+'×'+it.h+(it.layer==='wall'?' wall':'')+' · '+left+' to place</div><button class="btn" '+(left?'':'disabled')+'>'+(room.placing===it.id?'Placing…':'Place')+'</button>';
      b.querySelector('button').onclick=()=>{room.placing=it.id;room.sel=-1;sfx('click');draw();list();window.scrollTo(0,0)};pl.appendChild(b)})}
  cv.addEventListener('pointerdown',e=>{
    const r=cv.getBoundingClientRect(),gx=Math.floor((e.clientX-r.left)/c),gy=Math.floor((e.clientY-r.top)/c);
    const hits=S.room.map((p,i)=>i).filter(i=>{const p=S.room[i],it=ITEM[p.id];return gx>=p.x&&gx<p.x+it.w&&gy>=p.y&&gy<p.y+it.h}).sort((a,b)=>(ITEM[S.room[a].id].layer==='rug')-(ITEM[S.room[b].id].layer==='rug'));
    if(room.placing){const it=ITEM[room.placing];
      if(fits(room.placing,gx,gy,-1)){S.room.push({id:room.placing,x:gx,y:gy});sfx('buy');if(S.room.filter(p=>p.id===room.placing).length>=S.owned[room.placing])room.placing=null;save()}
      else{sfx('bad');toast(it.layer==='wall'&&gy>=WALL?'Wall decor goes on the wall (top area)':it.layer!=='wall'&&gy<WALL?'Put that on the floor':'Doesn\'t fit there')}}
    else if(room.sel>=0&&hits.indexOf(room.sel)<0){
      if(fits(S.room[room.sel].id,gx,gy,room.sel)){S.room[room.sel].x=gx;S.room[room.sel].y=gy;room.sel=-1;sfx('click');save()}else{sfx('bad');toast('Doesn\'t fit there')}}
    else if(hits.length){room.sel=hits[0]===room.sel?-1:hits[0];sfx('click')}
    else if(gy>=WALL){S.avatar={x:gx,y:gy};room.sel=-1;save()}
    draw();list();
  });
  draw();list();
}

/* ---------- ME: stats, achievements, saves ---------- */
function renderMe(v){
  const top=document.createElement('div');top.className='card row';{const a=avatarCanvas(110,140);a.classList.add('idle');top.appendChild(a)}
  top.insertAdjacentHTML('beforeend','<div style="flex:1"><div style="font-size:20px;font-weight:800">'+esc(S.char.name)+'</div><div class="small">'+GENDERS[S.char.gender].label+' · '+BODIES[S.char.body].label+'</div><button class="btn" id="edit" style="margin-top:8px">✏️ Edit look</button></div>');
  v.appendChild(top);
  const st=[['📅 Day',S.day],['💵 Cash',money(S.cash)],['🏦 Net worth',money(netWorth(S))],['👗 Closet value',money(closetValue(S))],['📦 Items owned',itemCount(S)],['💼 Shifts worked',S.shifts],['💰 Earned at jobs',money(S.earned)],['🛍️ Total spent',money(S.spent)]];
  v.insertAdjacentHTML('beforeend','<div class="card"><div class="lbl" style="margin-top:0">📊 Stats</div>'+st.map(s=>'<div class="slot"><span>'+s[0]+'</span><b>'+s[1]+'</b></div>').join('')+'</div>');
  v.insertAdjacentHTML('beforeend',recordCard());
  v.insertAdjacentHTML('beforeend','<div class="card"><div class="lbl" style="margin-top:0">🏆 Achievements ('+Object.keys(S.ach).length+'/'+ACH.length+'), +'+money(ACH_REWARD)+' each</div><div class="ach">'+ACH.map(a=>'<div class="'+(S.ach[a[0]]?'got':'')+'"><b>'+a[1]+'</b><br>'+a[2]+'</div>').join('')+'</div></div>');
  let sl='<div class="card" id="saves"><div class="lbl" style="margin-top:0">💾 Saves</div><div class="small">'+(storageOK?'✅ Autosave is ON (saves after every action).':'⚠️ This viewer blocks storage: autosave & slots last only until you close it. Use <b>Export</b> to keep progress!')+'</div>';
  for(let n=1;n<=3;n++){const m=slotMeta(n);sl+='<div class="slot"><span><b>Slot '+n+'</b><br><span class="small">'+(m?esc(m.char?m.char.name:'?')+' · Day '+m.day+' · '+money(m.cash)+' · '+new Date(m.savedAt).toLocaleString():'Empty')+'</span></span><span><button class="btn" data-save="'+n+'">Save</button> <button class="btn alt" data-load="'+n+'" '+(m?'':'disabled')+'>Load</button></span></div>'}
  sl+='<div class="lbl">📤 Export / 📥 Import code</div><div class="small">Copy this code somewhere safe (notes app, message to yourself). Paste it back here to restore.</div>'+
    '<div class="row" style="margin:6px 0"><button class="btn" id="exp">Export code</button><button class="btn alt" id="copy">Copy</button></div><textarea id="code" placeholder="Your save code appears here, or paste one to import"></textarea>'+
    '<button class="btn green" id="imp" style="margin-top:6px">Import code</button></div>';
  v.insertAdjacentHTML('beforeend',sl);
  v.insertAdjacentHTML('beforeend','<div class="card row"><button class="btn alt" id="snd">'+(S.muted?'🔇 Sound off':'🔊 Sound on')+'</button><button class="btn alt" id="tut">❓ Tutorial</button><button class="btn alt" id="reset" style="margin-left:auto">Reset game</button></div>');
  $('#edit').onclick=()=>{draft=null;go('create')};
  onAll(v,'[data-save]',b=>{S.savedAt=Date.now();store.set(slotKey(b.dataset.save),JSON.stringify(S));sfx('coin');toast('Saved to slot '+b.dataset.save);rerender()});
  onAll(v,'[data-load]',b=>{try{S=normalize(JSON.parse(store.get(slotKey(b.dataset.load))));save();sfx('level');toast('Loaded slot '+b.dataset.load);go('me')}catch(e){toast('Could not load: '+e.message)}});
  $('#exp').onclick=()=>{const t=$('#code');t.value=exportCode();t.focus();t.select();sfx('click');toast('Code ready: copy it!')};
  $('#copy').onclick=()=>{const t=$('#code');if(!t.value)t.value=exportCode();t.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}
    try{if(navigator.clipboard)navigator.clipboard.writeText(t.value).then(()=>toast('Copied!'),()=>{})}catch(e){}toast(ok?'Copied!':'Long-press the text to copy it')};
  $('#imp').onclick=()=>{try{importCode($('#code').value);sfx('level');toast('Save imported! Welcome back, '+S.char.name);go('me')}catch(e){sfx('bad');toast('That code didn\'t work ('+e.message+')')}};
  $('#snd').onclick=()=>{S.muted=!S.muted;save();sfx('click');rerender()};
  $('#tut').onclick=()=>showTut(0);
  $('#reset').onclick=e=>{const b=e.target;if(b.dataset.armed){S=fresh();S.dayAt=Date.now();save();draft=null;go('create')}else{b.dataset.armed=1;b.textContent='Tap again to WIPE';b.style.background='#d32f2f';setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent='Reset game';b.style.background=''}},3000)}};
}

/* ---------- CHARACTER CREATOR ---------- */
let draft=null;
function defaultChar(g){const d=GENDERS[g];return{name:'',gender:g,body:d.body,skin:SKINS[1],hair:d.hair,hairColor:HAIR_COLORS[1][1]}}
function renderCreate(v){
  if(!draft)draft=S.char?Object.assign({},S.char):defaultChar('female');
  v.innerHTML='<div class="card center"><h2 style="margin:4px 0">'+(S.char?'Edit your look':'Create your Mall Rat')+'</h2><div id="pv"></div></div>'+
   '<div class="card"><div class="lbl" style="margin-top:0">Name</div><input type="text" id="nm" maxlength="14" placeholder="Shopper">'+
   '<div class="lbl">Gender</div><div class="chips" id="g"></div><div class="lbl">Body</div><div class="chips" id="bd"></div>'+
   '<div class="lbl">Skin tone</div><div class="sws" id="sk"></div><div class="lbl">Hair style</div><div class="chips" id="hs"></div><div class="lbl">Hair color</div><div class="sws" id="hc"></div>'+
   '<p class="small">Every item fits every body. Gender just sets your starting look.</p><button class="btn big" id="done">'+(S.char?'Save look ✔':'Let\'s go shopping! 🛍️')+'</button>'+(S.char?'<button class="btn alt big" id="cancel" style="margin-top:8px">Cancel</button>':'')+'</div>';
  const nm=$('#nm');nm.value=draft.name;nm.oninput=()=>{draft.name=nm.value};
  function opts(){
    const chip=(id,obj,key,lab)=>{$(id).innerHTML=Object.keys(obj).map(k=>'<button class="chip '+(draft[key]===k?'on':'')+'" data-k="'+k+'">'+(lab?lab(obj[k]):obj[k])+'</button>').join('');
      onAll($(id),'button',b=>{if(key==='gender'){draft=Object.assign(defaultChar(b.dataset.k),{name:draft.name,skin:draft.skin,hairColor:draft.hairColor})}else draft[key]=b.dataset.k;sfx('click');opts()})};
    chip('#g',GENDERS,'gender',o=>o.label);chip('#bd',BODIES,'body',o=>o.label);chip('#hs',HAIRS,'hair');
    const sw=(id,list,key)=>{$(id).innerHTML=list.map(c=>'<button class="sw '+(draft[key]===c?'on':'')+'" style="background:'+c+'" data-c="'+c+'"></button>').join('');onAll($(id),'button',b=>{draft[key]=b.dataset.c;sfx('click');opts()})};
    sw('#sk',SKINS,'skin');sw('#hc',HAIR_COLORS.map(h=>h[1]),'hairColor');
    const pv=$('#pv');pv.innerHTML='';pv.appendChild(avatarCanvas(190,240,draft,S.equipped));
  }
  opts();
  $('#done').onclick=()=>{const first=!S.char;draft.name=(draft.name||'').trim()||'Shopper';S.char=draft;draft=null;
    if(first){['tee','jeans','sneakers'].forEach(sh=>{const it=ITEMS.filter(i=>i.shape===sh&&!i.rare).sort((a,b)=>a.price-b.price)[0];if(it){S.owned[it.id]=1;S.equipped[it.slot]=it.id}})}
    sfx('level');save();go('mall');if(first&&!S.tutDone)showTut(0)};
  if($('#cancel'))$('#cancel').onclick=()=>{draft=null;go('me')};
}

/* ---------- TUTORIAL ---------- */
const TUT=[['mall','👋 Welcome to the mall! Stores rotate every in-game day (3 real minutes, or 💤 Sleep in your room). Check 🔥 Daily Deals and grab ✨ Limited items before they sell out.'],
 ['work','💼 Broke? Clock in! Each job is a 45-second tap minigame. Level up a job to earn more, and new jobs unlock as you work.'],
 ['closet','👗 Your closet: tap Wear to dress your avatar. 💲 sells an item for half price.'],
 ['room','🏠 Your room: furniture goes on the floor, art on the wall. Tap an item to move or remove it. Tap the floor to walk.'],
 ['online','📱 Online never closes: 📦 Clamazon (search, reviews, Crime membership = instant delivery), 🔨 Fleabay (bid on auctions or sell your stuff) and 🏷️ Facenook (haggle with sketchy sellers… beware knockoffs).',()=>{onTab='clam'}],
 ['online','📬 Packages land on your doorstep. Tap the mailbox up top (or the 📦 in your room) to bring them in. 🚚 Orders tracks every delivery.',()=>{onTab='orders'}],
 ['online','💳 Wallet: short on cash? The Mall Rat Card and Pay-in-4 let you buy now and pay 3% a day later. Future-you is watching.',()=>{onTab='wallet'}],
 ['me','⭐ Stats, achievements and SAVES live here. Use save slots, and Export a code as a backup.']];
function showTut(i){const o=$('#overlay');if(i>=TUT.length){o.hidden=true;S.tutDone=true;save();go('mall');return}
  if(TUT[i][2])TUT[i][2]();go(TUT[i][0]);o.hidden=false;o.innerHTML='<div class="card"><div style="font-size:15px">'+TUT[i][1]+'</div><div class="row sp" style="margin-top:8px"><span class="small">'+(i+1)+'/'+TUT.length+'</span><span><button class="btn alt" id="tskip">Skip</button> <button class="btn" id="tnext">'+(i===TUT.length-1?'Done':'Next ›')+'</button></span></div></div>';
  $('#tnext').onclick=()=>{sfx('click');showTut(i+1)};$('#tskip').onclick=()=>showTut(TUT.length)}
