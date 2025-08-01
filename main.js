/* ========== 1.  MARQUEE INFINITA ========== */
document.querySelectorAll(".marquee__inner").forEach(($inner)=>{
  const speed = $inner.dataset.speed || 40;         // px / sec
  const width = $inner.scrollWidth;
  gsap.fromTo($inner, {x:0}, {
    x: -width/2,
    ease:"none",
    duration: width/speed,
    repeat:-1
  });
});

/* ========== 2.  SCROLL-REVEAL CARD ========== */
gsap.utils.toArray(".card").forEach(card=>{
  gsap.to(card,{
    y:0, opacity:1, duration:.8, ease:"power3.out",
    scrollTrigger:{trigger:card,start:"top 80%"}
  });
});

/* ========== 3.  SMOOTH ENTRY HERO TEXT ========== */
gsap.from(".hero__title span",{ /* split words into spans in CSS not needed */
  y:80, opacity:0, stagger:.05, duration:1.2, ease:"power4.out"
});
