// app.js - Blackdrop Portfolio
import LocomotiveScroll from 'https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/+esm';

// SCIA con il mouse
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const trail = [];
const maxTrail = 50;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', (e) => {
  trail.push({ x: e.clientX, y: e.clientY, alpha: 1 });
  if (trail.length > maxTrail) trail.shift();
});

function drawTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < trail.length; i++) {
    const p = trail[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
    ctx.fill();
    p.alpha *= 0.96;
  }
  requestAnimationFrame(drawTrail);
}
drawTrail();

// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.style.opacity = 0;
  setTimeout(() => loader.style.display = 'none', 500);
});

// Scroll fluido
window.addEventListener('load', () => {
  const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    smartphone: { smooth: true },
    tablet: { smooth: true },
  });
});
