/* ==========================================================================
   SMART MULTI-DEVICE CURSOR & SOFT GLOWING ORBS ON TAP / CLICK
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initSmartCursorAndSoftOrbs() {
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches || "ontouchstart" in window;

  // =========================================================================
  // 1. DESKTOP-ONLY SMOOTH GLOW CURSOR (HOVER SCREENS)
  // =========================================================================
  if (!isTouchDevice) {
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
  }

  // =========================================================================
  // 2. 3 LARGE TRANSLUCENT GLOWING ORBS (DESKTOP CLICK & MOBILE SMART TAP)
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
  const MAX_ACTIVE_ORBS = 9; // Strict FIFO limit for instant clean recycling

  function spawnSoftOrbs(x, y) {
    const orbCount = 3;
    const baseAngle = Math.random() * Math.PI * 2;

    for (let i = 0; i < orbCount; i++) {
      const angle = baseAngle + (i * (Math.PI * 2 / orbCount)) + (Math.random() * 0.4 - 0.2);
      const distance = Math.floor(Math.random() * 20) + 24; // 24px - 44px gentle drifting
      const tx = Math.round(Math.cos(angle) * distance);
      const ty = Math.round(Math.sin(angle) * distance);

      // Large diameter (20px to 32px)
      const size = Math.floor(Math.random() * 12) + 20;
      const palette = ORB_PALETTES[Math.floor(Math.random() * ORB_PALETTES.length)];
      const opacity = (Math.random() * 0.15 + 0.4).toFixed(2); // Translucent 0.40 - 0.55

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

    // Strict FIFO recycling
    while (activeOrbs.length > MAX_ACTIVE_ORBS) {
      const oldest = activeOrbs.shift();
      if (oldest && oldest.parentNode) oldest.remove();
    }
  }

  // A. Desktop Mouse Click Listener
  document.addEventListener("mousedown", (e) => {
    // Only on mouse left-click and non-touch
    if (!isTouchDevice && e.clientX && e.clientY && e.button === 0) {
      spawnSoftOrbs(e.clientX, e.clientY);
    }
  }, { passive: true });

  // B. Mobile Smart Tap Listener (Zero Scroll Interference)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isTouchMoving = false;

  document.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      isTouchMoving = false;
    }
  }, { passive: true });

  document.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      const moveX = e.touches[0].clientX;
      const moveY = e.touches[0].clientY;
      // If user moved more than 8px, it is a scroll/swipe, not a tap
      if (Math.hypot(moveX - touchStartX, moveY - touchStartY) > 8) {
        isTouchMoving = true;
      }
    }
  }, { passive: true });

  document.addEventListener("touchend", () => {
    const elapsed = Date.now() - touchStartTime;
    // Trigger ONLY on a genuine, stationary tap (<300ms, <8px movement)
    if (!isTouchMoving && elapsed < 300) {
      spawnSoftOrbs(touchStartX, touchStartY);
    }
  }, { passive: true });
})();
