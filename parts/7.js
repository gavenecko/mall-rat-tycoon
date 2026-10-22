/* ============================== ONLINE (v3) ==============================
   Clamazon (catalog + Crime membership + shipping), Fleabay (auctions), Facenook (haggling),
   orders/mailbox, wishlist, events, Mall Rat Card + Pay-in-4. */
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const CLAM=ITEMS.filter(i=>i.store==='clamazon');
const CRIME_FEE=15,SHIP_FEE=5,CARD_RATE=.03,LATE_FEE=10;
const NPC=['xX_BidLord_Xx','GrandmaGretchen','CryptoChad','ThriftQueen99','Kevin','DealGoblin','auntie_m','SirBidsALot','FrugalFrank','LilSpendy'];
const FB_SELLERS=[['Brenda (moving tmrw!!)','👩‍🦰'],['Dave\'s Garage','🧔'],['Crystal Vibes','🔮'],['Uncle Ron','👴'],['Tiffani w/ an i','💅'],['Totally Real Person','🕵️'],['Moms Basement LLC','🧑‍💻'],['Karen K.','👱‍♀️'],['Farmer Joe','👨‍🌾'],['Mystery Van Guy','🚐']];
const REVIEWERS=['🦝 TrashPanda','👵 Nana B.','🤓 Verified Nerd','🐸 frogman','💅 Slayyy','🧔 Big Mike','🤖 NotABot123','🧙 Wizard Gary'];
const REVIEWS=['Bought this {n} for my cat. The cat now refuses to speak to me.','Arrived in 3 minutes. The delivery guy was crying. 10/10.','The {c} is more of a "{c2}" but I am emotionally attached now.',
 'Wore it to a wedding. I am no longer invited to weddings.','Fell apart in 2 days, just like my last situationship.','Exactly as described. Suspiciously so.','Came with a free spider. Bonus!',
 'Would give 6 stars but the app won\'t let me. I checked.','My therapist asked where I got it. Now she has one too.','It\'s fine. I\'m fine. Everything is fine.','Five stars. My landlord hates it. Even better.',
 'Smells faintly of money. Or regret. Hard to tell.','Bought 3. Do not know why. Do not regret it.','Instructions were in Klingon. Assembled it anyway.'];
const EVENTS=[
 {day:7,name:'Black Fryday',emoji:'🖤',desc:'25% off everything at the mall!',off:it=>MALL_STORE[it.store]?25:0},
 {day:10,name:'Crime Day',emoji:'📦',desc:'Clamazon is 35% off for Crime members.',off:it=>it.store==='clamazon'&&S.crime.active?35:0},
 {day:14,name:'Valentime\'s Day',emoji:'💘',desc:'Pink, Hot Pink & Red items 30% off.',off:it=>/^(Pink|Red|Hot Pink)$/.test(it.colorName)?30:0},
 {day:21,name:'Spooky Szn',emoji:'🎃',desc:'Black & Orange items 40% off.',off:it=>/^(Black|Orange)$/.test(it.colorName)?40:0},
 {day:28,name:'Hollydaze',emoji:'🎁',desc:'A $50 gift from the mall + decor 30% off.',off:it=>it.cat==='decor'?30:0,gift:50}];
const cycleDay=d=>((d-1)%28)+1;
function eventToday(){const d=cycleDay(S.day);return EVENTS.filter(e=>e.day===d)[0]||null}
function eventOff(it){const e=eventToday();return e?e.off(it):0}
function eventBanner(){const e=eventToday();if(e)return'<div class="evt">'+e.emoji+' <b>'+e.name+'</b> today! '+e.desc+'</div>';
  const d=cycleDay(S.day),nx=EVENTS.filter(q=>q.day>d)[0]||EVENTS[0],n=nx.day>d?nx.day-d:28-d+nx.day;return'<div class="small" style="margin:0 4px 8px">Next event: '+nx.emoji+' '+nx.name+' in '+n+' day'+(n>1?'s':'')+'</div>'}
function rating(it){const r=rng(hash(it.id));return{stars:Math.round((1.5+r()*3.5)*2)/2,count:Math.floor(r()*r()*25000)+3}}
function starStr(s){let o='';for(let i=1;i<=5;i++)o+=s>=i?'★':s>=i-.5?'⯪':'☆';return o}
function reviewsFor(it){const r=rng(hash(it.id)+9);const out=[];for(let i=0;i<3;i++){const c2=COLORS[Math.floor(r()*COLORS.length)][0];
  out.push({who:REVIEWERS[Math.floor(r()*REVIEWERS.length)],s:1+Math.floor(r()*5),t:REVIEWS[Math.floor(r()*REVIEWS.length)].replace('{n}',BASES[it.cat].filter(b=>b.key===it.shape)[0].name.toLowerCase()).replace('{c}',it.colorName).replace('{c2}',c2)})}return out}

/* ---------- sheet (bottom modal) ---------- */
function sheet(html){const s=$('#sheet');s.hidden=false;s.innerHTML='<div class="sheetbox"><button class="icon x" id="shx" aria-label="close">✕</button>'+html+'</div>';$('#shx').onclick=closeSheet;s.onclick=e=>{if(e.target===s)closeSheet()}}
function closeSheet(){clearInterval(stealIv);const s=$('#sheet');s.hidden=true;s.innerHTML=''}
const sheetOpen=()=>!$('#sheet').hidden;

