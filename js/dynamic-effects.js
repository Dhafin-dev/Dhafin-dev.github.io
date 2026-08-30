/* ==========================================================================
   DYNAMIC MOTION & INTERACTIVE PROXIMITY PHYSICS ENGINE
   Ahmad Dhafin Al Farisy - Official Portfolio
   ========================================================================== */

(function initDynamicEffectsEngine() {
  "use strict";

  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches || "ontouchstart" in window;

  // =========================================================================
  // 1. HERO AVATAR 3D PROXIMITY TILT & DETACHED BADGE PARALLAX
  // =========================================================================
  function initHeroAvatar3DParallax() {
    const avatarWrapper = document.querySelector(".hero-avatar-wrapper");
    const avatarFrame = document.querySelector(".hero-avatar-frame");
    const avatarGlow = document.querySelector(".hero-avatar-glow");
    const badgeTop = document.querySelector(".badge-top-left");
    const badgeBottom = document.querySelector(".badge-bottom-right");

    if (!avatarWrapper || !avatarFrame) return;

    // Create Specular Glare Reflection Layer if not already present
    let glareLayer = avatarFrame.querySelector(".avatar-specular-glare");
    if (!glareLayer) {
      glareLayer = document.createElement("div");
      glareLayer.className = "avatar-specular-glare";
      avatarFrame.appendChild(glareLayer);
    }

    // Target and current interpolated values for 60fps spring smoothing
    let currentTiltX = 0, currentTiltY = 0;
    let targetTiltX = 0, targetTiltY = 0;
    
    let currentBadge1X = 0, currentBadge1Y = 0;
    let targetBadge1X = 0, targetBadge1Y = 0;

    let currentBadge2X = 0, currentBadge2Y = 0;
    let targetBadge2X = 0, targetBadge2Y = 0;

    let currentGlowX = 0, currentGlowY = 0;
    let targetGlowX = 0, targetGlowY = 0;

    let isMouseNear = false;
    let rafId = null;

    function updatePhysicsLoop() {
      // Smooth lerp (linear interpolation with spring damping)
      const ease = 0.1;
      currentTiltX += (targetTiltX - currentTiltX) * ease;
      currentTiltY += (targetTiltY - currentTiltY) * ease;

      currentBadge1X += (targetBadge1X - currentBadge1X) * (ease * 1.2);
      currentBadge1Y += (targetBadge1Y - currentBadge1Y) * (ease * 1.2);

      currentBadge2X += (targetBadge2X - currentBadge2X) * (ease * 1.1);
      currentBadge2Y += (targetBadge2Y - currentBadge2Y) * (ease * 1.1);

      currentGlowX += (targetGlowX - currentGlowX) * (ease * 0.8);
      currentGlowY += (targetGlowY - currentGlowY) * (ease * 0.8);

      // Apply 3D matrix transform to avatar frame
      avatarFrame.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) scale3d(${isMouseNear ? 1.025 : 1}, ${isMouseNear ? 1.025 : 1}, 1)`;

      // Specular Glare Reflection (moves opposite to tilt)
      if (glareLayer) {
        const glareX = 50 - (currentTiltY * 2.5);
        const glareY = 50 + (currentTiltX * 2.5);
        const glareOpacity = isMouseNear ? 0.35 : 0;
        glareLayer.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareOpacity}), transparent 65%)`;
      }

      // Detached Floating Badges 2.5D Parallax
      if (badgeTop) {
        badgeTop.style.transform = `translate3d(${currentBadge1X.toFixed(2)}px, ${currentBadge1Y.toFixed(2)}px, 40px) scale(${isMouseNear ? 1.04 : 1})`;
      }
      if (badgeBottom) {
        badgeBottom.style.transform = `translate3d(${currentBadge2X.toFixed(2)}px, ${currentBadge2Y.toFixed(2)}px, 30px) scale(${isMouseNear ? 1.04 : 1})`;
      }

      // Ambient Glow Shift
      if (avatarGlow) {
        avatarGlow.style.transform = `translate(calc(-50% + ${currentGlowX.toFixed(2)}px), calc(-50% + ${currentGlowY.toFixed(2)}px)) scale(${isMouseNear ? 1.15 : 1})`;
      }

      // Continue loop if active or smoothly settling back to zero
      if (isMouseNear || Math.abs(currentTiltX) > 0.05 || Math.abs(currentTiltY) > 0.05) {
        rafId = requestAnimationFrame(updatePhysicsLoop);
      } else {
        // Reset exact zero
        avatarFrame.style.transform = "";
        if (badgeTop) badgeTop.style.transform = "";
        if (badgeBottom) badgeBottom.style.transform = "";
        if (avatarGlow) avatarGlow.style.transform = "";
        rafId = null;
      }
    }

    // Proximity Mouse Move Listener (Calculates distance from avatar center)
    const heroSection = document.getElementById("hero") || document.body;

    function handleMouseMove(e) {
      if (isTouchDevice) return;

      const rect = avatarWrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const distX = mouseX - centerX;
      const distY = mouseY - centerY;
      const distance = Math.hypot(distX, distY);

      // Trigger radius: 550px around the avatar
      const triggerRadius = 550;

      if (distance < triggerRadius) {
        isMouseNear = true;
        const normalizedX = distX / (rect.width / 2);
        const normalizedY = distY / (rect.height / 2);

        const maxTilt = 12; // Max degrees of 3D tilt
        targetTiltX = -Math.max(-maxTilt, Math.min(maxTilt, normalizedY * maxTilt));
        targetTiltY = Math.max(-maxTilt, Math.min(maxTilt, normalizedX * maxTilt));

        // Badges have detached depth multiplier (counter-parallax for 3D separation)
        targetBadge1X = targetTiltY * 2.2;
        targetBadge1Y = -targetTiltX * 2.2;

        targetBadge2X = targetTiltY * 1.7;
        targetBadge2Y = -targetTiltX * 1.7;

        // Glow drift
        targetGlowX = targetTiltY * 1.2;
        targetGlowY = targetTiltX * 1.2;

        if (!rafId) {
          rafId = requestAnimationFrame(updatePhysicsLoop);
        }
      } else if (isMouseNear) {
        isMouseNear = false;
        targetTiltX = 0;
        targetTiltY = 0;
        targetBadge1X = 0;
        targetBadge1Y = 0;
        targetBadge2X = 0;
        targetBadge2Y = 0;
        targetGlowX = 0;
        targetGlowY = 0;
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Mobile / Tablet Gyroscope (DeviceOrientation) Parallax
    if (window.DeviceOrientationEvent && isTouchDevice) {
      window.addEventListener("deviceorientation", (e) => {
        if (e.gamma !== null && e.beta !== null) {
          // Clamp orientation angles between -20 and 20
          const gamma = Math.max(-20, Math.min(20, e.gamma)); // Left/Right tilt
          const beta = Math.max(-20, Math.min(20, e.beta - 45)); // Front/Back tilt (adjusted for viewing angle)

          targetTiltY = (gamma / 20) * 10;
          targetTiltX = (-beta / 20) * 10;

          targetBadge1X = targetTiltY * 1.8;
          targetBadge1Y = -targetTiltX * 1.8;
          targetBadge2X = targetTiltY * 1.4;
          targetBadge2Y = -targetTiltX * 1.4;

          isMouseNear = true;
          if (!rafId) rafId = requestAnimationFrame(updatePhysicsLoop);
        }
      }, { passive: true });
    }
  }

  // =========================================================================
  // 2. DYNAMIC SPOTLIGHT & SPECULAR GLASS BORDER ILLUMINATION ON ALL CARDS
  // =========================================================================
  function initDynamicCardSpotlight() {
    if (isTouchDevice) return;

    const cards = document.querySelectorAll(".glass-card, .highlight-card, .project-card, .timeline-card, .github-card-wrapper, .guestbook-message-card, .hero-greeting-pill");

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }, { passive: true });

      card.addEventListener("mouseleave", () => {
        card.style.removeProperty("--mouse-x");
        card.style.removeProperty("--mouse-y");
      });
    });
  }

  // =========================================================================
  // 3. MAGNETIC SNAPPING PHYSICS FOR BUTTONS & SOCIAL ICONS
  // =========================================================================
  function initMagneticButtons() {
    if (isTouchDevice) return;

    const magneticTargets = document.querySelectorAll(".btn-primary, .btn-secondary, .social-circle-btn, .nav-btn-resume, .filter-btn, .ai-chat-trigger-btn");

    magneticTargets.forEach((btn) => {
      let isHovered = false;
      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;
      let rafMagnetic = null;

      function renderMagnetic() {
        const ease = 0.2;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        btn.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

        if (isHovered || Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
          rafMagnetic = requestAnimationFrame(renderMagnetic);
        } else {
          btn.style.transform = "";
          rafMagnetic = null;
        }
      }

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Snapping strength (0.28 factor for subtle, elegant magnetic pull)
        targetX = (e.clientX - centerX) * 0.28;
        targetY = (e.clientY - centerY) * 0.28;

        isHovered = true;
        if (!rafMagnetic) rafMagnetic = requestAnimationFrame(renderMagnetic);
      }, { passive: true });

      btn.addEventListener("mouseleave", () => {
        isHovered = false;
        targetX = 0;
        targetY = 0;
      });
    });
  }

  // =========================================================================
  // 4. TIMELINE NODES ACTIVE PROXIMITY PULSE
  // =========================================================================
  function initTimelineProximityPulse() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    if (!timelineItems.length) return;

    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("timeline-in-focus");
          } else {
            entry.target.classList.remove("timeline-in-focus");
          }
        });
      }, { threshold: 0.4 });

      timelineItems.forEach((item) => observer.observe(item));
    }
  }

  // =========================================================================
  // INITIALIZATION ON DOM READY
  // =========================================================================
  function init() {
    initHeroAvatar3DParallax();
    initDynamicCardSpotlight();
    initMagneticButtons();
    initTimelineProximityPulse();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
