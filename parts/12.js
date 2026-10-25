/* ============================== v8 ==============================
   Stage A: game-time shifts, pay rebalance (sim_v8.js), cashier backdrop, home goods online, load-order fix. */
JBG_DRAW.register=function(g,W,H){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#e8f1fb');gr.addColorStop(1,'#cfe0f5');g.fillStyle=gr;g.fillRect(0,0,W,H);
  // back shelves with products
  for(let s=0;s<2;s++){const y=8+s*26;g.fillStyle='#b0bec5';g.fillRect(0,y+20,W,3);for(let i=3;i<W;i+=11){g.fillStyle=['#ef9a9a','#90caf9','#a5d6a7','#ffe082','#ce93d8','#ffab91'][(i+s*5)%6];g.globalAlpha=.6;const h=10+((i*7)%8);g.fillRect(i,y+20-h,8,h);g.globalAlpha=1}}
  // big "CHECKOUT 3" sign
  g.fillStyle='#1e63c4';rr(g,W*.62,4,W*.34,18,4);g.fill();g.fillStyle='#fff';g.font='bold 11px sans-serif';g.textAlign='center';g.fillText('CHECKOUT 3 · 10 ITEMS-ISH',W*.79,17);
  // counter + conveyor belt
  g.fillStyle='#78909c';g.fillRect(0,H-40,W,40);g.fillStyle='#37474f';g.fillRect(W*.32,H-46,W*.4,10);g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1;for(let i=W*.32;i<W*.72;i+=8)line(g,i,H-46,i,H-36);
  g.fillStyle='#546e7a';g.fillRect(0,H-40,W,4);
  // register
  g.fillStyle='#263238';rr(g,W*.72,H-74,W*.24,36,5);g.fill();g.fillStyle='#455a64';g.fillRect(W*.74,H-40,W*.2,8);
  // candy rack + impulse buys
  g.fillStyle='#8d6e63';g.fillRect(W*.02,H-40,W*.06,40);['#e53935','#fdd835','#43a047'].forEach((c,i)=>{g.fillStyle=c;g.fillRect(W*.025,H-36+i*11,W*.05,7)});
  g.textAlign='left'};

/* home goods (wallpaper, flooring, plants, outdoor) now ship from Clamazon too */
(function(){const seen={};CLAM.forEach(i=>seen[i.id]=1);const r=rng(8088);
  shuffle(ITEMS.filter(i=>(i.surf||i.cat==='plants'||i.cat==='outdoor')&&!i.rare&&!i.fake),r).slice(0,40).forEach(i=>{if(!seen[i.id]){CLAM.push(i);seen[i.id]=1}})})();
const CLAM_CATS=()=>Object.keys(BASES).concat(['plants','outdoor','surface']);

/* stage B hooks (no-ops until defined below) */
function setPayMult(){return typeof brandSet==='function'&&brandSet()?brandSet().mult:1}
function setBonusLine(){const b=typeof brandSet==='function'&&brandSet();return b?' · 👑 '+b.name+' set bonus ×'+b.mult:''}

/* ============================== v8 Stage B ============================== */
/* ---- 5) real rooms. The CURRENT room lives in S.room + S.home.wall/floor (so all v1-v7 code keeps working);
   the others are stashed in S.home.rooms[key] = {room,wall,floor}. ---- */
const ROOM_DEFS=[
 {k:'bed',name:'Bedroom',emoji:'🛏️',price:0,desc:'Where the magic (napping) happens.'},
 {k:'closet',name:'Walk-in Closet',emoji:'👗',price:6000,rows:8,pal:['#efe3fb','#f8f1ff','#cdb9a8','#a88f7a'],desc:'A whole room for clothes you swear you\'ll wear.'},
 {k:'kitchen',name:'Kitchen',emoji:'🍳',price:20000,pal:['#fff4c7','#fffbe6','#e3e3e3','#bdbdbd'],desc:'For microwaving things beautifully.'},
 {k:'patio',name:'Backyard Patio',emoji:'⛱️',price:55000,pal:['#9fd8ff','#d7f0ff','#b0a79b','#8e857a'],desc:'Wall? That\'s the sky now. Very feng shui.'},
 {k:'theater',name:'Home Theater',emoji:'🎬',price:140000,pal:['#3b1f3a','#552c52','#7b1f2a','#5a1620'],desc:'Velvet walls. Popcorn floor (optional).'},
 {k:'penthouse',name:'Penthouse Suite',emoji:'🏙️',price:420000,rows:12,pal:['#e9eef5','#ffffff','#eae2d6','#cfc3b0'],desc:'Floor-to-ceiling windows. Floor-to-ceiling ego.'}];
function roomDef(k){return ROOM_DEFS.filter(r=>r.k===k)[0]||ROOM_DEFS[0]}
function roomsValue(){return (S.home&&S.home.have||[]).reduce((a,k)=>a+roomDef(k).price*1.2,0)}
function allRooms(){const out={};out[S.home.cur||'bed']={room:S.room,wall:S.home.wall,floor:S.home.floor};Object.keys(S.home.rooms||{}).forEach(k=>out[k]=S.home.rooms[k]);return out}
function placedCount(id){const R0=allRooms();return Object.keys(R0).reduce((t,k)=>t+R0[k].room.filter(p=>p.id===id).length,0)}
function switchRoom(k){if(k===S.home.cur||S.home.have.indexOf(k)<0)return;
  S.home.rooms[S.home.cur]={room:S.room,wall:S.home.wall,floor:S.home.floor};const t=S.home.rooms[k]||{room:[],wall:null,floor:null};delete S.home.rooms[k];
  S.room=t.room;S.home.wall=t.wall;S.home.floor=t.floor;S.home.cur=k;room.sel=-1;room.placing=null;syncRows();
  if(S.avatar.y>=ROWS)S.avatar.y=ROWS-1;sfx('whoosh');save();rerender()}
function roomSwitcher(){if(S.home.have.length<2)return'';return'<div class="tabs" id="rsw" style="margin-bottom:8px">'+S.home.have.map(k=>{const d=roomDef(k);return'<button data-room="'+k+'" title="'+d.name+'" class="'+(k===S.home.cur?'on':'')+'">'+d.emoji+' '+d.name.split(' ').pop()+'</button>'}).join('')+'</div>'}
function bindSwitcher(){const r=$('#rsw');if(r)onAll(r,'[data-room]',b=>switchRoom(b.dataset.room))}
function roomsSheet(){
  sheet('<h3>🏗️ Rooms &amp; upgrades</h3><div class="small">Each room is its own space with its own wallpaper, floor and furniture. Switch rooms from the tabs above your room.</div>'+
   ROOM_DEFS.map(d=>{const has=S.home.have.indexOf(d.k)>=0;return'<div class="slot"><span>'+d.emoji+' <b>'+d.name+'</b><br><span class="small">'+d.desc+(d.price?' · '+money(d.price):'')+'</span></span>'+(has?'<button class="btn alt" data-go="'+d.k+'">'+(S.home.cur===d.k?'You\'re here':'Go')+'</button>':'<button class="btn" data-buy="'+d.k+'">Build</button>')+'</div>'}).join('')+
   '<div class="lbl">🛏️ Bedroom expansions</div>'+[[1,25000,'+2 rows of floor space'],[2,120000,'+2 more rows'],[3,450000,'Mansion wing: +2 rows']].map(u=>'<div class="slot"><span>'+u[2]+'<br><span class="small">'+money(u[1])+'</span></span>'+(S.home.size>=u[0]?'<b>✅</b>':S.home.size===u[0]-1?'<button class="btn" data-u="'+u[0]+'">Buy</button>':'<span class="small">🔒</span>')+'</div>').join(''));
  onAll($('#sheet'),'[data-go]',b=>{closeSheet();if(screen!=='room'||sub)go('room');switchRoom(b.dataset.go)});
  onAll($('#sheet'),'[data-buy]',b=>{const d=roomDef(b.dataset.buy);openPay('Build: '+d.name,d.price,()=>{S.home.have.push(d.k);sfx('level');burst(24);toast('🏗️ '+d.name+' built! Tap its tab to decorate.');save();closeSheet();go('room');switchRoom(d.k)})});
  onAll($('#sheet'),'[data-u]',b=>{const n=+b.dataset.u,cost=[0,25000,120000,450000][n];openPay('Bedroom expansion',cost,()=>{S.home.size=n;syncRows();sfx('level');burst(24);toast('🏗️ Construction complete!');save();rerender()})})}

