/* ==========================================================================
   TYPEWRITER EFFECT FOR HERO SECTION
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initTypewriter() {
  const element = document.getElementById("typewriterText");
  if (!element) return;

  const phrases = [
    "Information Systems @ Universitas Airlangga",
    "Duta FST UNAIR 2026 (Faculty Ambassador)",
    "2x International Gold Medalist (IoT & Robotics)",
    "Tech Innovator & Software Developer",
    "Social Impact & SDGs Enthusiast"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typingSpeed = 40;
    } else {
      charIndex++;
      typingSpeed = 80;
    }

    element.textContent = currentPhrase.substring(0, charIndex);

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full text
      isDeleting = true;
      typingSpeed = 2200;
    } else if (isDeleting && charIndex === 0) {
      // Switch phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeLoop, typingSpeed);
  }

  setTimeout(typeLoop, 800);
})();
