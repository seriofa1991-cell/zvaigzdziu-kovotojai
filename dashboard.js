/* ŽVAIGŽDŽIŲ KOVOTOJAI — desktop dashboard išdėstymas.
   Neliečia jokios žaidimo logikos: po kiekvieno render() tiesiog perkelia jau sugeneruotus
   DOM elementus (ne HTML tekstą) į šoninio meniu + dviejų skydelių struktūrą. Mobiliame (<900px)
   šis failas nieko nekeičia — ten lieka originalus vieno stulpelio išdėstymas su apatine navigacija.
   Visi mygtukai toliau naudoja tuos pačius data-act/data-arg atributus, tad esamas click listener
   (document.addEventListener('click',...) index.html faile) juos suvaldo be jokių pakeitimų. */
(function(){
  if(typeof render!=='function')return;
  const NAV=[['kova','⚔️'],['train','💪'],['bag','🎒'],['camp','🏕️'],['arena','🏟️'],['prof','👤']];
  const _origRender=render;

  function buildSide(){
    const side=document.createElement('div');
    side.className='db-side';
    side.innerHTML=`<img class="db-logo" src="img/logo/icon.svg" alt="" data-act="tab" data-arg="kova">`+
      NAV.map(([id,ic])=>
      `<button class="db-nv${typeof ui!=='undefined'&&ui.tab===id?' on':''}" data-act="tab" data-arg="${id}"><span class="ic">${ic}</span>${esc(t(id))}</button>`
    ).join('');
    return side;
  }

  function layoutDashboard(){
    if(window.innerWidth<900)return; // mobile: paliekama originali tvarka, be perstatymo
    const app=document.getElementById('app');
    if(!app||typeof S==='undefined'||!S||typeof USER==='undefined'||!USER)return;
    const navEl=app.querySelector(':scope > nav.nav');
    const charHead=app.querySelector('#charHead');
    const rest=Array.from(app.children).filter(c=>c!==navEl);
    if(!rest.length)return;

    const shell=document.createElement('div');shell.className='db-shell';
    const left=document.createElement('div');left.className='db-left';
    const right=document.createElement('div');right.className='db-right';
    rest.forEach(node=>{(node===charHead?right:left).appendChild(node)});
    shell.appendChild(left);
    if(charHead)shell.appendChild(right);

    app.innerHTML='';
    app.appendChild(buildSide());
    app.appendChild(shell);
    if(navEl)app.appendChild(navEl);
  }

  render=function(){
    _origRender();
    try{layoutDashboard()}catch(e){/* nutinka esant netikėtai ekrano struktūrai — tylisi, paliekama originali versija */}
  };

  let rT=null;
  window.addEventListener('resize',()=>{
    // Mobiliame ekrane (<900px) layoutDashboard() vis tiek nieko nedaro, bet render()
    // visada pilnai perrašo #app innerHTML — tai sunaikindavo focus'uotą <input> kai
    // telefono klaviatūra atsidarydavo (ji pati sukelia 'resize' įvykį), dėl ko klaviatūra
    // akimirksniu užsidarydavo. Žemiau 900px šis listener'is dabar nieko nedaro.
    if(window.innerWidth<900)return;
    clearTimeout(rT);rT=setTimeout(()=>{try{render()}catch(e){}},150)});

  render();
})();
