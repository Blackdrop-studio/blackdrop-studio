import LocomotiveScroll from 'https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/+esm';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import ScrollTrigger from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';

gsap.registerPlugin(ScrollTrigger);

// Canvas trail
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const trail = [];
const maxTrail = 40;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
window.addEventListener('mousemove', e => {
  trail.push({x:e.clientX,y:e.clientY,a:1});
  if(trail.length>maxTrail) trail.shift();
});
function drawTrail(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of trail){
    ctx.beginPath();ctx.arc(p.x,p.y,6,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${p.a})`;ctx.fill();
    p.a*=.94;
  }
  requestAnimationFrame(drawTrail);
}
drawTrail();

// On load
window.addEventListener('load',()=>{

  // loader fade
  const loader=document.getElementById('loader');
  loader.style.opacity=0;setTimeout(()=>loader.style.display='none',500);

  // Locomotive
  const scroll=new LocomotiveScroll({
    el:document.querySelector('[data-scroll-container]'),
    smooth:true,smartphone:{smooth:true},tablet:{smooth:true}
  });

  // GSAP reveal
  gsap.utils.toArray('.project').forEach(proj=>{
    gsap.from(proj,{
      opacity:0,y:60,duration:1,
      scrollTrigger:{trigger:proj,start:'top 85%',toggleActions:'play none none reverse'}
    });
  });

  // Filter buttons
  document.querySelectorAll('[data-filter]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const type=btn.dataset.filter;
      document.querySelectorAll('.project').forEach(p=>{
        p.style.display=(type==='all'||p.dataset.type===type)?'flex':'none';
      });
      scroll.update(); // refresh Locomotive
    });
  });
});
