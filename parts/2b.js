/* ============ v3 ONLINE CATALOGS (generated after mall items so v2 save ids stay stable) ============ */
const MALL_STORE={};STORES.forEach(s=>{MALL_STORE[s.id]=1});
const KO_NAMES={frauda:'Fraudah',goochie:'Gucchi',balence:'BalenciNOPE',vuitno:'Louie Vootin',shanel:'Chanell',versnatchy:'Versnatchie',hermeez:'Hermeze'};
const KO_OF={};
(function genOnline(){
  const r=rng(777),names={};
  Object.keys(BASES).forEach(cat=>BASES[cat].forEach(base=>{
    for(let k=0;k<4;k++){let it=null;
      for(let t=0;t<20&&!it;t++){const c=COLORS[Math.floor(r()*COLORS.length)],pat=base.plain?PATTERNS[0]:PATTERNS[Math.floor(r()*PATTERNS.length)];
        const name='Clamazon Basics '+c[0]+(pat.key?' '+pat.name:'')+' '+base.name;if(names[name])continue;names[name]=1;
        const p=(4+r()*55)*base.mul*(cat==='electronics'?5:1);
        it={id:'clam-'+cat+'-'+base.key+'-'+k,store:'clamazon',name:name,cat:cat,slot:SLOTS.indexOf(cat)>=0?cat:null,shape:base.key,price:nicePrice(p),color:c[1],colorName:c[0],pattern:pat.key,rare:false,stock:0,w:base.w||1,h:base.h||1,layer:base.layer||'floor'}}
      if(it){ITEMS.push(it);ITEM[it.id]=it}}
  }));
  // knockoffs: what Facenook scammers actually ship you. Same look, sadder name, ~3% value.
  ITEMS.filter(i=>KO_NAMES[i.store]&&!i.rare).forEach(i=>{const s=STORES.filter(q=>q.id===i.store)[0];
    const ko=Object.assign({},i,{id:'ko-'+i.id,store:'knockoff',name:KO_NAMES[i.store]+i.name.slice(s.name.length)+' (knockoff)',price:Math.max(3,nicePrice(i.price*.03)),fake:true,real:i.id});
    ITEMS.push(ko);ITEM[ko.id]=ko;KO_OF[i.id]=ko.id});
})();
