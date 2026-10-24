(async()=>{
 // B5 rooms
 const b5=await G(async()=>{const g=__game;g.S.cash=1e6;closeSheet();g.go('room');roomsSheet();document.querySelector('[data-buy="kitchen"]').click();await new Promise(r=>setTimeout(r,100));
   const pay=document.querySelector('#sheet [data-m="cash"]');if(pay)pay.click();await new Promise(r=>setTimeout(r,200));return{have:g.S.home.have.slice(),cur:g.S.home.cur,sheet:document.querySelector('#sheet').hidden?'':document.querySelector('#sheet').innerText.slice(0,200)}});
 console.log('    rooms',JSON.stringify(b5));
 ok(b5.have.indexOf('kitchen')>=0&&b5.cur==='kitchen','built kitchen + switched');
 const b5b=await G(async()=>{const g=__game;const sofa=g.ITEMS.filter(i=>i.cat==='furniture'&&i.w===2&&i.h===1)[0];g.S.owned[sofa.id]=1;g.S.room.push({id:sofa.id,x:1,y:4});g.save();
   const tile=g.ITEMS.filter(i=>i.surf==='floor')[0];g.S.owned[tile.id]=1;g.S.home.floor=tile.id;g.save();
   switchRoom('bed');const bedHas=g.S.room.some(p=>p.id===sofa.id),bedFloor=g.S.home.floor;switchRoom('kitchen');return{bedHas,bedFloor,kitHas:g.S.room.some(p=>p.id===sofa.id),kitFloor:g.S.home.floor===tile.id,placed:placedCount(sofa.id),tabs:document.querySelectorAll('#rsw [data-room]').length}});
 ok(!b5b.bedHas&&!b5b.bedFloor&&b5b.kitHas&&b5b.kitFloor&&b5b.placed===1&&b5b.tabs===2,'rooms decorate independently '+JSON.stringify(b5b));
 await shot('rooms');
 // B6 outfits + fit check
 const b6=await G(async()=>{const g=__game;const pick=SLOTS.map(k=>g.ITEMS.filter(i=>i.cat===k&&i.store==='goochie')[0]||g.ITEMS.filter(i=>i.cat===k)[0]);pick.forEach(it=>{g.S.owned[it.id]=1;g.S.equipped[it.cat]=it.id});g.save();g.go('closet');
   document.querySelector('#ofsave').click();const n=g.S.outfits.length;g.S.equipped={};document.querySelector('[data-wear="0"]').click();const worn=Object.keys(g.S.equipped).length;
   document.querySelector('#fitpic').click();await new Promise(r=>setTimeout(r,200));const img=document.querySelector('#sheet img');return{n,worn,png:!!img&&img.src.indexOf('data:image/png')===0&&img.naturalWidth===720,set:brandSet()}});
 ok(b6.n===1&&b6.worn>=5&&b6.png,'outfit preset save/wear + fit-check PNG '+JSON.stringify(b6));
 await shot('fitcheck');
 const b6r=await G(async()=>{closeSheet();__game.go('room');document.querySelector('#rphoto').click();await new Promise(r=>setTimeout(r,200));const i=document.querySelector('#sheet img');return !!i&&i.src.indexOf('data:image/png')===0});ok(b6r,'room photo PNG');
 // B7 collection / drops / set bonus
 const b7=await G(async()=>{const g=__game;closeSheet();const goo=g.ITEMS.filter(i=>i.store==='goochie'&&SLOTS.indexOf(i.cat)>=0);g.S.equipped={};goo.slice(0,0);const by={};goo.forEach(i=>{if(!by[i.cat])by[i.cat]=i});Object.keys(by).forEach(k=>{g.S.owned[by[k].id]=1;g.S.equipped[k]=by[k].id});g.save();
   const bs=brandSet();g.go('mall');const dc=!!document.querySelector('#dropcard');const d=weeklyDrop();const c0=g.S.cash;document.querySelector('#dropbuy').click();await new Promise(r=>setTimeout(r,100));
   g.go('me');document.querySelector('#collopen').click();const rows=document.querySelectorAll('#sheet [data-cs]').length;return{bs,dc,drop:!!g.S.owned[d.id]&&g.S.coll[d.id]===1,rows,rew:Object.keys(g.S.collRew).length}});
 ok(b7.bs&&b7.bs.mult>1&&b7.dc&&b7.drop&&b7.rows>20,'set bonus, weekly drop, collection log '+JSON.stringify(b7));
 await G(()=>{document.querySelector('#sheet [data-cs="goochie"]').click()});await sleep(300);await shot('collection');await G(()=>closeSheet());
 // collab drop not in mall rotation
 ok(await G(()=>{for(let d=1;d<60;d++){__game.S.day=d;if(openStores().some(s=>s.drop))return false}return true}),'collab store never rotates into mall');
})()
