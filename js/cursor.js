/* ==========================================================================
   CUSTOM CURSOR & LIGHTWEIGHT MULTI-COLOR CLICK PARTICLE EFFECT
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initCursorAndClickParticles() {
  // =========================================================================
  // 1. ULTRA-LIGHTWEIGHT CLICK PARTICLE & SHOCKWAVE ENGINE (UNIVERSAL)
  // =========================================================================
  const canvas = document.createElement("canvas");
  canvas.id = "clickParticleCanvas";
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999999;";
  document.documentElement.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  const PARTICLE_COLORS = [
    "#00f3ff", // Cyber Cyan
    "#3b82f6", // Electric Blue
    "#f59e0b", // Royal Gold
    "#bc13fe", // Neon Purple
    "#10b981", // Emerald Mint
    "#ff007f", // Neon Pink
    "#ffffff"  // Pure White Spark
  ];

  const particles = [];
  const shockwaves = [];
  let isLoopRunning = false;

  class ClickParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5.5 + 2.5; // Smooth radiant speed
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.radius = Math.random() * 2.5 + 2.5; // Visible radius (2.5 - 5px)
      this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      this.alpha = 1.0;
      this.decay = Math.random() * 0.024 + 0.02; // ~500-600ms lifespan
      this.gravity = 0.12;
      this.friction = 0.94;
    }

    update() {
      this.vx *= this.friction;
      this.vy = this.vy * this.friction + this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      if (this.radius > 0.5) this.radius -= 0.03;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.radius), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Shockwave {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 4;
      this.maxRadius = 32;
      this.alpha = 0.8;
      this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    }

    update() {
      this.radius += 2.4;
      this.alpha -= 0.045;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.strokeStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function emitBurst(x, y) {
    const count = 12 + Math.floor(Math.random() * 5); // 12-16 particles
    for (let i = 0; i < count; i++) {
      particles.push(new ClickParticle(x, y));
    }
    shockwaves.push(new Shockwave(x, y));

    if (!isLoopRunning) {
      isLoopRunning = true;
      requestAnimationFrame(particleLoop);
    }
  }

  function particleLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.update();
      sw.draw(ctx);
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(i, 1);
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0 || shockwaves.length > 0) {
      requestAnimationFrame(particleLoop);
    } else {
      isLoopRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Global listeners for clicks and touches
  document.addEventListener("mousedown", (e) => {
    emitBurst(e.clientX, e.clientY);
  }, { passive: true });

  document.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches[0]) {
      emitBurst(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // =========================================================================
  // 2. DESKTOP GLOW BULB CURSOR (HOVER DEVICES ONLY)
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