/* ---- 6) outfit presets + fit-check photos ---- */
function outfitCard(v){const b=brandSet();
  v.insertAdjacentHTML('beforeend','<div class="card"><div class="row sp"><b>👯 Outfits</b><span><button class="btn" id="ofsave">💾 Save look</button> <button class="btn alt" id="fitpic">📸 Fit check</button></span></div>'+
   (b?'<div class="small" style="margin-top:6px">👑 <b>'+esc(b.name)+' set</b> ('+b.n+' pieces): job pay ×'+b.mult+'</div>':'<div class="small" style="margin-top:6px">Wear 3+ pieces from one brand for a set bonus on job pay.</div>')+
   (S.outfits.length?'<div class="hs" style="margin-top:6px">'+S.outfits.map((o,i)=>'<div class="item" style="min-width:110px"><div class="nm">'+esc(o.n)+'</div><div class="small">'+Object.keys(o.eq).length+' pieces</div><button class="btn green" data-wear="'+i+'">Wear</button><button class="btn alt" data-del="'+i+'" style="margin-top:4px">✕</button></div>').join('')+'</div>':'')+'</div>');
  $('#ofsave').onclick=()=>{if(!Object.keys(S.equipped).length){toast('Wear something first!');return}if(S.outfits.length>=8){toast('8 outfits max. Delete one first');return}
    const nm=['Brunch Baddie','Mall Walker','CEO of Vibes','Thrift Wizard','Date Night','Main Character','Laundry Day Chic','Court Appearance'][S.outfits.length%8];S.outfits.push({n:nm,eq:Object.assign({},S.equipped)});sfx('buy');toast('💾 Saved "'+nm+'"');save();rerender()};
  $('#fitpic').onclick=fitCheck;
  onAll(v,'[data-wear]',b=>{const o=S.outfits[+b.dataset.wear];let miss=0;S.equipped={};Object.keys(o.eq).forEach(k=>{if(S.owned[o.eq[k]])S.equipped[k]=o.eq[k];else miss++});S.stats8.wears++;sfx('click');toast(miss?'Wore it (minus '+miss+' sold piece'+(miss>1?'s':'')+')':'✨ Outfit on!');save();rerender();avMood('happy')});
  onAll(v,'[data-del]',b=>{S.outfits.splice(+b.dataset.del,1);save();rerender()})}
const HYPE=['Serving. Absolutely serving.','The mall security guard just whistled.','This fit pays rent (it does not).','Certified drip. Do not touch.','Thrift store gods are weeping.','Main character energy detected.','Fashion week called. Wrong number, but still.'];
function dripScore(){const v=SLOTS.reduce((t,k)=>t+(S.equipped[k]?ITEM[S.equipped[k]].price:0),0);return Math.min(100,Math.round(Object.keys(S.equipped).length*8+Math.log10(1+v)*12+(brandSet()?10:0)))}
function fitCheck(){const W=720,H=960,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  let g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#ff3d81');g.addColorStop(.55,'#7c4dff');g.addColorStop(1,'#29b6f6');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.globalAlpha=.12;x.fillStyle='#fff';for(let i=0;i<40;i++){circ(x,(i*137)%W,(i*271)%H,8+(i%5)*6);x.fill()}x.globalAlpha=1;
  x.fillStyle='rgba(255,255,255,.18)';ell(x,W/2,H*.82,190,36);x.fill();
  x.save();x.translate(W/2,H*.82-162*3.3);x.scale(3.3,3.3);drawAvatar(x,S.char,S.equipped);x.restore();
  x.fillStyle='#fff';x.textAlign='center';x.font='bold 64px '+SERIF;x.fillText('FIT CHECK',W/2,92);x.font='bold 30px sans-serif';x.fillText(S.char.name+(S.title?' · '+achName(S.title):''),W/2,140);
  const sc=dripScore(),b=brandSet(),val=SLOTS.reduce((t,k)=>t+(S.equipped[k]?ITEM[S.equipped[k]].price:0),0);
  x.fillStyle='rgba(0,0,0,.35)';rr(x,40,H-120,W-80,88,18);x.fill();x.fillStyle='#fff';x.font='bold 30px sans-serif';x.fillText('💧 Drip '+sc+'/100 · fit worth '+money(val)+(b?' · 👑 '+b.name:''),W/2,H-80);
  x.font='24px sans-serif';x.fillText(HYPE[sc%HYPE.length],W/2,H-46);x.font='18px sans-serif';x.globalAlpha=.8;x.fillText('Mall Rat Tycoon · Day '+S.day,W/2,H-8);x.globalAlpha=1;
  S.stats8.photos++;save();photoSheet(c.toDataURL('image/png'),'fit-check')}
function roomPhoto(cv){const W=cv.width,H=cv.height,c=document.createElement('canvas');c.width=W;c.height=H+90;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H+90);x.drawImage(cv,0,0);
  x.fillStyle='#222';x.textAlign='center';x.font='bold 30px sans-serif';x.fillText(S.char.name+'\'s '+roomDef(S.home.cur).name+' · '+decorScore()+'/100 ✨',W/2,H+50);S.stats8.photos++;save();photoSheet(c.toDataURL('image/png'),'room')}
function photoSheet(url,name){sheet('<h3>📸 Looking good</h3><img src="'+url+'" style="width:100%;border-radius:14px" alt="photo"><button class="btn big green" id="dl">⬇️ Save PNG</button><button class="btn alt" id="dlhelp" hidden style="width:100%;margin-top:6px">🤔 Didn\'t save? Show photo</button><div class="small">If the download doesn\'t start (some phone viewers block it), long-press the picture and choose "Download image".</div>');
  $('#dl').onclick=()=>{let ok=false;try{const a=document.createElement('a');let href=url;try{if(window.Blob&&window.URL&&URL.createObjectURL&&/^data:/.test(url)){const bs=atob(url.split(',')[1]),u=new Uint8Array(bs.length);for(let i=0;i<bs.length;i++)u[i]=bs.charCodeAt(i);href=URL.createObjectURL(new Blob([u],{type:'image/png'}));setTimeout(()=>{try{URL.revokeObjectURL(href)}catch(e){}},60000)}}catch(e){}
    a.href=href;a.download='mall-rat-'+name+'-day'+S.day+'.png';document.body.appendChild(a);a.click();a.remove();ok=!dlBlocked()}catch(e){photoOverlay(url);return}
    const h=$('#dlhelp');if(h)h.hidden=false;if(ok)toast('📸 Download started');else toast('Your viewer may block downloads. Tap "Didn\'t save?" below.')};
  $('#dlhelp').onclick=()=>photoOverlay(url)}
function dlBlocked(){if(window.__forceDlBlock)return true;let f=false;try{f=window.self!==window.top}catch(e){f=true}let o='';try{o=String(window.origin||location.origin)}catch(e){}return f||o==='null'||/; wv\)/.test(navigator.userAgent)}
function photoOverlay(url){const old=document.getElementById('phov');if(old)old.remove();const d=document.createElement('div');d.id='phov';d.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;gap:12px';
  d.innerHTML='<div style="color:#fff;font-weight:800;font-size:18px;text-align:center">👆 Press and hold the photo to save it</div><img src="'+url+'" alt="photo" style="max-width:100%;max-height:72vh;border-radius:14px;-webkit-touch-callout:default;user-select:auto;pointer-events:auto"><div style="color:#ccc;font-size:13px;text-align:center">This viewer blocks downloads. Choose "Download image" / "Save image".</div><button class="btn big" id="phx">Done</button>';
  document.body.appendChild(d);d.querySelector('#phx').onclick=()=>d.remove()}

/* ---- 7) collection log, limited drops, brand set bonuses ---- */
const COLLAB_STORE={id:'collab',name:'Celebrity Collabs',tag:'Limited. Hyped. Overpriced. Perfect.',color:'#111111',emoji:'🌟',cats:['tops','hats','shoes','accessories','bottoms'],tier:[300,20000],drop:true};
STORES.push(COLLAB_STORE);
const DROP_DEFS=[['Kanye Rest','slides','shoes','Black',900],['Taylor Shift','sweater','tops','Lavender',650],['Drakeh','hoodie','tops','Black',1200],['Bad Bunnyish','bucket','hats','Pink',480],
 ['Rihannuh','handbag','accessories','Red',4800],['Beyonce-adjacent','sunglasses','accessories','Gold',2200],['Post Maloney','chain','accessories','Silver',3100],['Billie Eyelash','puffer','tops','Lime',1800],
 ['Harry Stiles','blazer','tops','Pink',5200],['Snoop Dogg-ish','joggers','bottoms','Purple',700],['Lady GooGoo','heels','shoes','Hot Pink',7500],['Elton Johnless','crown','hats','Gold',15000]];
const DROPS=[];(function(){DROP_DEFS.forEach((d,i)=>{const c=COLORS.filter(q=>q[0]===d[3])[0]||COLORS[i%COLORS.length];const base=BASES[d[2]].filter(b=>b.key===d[1])[0];
  const it={id:'d8-'+i,store:'collab',name:d[0]+' x Mall '+base.name,cat:d[2],slot:d[2],shape:d[1],price:d[4],color:c[1],colorName:c[0],pattern:'sparkle',rare:true,stock:5,w:1,h:1,layer:'floor',drop:true,celeb:d[0]};
  ITEMS.push(it);ITEM[it.id]=it;DROPS.push(it)})})();
