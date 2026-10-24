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
function v8Fix(s){}
