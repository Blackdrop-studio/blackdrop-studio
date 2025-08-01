import LocomotiveScroll from 'https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/+esm';
import { gsap }          from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
gsap.registerPlugin(ScrollTrigger);

/* -------- Canvas trail -------- */
const cvs = document.getElementById('bg-canvas'), ctx = cvs.getContext('2d');
const trail = [], MAX = 40;
function size() { cvs.width = innerWidth; cvs.height = innerHeight; }
size(); addEventListener('resize', size);
addEventListener('mousemove', e => {
  trail.push({x:e.clientX, y:e.clientY, a:1});
  if (trail.length > MAX) trail.shift();
});
(function loop(){
  ctx.clearRect(0,0,cvs.width,cvs.height);
  trail.forEach(p=>{
    ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${p.a})`; ctx.fill();
    p.a*=.94;
  });
  requestAnimationFrame(loop);
})();

/* -------- On load -------- */
addEventListener('load', () => {
  /* loader fade */
  document.getElementById('loader').style.opacity = 0;
  setTimeout(() => document.getElementById('loader').style.display = 'none', 500);

  /* locomotive scroll */
  const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    smartphone: { smooth: true },
    tablet:    { smooth: true }
  });

  /* reveal projects */
  gsap.utils.toArray('.project').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 60, duration: 1,
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });

  /* filter logic */
  document.querySelectorAll('[data-filter]').forEach(btn=>{
    btn.addEventListener('click', () => {
      const type = btn.dataset.filter;
      document.querySelectorAll('.project').forEach(card=>{
        card.classList.toggle('hidden', type!=='all' && card.dataset.type!==type);
      });
      scroll.update();
      document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});