const weekNo=d=>Math.floor(((d||S.day)-1)/7);
function weeklyDrop(){return DROPS[weekNo()%DROPS.length]}
function dropCard(){const it=weeklyDrop(),left=stockLeft(it),dl=7-((S.day-1)%7);return'<div class="card row" id="dropcard" style="background:linear-gradient(120deg,#111,#3a2b4a);color:#fff"><img src="'+thumb(it)+'" style="width:72px;border-radius:12px" alt=""><div style="flex:1"><b>🌟 Weekly Drop</b><div>'+esc(it.name)+'</div><div class="small" style="color:#ddd">'+money(priceOf(it))+' · '+(left?left+' of 5 left':'SOLD OUT')+' · gone in '+dl+'d</div></div><button class="btn" id="dropbuy" '+(left?'':'disabled')+'>Cop</button></div>'}
function bindDrop(){const b=$('#dropbuy');if(b)b.onclick=()=>{const it=weeklyDrop();if(stockLeft(it)<=0)return;buy(it)}}
const SET_STORES=()=>STORES.filter(s=>!s.park);
function brandSet(){if(!S||!S.equipped)return null;const n={};Object.keys(S.equipped).forEach(k=>{const it=ITEM[S.equipped[k]];if(it&&!it.fake)n[it.store]=(n[it.store]||0)+1});
  let best=null;Object.keys(n).forEach(sid=>{if(n[sid]>=3&&(!best||n[sid]>best.n)){const st=STORES.filter(s=>s.id===sid)[0];best={id:sid,name:st?st.name:sid,n:n[sid],mult:n[sid]>=5?1.25:n[sid]>=4?1.15:1.1}}});return best}
function collStores(){return STORES.filter(s=>ITEMS.some(i=>i.store===s.id&&!i.fake))}
function collOf(sid){const all=ITEMS.filter(i=>i.store===sid&&!i.fake),got=all.filter(i=>S.coll[i.id]);return{all:all,got:got,pct:Math.round(got.length/all.length*100),rare:all.filter(i=>i.rare),rareGot:got.filter(i=>i.rare)}}
const COLL_MS=[25,50,100];
function collReward(sid,m){const st=STORES.filter(s=>s.id===sid)[0];return Math.min(5000,nicePrice(Math.max(20,(st?st.tier[1]:200)*[.02,.06,.25][m])))}
function v8Save(){if(!S.coll)return;Object.keys(S.owned).forEach(id=>{if(!S.coll[id]&&ITEM[id]&&!ITEM[id].fake)S.coll[id]=1});
  // brand milestone rewards
  if(S.char)collStores().forEach(s=>{const c=collOf(s.id),lv=S.collRew[s.id]||0;if(lv<3&&c.pct>=COLL_MS[lv]){S.collRew[s.id]=lv+1;const r=collReward(s.id,lv);S.cash+=r;setTimeout(()=>{toast('📚 '+s.name+' collection '+COLL_MS[lv]+'%! +'+money(r));sfx('level')},900)}});
  placeFix()}
function placeFix(){if(!S.home||!S.home.rooms)return;const R0=allRooms();Object.keys(R0).forEach(k=>{R0[k].room=R0[k].room.filter(p=>ITEM[p.id]&&S.owned[p.id])});
  const cnt={};Object.keys(R0).sort((a,b)=>(a===S.home.cur)-(b===S.home.cur)).forEach(k=>{});
  Object.keys(R0).forEach(k=>{const keep=[];R0[k].room.forEach(p=>{cnt[p.id]=(cnt[p.id]||0)+1;if(cnt[p.id]<=S.owned[p.id])keep.push(p)});R0[k].room=keep});
  S.room=R0[S.home.cur].room;Object.keys(S.home.rooms).forEach(k=>{S.home.rooms[k].room=R0[k].room;['wall','floor'].forEach(f=>{const id=S.home.rooms[k][f];if(id&&!S.owned[id])S.home.rooms[k][f]=null})})}
function collCard(v){const st=collStores(),tot=ITEMS.filter(i=>!i.fake).length,got=Object.keys(S.coll).length;
  v.insertAdjacentHTML('beforeend','<div class="card" id="collcard"><div class="row sp"><b>📚 Collection log</b><button class="btn" id="collopen">Open</button></div><div class="small">'+got+' / '+tot+' items ever owned · '+DROPS.filter(i=>S.coll[i.id]).length+'/'+DROPS.length+' collab drops · '+Object.keys(S.collRew).reduce((a,k)=>a+S.collRew[k],0)+' brand milestones</div><div class="bar"><div style="width:'+(got/tot*100)+'%"></div></div></div>');
  $('#collopen').onclick=collSheet}
function collSheet(open){const st=collStores().map(s=>({s:s,c:collOf(s.id)})).sort((a,b)=>b.c.pct-a.c.pct||a.s.name.localeCompare(b.s.name));
  sheet('<h3>📚 Collection log</h3><div class="small">Own an item once and it\'s logged forever. Brand milestones at 25/50/100% pay out cash. ✨ = Limited, 🌟 = collab drop.</div>'+
   st.map(o=>'<div class="slot" data-cs="'+o.s.id+'" style="display:block;cursor:pointer"><div class="row sp"><b>'+o.s.emoji+' '+esc(o.s.name)+'</b><span class="small">'+o.c.got.length+'/'+o.c.all.length+' · ✨'+o.c.rareGot.length+'/'+o.c.rare.length+' · '+'⭐'.repeat(S.collRew[o.s.id]||0)+'</span></div><div class="bar"><div style="width:'+o.c.pct+'%"></div></div>'+
     (open===o.s.id?'<div class="grid" style="margin-top:6px">'+o.c.all.map(i=>'<div class="item" style="'+(S.coll[i.id]?'':'filter:grayscale(1) brightness(.35)')+'"><img alt="" src="'+thumb(i)+'"><div class="nm">'+(S.coll[i.id]?esc(i.name):'???')+(i.rare?' ✨':'')+(i.drop?' 🌟':'')+'</div></div>').join('')+'</div>':'')+'</div>').join(''));
  onAll($('#sheet'),'[data-cs]',b=>{collSheet(open===b.dataset.cs?null:b.dataset.cs)})}

/* ---- save migration for v8 fields (runs in normalize for v2..v7 saves) ---- */
function v8Fix(s){const f8={outfits:[],coll:{},collRew:{},stats8:{wears:0,photos:0,bins:0,doors:0,drops:0,visits:{},wins:0,resold:0,resProfit:0,stockProfit:0,trades:0,neighborRates:0},title:null,muzak:false,
    mkt:null,hustle:[],ev:{},nb:{week:-1,scores:{}}};
  Object.keys(f8).forEach(k=>{if(s[k]===undefined||s[k]===null&&f8[k]!==null)s[k]=f8[k]});s.stats8=Object.assign({},f8.stats8,s.stats8);
  const h=s.home;if(!h.have){h.have=['bed'];if(h.size>=1)h.have.push('closet');if(h.size>=2)h.have.push('kitchen');if(h.size>=3)h.have.push('patio')}
  h.rooms=h.rooms||{};h.cur=h.cur||'bed';if(h.have.indexOf(h.cur)<0)h.cur='bed';
  Object.keys(h.rooms).forEach(k=>{const r=h.rooms[k];r.room=(r.room||[]).filter(p=>ITEM[p.id]&&s.owned[p.id]);['wall','floor'].forEach(q=>{if(r[q]&&!(ITEM[r[q]]&&s.owned[r[q]]))r[q]=null})});
  Object.keys(s.coll).forEach(id=>{if(!ITEM[id])delete s.coll[id]});Object.keys(s.owned).forEach(id=>{if(!ITEM[id].fake)s.coll[id]=1});
  s.outfits=s.outfits.filter(o=>o&&o.eq);s.hustle=(s.hustle||[]).filter(l=>ITEM[l.id])}
function achName(k){const a=ACH.filter(q=>q[0]===k)[0];return a?a[1].replace(/\s*\S+$/,''):''}
function decorScore(){const R0=allRooms();let s=0,val=0,n=0;const kinds={};Object.keys(R0).forEach(k=>{const r=R0[k];n+=r.room.length;if(r.wall)s+=4;if(r.floor)s+=4;r.room.forEach(p=>{const it=ITEM[p.id];val+=it.price;kinds[it.shape]=1;if(it.plant&&wiltOf(it))s-=2})});
  s+=Math.min(30,n*2.5)+Math.min(20,Object.keys(kinds).length*2)+Math.min(25,Math.log10(1+val)*4.5)+Math.min(10,(S.home.have.length-1)*2.5);return Math.max(0,Math.min(100,Math.round(s)))}

/* ============================== v8 Stage C ============================== */
/* ---- 8) weekly mall events: the last 3 days (5-7) of every in-game week ---- */
const WEV=[{k:'stampede',name:'Black Friday Stampede',emoji:'🛒',desc:'25% off the whole mall + doorbuster grabs (3 tries a day). Elbows out.'},
 {k:'clearance',name:'Clearance Bin Bonanza',emoji:'🗑️',desc:'Rummage mystery bins for cheap finds. Smells like a basement.'},
 {k:'collab',name:'Celebrity Collab Weekend',emoji:'🌟',desc:'Next week\'s collab drop releases EARLY and celebs are "spotted" at the mall.'}];
