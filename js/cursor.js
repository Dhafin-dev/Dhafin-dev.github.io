/* ==========================================================================
   DESKTOP CUSTOM CURSOR & SOFT GLOWING ORB CLICK EFFECT
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initDesktopCursorAndSoftOrbs() {
  // Strict Mobile / Touch Device Check
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches || "ontouchstart" in window;

  // On Mobile / Touchscreen: Terminate immediately to ensure 100% native hardware scroll speed
  if (isTouchDevice) {
    return;
  }

  // =========================================================================
  // 1. DESKTOP-ONLY SMOOTH GLOW CURSOR
  // =========================================================================
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
  }, { passive: true });

  function renderCursorGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;

    requestAnimationFrame(renderCursorGlow);
  }
  requestAnimationFrame(renderCursorGlow);

  const interactiveTargets = "a, button, input, textarea, select, .glass-card, .filter-btn, .timeline-card, .social-circle-btn, .ai-chat-trigger-btn, .star-item";

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

  // =========================================================================
  // 2. DESKTOP 3 LARGE TRANSLUCENT GLOWING ORBS ON CLICK
  // =========================================================================
  const ORB_PALETTES = [
    { bg: "rgba(0, 243, 255, 0.55)", shadow: "rgba(0, 243, 255, 0.45)" },   // Cyan
    { bg: "rgba(188, 19, 254, 0.5)", shadow: "rgba(188, 19, 254, 0.4)" },   // Neon Purple
    { bg: "rgba(236, 72, 153, 0.5)", shadow: "rgba(236, 72, 153, 0.4)" },   // Soft Rose
    { bg: "rgba(16, 185, 129, 0.5)", shadow: "rgba(16, 185, 129, 0.4)" },   // Mint Emerald
    { bg: "rgba(163, 230, 53, 0.5)", shadow: "rgba(163, 230, 53, 0.4)" },   // Lime
    { bg: "rgba(245, 158, 11, 0.5)", shadow: "rgba(245, 158, 11, 0.4)" }    // Royal Gold
  ];

  const activeOrbs = [];
  const MAX_ACTIVE_ORBS = 12; // Auto-recycle FIFO limit

  function spawnSoftOrbs(x, y) {
    // Spawn exactly 3 large translucent glowing dots
    const orbCount = 3;
    const baseAngle = Math.random() * Math.PI * 2;

    for (let i = 0; i < orbCount; i++) {
      const angle = baseAngle + (i * (Math.PI * 2 / orbCount)) + (Math.random() * 0.4 - 0.2);
      const distance = Math.floor(Math.random() * 20) + 26; // 26px - 46px drifting radius
      const tx = Math.round(Math.cos(angle) * distance);
      const ty = Math.round(Math.sin(angle) * distance);

      // Large diameter: 20px to 32px
      const size = Math.floor(Math.random() * 12) + 20;
      const palette = ORB_PALETTES[Math.floor(Math.random() * ORB_PALETTES.length)];
      const opacity = (Math.random() * 0.15 + 0.4).toFixed(2); // Low opacity (0.40 - 0.55)

      const orb = document.createElement("div");
      orb.className = "click-soft-orb";
      orb.style.left = `${x}px`;
      orb.style.top = `${y}px`;
      orb.style.width = `${size}px`;
      orb.style.height = `${size}px`;
      orb.style.background = palette.bg;
      orb.style.boxShadow = `0 0 16px ${palette.shadow}`;
      orb.style.setProperty("--tx", `${tx}px`);
      orb.style.setProperty("--ty", `${ty}px`);
      orb.style.setProperty("--orb-opacity", opacity);

      document.body.appendChild(orb);
      activeOrbs.push(orb);

      orb.addEventListener("animationend", () => {
        orb.remove();
        const idx = activeOrbs.indexOf(orb);
        if (idx > -1) activeOrbs.splice(idx, 1);
      }, { once: true });
    }

    // Overflow FIFO clean-up
    while (activeOrbs.length > MAX_ACTIVE_ORBS) {
      const oldest = activeOrbs.shift();
      if (oldest && oldest.parentNode) oldest.remove();
    }
  }

  // Trigger only on desktop mouse click
  document.addEventListener("mousedown", (e) => {
    if (e.clientX && e.clientY) {
      spawnSoftOrbs(e.clientX, e.clientY);
    }
  }, { passive: true });
})();
