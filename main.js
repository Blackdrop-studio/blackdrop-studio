/*  IMPORT  —  usa le build ESM “ufficiali”  */
import gsap from 'https://unpkg.com/gsap@3.12.5/dist/gsap.min.js?module';
import ScrollTrigger from 'https://unpkg.com/gsap@3.12.5/dist/ScrollTrigger.min.js?module';
gsap.registerPlugin(ScrollTrigger);

/*  ——— DROP TIMELINE ——— */
const drop   = document.getElementById('drop');          // cerchio nello SVG
const cover  = document.getElementById('white-cover');   // div full-screen
const endY   = window.innerHeight * 0.75;                // dove “atterra”

gsap.timeline({
  scrollTrigger:{
    trigger : '#projects',
    start   : 'top 75%',     // quando la sezione entra
    end     : 'top 5%',      // fine dell’effetto
    scrub   : true,          // aggancia allo scroll
  }
})
  .to(drop , { attr:{ cy:endY, r:40 } }, 0)
  .to(cover, { clipPath:`circle(130% at 1120px ${endY}px)` }, 0)

/*  ——— FILTRO PROGETTI ——— */
document.querySelectorAll('[data-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const t = btn.dataset.filter;
    document.querySelectorAll('.project').forEach(card=>{
      card.style.display = (t==='all' || card.dataset.type===t) ? 'grid' : 'none';
    });
    document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});