const dow=d=>((d||S.day)-1)%7;// 0..6
function weekEvent(){return dow()>=4?WEV[weekNo()%WEV.length]:null}
function weeklyOff(it){const e=weekEvent();return e&&e.k==='stampede'&&MALL_STORE[it.store]?25:0}
function weeklyDrops(){const a=[weeklyDrop()];const e=weekEvent();if(e&&e.k==='collab')a.push(DROPS[(weekNo()+1)%DROPS.length]);return a}
function evDay(){if(S.ev.day!==S.day)S.ev={day:S.day,tries:0,doors:[],bins:0};return S.ev}
function weekBanner(){const e=weekEvent();if(!e){const n=4-dow();return'<div class="small" style="margin:0 4px 8px">📆 Weekend event in '+n+' day'+(n>1?'s':'')+': '+WEV[weekNo()%WEV.length].emoji+' '+WEV[weekNo()%WEV.length].name+'</div>'}
  return'<div class="card" id="wev" style="background:linear-gradient(120deg,#ffd54f,#ff8a65);border:0"><b>'+e.emoji+' '+e.name+'</b> · ends in '+(7-dow())+'d<div class="small" style="color:#3e2723">'+e.desc+'</div>'+
   (e.k==='stampede'?'<button class="btn" id="stampede" style="margin-top:6px">🏃 Hit the doorbusters ('+(3-evDay().tries)+' tries left)</button>'+evDay().doors.map(d=>{const it=ITEM[d.id];return'<div class="slot"><span>'+esc(it.name)+'<br><span class="small"><s>'+money(it.price)+'</s> '+money(d.p)+'</span></span>'+(d.got?'<b>✅</b>':'<button class="btn green" data-door="'+d.id+'">Grab</button>')+'</div>'}).join(''):'')+
   (e.k==='clearance'?'<div class="row" style="margin-top:6px">'+[[20,'🧺 Small bin'],[100,'🗑️ Big bin'],[500,'📦 Pallet']].map(b=>'<button class="btn" data-bin="'+b[0]+'">'+b[1]+' '+money(b[0])+'</button>').join('')+'</div><div class="small">'+(8-evDay().bins)+' rummages left today</div>':'')+
   (e.k==='collab'?'<div class="small">'+pick(['📸 Rumor: Kanye Rest was seen buying socks at Wally\'s Mart.','📸 Taylor Shift is signing receipts at the food court.','📸 Someone swears Drakeh is in line at Burger Bonanza.'])+'</div>':'')+'</div>'}
function bindWeek(){const s=$('#stampede');if(s)s.onclick=stampede;onAll(document,'[data-door]',b=>{const d=evDay().doors.filter(q=>q.id===b.dataset.door)[0];if(!d||d.got)return;if(S.cash<d.p){toast('Not enough cash. Doorbusters are cash-only, no cap');sfx('bad');return}
    S.cash-=d.p;S.spent+=d.p;d.got=1;S.owned[d.id]=(S.owned[d.id]||0)+1;S.stats8.doors++;sfx('buy');burst(16);toast('🛒 Doorbuster secured!');save();rerender()});
  onAll(document,'[data-bin]',b=>rummage(+b.dataset.bin))}
function stampede(){const ev=evDay();if(ev.tries>=3){toast('Security says: come back tomorrow');return}ev.tries++;save();
  const pool=ITEMS.filter(i=>MALL_STORE[i.store]&&!i.rare&&!i.fake&&i.price>=40&&i.price<=6000),prize=pool[Math.floor(Math.random()*pool.length)];
  sheet('<h3>🛒 STAMPEDE!</h3><div class="small">The doors open. Tap GRAB when the marker is in the green gap between shoppers.</div><canvas id="stc"></canvas><button class="btn big green" id="stgo">🙌 GRAB!</button>');
  const W=Math.min(innerWidth-48,420),H=90,x=setupCanvas($('#stc'),W,H),gap=[.35+Math.random()*.4],gw=.14;let t=0,done=false;
  const iv=setInterval(()=>{if(done||sheetOpen()===false){clearInterval(iv);return}t+=.035;const m=(Math.sin(t*2.6)+1)/2;x.fillStyle='#eceff1';x.fillRect(0,0,W,H);x.fillStyle='#a5d6a7';x.fillRect(W*(gap[0]-gw/2),0,W*gw,H);
    x.font='26px sans-serif';for(let i=0;i<8;i++){const px=(i/8+t*.05)%1;if(Math.abs(px-gap[0])>gw/2)x.fillText(['🏃','🏃‍♀️','🛒','👵','🧔'][i%5],px*W-12,H*.62)}
    x.fillStyle='#d32f2f';x.fillRect(m*W-3,0,6,H);x.__m=m},30);
  $('#stgo').onclick=()=>{if(done)return;done=true;clearInterval(iv);const m=x.__m||0,hit=Math.abs(m-gap[0])<=gw/2||window.__stampedeWin;
    if(hit){const p=Math.max(1,Math.round(prize.price*.3));ev.doors.push({id:prize.id,p:p});sfx('level');burst(20);sheet('<h3>🎉 You got one!</h3><img src="'+thumb(prize)+'" style="width:120px;border-radius:12px"><p><b>'+esc(prize.name)+'</b> for <b>'+money(p)+'</b> (70% off). It\'s waiting in the event card.</p><button class="btn big" id="stok">Nice</button>')}
    else{sfx('bad');sheet('<h3>😵 Trampled</h3><p>A grandma with a shopping cart body-checked you into a display of discount crocs.</p><button class="btn big" id="stok">Ouch</button>')}
    save();$('#stok').onclick=()=>{closeSheet();rerender()}}}
function rummage(fee){const ev=evDay();if(ev.bins>=8){toast('The bins are empty. Just a sock left.');return}if(S.cash<fee){toast('Need '+money(fee));sfx('bad');return}
  S.cash-=fee;S.spent+=fee;ev.bins++;S.stats8.bins++;const pool=ITEMS.filter(i=>MALL_STORE[i.store]&&!i.rare&&!i.fake&&i.price>=fee*.25&&i.price<=fee*4);
  const r=Math.random(),tgt=fee*(r<.5?.4+r:r<.9?1+r:2+r*2),it=pool.sort((a,b)=>Math.abs(a.price-tgt)-Math.abs(b.price-tgt))[Math.floor(Math.random()*5)];
  S.owned[it.id]=(S.owned[it.id]||0)+1;sfx(it.price>fee?'level':'coin');if(it.price>fee*1.5)burst(16);
  sheet('<h3>🗑️ You dig around…</h3><img src="'+thumb(it)+'" style="width:120px;border-radius:12px"><p>Found <b>'+esc(it.name)+'</b> (worth '+money(it.price)+')! '+(it.price>fee*1.5?'Absolute steal (legally).':it.price<fee?'Hm. It was in the bin for a reason.':'Fair trade.')+'</p><button class="btn big" id="rok">Keep digging</button>');
  save();$('#rok').onclick=()=>{closeSheet();rerender()}}

/* ---- 9) neighbors ---- */
const NEIGHBORS=[{k:'karen',name:'Karen Kardashi-ish',face:'💅',base:38,grow:4,line:'Is that wallpaper… from THIS season? Bold.',likes:'expensive'},
 {k:'chad',name:'Chad Thundermall',face:'🏋️',base:30,grow:5,line:'My house is 90% protein powder storage, bro.',likes:'electronics'},
 {k:'gretchen',name:'Grandma Gretchen',face:'👵',base:45,grow:2,line:'I knitted my roof. Want a cookie?',likes:'plants'},
 {k:'mike',name:'Minimalist Mike',face:'🧘',base:25,grow:4,line:'I own one chair. It is enough. It is everything.',likes:'few'},
 {k:'gary',name:'Gnome Guy Gary',face:'🧙',base:35,grow:3,line:'347 garden gnomes. They watch. They judge.',likes:'outdoor'}];
function homeScore(){return Math.min(100,Math.round(decorScore()*.6+curbAppeal()*.4)+(typeof petBonus==='function'?petBonus():0)+(typeof apt==='function'&&S.apt?apt().home:0))}
function nbScore(n,w){const r=rng(hash(n.k)+w*7919)();return Math.min(97,Math.round(n.base+n.grow*Math.min(w,12)+r*18))}
function rateLine(n,sc){const hi=sc>=70,mid=sc>=40;return n.k==='karen'?(hi?'Okay fine. It\'s giving penthouse. I hate you.':mid?'Cute! In a "rental" way.':'Do you… live here? Like on purpose?'):
  n.k==='chad'?(hi?'BRO. This place has GAINS.':mid?'Solid. Needs a squat rack in the living room.':'Where is the TV, bro. Where is it.'):
  n.k==='gretchen'?(hi?'Oh sweetie, it\'s lovely! Here, a cookie.':mid?'Very nice, dear. Water your ferns.':'It\'s… cozy! I\'ll bring a quilt.'):
  n.k==='mike'?(hi?'Too much stuff. And yet… I feel peace.':mid?'You could lose 40% of this and be free.':'Empty. Perfect. I cried.'):
  (hi?'Your yard energy is IMMACULATE. The gnomes approve.':mid?'Decent. Needs ~200 more gnomes.':'No gnomes? Bold. Wrong, but bold.')}
