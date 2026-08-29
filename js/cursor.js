/* ==========================================================================
   CUSTOM CURSOR & GPU-ACCELERATED ZERO-LAG CLICK SPARK ENGINE
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initCursorAndGPUClickEffect() {
  // =========================================================================
  // 1. GPU-ACCELERATED CLICK SPARK & RIPPLE ENGINE (ZERO CPU OVERHEAD)
  // =========================================================================
  const SPARK_COLORS = [
    "#00f3ff", // Cyber Cyan
    "#3b82f6", // Electric Blue
    "#f59e0b", // Royal Gold
    "#bc13fe", // Neon Purple
    "#10b981", // Emerald Mint
    "#ff007f"  // Neon Pink
  ];

  const activeDomNodes = [];
  const MAX_DOM_NODES = 16; // Strict FIFO limit: Even with 100 rapid clicks, DOM never exceeds 16 elements

  function spawnGpuSpark(x, y) {
    // 1. Pick a random neon color
    const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];

    // 2. Create Expanding Glow Ring
    const ring = document.createElement("div");
    ring.className = "click-ripple-ring";
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.style.setProperty("--ring-color", color);
    document.body.appendChild(ring);
    activeDomNodes.push(ring);

    ring.addEventListener("animationend", () => {
      ring.remove();
      const idx = activeDomNodes.indexOf(ring);
      if (idx > -1) activeDomNodes.splice(idx, 1);
    }, { once: true });

    // 3. Create 4 Radiant Micro Sparks (N, E, S, W diagonal directions)
    const angles = [0.78, 2.35, 3.92, 5.49]; // 45deg, 135deg, 225deg, 315deg
    angles.forEach(ang => {
      const dist = Math.floor(Math.random() * 16) + 18; // 18-34px travel distance
      const dx = Math.round(Math.cos(ang) * dist);
      const dy = Math.round(Math.sin(ang) * dist);

      const spark = document.createElement("div");
      spark.className = "click-micro-spark";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty("--spark-color", color);
      spark.style.setProperty("--dx", `${dx}px`);
      spark.style.setProperty("--dy", `${dy}px`);
      document.body.appendChild(spark);
      activeDomNodes.push(spark);

      spark.addEventListener("animationend", () => {
        spark.remove();
        const idx = activeDomNodes.indexOf(spark);
        if (idx > -1) activeDomNodes.splice(idx, 1);
      }, { once: true });
    });

    // 4. FIFO Overflow Protection: Clean up oldest if rapid clicking occurs
    while (activeDomNodes.length > MAX_DOM_NODES) {
      const oldest = activeDomNodes.shift();
      if (oldest && oldest.parentNode) oldest.remove();
    }
  }

  // Instant trigger on click or touch (0ms latency, zero cooldown)
  document.addEventListener("pointerdown", (e) => {
    if (e.clientX && e.clientY) {
      spawnGpuSpark(e.clientX, e.clientY);
    }
  }, { passive: true });

  // =========================================================================
  // 2. DESKTOP GLOW CURSOR (NON-TOUCH SCREENS ONLY)
  // =========================================================================
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

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
})();
