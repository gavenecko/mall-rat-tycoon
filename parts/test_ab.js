// v31.1: every store card must show opaque, non-blank item art
(async()=>{
 const art=await G(async()=>{
  function bgOf(it){
   const N=160,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');
   const RB=RAR_BG[rarity(it)],gb=x.createRadialGradient(N/2,N*.42,8,N/2,N/2,N*.75);
   gb.addColorStop(0,lum(it.color)>.85?'#e4e2ee':RB[0]);gb.addColorStop(1,RB[1]);
   x.fillStyle=gb;rr(x,0,0,N,N,26);x.fill();
   x.fillStyle='rgba(255,255,255,.45)';ell(x,N*.3,N*.18,N*.28,N*.08);x.fill();
   x.fillStyle='rgba(40,20,60,.16)';ell(x,N/2,N*.9,N*.3,N*.045);x.fill();
   return x.getImageData(0,0,N,N);
  }
  function loadImg(src){return new Promise(function(res,rej){const im=new Image();im.onload=function(){res(im)};im.onerror=function(){rej(new Error('img'))};im.src=src})}
  async function ready(img,src){
   if(img&&img.complete&&img.naturalWidth)return img;
   return loadImg(src||(img&&img.src));
  }
  function score(img,it){
   if(!img||!img.naturalWidth)return {ok:false,reason:'missing',diff:0,op:0};
   const N=img.naturalWidth,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');
   x.drawImage(img,0,0,N,N);const fg=x.getImageData(0,0,N,N),bg=bgOf(it);
   let diff=0,opaque=0,inner=0,m=Math.floor(N*.15);
   for(let y=m;y<N-m;y++)for(let xx=m;xx<N-m;xx++){
    const i=(y*N+xx)*4;inner++;
    if(fg.data[i+3]>200)opaque++;
    const bi=N===160?i:((Math.round(y*160/N)*160+Math.round(xx*160/N))*4);
    if(Math.abs(fg.data[i]-bg.data[bi])>14||Math.abs(fg.data[i+1]-bg.data[bi+1])>14||Math.abs(fg.data[i+2]-bg.data[bi+2])>14)diff++;
   }
   return {ok:diff>=120&&opaque/inner>=.9,diff:diff,op:+(opaque/inner).toFixed(3),reason:''};
  }
  const _os=openStores;openStores=function(){return STORES.slice()};
  const blank=[];let cards=0;
  try{
   filter='all';closeSheet();
   for(let si=0;si<STORES.length;si++){
    const s=STORES[si];
    go('mall',s.id);
    const list=ITEMS.filter(i=>i.store===s.id);
    const shown=document.querySelectorAll('#view .item img').length;
    if(shown!==list.length)blank.push({store:s.id,name:'(count)',id:'',reason:'shown '+shown+' expected '+list.length});
    for(let i=0;i<list.length;i++){
     const it=list[i],el=[].find.call(document.querySelectorAll('#view .item img'),function(e){return e.alt===it.name});
     cards++;
     let img=null;try{img=await ready(el,thumb(it))}catch(e){}
     const r=score(img,it);
     if(!r.ok)blank.push({store:s.id,name:it.name,id:it.id,slot:it.slot||'',cat:it.cat,shape:it.shape,pat:it.pattern||'',diff:r.diff,op:r.op,reason:r.reason||'blank'});
    }
   }
  }finally{openStores=_os;filter='all';go('mall')}
  const catalog=[];
  for(let i=0;i<ITEMS.length;i++){
   const it=ITEMS[i];let img=null;
   try{img=await loadImg(thumb(it))}catch(e){}
   const r=score(img,it);
   if(!r.ok)catalog.push({store:it.store,name:it.name,id:it.id,slot:it.slot||'',cat:it.cat,shape:it.shape,pat:it.pattern||'',diff:r.diff,op:r.op});
  }
  return {cards:cards,stores:STORES.length,items:ITEMS.length,blank:blank,catalog:catalog,clothingSlots:ITEMS.filter(function(i){return SLOTS.indexOf(i.cat)>=0&&!i.slot}).map(function(i){return i.id})};
 });
 const okArt=!art.blank.length&&!art.catalog.length&&!art.clothingSlots.length&&art.cards>=100;
 ok(okArt,'store cards have opaque drawn art ('+art.stores+' stores, '+art.cards+' cards, '+art.items+' thumbs)'+(okArt?'':' BLANK '+JSON.stringify(art.blank.slice(0,8))+' CATALOG '+JSON.stringify(art.catalog.slice(0,8))+' NOSLOT '+JSON.stringify(art.clothingSlots.slice(0,8))));
})();
