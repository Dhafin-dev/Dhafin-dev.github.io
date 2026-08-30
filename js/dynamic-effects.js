/* ==========================================================================
   DYNAMIC MOTION & INTERACTIVE PROXIMITY PHYSICS ENGINE
   Ahmad Dhafin Al Farisy - Official Portfolio
   ========================================================================== */

(function initDynamicEffectsEngine() {
  "use strict";

  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches || "ontouchstart" in window;

  // =========================================================================
  // 1. HERO AVATAR SUBTLE HORIZONTAL 3D TILT
  // =========================================================================
  function initHeroAvatar3DParallax() {
    const avatarWrapper = document.querySelector(".hero-avatar-wrapper");
    const avatarFrame = document.querySelector(".hero-avatar-frame");

    if (!avatarWrapper || !avatarFrame) return;

    // Target and current interpolated values for 60fps spring smoothing (Horizontal Y-Axis Only)
    let currentTiltY = 0;
    let targetTiltY = 0;
    let isMouseNear = false;
    let rafId = null;

    function updatePhysicsLoop() {
      // Smooth lerp (linear interpolation with spring damping)
      const ease = 0.09;
      currentTiltY += (targetTiltY - currentTiltY) * ease;

      // Apply Horizontal-Only 3D matrix transform to avatar frame (RotateY only)
      avatarFrame.style.transform = `perspective(1000px) rotateY(${currentTiltY.toFixed(2)}deg) scale3d(${isMouseNear ? 1.015 : 1}, ${isMouseNear ? 1.015 : 1}, 1)`;

      // Continue loop if active or smoothly settling back to zero
      if (isMouseNear || Math.abs(currentTiltY) > 0.04) {
        rafId = requestAnimationFrame(updatePhysicsLoop);
      } else {
        avatarFrame.style.transform = "";
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

      // Trigger radius: 500px around the avatar
      const triggerRadius = 500;

      if (distance < triggerRadius) {
        isMouseNear = true;
        const normalizedX = distX / (rect.width / 2);

        // Max 7 degrees of gentle, subtle horizontal 3D tilt
        const maxTilt = 7;
        targetTiltY = Math.max(-maxTilt, Math.min(maxTilt, normalizedX * maxTilt));

        if (!rafId) {
          rafId = requestAnimationFrame(updatePhysicsLoop);
        }
      } else if (isMouseNear) {
        isMouseNear = false;
        targetTiltY = 0;
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Mobile / Tablet Gyroscope (Horizontal Left/Right Gamma Only)
    if (window.DeviceOrientationEvent && isTouchDevice) {
      window.addEventListener("deviceorientation", (e) => {
        if (e.gamma !== null) {
          // Clamp orientation angle between -20 and 20 (Left/Right tilt only)
          const gamma = Math.max(-20, Math.min(20, e.gamma));

          targetTiltY = (gamma / 20) * 6;
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
  // 3. GENTLE MAGNETIC SNAPPING PHYSICS FOR BUTTONS & SOCIAL ICONS
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
        // Gentle spring ease (0.08) for smooth, non-abrupt gliding
        const ease = 0.08;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        btn.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

        if (isHovered || Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
          rafMagnetic = requestAnimationFrame(renderMagnetic);
        } else {
          btn.style.transform = "";
          btn.style.transition = "";
          rafMagnetic = null;
        }
      }

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Subtle displacement factor (0.12) with a strict maximum limit of +/- 6px
        const maxOffset = 6;
        const rawX = (e.clientX - centerX) * 0.12;
        const rawY = (e.clientY - centerY) * 0.12;

        targetX = Math.max(-maxOffset, Math.min(maxOffset, rawX));
        targetY = Math.max(-maxOffset, Math.min(maxOffset, rawY));

        btn.style.transition = "none";
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