/* ---------- mailbox / notifications / packages ---------- */
function notify(msg){S.inbox.unshift({msg:msg,day:S.day,read:false});if(S.inbox.length>40)S.inbox.length=40}
const unread=()=>S.inbox.filter(m=>!m.read).length;
const packagesReady=()=>S.orders.filter(o=>o.status==='delivered');
function wishOnSale(){return Object.keys(S.wish).filter(id=>ITEM[id]&&offOf(ITEM[id])>0).length}
function mailHud(){const b=$('#mailb');if(!b)return;const n=unread()+packagesReady().length;b.textContent=n?String(n):'';
  const r=document.querySelector('[data-nb=room]');if(r)r.textContent=packagesReady().length||'';const o=document.querySelector('[data-nb=online]');if(o)o.textContent=wishOnSale()?'♥':''}
function openMail(){const pk=packagesReady();
  sheet('<h3>📬 Mailbox</h3>'+(pk.length?'<div class="card" style="background:#fff8e1">📦 <b>'+pk.length+' package'+(pk.length>1?'s':'')+'</b> on your doorstep!<button class="btn green big" id="col">Bring them inside</button></div>':'')+
    (S.inbox.length?S.inbox.map(m=>'<div class="slot"><span style="'+(m.read?'':'font-weight:800')+'">'+esc(m.msg)+'</span><span class="small" style="white-space:nowrap">Day '+m.day+'</span></div>').join(''):'<p class="small">No mail. Even the spam forgot about you.</p>'));
  S.inbox.forEach(m=>{m.read=true});save();
  if($('#col'))$('#col').onclick=()=>{collect();closeSheet()}}
function collect(){const pk=packagesReady();if(!pk.length)return;pk.forEach(o=>{o.status='collected';S.owned[o.id]=(S.owned[o.id]||0)+1;const it=ITEM[o.id];if(it.slot&&!S.equipped[it.slot])S.equipped[it.slot]=it.id});
  sfx('buy');toast('📦 Unboxed '+pk.length+' package'+(pk.length>1?'s':'')+'! Check your closet/room.');save();rerender()}
function drawDoorstep(x,c){const n=packagesReady().length;x.fillStyle='#795548';x.fillRect(0,(ROWS-1)*c,c*.12,c);if(!n)return;
  x.font=(c*.75)+'px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('📦',c*.55,(ROWS-.5)*c);
  x.fillStyle='#ff1744';circ(x,c*.85,(ROWS-.85)*c,c*.2);x.fill();x.fillStyle='#fff';x.font='bold '+(c*.26)+'px sans-serif';x.fillText(n,c*.85,(ROWS-.84)*c)}
function toggleWish(it){if(S.wish[it.id])delete S.wish[it.id];else{S.wish[it.id]=1;toast('💖 Added to wishlist. We\'ll ping you when it\'s on sale.')}sfx('click');save()}

/* ---------- money: Mall Rat Card + Pay in 4 ---------- */
const cardLimit=()=>Math.min(10000,500+100*S.shifts);
function payWith(m,amt,label){
  if(m==='cash'){if(S.cash<amt)return false;S.cash-=amt}
  else if(m==='card'){if(S.card.bal+amt>cardLimit())return false;S.card.bal+=amt}
  else{const part=Math.ceil(amt/4);if(S.cash<part)return false;S.cash-=part;S.bnpl.push({label:label,amt:part,left:3})}
  S.spent+=amt;bumpCash();if(S.card.bal>cardLimit()*.6)setTimeout(()=>toast('💳 Your card is getting heavy. Future-you just sighed audibly.'),1900);return true}
function openPay(title,amt,done,extra){
  const lim=cardLimit(),part=Math.ceil(amt/4);
  sheet('<h3>'+esc(title)+'</h3><div style="font-size:26px" class="pr">'+money(amt)+'</div>'+(extra||'')+
   '<button class="btn green big" data-m="cash" '+(S.cash>=amt?'':'disabled')+'>💵 Cash (you have '+money(S.cash)+')</button>'+
   '<button class="btn big" data-m="card" '+(S.card.bal+amt<=lim?'':'disabled')+'>💳 Mall Rat Card · '+money(lim-S.card.bal)+' left · 3%/day</button>'+
   '<button class="btn alt big" data-m="bnpl" '+(S.cash>=part?'':'disabled')+'>🐢 Pay in 4: '+money(part)+' now + 3 daily</button>'+
   '<p class="small">Credit is fun until it isn\'t. Card interest compounds every in-game day.</p>');
  onAll($('#sheet'),'[data-m]',b=>{if(payWith(b.dataset.m,amt,title)){closeSheet();done(b.dataset.m)}else{sfx('bad');toast('Payment declined 😬')}})}

