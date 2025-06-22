// Animazione titolo con GSAP
document.addEventListener("DOMContentLoaded", function () {
  gsap.from(".hero h1", {
    y: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out"
  });

  gsap.from(".hero p", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out",
    delay: 0.5
  });
});
