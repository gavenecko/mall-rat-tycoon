"use strict";
/* =====================================================================
   MALL RAT TYCOON v2 — single file. Sections:
   DATA -> ITEM GENERATION -> STATE/SAVES -> DRAWING -> SCREENS -> JOBS -> BOOT
   ES2017-safe; all storage access guarded for sandboxed viewers.
===================================================================== */
/* ============================ DATA ============================ */
const START_CASH=150, DAY_MS=600000, OPEN_COUNT=4, SHIFT_MS=45000;
// [name, hex] — names match the hex used for drawing
const COLORS=[['Red','#d32f2f'],['Pink','#f48fb1'],['Hot Pink','#ff1493'],['Orange','#fb8c00'],['Yellow','#fdd835'],['Lime','#9ccc65'],
 ['Green','#2e7d32'],['Mint','#98ff98'],['Teal','#00897b'],['Sky Blue','#4fc3f7'],['Royal Blue','#1e4fd6'],['Navy','#1a237e'],
 ['Purple','#7b1fa2'],['Lavender','#b39ddb'],['Burgundy','#800020'],['Brown','#6d4c41'],['Tan','#d2b48c'],['Beige','#f5f5dc'],
 ['Black','#212121'],['Gray','#9e9e9e'],['White','#fafafa'],['Gold','#d4af37'],['Silver','#c0c0c0']];
const PATTERNS=[{name:'Plain',key:''},{name:'Plain',key:''},{name:'Striped',key:'stripes'},{name:'Polka-Dot',key:'dots'},{name:'Checkered',key:'checks'}];
const SPARKLE={name:'Sparkle',key:'sparkle'};
const SLOTS=['hats','tops','bottoms','shoes','accessories'];
const ROOM_CATS=['furniture','decor','electronics'];
const CAT_LABEL={hats:'🧢 Hats',tops:'👕 Tops',bottoms:'👖 Bottoms',shoes:'👟 Shoes',accessories:'🕶️ Accessories',furniture:'🛋️ Furniture',decor:'🪴 Decor',electronics:'🎮 Electronics'};
// key = drawing shape; name = display noun. plain:1 => no fabric pattern. w/h = room footprint; layer: floor|rug|wall
const B=(key,name,mul,o)=>Object.assign({key:key,name:name,mul:mul},o||{});
const BASES={
 hats:[B('cap','Baseball Cap',1),B('beanie','Beanie',.8),B('tophat','Top Hat',2),B('bucket','Bucket Hat',1),B('crown','Crown',6,{plain:1}),B('cowboy','Cowboy Hat',1.6)],
 tops:[B('tee','T-Shirt',1),B('tank','Tank Top',.7),B('hoodie','Hoodie',1.5),B('blazer','Blazer',3),B('puffer','Puffer Jacket',2.5),B('sweater','Sweater',1.4)],
 bottoms:[B('jeans','Jeans',1.2),B('joggers','Joggers',1),B('shorts','Shorts',.7),B('skirt','Skirt',.9)],
 shoes:[B('sneakers','Sneakers',1),B('boots','Boots',1.5),B('heels','Heels',1.8),B('slides','Slides',.4),B('loafers','Loafers',1.3)],
 accessories:[B('sunglasses','Sunglasses',1,{plain:1}),B('chain','Chain Necklace',1.5,{plain:1}),B('handbag','Handbag',2.5),B('watch','Watch',2,{plain:1}),B('scarf','Scarf',.8)],
 furniture:[B('sofa','Sofa',3,{w:2,h:1}),B('bed','Bed',4,{w:2,h:2}),B('chair','Chair',1,{w:1,h:1}),B('table','Table',1.5,{w:2,h:1}),B('bookshelf','Bookshelf',2,{w:1,h:2}),B('bathtub','Bathtub',3,{w:2,h:1})],
 decor:[B('plant','Potted Plant',.5,{w:1,h:1}),B('lamp','Floor Lamp',.8,{w:1,h:1,plain:1}),B('rug','Rug',1,{w:2,h:2,layer:'rug'}),B('tv','TV',3,{w:2,h:1,plain:1}),B('fishtank','Fish Tank',2,{w:1,h:1,plain:1}),
  B('painting','Painting',1.5,{w:1,h:1,layer:'wall'}),B('clock','Wall Clock',.7,{w:1,h:1,layer:'wall',plain:1}),B('curtains','Curtained Window',1.2,{w:2,h:1,layer:'wall'}),B('poster','Poster',.4,{w:1,h:1,layer:'wall'}),B('wallshelf','Wall Shelf',.8,{w:2,h:1,layer:'wall'})],
 electronics:[B('console','Game Console',4,{w:1,h:1,plain:1}),B('phone','Smartphone',5,{w:1,h:1,plain:1}),B('speaker','Smart Speaker',1.5,{w:1,h:1,plain:1}),B('arcade','Arcade Cabinet',6,{w:1,h:2,plain:1}),B('laptop','Laptop',5,{w:1,h:1,plain:1}),B('vr','VR Headset',4,{w:1,h:1,plain:1}),B('gamingpc','Gaming PC',7,{w:1,h:1,plain:1})]
};
const STORES=[
 {id:'frauda',name:'Frauda',tag:'Milano-ish luxury',color:'#111',emoji:'👜',cats:['tops','bottoms','shoes','accessories'],tier:[400,9000]},
 {id:'goochie',name:'Goochie',tag:'Double G, double price',color:'#0a6b3a',emoji:'🐍',cats:['hats','tops','shoes','accessories'],tier:[300,7000]},
 {id:'balence',name:'BalenceNada',tag:'Ugly-chic, extra $$$',color:'#444',emoji:'👟',cats:['shoes','tops','bottoms','hats'],tier:[350,8000]},
 {id:'vuitno',name:'Louis Vuitno',tag:'Monogram everything',color:'#6b4a1e',emoji:'🧳',cats:['accessories','hats','decor'],tier:[500,15000]},
 {id:'shanel',name:'Shanel',tag:'No. 5 out of 10',color:'#000',emoji:'💄',cats:['tops','bottoms','accessories','shoes'],tier:[450,12000]},
 {id:'versnatchy',name:'Versnatchy',tag:'Medusa approved',color:'#b8860b',emoji:'👑',cats:['hats','tops','furniture','decor'],tier:[800,30000]},
 {id:'hermeez',name:'Hermeez',tag:'Waitlist for the waitlist',color:'#e65100',emoji:'🍊',cats:['accessories','furniture','decor'],tier:[2000,25000]},
 {id:'dollar',name:'Dollar Treet',tag:'Everything about a buck',color:'#2a9d3a',emoji:'💵',cats:['hats','accessories','decor','shoes'],tier:[1,5]},
 {id:'wally',name:"Wally's Mart",tag:'Save money. Live... ok.',color:'#1f6fd1',emoji:'🛒',cats:['tops','bottoms','shoes','furniture','decor'],tier:[4,60]},
 {id:'ikeya',name:'Ikeya',tag:'Some assembly required',color:'#0051ba',emoji:'🪑',cats:['furniture','decor'],tier:[15,400]},
 {id:'thrift',name:'Thrift Shift',tag:'Pre-loved, pre-smelled',color:'#9b59b6',emoji:'♻️',cats:['hats','tops','bottoms','shoes','furniture'],tier:[1,25]},
 {id:'targit',name:'Targit',tag:'Came for soap, left with a lamp',color:'#cc0000',emoji:'🎯',cats:['decor','furniture','tops','bottoms'],tier:[8,150]},
 {id:'worstbuy',name:'Worst Buy',tag:'Extended warranty? Extended regret.',color:'#0a2f8f',emoji:'🎮',cats:['electronics','decor'],tier:[40,2500]}
];
const BODIES={slim:{label:'Slim',sh:15,hip:12},average:{label:'Average',sh:17,hip:14},curvy:{label:'Curvy',sh:16,hip:18},broad:{label:'Broad',sh:21,hip:15},round:{label:'Round',sh:20,hip:19}};
const SKINS=['#ffe0c4','#f6c89f','#e0ac69','#c68642','#8d5524','#5c3a21'];
const HAIRS={buzz:'Buzz',short:'Short',spiky:'Spiky',bob:'Bob',long:'Long',ponytail:'Ponytail',bun:'Bun',afro:'Afro'};
const HAIR_COLORS=[['Black','#1f1410'],['Brown','#5a3825'],['Auburn','#a0522d'],['Blonde','#e6c27a'],['Silver','#c9c9c9'],['Pink','#ff6fb5'],['Blue','#3fa9f5'],['Purple','#7b4fd6']];
const GENDERS={male:{label:'Male',body:'broad',hair:'short'},female:{label:'Female',body:'curvy',hair:'long'},nb:{label:'Non-binary',body:'slim',hair:'bob'}};

