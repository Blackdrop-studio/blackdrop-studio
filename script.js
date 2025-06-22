const tl = gsap.timeline();

tl.to(".loading-logo", {
  duration: 1,
  opacity: 1,
  ease: "power2.out",
})
.to(".loading-logo", {
  duration: 0.5,
  opacity: 0,
  delay: 0.5,
  ease: "power2.in"
})
.to(".loading-screen", {
  duration: 1.2,
  y: "-100%",
  ease: "power4.inOut"
}, "-=0.5") // parte mentre il logo sta svanendo
.from(".title", {
  duration: 1.2,
  y: 50,
  opacity: 0,
  ease: "power3.out"
}, "-=0.6")
.from(".subtitle", {
  duration: 1.2,
  y: 30,
  opacity: 0,
  ease: "power3.out"
}, "-=0.9");