/* ---------- daily processing ---------- */
function onNewDay(){
  if(S.card.bal>0){const i=Math.ceil(S.card.bal*CARD_RATE);S.card.bal+=i;if(S.card.bal>cardLimit()*.6)notify('💳 Card balance is '+money(S.card.bal)+' (+'+money(i)+' interest). No pressure. (Some pressure.)')}
  S.bnpl.forEach(b=>{if(S.cash>=b.amt)S.cash-=b.amt;else{S.card.bal+=b.amt+LATE_FEE;notify('🐢 Pay-in-4 for '+b.label+' bounced: moved to your card + '+money(LATE_FEE)+' late fee')}b.left--});S.bnpl=S.bnpl.filter(b=>b.left>0);
  if(S.crime.active&&S.day>=S.crime.next){if(S.cash>=CRIME_FEE){S.cash-=CRIME_FEE;S.crime.next=S.day+7;notify('📦 Clamazon Crime renewed ('+money(CRIME_FEE)+')')}
    else if(S.card.bal+CRIME_FEE<=cardLimit()){S.card.bal+=CRIME_FEE;S.crime.next=S.day+7;notify('📦 Crime renewed on your card')}else{S.crime.active=false;notify('📦 Crime membership lapsed (couldn\'t pay)')}}
  S.orders.forEach(o=>{if(o.status==='shipping'&&S.day>=o.arrive){o.status='delivered';notify('📦 Delivered: '+ITEM[o.id].name+' is on your doorstep!')}});
  fbRefresh();
  Object.keys(S.wish).forEach(id=>{const it=ITEM[id];if(it&&offOf(it))notify('💖 Wishlist alert: '+it.name+' is '+offOf(it)+'% off today!')});
  crimeNewDay();const e=eventToday();if(e){notify(e.emoji+' '+e.name+' starts today! '+e.desc);if(e.gift&&!S.gifted[S.day]){S.gifted[S.day]=1;S.cash+=e.gift}}
}

/* ---------- Fleabay ---------- */
const inc=a=>Math.max(1,Math.round(a.bid*.06));
const nextBid=a=>a.high?a.bid+inc(a):a.bid;
function fmtLeft(ms){const s=Math.max(0,Math.ceil(ms/1000));return s?Math.floor(s/60)+':'+String(s%60).padStart(2,'0'):'ended'}
function fleaRefill(){const now=Date.now(),pool=ITEMS.filter(i=>MALL_STORE[i.store]&&!i.rare);
  while(S.flea.filter(a=>!a.done&&a.seller!=='you').length<5){const it=pick(pool),st=Math.max(1,Math.round(it.price*.15));
    S.flea.push({aid:S.oid++,id:it.id,seller:pick(NPC),bid:st,high:null,end:now+(60+rand(180))*1000,npcMax:Math.round(it.price*(.45+Math.random()*.5)),escrow:0,done:false,bids:0})}}
function playerBid(a){if(a.done||a.high==='you'||a.seller==='you')return;const amt=nextBid(a);
  if(S.cash<amt){toast('You need '+money(amt)+' cash to back that bid');sfx('bad');return}
  S.cash-=amt;a.bid=amt;a.high='you';a.escrow=amt;a.bids++;if(a.end-Date.now()<10000)a.end=Date.now()+10000;sfx('coin');toast('🙌 You\'re the high bidder!');save();rerender()}
function npcBid(a){const amt=nextBid(a);if(amt>a.npcMax)return false;
  if(a.high==='you'){S.cash+=a.escrow;a.escrow=0;notify('😤 Outbid on '+ITEM[a.id].name+' (now '+money(amt)+')');toast('😤 Outbid on '+ITEM[a.id].name+'!');sfx('bad')}
  a.bid=amt;a.high=pick(NPC.filter(n=>n!==a.seller&&n!==a.high));a.bids++;return true}
function endAuction(a){a.done=true;const it=ITEM[a.claim||a.id];
  if(a.seller==='you'){if(a.high&&ITEM[a.id].fake&&fakeBust(ITEM[a.id],a.bid,'Fleabay')){notify('🚨 Fleabay flagged your "'+it.name+'" as counterfeit. Sale reversed, item seized.')}else if(a.high&&a.hot&&hotBust(ITEM[a.id],a.bid,'Fleabay')){notify('🚨 Fleabay flagged "'+it.name+'" as reported stolen. Sale reversed, item seized.')}else if(a.high){if(ITEM[a.id].fake)S.rap.fakesSold++;const pay=Math.round(a.bid*(a.hot?.25:.9));S.cash+=pay;S.stats3.flipped++;notify('💸 Sold '+it.name+' on Fleabay for '+money(a.bid)+' (you get '+money(pay)+' after the 10% fee)');toast('💸 Fleabay sale: +'+money(pay));sfx('coin')}
    else{S.owned[a.id]=(S.owned[a.id]||0)+1;notify('🦗 No bids on '+it.name+'. It came back home.')}}
  else if(a.high==='you'){S.orders.unshift({oid:S.oid++,id:a.id,src:'Fleabay',price:a.bid,day:S.day,arrive:S.day,status:'delivered'});S.stats3.won++;
    notify('🏆 You won '+it.name+' for '+money(a.bid)+'! It\'s on your doorstep.');toast('🏆 Won '+it.name+'!');sfx('level')}}