function neighborSheet(){const w=weekNo(),me=homeScore(),rows=NEIGHBORS.map(n=>({n:n,s:nbScore(n,w)})).concat([{me:1,s:me}]).sort((a,b)=>b.s-a.s);
  sheet('<h3>🏘️ The Block</h3><div class="small">Neighbors rate homes all week (60% interior across all rooms, 40% curb appeal). At the end of each in-game week the best-decorated home wins a cash prize: <b>'+money(contestPrize(w))+'</b> this week. Wins so far: '+S.stats8.wins+'</div>'+
   '<div class="lbl">🏆 This week\'s standings (ends in '+(7-dow())+'d)</div>'+rows.map((r,i)=>'<div class="slot"><span>'+(i+1)+'. '+(r.me?'🏠 <b>You</b>':r.n.face+' '+esc(r.n.name))+'</span><b>'+r.s+'</b></div>').join('')+
   '<div class="lbl">🚪 Visit</div>'+NEIGHBORS.map(n=>'<div class="slot"><span>'+n.face+' '+esc(n.name)+'</span><button class="btn alt" data-nb="'+n.k+'">Visit</button></div>').join(''));
  onAll($('#sheet'),'[data-nb]',b=>visitNb(NEIGHBORS.filter(n=>n.k===b.dataset.nb)[0]))}
function contestPrize(w){return Math.min(2500,300+150*w)}
function visitNb(n){S.stats8.visits[n.k]=1;S.stats8.neighborRates++;save();const w=weekNo(),me=homeScore();
  sheet('<h3>'+n.face+' '+esc(n.name)+'</h3><canvas id="nbc"></canvas><div class="card"><b>Their place: '+nbScore(n,w)+'/100</b><div class="small">"'+esc(n.line)+'"</div></div><div class="card"><b>They rate YOUR place: '+me+'/100</b><div class="small">'+n.face+' "'+esc(rateLine(n,me))+'"</div><div class="small">Interior '+decorScore()+' · curb appeal '+curbAppeal()+'</div></div><button class="btn alt big" id="nbback">← Back to the block</button>');
  const c=Math.floor(Math.min(innerWidth-48,420)/COLS),cv=$('#nbc'),x=setupCanvas(cv,c*COLS,c*(HROWS+2));
  const sv=S.home.ext;const r=rng(hash(n.k)+w);const fake={};Object.keys(EXT_DEF).forEach(k=>{const pool=ITEMS.filter(i=>i.ext===k);if(pool.length&&r()<.85)fake[k]=pool[Math.floor(r()*pool.length)].id});
  try{S.home.ext=fake;const g=x.createLinearGradient(0,0,0,c*(HROWS+2));g.addColorStop(0,'#90caf9');g.addColorStop(1,'#e3f2fd');x.fillStyle=g;x.fillRect(0,0,c*COLS,c*(HROWS+2));x.fillStyle='#8bc34a';x.fillRect(0,c*HROWS,c*COLS,c*2);x.save();x.translate(0,c*.4);drawHouse(x,c);x.restore();
    x.font=Math.round(c*.8)+'px sans-serif';for(let i=0;i<(n.k==='gary'?9:2);i++)x.fillText(n.k==='gary'?'🧙':'🌳',(r()*(COLS-1))*c,c*(HROWS+1.6));}finally{S.home.ext=sv}
  $('#nbback').onclick=neighborSheet}
function contestEnd(w){const me=homeScore(),best=Math.max.apply(0,NEIGHBORS.map(n=>nbScore(n,w)));if(me>=best){const p=contestPrize(w);S.cash+=p;S.stats8.wins++;notify('🏆 Your home won Best on the Block for week '+(w+1)+'! +'+money(p))}
  else notify('🏘️ Week '+(w+1)+' Best on the Block went to someone with '+best+' points. You had '+me+'. Grandma Gretchen sends a pity cookie.')}

/* ---- 10) Stonks ---- */
const TICK_MS=20000;
const TICKERS=[{k:'CLMZ',name:'Clamazon',p0:120,vol:.02,dr:.0007,col:'#ff9900'},{k:'GOOCH',name:'Goochie Group',p0:340,vol:.025,dr:.0005,col:'#2e7d32'},
 {k:'WALY',name:'Wally\'s Mart',p0:45,vol:.012,dr:.0004,col:'#1565c0'},{k:'FRAUD',name:'Frauda SpA',p0:80,vol:.035,dr:.0002,col:'#6a1b9a'},{k:'DOGE',name:'Doge-ish Coin',p0:.42,vol:.08,dr:0,col:'#f9a825',coin:1}];
const HEADLINES={up:['{n} CEO spotted smiling. Investors lose their minds.','{n} announces "AI-powered shopping bag". Stock moons.','Analyst: "{n}? More like {n} to the moon."'],
 dn:['{n} recalls 10 million left shoes.','{n} CEO says "vibes are down this quarter".','Rumor: {n} warehouse cat quits. Panic.']};
