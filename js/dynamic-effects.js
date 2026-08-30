/* ==========================================================================
   DYNAMIC MOTION & INTERACTIVE PROXIMITY PHYSICS ENGINE
   Ahmad Dhafin Al Farisy - Official Portfolio
   ========================================================================== */

(function initDynamicEffectsEngine() {
  "use strict";

  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches || "ontouchstart" in window;

  // =========================================================================
  // 1. HERO AVATAR HORIZONTAL 3D TILT & DETACHED BADGE PARALLAX
  // =========================================================================
  function initHeroAvatar3DParallax() {
    const avatarWrapper = document.querySelector(".hero-avatar-wrapper");
    const avatarFrame = document.querySelector(".hero-avatar-frame");
    const badgeTop = document.querySelector(".badge-top-left");
    const badgeBottom = document.querySelector(".badge-bottom-right");

    if (!avatarWrapper || !avatarFrame) return;

    // Target and current interpolated values for 60fps spring smoothing (Horizontal Y-Axis Only)
    let currentTiltY = 0;
    let targetTiltY = 0;
    
    let currentBadge1X = 0;
    let targetBadge1X = 0;

    let currentBadge2X = 0;
    let targetBadge2X = 0;

    let isMouseNear = false;
    let rafId = null;

    function updatePhysicsLoop() {
      // Smooth lerp (linear interpolation with spring damping)
      const ease = 0.1;
      currentTiltY += (targetTiltY - currentTiltY) * ease;

      currentBadge1X += (targetBadge1X - currentBadge1X) * (ease * 1.2);
      currentBadge2X += (targetBadge2X - currentBadge2X) * (ease * 1.1);

      // Apply Horizontal-Only 3D matrix transform to avatar frame (RotateY only)
      avatarFrame.style.transform = `perspective(1000px) rotateY(${currentTiltY.toFixed(2)}deg) scale3d(${isMouseNear ? 1.02 : 1}, ${isMouseNear ? 1.02 : 1}, 1)`;

      // Detached Floating Badges Horizontal 2.5D Parallax
      if (badgeTop) {
        badgeTop.style.transform = `translate3d(${currentBadge1X.toFixed(2)}px, 0px, 40px) scale(${isMouseNear ? 1.03 : 1})`;
      }
      if (badgeBottom) {
        badgeBottom.style.transform = `translate3d(${currentBadge2X.toFixed(2)}px, 0px, 30px) scale(${isMouseNear ? 1.03 : 1})`;
      }

      // Continue loop if active or smoothly settling back to zero
      if (isMouseNear || Math.abs(currentTiltY) > 0.05) {
        rafId = requestAnimationFrame(updatePhysicsLoop);
      } else {
        // Reset exact zero
        avatarFrame.style.transform = "";
        if (badgeTop) badgeTop.style.transform = "";
        if (badgeBottom) badgeBottom.style.transform = "";
        rafId = null;
      }
    }

    // Proximity Mouse Move Listener (Horizontal calculations only)
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

        const maxTilt = 10; // Max degrees of horizontal 3D tilt
        targetTiltY = Math.max(-maxTilt, Math.min(maxTilt, normalizedX * maxTilt));

        // Badges have detached horizontal depth multiplier (counter-parallax)
        targetBadge1X = targetTiltY * 1.6;
        targetBadge2X = targetTiltY * 1.2;

        if (!rafId) {
          rafId = requestAnimationFrame(updatePhysicsLoop);
        }
      } else if (isMouseNear) {
        isMouseNear = false;
        targetTiltY = 0;
        targetBadge1X = 0;
        targetBadge2X = 0;
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Mobile / Tablet Gyroscope (Horizontal Left/Right Gamma Only)
    if (window.DeviceOrientationEvent && isTouchDevice) {
      window.addEventListener("deviceorientation", (e) => {
        if (e.gamma !== null) {
          // Clamp orientation angle between -20 and 20 (Left/Right tilt only)
          const gamma = Math.max(-20, Math.min(20, e.gamma));

          targetTiltY = (gamma / 20) * 8;
          targetBadge1X = targetTiltY * 1.4;
          targetBadge2X = targetTiltY * 1.0;

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