function removeOne(id){S.owned[id]--;if(!S.owned[id]){delete S.owned[id];Object.keys(S.equipped).forEach(k=>{if(S.equipped[k]===id)delete S.equipped[k]});S.room=S.room.filter(q=>q.id!==id)}
  else{const pl=S.room.filter(q=>q.id===id);if(pl.length>S.owned[id])S.room.splice(S.room.indexOf(pl[0]),1)}if(S.rap)hotClamp(id)}
function listItem(it,start){const hot=!it.fake&&hotTake(it.id);removeOne(it.id);hotClamp(it.id);S.flea.push({aid:S.oid++,id:it.id,hot:hot,seller:'you',bid:start,high:null,end:Date.now()+120000,claim:it.fake?it.real:null,npcMax:Math.round((it.fake?ITEM[it.real]:it).price*(.35+Math.random()*.55)),escrow:0,done:false,bids:0});
  sfx('click');toast('🔨 Listed! Auction ends in 2:00');save();closeSheet();rerender()}
function onlineTick(){
  const now=Date.now();let ch=false;
  S.flea.forEach(a=>{if(a.done)return;if(now>=a.end){endAuction(a);ch=true;return}
    const p=(a.end-now)<15000?.3:.07;if((a.high==='you'||!a.high||a.seller==='you')&&Math.random()<p&&npcBid(a))ch=true});
  const before=S.flea.length;S.flea=S.flea.filter(a=>!a.done||now-a.end<300000);if(S.flea.length!==before)ch=true;
  if(S.flea.filter(a=>!a.done&&a.seller!=='you').length<5){fleaRefill();ch=true}
  if(S.fb.day!==S.day){fbRefresh();ch=true}
  if(ch){save();if(screen==='online'&&onTab==='flea'&&!sheetOpen())rerender()}
  Array.prototype.forEach.call(document.querySelectorAll('[data-end]'),e=>{e.textContent=fmtLeft(+e.dataset.end-now)});
}

/* ---------- Facenook Marketplace ---------- */
function fbRefresh(){const pool=ITEMS.filter(i=>MALL_STORE[i.store]&&!i.rare);S.fb={day:S.day,list:[]};
  for(let i=0;i<6;i++){const it=pick(pool),sl=pick(FB_SELLERS),ask=nicePrice(it.price*(.35+Math.random()*.35));
    S.fb.list.push({lid:S.oid++,id:it.id,seller:sl[0],face:sl[1],ask:ask,floor:Math.round(ask*(.6+Math.random()*.25)),scam:!!KO_OF[it.id]&&Math.random()<.3,status:'open',chat:[],counter:0,tries:0,asked:false})}}
function openFb(l){const it=ITEM[l.id];
  const chat=l.chat.map(m=>'<div class="bub '+(m[0]==='me'?'me':'')+'">'+esc(m[1])+'</div>').join('');
  sheet('<div class="row" style="align-items:flex-start"><img src="'+thumb(it)+'" style="width:76px;border-radius:10px"><div style="flex:1"><b>'+esc(it.name)+'</b><div class="small">'+l.face+' '+esc(l.seller)+' · retail '+money(it.price)+'</div><div class="pr">Asking '+money(l.ask)+'</div></div></div>'+
   '<div class="chat" id="chat">'+(chat||'<div class="small center">Say hi to the seller…</div>')+'</div>'+
   (l.status==='ghosted'?'<p class="center">👻 '+esc(l.seller)+' has left the chat. Forever.</p>':l.status==='sold'?'<p class="center">✅ You bought this.</p>':
   (!l.asked?'<button class="btn big" id="ask">👋 "Hi, is this still available?"</button>':
    '<div class="row"><input type="number" id="offer" inputmode="numeric" value="'+Math.round((l.counter||l.ask)*.75)+'" style="flex:1;width:auto"><button class="btn" id="off">Offer</button></div>'+
    (l.counter?'<button class="btn green big" id="acc">🤝 Accept '+money(l.counter)+'</button>':'')+'<button class="btn alt big" id="full">Pay asking price '+money(l.ask)+'</button>')));
  const ch=$('#chat');ch.scrollTop=ch.scrollHeight;
  const say=(w,t)=>l.chat.push([w,t]),ghost=()=>{l.status='ghosted';sfx('bad')};
  if($('#ask'))$('#ask').onclick=()=>{l.asked=true;say('me','Hi, is this still available?');
    if(Math.random()<.1){say('them','…');ghost()}else say('them',pick(['Yes!!! still available','yes. no lowballs I know what I have','Yeah but 3 other people want it','who is this','Yes 😊 porch pickup only, 2am','Available. Cash, Venmoo, or interesting rocks.']));save();openFb(l)};
  if($('#off'))$('#off').onclick=()=>{const v=parseInt($('#offer').value,10);if(!(v>0))return;l.tries++;say('me','Would you take '+money(v)+'?');
    if(v>=l.ask){l.counter=l.ask;say('them','Sure lol. '+money(l.ask)+' it is')}
    else if(v>=l.floor){l.counter=v;say('them',pick(['Ugh fine. '+money(v)+'. Come get it','Deal 🤝 '+money(v),'ok '+money(v)+' but you have to compliment my dog']))}
    else if(v>=l.floor*.75&&l.tries<5){l.counter=Math.max(l.floor,Math.round((v+l.ask)/2));say('them','Best I can do is '+money(l.counter))}
    else if(Math.random()<.35||l.tries>=5){say('them',pick(['lol','Seen ✓','🙄','Blocked.']));ghost()}
    else{l.counter=l.ask;say('them','lol no. '+money(l.ask)+' firm')}
    save();openFb(l)};
  const buyAt=p=>openPay('Facenook: '+it.name,p,()=>{l.status='sold';S.stats3.haggled++;maybeContact();
    if(l.scam){const ko=ITEM[KO_OF[l.id]];S.owned[ko.id]=(S.owned[ko.id]||0)+1;S.stats3.scammed++;notify('🤡 Facenook: your "'+it.name+'" is actually a '+ko.name+'. Worth '+money(ko.price)+'.');toast('🤡 Plot twist: it\'s a '+ko.name+' (worth '+money(ko.price)+')');sfx('bad')}
    else{S.owned[it.id]=(S.owned[it.id]||0)+1;toast('🎉 Got it for '+money(p)+'! (retail '+money(it.price)+')');sfx('buy')}save();rerender()});
  if($('#acc'))$('#acc').onclick=()=>buyAt(l.counter);if($('#full'))$('#full').onclick=()=>buyAt(l.ask);
}

