/* ==========================================================================
   PRELOADER & OPENING ANIMATION
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initPreloader() {
  const preloader = document.getElementById("preloader");
  const bar = document.getElementById("preloaderBar");
  const percent = document.getElementById("preloaderPercent");
  const particlesWrap = document.getElementById("preloaderParticles");

  if (!preloader || !bar || !percent) return;

  // Generate floating particles
  if (particlesWrap) {
    for (let i = 0; i < 22; i++) {
      const p = document.createElement("div");
      p.className = "preloader-particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 2.5}s`;
      p.style.animationDuration = `${2 + Math.random() * 2.5}s`;
      p.style.width = p.style.height = `${2 + Math.random() * 3}px`;
      if (i % 2 === 0) p.style.background = "#bc13fe";
      if (i % 3 === 0) p.style.background = "#f59e0b";
      particlesWrap.appendChild(p);
    }
  }

  let progress = 0;
  let targetProgress = 35;
  let isComplete = false;

  function updateProgressBar() {
    if (isComplete) return;
    progress += (targetProgress - progress) * 0.12;
    const rounded = Math.min(Math.round(progress), 100);

    bar.style.width = `${rounded}%`;
    percent.textContent = `${rounded}%`;

    if (rounded >= 100) {
      isComplete = true;
      setTimeout(() => {
        preloader.classList.add("preloader-hidden");
        document.body.classList.remove("no-scroll");
        setTimeout(() => {
          preloader.style.display = "none";
          // Trigger GitHub 3D initialization if available
          if (window.initGithub3DVisualizer) window.initGithub3DVisualizer();
        }, 700);
      }, 250);
      return;
    }
    requestAnimationFrame(updateProgressBar);
  }
  requestAnimationFrame(updateProgressBar);

  document.addEventListener("DOMContentLoaded", () => {
    targetProgress = 75;
  });

  window.addEventListener("load", () => {
    targetProgress = 100;
  });

  // Failsafe timer (dismiss at 2.5s maximum)
  setTimeout(() => {
    targetProgress = 100;
  }, 2500);
})();