function mkt(){if(!S.mkt||!S.mkt.px){S.mkt={t:Math.floor(gnow()/TICK_MS),px:{},hist:{},hold:{}};TICKERS.forEach(t=>{S.mkt.px[t.k]=t.p0;S.mkt.hist[t.k]=[t.p0]})}TICKERS.forEach(t=>{if(!S.mkt.px[t.k]){S.mkt.px[t.k]=t.p0;S.mkt.hist[t.k]=[t.p0]}});return S.mkt}
function gauss(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function mktStep(news){const m=mkt();TICKERS.forEach(t=>{let r=t.dr+t.vol*gauss();if(t.coin&&Math.random()<.03){r=Math.random()<.55?.4:-.35;if(news)notify('🐕 '+(r>0?'A billionaire tweeted a dog emoji. Doge-ish Coin +40%!':'Doge-ish Coin dev "went for milk". -35%'))}
   else if(Math.random()<.01){r+=Math.random()<.5?.12:-.12;if(news)notify('📰 '+pick(HEADLINES[r>0?'up':'dn']).replace(/\{n\}/g,t.name))}
   const px=Math.max(t.coin?.01:1,m.px[t.k]*Math.exp(r));m.px[t.k]=t.coin?Math.round(px*1000)/1000:Math.round(px*100)/100;const h=m.hist[t.k];h.push(m.px[t.k]);if(h.length>80)h.splice(0,h.length-80)})}
function mktTick(){const m=mkt(),now=Math.floor(gnow()/TICK_MS);if(now<=m.t)return false;const n=Math.min(30,now-m.t);m.t=now;for(let i=0;i<n;i++)mktStep(i===n-1);return true}
const fmtPx=(t,p)=>t.coin?'$'+p.toFixed(3):'$'+p.toFixed(2);
function trade(k,q){const m=mkt(),t=TICKERS.filter(x=>x.k===k)[0],p=m.px[k],h=m.hold[k]||(m.hold[k]={n:0,cost:0});
  if(q>0){const fee=t.coin?Math.max(1,p*q*.02):1,cost=p*q+fee;if(S.cash<cost){toast('Not enough cash');sfx('bad');return}S.cash-=cost;h.n+=q;h.cost+=cost;S.stats8.trades++;sfx('coin');toast('📈 Bought '+q+' '+k)}
  else{q=Math.min(-q,h.n);if(!q)return;const fee=t.coin?Math.max(1,p*q*.02):1,got=Math.max(0,p*q-fee),basis=h.cost*q/h.n;h.n-=q;h.cost-=basis;S.cash+=got;const pl=got-basis;S.stats8.stockProfit+=pl;S.stats8.trades++;if(pl>0)S.stats8.stonkWin=1;
    sfx(pl>=0?'level':'bad');toast((pl>=0?'💰 Sold for a '+money(pl)+' profit':'📉 Sold at a '+money(-pl)+' loss')+'. Fees: '+money(fee));if(!h.n)delete m.hold[k]}
  S.cash=Math.round(S.cash*100)/100;save();rerender()}
function spark(cv,h,col){const W=cv.width,H=cv.height,x=cv.getContext('2d');x.clearRect(0,0,W,H);const lo=Math.min.apply(0,h),hi=Math.max.apply(0,h),sp=hi-lo||1;x.strokeStyle=col;x.lineWidth=2*(window.devicePixelRatio||1);x.beginPath();h.forEach((v,i)=>{const X=i/(Math.max(1,h.length-1))*W,Y=H-((v-lo)/sp)*(H-4)-2;i?x.lineTo(X,Y):x.moveTo(X,Y)});x.stroke()}
function renderStonks(v){mktTick();const m=mkt();const port=Object.keys(m.hold).reduce((a,k)=>a+m.hold[k].n*m.px[k],0);
  v.insertAdjacentHTML('beforeend','<div class="bhead" style="background:linear-gradient(120deg,#0d47a1,#00c853);color:#fff;padding:12px;border-radius:16px;margin-bottom:8px"><b style="font-size:20px">📈 Robbinghood</b><div class="small" style="color:#e0f2f1">Commission-free*! (*there\'s a $1 fee). Prices move every 20s of game time. Not financial advice. Barely financial.</div></div>'+
   '<div class="card row sp"><span>Portfolio</span><b>'+money(port)+'</b><span class="small">Lifetime P/L: <b style="color:'+(S.stats8.stockProfit>=0?'#2e7d32':'#c62828')+'">'+(S.stats8.stockProfit<0?'-':'')+money(Math.abs(S.stats8.stockProfit))+'</b></span></div>');
  TICKERS.forEach(t=>{const h=m.hist[t.k],p=m.px[t.k],ch=h.length>1?(p/h[Math.max(0,h.length-16)]-1)*100:0,hd=m.hold[t.k];const d=document.createElement('div');d.className='card';
    d.innerHTML='<div class="row sp"><span><b>'+t.k+'</b> <span class="small">'+esc(t.name)+'</span></span><span><b>'+fmtPx(t,p)+'</b> <span style="color:'+(ch>=0?'#2e7d32':'#c62828')+'">'+(ch>=0?'▲':'▼')+Math.abs(ch).toFixed(1)+'%</span></span></div><canvas data-sp="'+t.k+'" style="width:100%;height:44px"></canvas>'+
     '<div class="small">'+(hd?'You own '+hd.n+' · worth '+money(hd.n*p)+' · avg cost '+fmtPx(t,hd.cost/hd.n):'You own none')+'</div><div class="row" style="margin-top:4px">'+(t.coin?[100,1000]:[1,10]).map(q=>'<button class="btn" data-tr="'+t.k+'" data-q="'+q+'">Buy '+q+'</button>').join('')+'<button class="btn alt" data-tr="'+t.k+'" data-q="-all" '+(hd?'':'disabled')+'>Sell all</button></div>';
    v.appendChild(d);const cv=d.querySelector('canvas');cv.width=(innerWidth-60)*(window.devicePixelRatio||1);cv.height=44*(window.devicePixelRatio||1);spark(cv,h,t.col)});
  onAll(v,'[data-tr]',b=>{const k=b.dataset.tr;trade(k,b.dataset.q==='-all'?-((mkt().hold[k]||{}).n||0):+b.dataset.q)})}

/* ---- 11) legit resale side hustle ---- */
const HUSTLE_PLAT={flea:{name:'Fleabay',fee:.08,em:'🔨'},fb:{name:'Facenook',fee:0,em:'🏷️'}};
const BUYERS=['xX_BidLord_Xx','GrandmaGretchen','CryptoChad','ThriftQueen99','Kevin','DealGoblin','auntie_m','SirBidsALot','FrugalFrank','Brenda (moving tmrw!!)','Uncle Ron','definitely_not_a_bot'];
const LOWBALL=['is this still available? would u take {o}','{o} cash and a sandwich. final offer.','i can do {o}. my cat is sick (i don\'t have a cat)','lowest u can go? {o}? ok {o}.','{o}. take it or leave it. im a business man.'];
const WEIRD=['will you trade for a used futon and a signed photo of my uncle','can u deliver it to the moon. jk. unless?','is it haunted? asking for a friend (the friend wants it haunted)','what is the meaning of life. also is this available','ok but what if I paid you in exposure'];
const SCAMS=['I will send cheque for {x}, you send me {o} back for the shipping, my assistant pick up','Hello dear I am a prince. I send {x} via gift card, please confirm your bank pin','congrats u won a FREE iPhone 17!!! just send item first and click this link'];
const BUYMSG=['bought it! smooth transaction 10/10 would get ripped off again','ty!! my therapist said shopping isn\'t a personality but here we are','PAID. don\'t tell my wife','omg finally. been hunting this for weeks'];
function hustleCap(){return 5}
function demand(it){let d=1;if(it.rare)d*=2.5;if(it.drop)d*=3;if(typeof openStores==='function'&&openStores().every(s=>s.id!==it.store))d*=1.3;return d}
function sellChance(l){const it=ITEM[l.id],m=l.ask/it.price;return Math.min(.6,.22*demand(it)*Math.exp(-(m-1)*2.4)*(l.plat==='fb'?.85:1))}
function listHustle(it,mark,plat){if(S.hustle.length>=hustleCap()){toast('5 listings max');return}removeOne(it.id);hotClamp(it.id);
  S.hustle.push({hid:S.oid++,id:it.id,ask:Math.max(1,Math.round(it.price*mark)),plat:plat,at:gnow(),last:gnow(),msgs:[{t:'📣 Listed at '+money(Math.round(it.price*mark))+' ('+Math.round(mark*100)+'% of retail)'}]});sfx('click');save();rerender()}
function hustleTick(){const now=gnow();let ch=false;S.hustle.forEach(l=>{if(l.sold)return;let k=0;while(now-l.last>=15000&&k<20){l.last+=15000;k++;const r=Math.random(),it=ITEM[l.id],who=pick(BUYERS);
    if(r<sellChance(l)){const fee=HUSTLE_PLAT[l.plat].fee,net=Math.round(l.ask*(1-fee));l.sold=1;S.cash+=net;S.stats8.resold++;S.stats8.resProfit+=Math.max(0,net-it.price);l.msgs.push({t:'💸 '+who+': '+pick(BUYMSG)+' (+'+money(net)+(fee?' after '+Math.round(fee*100)+'% fee':'')+')'});notify('💸 Sold '+it.name+' on '+HUSTLE_PLAT[l.plat].name+' for '+money(net)+'!');ch=true;break}
    else if(r<.55){const roll=Math.random();if(roll<.5){const o=Math.max(1,Math.round(l.ask*(.4+Math.random()*.4)));l.msgs.push({t:who+': '+pick(LOWBALL).replace(/\{o\}/g,money(o)),offer:o,who:who})}
      else if(roll<.8)l.msgs.push({t:who+': '+pick(WEIRD)});else l.msgs.push({t:who+': '+pick(SCAMS).replace('{x}',money(l.ask*3)).replace('{o}',money(l.ask*2)),scam:1});ch=true}}
   if(l.msgs.length>8)l.msgs.splice(1,l.msgs.length-8)});
  S.hustle=S.hustle.filter(l=>!l.sold||now-l.last<120000);return ch}
function renderHustle(v){hustleTick();
  v.insertAdjacentHTML('beforeend','<div class="bhead" style="background:linear-gradient(120deg,#6a1b9a,#ff3d81);color:#fff;padding:12px;border-radius:16px;margin-bottom:8px"><b style="font-size:20px">💼 Side Hustle</b><div class="small" style="color:#fce4ec">Flip your legit stuff ABOVE retail. Higher markup = fewer buyers. Limited, collab & "not in the mall today" items sell best. Buyers message every ~15s of game time.</div></div>'+
   '<div class="card row sp"><span>Resold: <b>'+S.stats8.resold+'</b> · markup profit <b>'+money(S.stats8.resProfit)+'</b></span><button class="btn" id="hnew" '+(S.hustle.filter(l=>!l.sold).length>=hustleCap()?'disabled':'')+'>+ New listing</button></div>');
  S.hustle.slice().reverse().forEach(l=>{const it=ITEM[l.id],P=HUSTLE_PLAT[l.plat];const d=document.createElement('div');d.className='card';
    d.innerHTML='<div class="row" style="flex-wrap:nowrap"><img src="'+thumb(it)+'" style="width:56px;border-radius:10px" alt=""><div style="flex:1"><b>'+esc(it.name)+'</b><div class="small">'+P.em+' '+P.name+' · ask <b>'+money(l.ask)+'</b> (retail '+money(it.price)+') · '+(l.sold?'✅ SOLD':Math.round(sellChance(l)*100)+'% sell chance / msg')+'</div></div>'+(l.sold?'':'<button class="btn alt" data-hx="'+l.hid+'">Pull</button>')+'</div>'+
     '<div class="chat">'+l.msgs.map((m,i)=>'<div class="bub">'+esc(m.t)+(m.offer&&!l.sold?' <button class="btn green" data-ho="'+l.hid+'" data-i="'+i+'" style="padding:4px 8px">Accept</button>':'')+(m.scam&&!l.sold?' <button class="btn alt" data-hs="'+l.hid+'" style="padding:4px 8px">Sounds legit</button>':'')+'</div>').join('')+'</div>';v.appendChild(d)});
  if(!S.hustle.length)v.insertAdjacentHTML('beforeend','<div class="card small">No listings yet. Tip: buy a weekly collab drop, wait for it to sell out, then flip it for 150%+.</div>');
  const L=id=>S.hustle.filter(l=>l.hid===+id)[0];
  onAll(v,'[data-hx]',b=>{const l=L(b.dataset.hx);S.owned[l.id]=(S.owned[l.id]||0)+1;S.hustle.splice(S.hustle.indexOf(l),1);toast('Listing pulled, item back in your closet');save();rerender()});
  onAll(v,'[data-ho]',b=>{const l=L(b.dataset.ho),m=l.msgs[+b.dataset.i],fee=HUSTLE_PLAT[l.plat].fee,net=Math.round(m.offer*(1-fee));l.sold=1;S.cash+=net;S.stats8.resold++;S.stats8.resProfit+=Math.max(0,net-ITEM[l.id].price);l.msgs.push({t:'🤝 Sold to '+m.who+' for '+money(net)});sfx('coin');save();rerender()});
  onAll(v,'[data-hs]',b=>{const l=L(b.dataset.hs);l.sold=1;S.stats8.scammed8=1;l.msgs.push({t:'🤡 The "cheque" was a drawing of a cheque. Item gone. Lesson learned.'});sfx('bad');save();rerender()});
  $('#hnew').onclick=()=>{const own=Object.keys(S.owned).map(id=>ITEM[id]).filter(i=>!i.fake&&!(S.rap.hot[i.id]>0));
    sheet('<h3>💼 New listing</h3><div class="small">Counterfeits and "no-receipt" goods aren\'t allowed here. This is a legit hustle.</div>'+(own.length?own.map(it=>'<div class="slot"><span class="row" style="flex-wrap:nowrap"><img src="'+thumb(it)+'" style="width:44px;border-radius:8px"><span>'+esc(it.name)+'<br><span class="small">retail '+money(it.price)+(demand(it)>1.2?' · 🔥 in demand':'')+'</span></span></span><button class="btn" data-hl="'+it.id+'">List</button></div>').join(''):'<p>Nothing to sell!</p>'));
    onAll($('#sheet'),'[data-hl]',b=>{const it=ITEM[b.dataset.hl];sheet('<h3>'+esc(it.name)+'</h3><div class="small">Retail '+money(it.price)+'</div><div class="lbl">Markup</div><div class="row">'+[1.1,1.3,1.6,2,2.5].map(m=>'<button class="btn alt" data-mk="'+m+'">'+Math.round(m*100)+'%<br><span class="small">'+money(it.price*m)+'</span></button>').join('')+'</div><div class="lbl">Where</div><div class="row"><button class="btn on" data-pl="flea">🔨 Fleabay (8% fee)</button><button class="btn alt" data-pl="fb">🏷️ Facenook (no fee, more weirdos)</button></div>');
      let mk=1.3,pl='flea';onAll($('#sheet'),'[data-mk]',x=>{mk=+x.dataset.mk;Array.prototype.forEach.call(document.querySelectorAll('[data-mk]'),y=>y.className='btn alt');x.className='btn'});
      onAll($('#sheet'),'[data-pl]',x=>{pl=x.dataset.pl;closeSheet();listHustle(it,mk,pl)})})}}

/* ---- 12) achievements (funny titles) + equippable title ---- */
ACH.push(['therapist','Retail Therapist 🛋️','Spend $10,000 total',s=>s.spent>=10000],['goblin','Clearance Goblin 🗑️','Rummage 10 clearance bins',s=>s.stats8&&s.stats8.bins>=10],
 ['doorbuster','Doorbuster 🛒','Win a Black Friday doorbuster',s=>s.stats8&&s.stats8.doors>0],['hype','Hypebeast 🌟','Cop a celebrity collab drop',s=>Object.keys(s.owned).some(id=>ITEM[id]&&ITEM[id].drop)],
 ['stonks','Stonks Only Go Up 📈','Sell a stock for a profit',s=>s.stats8&&!!s.stats8.stonkWin],['diamond','Diamond Hands 💎','Own 10,000 Doge-ish Coin',s=>s.mkt&&s.mkt.hold&&s.mkt.hold.DOGE&&s.mkt.hold.DOGE.n>=10000],
 ['hustler','Side Hustler 💼','Resell 5 items',s=>s.stats8&&s.stats8.resold>=5],['flipper2','Professional Reseller 🤑','Earn $1,000 in markup profit',s=>s.stats8&&s.stats8.resProfit>=1000],
 ['scam8','Sounds Legit 🤡','Fall for a buyer scam',s=>s.stats8&&!!s.stats8.scammed8],['nosy','Neighborhood Watch 👀','Visit every neighbor',s=>s.stats8&&Object.keys(s.stats8.visits).length>=5],
 ['block','Best House on the Block 🏆','Win the weekly decorating contest',s=>s.stats8&&s.stats8.wins>0],['realty','Real Estate Mogul 🏗️','Own 3 rooms',s=>s.home&&s.home.have&&s.home.have.length>=3],
 ['dripset','Drip Lord 👑','Wear a full 5-piece brand set',s=>{const n={};Object.keys(s.equipped||{}).forEach(k=>{const it=ITEM[s.equipped[k]];if(it)n[it.store]=(n[it.store]||0)+1});return Object.keys(n).some(k=>n[k]>=5)}],
 ['fitcheck','Fit Check ✅','Take a fit-check photo',s=>s.stats8&&s.stats8.photos>0],['repeat','Outfit Repeater 👯','Save 3 outfits',s=>s.outfits&&s.outfits.length>=3],
 ['complete','Completionist 📚','Hit 100% of any brand collection',s=>s.collRew&&Object.keys(s.collRew).some(k=>s.collRew[k]>=3)],['muzak','Elevator Enjoyer 🎶','Turn on the mall muzak',s=>!!s.muzak]);
function titleCard(v){const got=ACH.filter(a=>S.ach[a[0]]);v.insertAdjacentHTML('beforeend','<div class="card"><div class="lbl" style="margin-top:0">🏷️ Your title</div><select id="titlesel" style="width:100%;padding:8px;border-radius:10px"><option value="">(none)</option>'+got.map(a=>'<option value="'+a[0]+'" '+(S.title===a[0]?'selected':'')+'>'+esc(a[1])+'</option>').join('')+'</select><div class="small">Earn achievements to unlock titles. Shows on your fit-check photos.</div></div>');
  $('#titlesel').onchange=e=>{S.title=e.target.value||null;save();toast(S.title?'🏷️ You are now "'+achName(S.title)+'"':'Title removed')}}

/* ---- 13) WebAudio mall muzak (off by default) ---- */
const MZ={iv:null,step:0};
const MZ_CH=[[261.6,329.6,392,493.9],[220,261.6,329.6,392],[174.6,220,261.6,329.6],[196,246.9,293.7,349.2]];// Cmaj7 Am7 Fmaj7 G7: peak elevator
function mzNote(f,t,d,g,type){const o=AC.createOscillator(),gn=AC.createGain();o.type=type||'sine';o.frequency.value=f;gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(g,t+.03);gn.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+d+.05)}
function muzakStart(){if(MZ.iv||!S.muzak||S.muted||document.hidden)return;try{if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C()}if(AC.state==='suspended')AC.resume()}catch(e){return}
  MZ.iv=setInterval(()=>{if(!AC)return;const t=AC.currentTime+.05,bar=Math.floor(MZ.step/8)%4,ch=MZ_CH[bar],s=MZ.step%8;
    if(s===0)ch.forEach(f=>mzNote(f/2,t,1.9,.012,'triangle'));if(s%2===0)mzNote(ch[0]/4,t,.35,.03,'sine');
    if([0,3,5,6].indexOf(s)>=0)mzNote(ch[(s+MZ.step)%4]*2,t,.4,.016,'sine');MZ.step++},260)}