/* ---------- Clamazon ---------- */
let onTab='clam',clamQ='',clamCat='all',clamSort='rel';
function clamDeliver(){return S.crime.active?'🚀 FREE instant delivery (Crime)':'🚚 '+money(SHIP_FEE)+' shipping · arrives Day '+(S.day+1)}
function buyClam(it){const p=priceOf(it),ship=S.crime.active?0:SHIP_FEE,tot=p+ship;
  openPay('Clamazon: '+it.name,tot,()=>{const o={oid:S.oid++,id:it.id,src:'Clamazon',price:tot,day:S.day,arrive:S.crime.active?S.day:S.day+1,status:S.crime.active?'delivered':'shipping'};
    S.orders.unshift(o);if(S.orders.length>60)S.orders.length=60;
    notify(S.crime.active?'📦 Crime delivery: '+it.name+' is already on your doorstep.':'🚚 Ordered '+it.name+'. Arrives Day '+o.arrive+'.');
    sfx('buy');toast(S.crime.active?'📦 Delivered instantly! Check your mailbox':'🚚 Ordered! Arrives Day '+o.arrive);save();rerender()},
    '<div class="small">Item '+money(p)+(ship?' + '+money(ship)+' shipping':'')+' · '+clamDeliver()+'</div>')}
function clamDetail(it){const rt=rating(it);
  sheet('<div class="row" style="align-items:flex-start"><img src="'+thumb(it)+'" style="width:110px;border-radius:12px"><div style="flex:1"><b>'+esc(it.name)+'</b><div class="stars">'+starStr(rt.stars)+' <span class="small">'+rt.stars+' ('+rt.count.toLocaleString('en-US')+')</span></div><div class="pr" style="font-size:20px">'+money(priceOf(it))+'</div><div class="small">'+clamDeliver()+'</div></div></div>'+
   '<button class="btn big" id="cbuy" style="background:#ffa41c;box-shadow:0 2px 0 #c77700">Buy now</button><div class="lbl">Customer reviews</div>'+
   reviewsFor(it).map(r=>'<div class="slot" style="display:block"><b>'+r.who+'</b> <span class="stars">'+starStr(r.s)+'</span><br>'+esc(r.t)+'</div>').join(''));
  $('#cbuy').onclick=()=>buyClam(it)}
function clamCard(it){const rt=rating(it),off=offOf(it),d=document.createElement('div');d.className='item';
  d.innerHTML='<img alt="" src="'+thumb(it)+'" data-a="det">'+(off?'<span class="badge">-'+off+'%</span>':'')+'<button class="heart" data-a="wish">'+(S.wish[it.id]?'❤️':'🤍')+'</button><div class="nm">'+esc(it.name)+'</div>'+
   '<div class="stars">'+starStr(rt.stars)+' <span class="small">('+rt.count.toLocaleString('en-US')+')</span></div><div>'+(off?'<span class="was">'+money(it.price)+'</span>':'')+'<span class="pr">'+money(priceOf(it))+'</span></div>'+
   '<div class="small">'+(S.crime.active?'🚀 Crime: FREE today':'Arrives Day '+(S.day+1))+'</div><div class="row"><button class="btn alt" data-a="det" style="flex:1;padding:8px 4px">Reviews</button><button class="btn" data-a="buy" style="flex:1;padding:8px 4px;background:#ffa41c;box-shadow:0 2px 0 #c77700">Buy</button></div>';
  onAll(d,'[data-a]',b=>{const a=b.dataset.a;if(a==='wish'){toggleWish(it);b.textContent=S.wish[it.id]?'❤️':'🤍'}else if(a==='buy')buyClam(it);else clamDetail(it)});return d}
