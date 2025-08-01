/* filtro progetti senza librerie */
document.querySelectorAll('[data-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const t=btn.dataset.filter;

    document.querySelectorAll('.project').forEach(card=>{
      card.style.display = (t==='all'||card.dataset.type===t) ? 'grid' : 'none';
    });

    document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    /* scroll to first visible project (mobile UX) */
    const first = document.querySelector('.project:not([style*="none"])');
    if(first) first.scrollIntoView({behavior:'smooth',block:'start'});
  });
});
