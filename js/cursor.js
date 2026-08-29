/* ==========================================================================
   CUSTOM CURSOR & LIGHTWEIGHT MULTI-COLOR CLICK PARTICLE EFFECT
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initCustomCursorAndParticles() {
  // =========================================================================
  // 1. DESKTOP GLOW CURSOR
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
  // 2. ULTRA-LIGHTWEIGHT ZERO-LAG CLICK PARTICLE ENGINE
  // =========================================================================
  const canvas = document.createElement("canvas");
  canvas.id = "clickParticleCanvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  let dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  const PARTICLE_COLORS = [
    "#00f3ff", // Cyber Cyan
    "#3b82f6", // Electric Blue
    "#f59e0b", // Royal Gold
    "#bc13fe", // Neon Purple
    "#10b981", // Emerald Mint
    "#ec4899"  // Neon Rose
  ];

  const particles = [];
  const shockwaves = [];
  let isLoopRunning = false;

  class ClickParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 2.0; // Moderate velocity for smooth burst
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.radius = Math.random() * 2.5 + 2.0;
      this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      this.alpha = 1.0;
      this.decay = Math.random() * 0.028 + 0.022; // ~500ms lifespan
      this.gravity = 0.1;
      this.friction = 0.94;
    }

    update() {
      this.vx *= this.friction;
      this.vy = this.vy * this.friction + this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Shockwave {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = 26;
      this.alpha = 0.7;
      this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    }

    update() {
      this.radius += 2.2;
      this.alpha -= 0.055;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.strokeStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function emitParticles(x, y) {
    // Spawn a gentle wave: 10-12 particles per click
    const count = 10 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      particles.push(new ClickParticle(x, y));
    }
    shockwaves.push(new Shockwave(x, y));

    // Start animation loop only when particles exist
    if (!isLoopRunning) {
      isLoopRunning = true;
      requestAnimationFrame(particleLoop);
    }
  }

  function particleLoop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Update & Draw Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.update();
      sw.draw(ctx);
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(i, 1);
      }
    }

    // Update & Draw Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    // If active particles exist, continue loop; otherwise stop to save 100% CPU/GPU
    if (particles.length > 0 || shockwaves.length > 0) {
      requestAnimationFrame(particleLoop);
    } else {
      isLoopRunning = false;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  // Listen to both Mouse Click and Touch Tap smoothly
  window.addEventListener("pointerdown", (e) => {
    // Trigger on valid window bounds
    if (e.clientX && e.clientY) {
      emitParticles(e.clientX, e.clientY);
    }
  }, { passive: true });
})();
