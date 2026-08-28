/* ==========================================================================
   CUSTOM CURSOR & GLOW EFFECT
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initCustomCursor() {
  // Only initialize on desktop / devices supporting hover
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow";
  document.body.appendChild(cursorGlow);

  const cursorDot = document.createElement("div");
  cursorDot.className = "cursor-dot";
  document.body.appendChild(cursorDot);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth lagging glow interpolation (Lerp)
  function renderCursorGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;

    requestAnimationFrame(renderCursorGlow);
  }
  requestAnimationFrame(renderCursorGlow);

  // Interactive Hover Effects on links and buttons
  const interactiveTargets = "a, button, input, textarea, select, .glass-card, .filter-btn, .timeline-card, .social-circle-btn, .ai-chat-trigger-btn";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactiveTargets)) {
      cursorDot.classList.add("cursor-hover");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactiveTargets)) {
      cursorDot.classList.remove("cursor-hover");
    }
  });
})();