/* ======================= ITEM GENERATION ======================= */
const rand=n=>Math.floor(Math.random()*n);
const pick=a=>a[rand(a.length)];
function rng(seed){seed=(seed>>>0)||1;return function(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
function shuffle(a,r){r=r||Math.random;a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));const t=a[i];a[i]=a[j];a[j]=t}return a}
function nicePrice(p){return p<100?Math.max(1,Math.round(p)):p<1000?Math.round(p/5)*5:Math.round(p/50)*50}
const ITEMS=[], ITEM={};
(function gen(){
  const r=rng(2026), names={};
  function make(s,cat,base,rare){
    let it=null;
    for(let t=0;t<20&&!it;t++){
      const c=COLORS[Math.floor(r()*COLORS.length)];
      const pat=base.plain?PATTERNS[0]:(rare?SPARKLE:PATTERNS[Math.floor(r()*PATTERNS.length)]);
      const name=s.name+(rare?' Limited':'')+' '+c[0]+(pat.key?' '+pat.name:'')+' '+base.name;
      if(names[name])continue;names[name]=1;
      const lo=s.tier[0],hi=s.tier[1];
      let p=lo*Math.pow(hi/lo,Math.pow(r(),1.4))*base.mul;p=Math.min(Math.max(p,1),hi*2.5);if(rare)p*=3;
      it={id:s.id+'-'+cat+'-'+base.key+'-'+ITEMS.length,store:s.id,name:name,cat:cat,slot:SLOTS.indexOf(cat)>=0?cat:null,shape:base.key,
        price:nicePrice(p),color:c[1],colorName:c[0],pattern:pat.key,rare:!!rare,stock:rare?3:0,w:base.w||1,h:base.h||1,layer:base.layer||'floor'};
    }
    if(it){ITEMS.push(it);ITEM[it.id]=it}
  }
  STORES.forEach(s=>{
    s.cats.forEach(cat=>{shuffle(BASES[cat],r).slice(0,cat==='decor'?5:4).forEach(b=>make(s,cat,b,false))});
    const rc=s.cats[Math.floor(r()*s.cats.length)];make(s,rc,BASES[rc][Math.floor(r()*BASES[rc].length)],true);
  });
})();