function fillClam(){const g=$('#cgrid');if(!g)return;const q=clamQ.toLowerCase().trim();
  let r=CLAM.filter(i=>(clamCat==='all'||i.cat===clamCat)&&(!q||q.split(/\s+/).every(w=>i.name.toLowerCase().indexOf(w)>=0)));
  if(clamSort==='lo')r.sort((a,b)=>priceOf(a)-priceOf(b));else if(clamSort==='hi')r.sort((a,b)=>priceOf(b)-priceOf(a));else if(clamSort==='stars')r.sort((a,b)=>rating(b).stars-rating(a).stars);
  g.innerHTML='';$('#ccount').textContent=r.length+' results';r.slice(0,60).forEach(i=>g.appendChild(clamCard(i)));
  if(!r.length)g.innerHTML='<div class="card">No results for "'+esc(clamQ)+'". Try "hoodie", "red", or "console".</div>'}
function renderClam(v){
  v.insertAdjacentHTML('beforeend','<div class="ohead" style="background:#232f3e">clamazon<span style="color:#ff9900">.</span> <span class="small" style="color:#ccc">Everything. Eventually.</span></div>'+
   '<div class="card row sp" style="background:'+(S.crime.active?'#e3f2fd':'#fff')+'">'+(S.crime.active?'<div>📦 <b>Crime member</b><div class="small">Free instant delivery · renews Day '+S.crime.next+' ('+money(CRIME_FEE)+'/wk)</div></div><button class="btn alt" id="crime">Cancel</button>':
    '<div>📦 <b>Clamazon Crime</b><div class="small">'+money(CRIME_FEE)+'/week · FREE instant delivery · Crime Day deals</div></div><button class="btn" id="crime" style="background:#00a8e1;box-shadow:0 2px 0 #007aa3">Join</button>')+'</div>'+
   '<input type="search" id="cq" placeholder="🔍 Search Clamazon" value="'+esc(clamQ)+'"><div class="row sp" style="margin:6px 0"><span class="small" id="ccount"></span><select id="csort" style="padding:6px;border-radius:8px"><option value="rel">Featured</option><option value="lo">Price: low→high</option><option value="hi">Price: high→low</option><option value="stars">Avg. review</option></select></div><div id="ctabs"></div><div class="grid" id="cgrid"></div>');
  const ct=$('#ctabs'),cats=['all'].concat(Object.keys(BASES));const t=document.createElement('div');t.className='tabs';
  cats.forEach(c=>{const b=document.createElement('button');b.textContent=c==='all'?'All':CAT_LABEL[c];b.className=c===clamCat?'on':'';b.onclick=()=>{clamCat=c;Array.prototype.forEach.call(t.children,x=>x.className='');b.className='on';fillClam()};t.appendChild(b)});ct.appendChild(t);
  $('#csort').value=clamSort;$('#csort').onchange=e=>{clamSort=e.target.value;fillClam()};
  $('#cq').oninput=e=>{clamQ=e.target.value;fillClam()};
  $('#crime').onclick=()=>{if(S.crime.active){S.crime.active=false;toast('Crime cancelled. Shipping is slow again 🐌');save();rerender()}
    else openPay('Clamazon Crime (1 week)',CRIME_FEE,()=>{S.crime.active=true;S.crime.next=S.day+7;notify('📦 Welcome to Clamazon Crime! Instant delivery unlocked.');sfx('level');save();rerender()})};
  fillClam();
}
function renderFlea(v){
  const now=Date.now(),mine=S.flea.filter(a=>a.seller==='you'),theirs=S.flea.filter(a=>a.seller!=='you');
  v.insertAdjacentHTML('beforeend','<div class="ohead" style="background:linear-gradient(90deg,#e53238,#0064d2,#f5af02,#86b817)">Fleabay 🔨 <span class="small" style="color:#fff">Bid. Win. Regret.</span></div>'+
    '<div class="card row sp"><div><b>Sell your stuff</b><div class="small">2-min auction · NPCs bid · 10% fee</div></div><button class="btn" id="list">+ List an item</button></div>');
  const row=a=>{const it=ITEM[a.claim||a.id],live=!a.done;const you=a.high==='you';
    return'<div class="card row" style="align-items:flex-start"><img src="'+thumb(it)+'" style="width:70px;border-radius:10px"><div style="flex:1"><b>'+esc(it.name)+'</b><div class="small">'+(a.seller==='you'?'Your listing':'Seller: '+esc(a.seller))+' · retail '+money(it.price)+'</div>'+
      '<div>'+(a.high?'Bid':'Starting')+' <b class="pr">'+money(a.bid)+'</b> · '+a.bids+' bid'+(a.bids===1?'':'s')+(a.high?' · <b>'+(you?'You\'re winning 🎉':esc(a.high))+'</b>':'')+'</div>'+
      '<div class="small">'+(live?'⏱ <b data-end="'+a.end+'">'+fmtLeft(a.end-now)+'</b> left':(a.seller==='you'?(a.high?'💸 Sold':'🦗 Unsold'):you?'🏆 You won!':'Ended'))+'</div></div>'+
      (live&&a.seller!=='you'?'<button class="btn" data-bid="'+a.aid+'" '+(you?'disabled':'')+'>'+(you?'Top bid':'Bid '+money(nextBid(a)))+'</button>':'')+'</div>'};
  if(mine.length)v.insertAdjacentHTML('beforeend','<div class="lbl">Your listings</div>'+mine.map(row).join(''));
  v.insertAdjacentHTML('beforeend','<div class="lbl">Live auctions</div>'+theirs.filter(a=>!a.done).sort((a,b)=>a.end-b.end).map(row).join('')+(theirs.some(a=>a.done)?'<div class="lbl">Recently ended</div>'+theirs.filter(a=>a.done).map(row).join(''):''));
  onAll(v,'[data-bid]',b=>playerBid(S.flea.filter(a=>a.aid===+b.dataset.bid)[0]));
  $('#list').onclick=()=>{const own=Object.keys(S.owned).filter(sellable).map(id=>ITEM[id]);
    sheet('<h3>🔨 List on Fleabay</h3>'+(own.length?own.map(it=>'<div class="slot"><span class="row" style="flex-wrap:nowrap"><img src="'+thumb(it)+'" style="width:44px;border-radius:8px"><span>'+esc(it.name)+'<br><span class="small">worth '+money(it.price)+'</span></span></span><button class="btn" data-l="'+it.id+'">List</button></div>').join(''):'<p>You don\'t own anything yet!</p>'));
    onAll($('#sheet'),'[data-l]',b=>{const it=ITEM[b.dataset.l];
      sheet('<h3>List '+esc(it.name)+'</h3><div class="small">Retail '+money(it.price)+'. Lower starting bids attract more bidders.</div><div class="lbl">Starting bid</div><input type="number" id="lstart" value="'+Math.max(1,Math.round(it.price*.25))+'"><button class="btn big green" id="lgo">Start 2-minute auction</button>');
      $('#lgo').onclick=()=>{const v2=parseInt($('#lstart').value,10);if(!(v2>0))return;listItem(it,v2)}})};
}
function renderFb(v){
  if(S.fb.day!==S.day)fbRefresh();
  v.insertAdjacentHTML('beforeend','<div class="ohead" style="background:#1877f2">Facenook Marketplace 🏷️ <span class="small" style="color:#dbe7ff">New listings every day</span></div><div class="small" style="margin:0 4px 8px">Used goods, wild prices. Haggle! Some deals are too good to be true…</div><button class="btn" id="fbsell" style="width:100%;margin-bottom:8px;background:#42b72a;box-shadow:0 2px 0 #2d8a1c">📣 Sell something on Facenook</button><div class="grid" id="fbg"></div>');$('#fbsell').onclick=fbSell;
  S.fb.list.forEach(l=>{const it=ITEM[l.id],d=document.createElement('div');d.className='item';
    d.innerHTML='<img alt="" src="'+thumb(it)+'">'+(l.status!=='open'?'<span class="badge" style="background:#555">'+(l.status==='sold'?'SOLD':'👻 GHOSTED')+'</span>':'')+'<div class="nm">'+esc(it.name)+'</div><div><span class="was">'+money(it.price)+'</span><span class="pr">'+money(l.ask)+'</span></div><div class="small">'+l.face+' '+esc(l.seller)+'</div><button class="btn" style="background:#1877f2;box-shadow:0 2px 0 #0d5bc4">'+(l.status==='open'?'💬 Message':'View')+'</button>';
    d.querySelector('button').onclick=()=>openFb(l);$('#fbg').appendChild(d)})}