function muzakStop(){clearInterval(MZ.iv);MZ.iv=null}
function setMuzak(on){S.muzak=on;save();if(on)muzakStart();else muzakStop()}
document.addEventListener('visibilitychange',()=>{if(document.hidden)muzakStop();else setTimeout(muzakStart,200)});
['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,()=>{if(S&&S.muzak&&!MZ.iv)muzakStart()},{passive:true}));
Object.assign(SFX,{ding:[[1568,.08,'sine'],[2093,.18,'sine']],stonk:[[392,.06],[523,.06],[784,.14]],trample:[[120,.1,'sawtooth'],[90,.2,'sawtooth']]});

/* ---- hooks: daily + per-second ---- */
function v8NewDay(){const w=weekNo();if(S.nb.week<0)S.nb.week=w;if(w>S.nb.week){contestEnd(S.nb.week);S.nb.week=w;const d=weeklyDrop();notify('🌟 New collab drop: '+d.name+' ('+money(d.price)+', 5 made)')}
  const e=weekEvent();if(e&&dow()===4)notify(e.emoji+' '+e.name+' starts today! '+e.desc)}
function v8Tick(){const a=mktTick(),b=hustleTick();if((a||b)&&screen==='online'&&(onTab==='stonks'||onTab==='hustle')&&!sheetOpen())rerender()}
/* ---- v8.1 distinct room looks ---- */
const ROOM_STYLE={
 patioFull(x,W,H,wh,c,r){const dk=S.dark;
  let g=x.createLinearGradient(0,0,0,wh);g.addColorStop(0,dk?'#1a2350':'#7ec8f5');g.addColorStop(1,dk?'#5a3d7a':'#cfeefe');x.fillStyle=g;x.fillRect(0,0,W,wh);
  if(dk){x.fillStyle='#fff';for(let i=0;i<30;i++){x.globalAlpha=.4+r()*.6;x.fillRect(r()*W,r()*wh*.7,1.6,1.6)}x.globalAlpha=1;x.fillStyle='#fff6c8';x.beginPath();x.arc(W*.82,wh*.22,c*.35,0,7);x.fill()}
  else{x.fillStyle='#ffe066';x.beginPath();x.arc(W*.84,wh*.2,c*.4,0,7);x.fill();x.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<3;i++){const cx=W*(.12+i*.28),cy=wh*(.18+r()*.15);[0,1,2].forEach(j=>{x.beginPath();x.arc(cx+j*c*.3,cy-(j===1?c*.12:0),c*.22,0,7);x.fill()})}}
  // distant hills + hedge greenery
  x.fillStyle=dk?'#24384a':'#8fd19e';x.beginPath();x.moveTo(0,wh*.75);for(let i=0;i<=8;i++)x.quadraticCurveTo(W*(i/8-.06),wh*(.55+r()*.12),W*i/8,wh*.72);x.lineTo(W,wh);x.lineTo(0,wh);x.fill();
  x.fillStyle=dk?'#1d3b2a':'#4caf50';for(let xx=0;xx<W+c;xx+=c*.45){x.beginPath();x.arc(xx,wh-c*.15,c*(.3+r()*.15),0,7);x.fill()}
  x.fillStyle=dk?'#2e5a3c':'#66bb6a';for(let xx=c*.2;xx<W+c;xx+=c*.5){x.beginPath();x.arc(xx,wh-c*.05,c*.2,0,7);x.fill()}
  // string lights
  x.strokeStyle='rgba(60,40,30,.6)';x.lineWidth=1.2;x.beginPath();x.moveTo(0,c*.25);for(let i=1;i<=4;i++)x.quadraticCurveTo(W*(i-.5)/4,c*.75,W*i/4,c*.25);x.stroke();
  for(let i=0;i<20;i++){const t=(i+.5)/20,seg=Math.floor(t*4),u=t*4-seg,bx=W*t,by=c*.25+(c*.5)*Math.sin(u*Math.PI)*.5*2*.5*2;x.fillStyle=dk?'rgba(255,220,120,.35)':'rgba(255,220,120,.25)';x.beginPath();x.arc(bx,by+3,7,0,7);x.fill();x.fillStyle=['#ffd54f','#ff8a80','#80d8ff','#b9f6ca'][i%4];x.beginPath();x.arc(bx,by+3,2.6,0,7);x.fill()}
  // deck boards
  const fy=wh;g=x.createLinearGradient(0,fy,0,H);g.addColorStop(0,dk?'#5b4030':'#c08a5a');g.addColorStop(1,dk?'#3b2a1f':'#8d5f3a');x.fillStyle=g;x.fillRect(0,fy,W,H-fy);
  for(let xx=0;xx<W;xx+=c*.42){x.fillStyle='rgba(50,25,10,.25)';x.fillRect(xx,fy,1.5,H-fy);x.fillStyle='rgba(255,255,255,'+(.03+r()*.05)+')';x.fillRect(xx+2,fy,c*.42-3,H-fy)}
  if(S.home.floor)drawSurface(x,ITEM[S.home.floor],0,fy,W,H-fy,c*.6);
  // railing
  x.fillStyle=dk?'#6d5240':'#e8d6c0';x.fillRect(0,fy-c*.7,W,c*.12);x.fillRect(0,fy-c*.12,W,c*.12);for(let xx=c*.1;xx<W;xx+=c*.3)x.fillRect(xx,fy-c*.6,c*.07,c*.5);
  x.fillStyle='rgba(0,0,0,.12)';x.fillRect(0,fy-c*.58,W,2);
  // planter pots
  [[c*.35],[W-c*.35]].forEach(p=>{x.fillStyle='#b5651d';x.fillRect(p[0]-c*.2,fy-c*.35,c*.4,c*.35);x.fillStyle=dk?'#2e7d32':'#43a047';x.beginPath();x.arc(p[0],fy-c*.45,c*.25,0,7);x.fill()});
  g=x.createLinearGradient(0,fy,0,fy+c*.5);g.addColorStop(0,'rgba(40,20,10,.25)');g.addColorStop(1,'rgba(40,20,10,0)');x.fillStyle=g;x.fillRect(0,fy,W,c*.5)},
 kitchen(x,W,H,wh,c){x.fillStyle='#fff';for(let yy=wh-c*.9;yy<wh-c*.1;yy+=c*.2)for(let xx=((yy/(c*.2))|0)%2?0:c*.1;xx<W;xx+=c*.2){x.fillStyle='rgba(255,255,255,.55)';x.fillRect(xx+1,yy+1,c*.2-2,c*.2-2)}
  x.fillStyle=S.dark?'#5b6b7a':'#90a4ae';x.fillRect(0,wh-c*.95,W,4);for(let xx=0;xx<W;xx+=c*.6){for(let yy=0;yy<c*.12;yy+=c*.06)x.fillStyle=((xx/(c*.6)+yy)|0)%2?'rgba(0,0,0,.05)':'rgba(255,255,255,.05)'}
  x.fillStyle='rgba(0,0,0,.06)';for(let xx=0;xx<W;xx+=c*.5)for(let yy=wh;yy<H;yy+=c*.5)if(((xx+yy)/(c*.5))%2<1)x.fillRect(xx,yy,c*.5,c*.5)},
 closet(x,W,H,wh,c){x.fillStyle=S.dark?'#8d7a9e':'#c9a27a';x.fillRect(c*.2,c*.55,W-c*.4,4);x.fillStyle='rgba(0,0,0,.15)';for(let xx=c*.4;xx<W-c*.4;xx+=c*.35){x.fillRect(xx,c*.55,1.2,c*.25)}
  x.fillStyle=S.dark?'rgba(255,255,255,.12)':'rgba(255,255,255,.55)';x.fillRect(W*.4,c*.95,W*.2,wh-c*1.2);x.strokeStyle='#d4af37';x.lineWidth=3;x.strokeRect(W*.4,c*.95,W*.2,wh-c*1.2)},
 theater(x,W,H,wh,c){x.fillStyle='rgba(20,0,20,.55)';x.fillRect(0,0,W,H);x.fillStyle='#8b0000';for(let xx=0;xx<c*.9;xx+=c*.15){x.fillStyle=(xx/(c*.15))%2?'#9b1020':'#7a0010';x.fillRect(xx,0,c*.15,wh);x.fillRect(W-xx-c*.15,0,c*.15,wh)}
  x.fillStyle='#111';x.fillRect(W*.22,c*.35,W*.56,wh-c*.8);x.fillStyle='rgba(120,180,255,.25)';x.fillRect(W*.22+4,c*.35+4,W*.56-8,wh-c*.8-8);
  for(let xx=c*.2;xx<W;xx+=c*.5){x.fillStyle='#ffd54f';x.beginPath();x.arc(xx,wh-4,2.5,0,7);x.fill()}},
 penthouse(x,W,H,wh,c,r){const wx=W*.12,ww=W*.76,wy=c*.3,wh2=wh-c*.7;let g=x.createLinearGradient(0,wy,0,wy+wh2);g.addColorStop(0,S.dark?'#0b1030':'#ffb07c');g.addColorStop(1,S.dark?'#2b2050':'#ffe0b2');x.fillStyle=g;x.fillRect(wx,wy,ww,wh2);
  for(let xx=wx;xx<wx+ww;){const bw=c*(.25+r()*.35),bh=wh2*(.3+r()*.6);x.fillStyle=S.dark?'#1c1c34':'#5d4a6a';x.fillRect(xx,wy+wh2-bh,bw,bh);x.fillStyle=S.dark?'#ffe082':'rgba(255,255,255,.35)';for(let yy=wy+wh2-bh+4;yy<wy+wh2-4;yy+=7)for(let k=xx+3;k<xx+bw-3;k+=6)if(r()<.5)x.fillRect(k,yy,2,3);xx+=bw+1}
  x.strokeStyle=S.dark?'#ccc':'#333';x.lineWidth=3;x.strokeRect(wx,wy,ww,wh2);for(let i=1;i<4;i++){x.beginPath();x.moveTo(wx+ww*i/4,wy);x.lineTo(wx+ww*i/4,wy+wh2);x.stroke()}
  x.fillStyle='rgba(255,255,255,.08)';x.fillRect(0,wh,W,H-wh)}
};
