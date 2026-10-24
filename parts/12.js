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
function roomSwitcher(){if(S.home.have.length<2)return'';return'<div class="tabs" id="rsw" style="margin-bottom:8px">'+S.home.have.map(k=>{const d=roomDef(k);return'<button data-room="'+k+'" class="'+(k===S.home.cur?'on':'')+'">'+d.emoji+' '+d.name+'</button>'}).join('')+'</div>'}
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
function photoSheet(url,name){sheet('<h3>📸 Looking good</h3><img src="'+url+'" style="width:100%;border-radius:14px" alt="photo"><button class="btn big green" id="dl">⬇️ Save PNG</button><div class="small">If the download doesn\'t start (some phone viewers block it), long-press the picture and choose "Download image".</div>');
  $('#dl').onclick=()=>{try{const a=document.createElement('a');a.href=url;a.download='mall-rat-'+name+'-day'+S.day+'.png';document.body.appendChild(a);a.click();a.remove();toast('📸 Saved!')}catch(e){toast('Long-press the picture to save it')}}}

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
