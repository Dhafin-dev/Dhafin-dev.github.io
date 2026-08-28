/* ==========================================================================
   CONTACT FORM HANDLER (WITH EMAILJS INTEGRATION)
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initContact() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("contactSubmitBtn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !message) {
      alert("Harap isi semua kolom wajib.");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    }

    try {
      // If EmailJS library is loaded and service configured
      if (typeof emailjs !== "undefined" && PORTFOLIO_CONFIG.api.emailJsServiceId) {
        // Attempt EmailJS sendForm or send
        await emailjs.send(PORTFOLIO_CONFIG.api.emailJsServiceId, "template_default", {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message
        });
        alert(`Terima kasih ${name}, pesan Anda telah berhasil terkirim ke email Ahmad Dhafin!`);
      } else {
        // Direct Fallback to mailto link
        const mailtoUrl = `mailto:${PORTFOLIO_CONFIG.profile.personalEmail}?subject=${encodeURIComponent(subject || 'Pesan dari Portofolio')}&body=${encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`)}`;
        window.location.href = mailtoUrl;
      }

      form.reset();
    } catch (err) {
      // Fallback
      const mailtoUrl = `mailto:${PORTFOLIO_CONFIG.profile.personalEmail}?subject=${encodeURIComponent(subject || 'Pesan dari Portofolio')}&body=${encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`)}`;
      window.location.href = mailtoUrl;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan';
      }
    }
  });
})();