function renderOrders(v){
  v.insertAdjacentHTML('beforeend','<div class="ohead" style="background:#6d4c41">🚚 Orders & tracking</div>');
  const pk=packagesReady().length;if(pk)v.insertAdjacentHTML('beforeend','<div class="card row sp" style="background:#fff8e1"><span>📦 <b>'+pk+'</b> package(s) on your doorstep</span><button class="btn green" id="ocol">Bring inside</button></div>');
  if(!S.orders.length)v.insertAdjacentHTML('beforeend','<div class="card">No orders yet. Clamazon is <i>right there</i>.</div>');
  S.orders.forEach(o=>{const it=ITEM[o.id],st=o.status==='collected'?4:o.status==='delivered'?3:S.day>=o.arrive-0?2:1;
    v.insertAdjacentHTML('beforeend','<div class="card row" style="align-items:flex-start"><img src="'+thumb(it)+'" style="width:56px;border-radius:8px"><div style="flex:1"><b>'+esc(it.name)+'</b><div class="small">'+o.src+' · '+money(o.price)+' · ordered Day '+o.day+'</div>'+
      '<div class="small">'+(o.status==='collected'?'✅ Unboxed':o.status==='delivered'?'📦 Delivered to your doorstep':'🚚 Shipped · arrives Day '+o.arrive)+'</div><div class="steps">'+[1,2,3,4].map(i=>'<i class="'+(i<=st?'on':'')+'"></i>').join('')+'</div></div></div>')});
  if($('#ocol'))$('#ocol').onclick=collect}
