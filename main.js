import { gsap }          from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
gsap.registerPlugin(ScrollTrigger);

/* ========== Goccia & cover ========== */
const drop   = document.getElementById('drop');
const cover  = document.getElementById('white-cover');
const endY   = window.innerHeight * 0.8;   // punto di arrivo della goccia

gsap.timeline({
  scrollTrigger:{
    trigger:'#projects',
    start:'top 80%',
    end:  'top 0%',
    scrub:true
  }
})
.to(drop ,{ attr:{ cy:endY, r:40 } }, 0)
.to(cover,{ clipPath:`circle(130% at 1120px ${endY}px)` }, 0);

/* ========== Filtro progetti ========== */
document.querySelectorAll('[data-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const t=btn.dataset.filter;
    document.querySelectorAll('.project').forEach(card=>{
      card.style.display = (t==='all'||card.dataset.type===t)?'grid':'none';
    });
    document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});
