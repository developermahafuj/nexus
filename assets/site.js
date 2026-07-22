const menuToggle=document.getElementById('menuToggle');
const navLinks=document.getElementById('navLinks');
if(menuToggle&&navLinks){
  menuToggle.addEventListener('click',()=>{
    const open=navLinks.classList.toggle('mobile-open');
    document.body.classList.toggle('menu-open',open);
    menuToggle.setAttribute('aria-expanded',String(open));
  });
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    navLinks.classList.remove('mobile-open');document.body.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false');
  }));
}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('.faq-q').forEach(button=>button.addEventListener('click',()=>button.closest('.faq-item').classList.toggle('open')));
const modal=document.getElementById('mediaModal');
const modalBody=document.getElementById('modalBody');
const closeModal=()=>{if(!modal)return;modal.classList.remove('open');document.body.classList.remove('modal-open');if(modalBody){modalBody.querySelectorAll('video').forEach(v=>v.pause());modalBody.innerHTML='';}};
document.querySelectorAll('.media-card').forEach(card=>card.addEventListener('click',()=>{
  if(!modal||!modalBody)return;
  const type=card.dataset.type,src=card.dataset.src;
  modalBody.innerHTML=type==='video'?`<video controls autoplay playsinline src="${src}"></video>`:`<img src="${src}" alt="Expanded company gallery media">`;
  modal.classList.add('open');document.body.classList.add('modal-open');
}));
document.getElementById('modalClose')?.addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

// V3 selectable service packages
const packageButtons=[...document.querySelectorAll('.package-select')];
const selectedService=document.getElementById('selectedService');
const selectedTier=document.getElementById('selectedTier');
const selectedPrice=document.getElementById('selectedPrice');
const selectedTitle=document.getElementById('selectedPackageTitle');
const selectedMeta=document.getElementById('selectedPackageMeta');
const requestSection=document.getElementById('package-request');
const packageForm=document.getElementById('packageForm');
const packageSuccess=document.getElementById('packageFormSuccess');

function choosePackage(button,{scroll=true}={}){
  const service=button.dataset.service||'';
  const tier=button.dataset.tier||'';
  const price=button.dataset.price||'';
  document.querySelectorAll('.tier.selected').forEach(card=>card.classList.remove('selected'));
  packageButtons.forEach(item=>{
    const label=item.querySelector('strong');
    if(label) label.textContent=`Choose ${item.dataset.tier} Package`;
    item.removeAttribute('aria-pressed');
  });
  const card=button.closest('.tier');
  card?.classList.add('selected');
  button.setAttribute('aria-pressed','true');
  const label=button.querySelector('strong');
  if(label) label.textContent=`Selected ${tier} Package`;
  if(selectedService) selectedService.value=service;
  if(selectedTier) selectedTier.value=tier;
  if(selectedPrice) selectedPrice.value=price;
  if(selectedTitle) selectedTitle.innerHTML=`<strong>${service}</strong>`;
  if(selectedMeta) selectedMeta.innerHTML=`<strong>${tier} Package</strong> · Starting at <strong>${price}</strong>`;
  packageSuccess?.classList.remove('show');
  if(scroll&&requestSection){
    requestSection.scrollIntoView({behavior:'smooth',block:'start'});
    window.setTimeout(()=>packageForm?.querySelector('input:not([type="hidden"])')?.focus({preventScroll:true}),650);
  }
}
packageButtons.forEach(button=>button.addEventListener('click',()=>choosePackage(button)));

if(packageForm){
  packageForm.addEventListener('submit',event=>{
    event.preventDefault();
    if(!selectedService?.value){
      if(selectedTitle) selectedTitle.innerHTML='<strong>Please choose a package first</strong>';
      if(selectedMeta) selectedMeta.textContent='Select any Basic, Standard or Premium package from the pricing cards above.';
      document.getElementById('pricing')?.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    packageSuccess?.classList.add('show');
    packageSuccess?.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
}

// Optional deep-link support: services.html?service=...&tier=...
if(packageButtons.length){
  const params=new URLSearchParams(window.location.search);
  const serviceParam=(params.get('service')||'').toLowerCase();
  const tierParam=(params.get('tier')||'').toLowerCase();
  if(serviceParam&&tierParam){
    const match=packageButtons.find(button=>button.dataset.service.toLowerCase().includes(serviceParam)&&button.dataset.tier.toLowerCase()===tierParam);
    if(match) choosePackage(match,{scroll:false});
  }
}

// V3 team filters
const teamFilters=[...document.querySelectorAll('.team-filter')];
const teamCards=[...document.querySelectorAll('.team-member-card')];
teamFilters.forEach(filter=>filter.addEventListener('click',()=>{
  const target=filter.dataset.filter;
  teamFilters.forEach(item=>item.classList.toggle('active',item===filter));
  teamCards.forEach(card=>{
    const show=target==='all'||card.dataset.department===target;
    card.classList.toggle('filtered-out',!show);
    if(show) card.classList.add('visible');
  });
}));

// Do not navigate placeholder social links until verified URLs are supplied.
document.querySelectorAll('.member-socials a[href="#"]').forEach(link=>link.addEventListener('click',event=>event.preventDefault()));