function renderWish(v){
  v.insertAdjacentHTML('beforeend','<div class="ohead" style="background:#e91e63">💖 Wishlist</div><div class="small" style="margin:0 4px 8px">Tap 🤍 on any item to save it. We\'ll mail you when it goes on sale.</div><div class="grid" id="wg"></div>');
  const ids=Object.keys(S.wish).filter(id=>ITEM[id]);if(!ids.length){$('#wg').innerHTML='<div class="card">Nothing yet. Go heart something pretty.</div>';return}
  const open=openStores().map(s=>s.id);
  ids.forEach(id=>{const it=ITEM[id],off=offOf(it),d=document.createElement('div');d.className='item';
    const where=it.store==='clamazon'?'Clamazon':(STORES.filter(s=>s.id===it.store)[0]||{name:'?'}).name,avail=it.store==='clamazon'||open.indexOf(it.store)>=0;
    d.innerHTML='<img alt="" src="'+thumb(it)+'">'+(off?'<span class="badge">-'+off+'%</span>':'')+'<button class="heart" data-a="wish">❤️</button><div class="nm">'+esc(it.name)+'</div><div>'+(off?'<span class="was">'+money(it.price)+'</span>':'')+'<span class="pr">'+money(priceOf(it))+'</span></div><div class="small">'+esc(where)+(avail?' · open now':' · closed today')+'</div><button class="btn" data-a="buy" '+(avail&&stockLeft(it)>0?'':'disabled')+'>Buy</button>';
    onAll(d,'[data-a]',b=>{if(b.dataset.a==='wish'){toggleWish(it);rerender()}else if(it.store==='clamazon')buyClam(it);else buy(it)});$('#wg').appendChild(d)})}
function renderWallet(v){
  const lim=cardLimit(),bal=S.card.bal,pct=Math.min(1,bal/lim);
  v.insertAdjacentHTML('beforeend','<div class="ohead" style="background:linear-gradient(90deg,#424242,#9e9e9e)">💳 Mall Rat Card</div>'+
   '<div class="card"><div class="slot"><span>💵 Cash</span><b>'+money(S.cash)+'</b></div><div class="slot"><span>💳 Card balance</span><b style="color:'+(bal?'#d32f2f':'#222')+'">'+money(bal)+'</b></div><div class="slot"><span>Credit limit (grows with shifts worked)</span><b>'+money(lim)+'</b></div>'+
   '<div class="bar"><div style="width:'+pct*100+'%;background:'+(pct>.6?'#e53935':'#ff9800')+'"></div></div><div class="small">Interest: 3% per in-game day, compounding. '+(bal?'Tomorrow you\'ll owe ~'+money(bal+Math.ceil(bal*CARD_RATE))+'.':'')+'</div>'+
   (pct>.6?'<p style="background:#ffebee;border-radius:10px;padding:8px">🫠 Gentle vibe check: that balance is getting chunky. Maybe a burger shift or two before the next haul?</p>':'')+
   '<div class="row" style="margin-top:8px"><button class="btn green" id="payall" '+(bal&&S.cash?'':'disabled')+'>Pay '+money(Math.min(bal,S.cash))+'</button><button class="btn alt" id="pay50" '+(bal&&S.cash>=1?'':'disabled')+'>Pay half</button></div></div>'+
   '<div class="card"><div class="lbl" style="margin-top:0">🐢 Pay-in-4 plans</div>'+(S.bnpl.length?S.bnpl.map(b=>'<div class="slot"><span>'+esc(b.label)+'</span><b>'+money(b.amt)+' × '+b.left+' more days</b></div>').join(''):'<div class="small">None. Your future self thanks you.</div>')+'<div class="small">Missed payments go on your card + '+money(LATE_FEE)+' late fee.</div></div>');
  const pay=a=>{a=Math.min(a,S.cash,S.card.bal);if(a<=0)return;S.cash-=a;S.card.bal-=a;sfx('coin');toast('Paid '+money(a)+' toward your card ✨');save();rerender()};
  $('#payall').onclick=()=>pay(bal);$('#pay50').onclick=()=>pay(Math.ceil(bal/2))}
const OTABS=[['clam','📦 Clamazon'],['flea','🔨 Fleabay'],['fb','🏷️ Facenook'],['orders','🚚 Orders'],['wish','💖 Wishlist'],['wallet','💳 Wallet']];
function renderOnline(v){
  const t=document.createElement('div');t.className='tabs';
  OTABS.forEach(o=>{const b=document.createElement('button');b.textContent=o[1]+(o[0]==='orders'&&packagesReady().length?' ('+packagesReady().length+')':'');b.className=o[0]===onTab?'on':'';b.dataset.ot=o[0];b.onclick=()=>{onTab=o[0];sfx('click');render();window.scrollTo(0,0)};t.appendChild(b)});
  v.appendChild(t);({clam:renderClam,flea:renderFlea,fb:renderFb,orders:renderOrders,wish:renderWish,wallet:renderWallet})[onTab](v);
}
ACH.push(['crime','Crime Pays 📦','Join Clamazon Crime',s=>s.crime.active],['won','Gavel Gremlin 🔨','Win a Fleabay auction',s=>s.stats3.won>0],
 ['flip','Flipper 💸','Sell an item on Fleabay',s=>s.stats3.flipped>0],['haggle','Haggle Hero 🤝','Buy something on Facenook',s=>s.stats3.haggled>0],
 ['scam','Lesson Learned 🤡','Get scammed on Facenook',s=>s.stats3.scammed>0],['debt','In Debt We Trust 💳','Carry a $500+ card balance',s=>s.card.bal>=500],
 ['gadget','Gadget Goblin 🎮','Own 3 electronics',s=>Object.keys(s.owned).filter(id=>ITEM[id].cat==='electronics').length>=3]);
