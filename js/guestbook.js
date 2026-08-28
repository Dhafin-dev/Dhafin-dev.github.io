/* ==========================================================================
   INTERACTIVE GUESTBOOK & STAR RATING
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initGuestbook() {
  const form = document.getElementById("guestbookForm");
  const feed = document.getElementById("guestbookFeed");
  const starContainer = document.getElementById("starRatingSelect");
  const ratingInput = document.getElementById("guestbookRatingValue");

  if (!form || !feed) return;

  const STORAGE_KEY = "dhafin_portfolio_guestbook";

  // Initial Sample Entries if empty
  const defaultEntries = [
    {
      name: "Riset & Inovasi UNAIR",
      rating: 5,
      message: "Luar biasa inovasi robot MERI dan Biawak. Sukses terus untuk riset teknologi dan tugas Duta FST 2026!",
      date: "2026-08-20"
    },
    {
      name: "Tech Enthusiast",
      rating: 5,
      message: "Portofolio yang sangat futuristik dan inspiratif. Terus berkarya di bidang IoT dan Sistem Informasi!",
      date: "2026-08-25"
    }
  ];

  function getEntries() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultEntries;
    } catch (e) {
      return defaultEntries;
    }
  }

  function renderEntries() {
    const entries = getEntries();
    feed.innerHTML = entries.map(entry => {
      const stars = "★".repeat(entry.rating) + "☆".repeat(5 - entry.rating);
      return `
        <div class="guestbook-entry">
          <div class="guestbook-entry-header">
            <span class="guestbook-entry-name"><i class="fas fa-user-circle" style="color: var(--accent-cyan);"></i> ${escapeHtml(entry.name)}</span>
            <span class="guestbook-entry-stars">${stars}</span>
          </div>
          <p class="guestbook-entry-msg">${escapeHtml(entry.message)}</p>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Handle Star Rating Click
  if (starContainer && ratingInput) {
    const stars = starContainer.querySelectorAll(".star-item");
    stars.forEach(star => {
      star.addEventListener("click", () => {
        const val = parseInt(star.getAttribute("data-value"), 10);
        ratingInput.value = val;
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute("data-value"), 10);
          if (sVal <= val) {
            s.classList.add("active");
          } else {
            s.classList.remove("active");
          }
        });
      });
    });
  }

  // Handle Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("guestbookName");
    const msgInput = document.getElementById("guestbookMsg");

    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    const rating = parseInt(ratingInput?.value || "5", 10);

    if (!name || !message) return;

    const newEntry = {
      name,
      rating,
      message,
      date: new Date().toISOString().split("T")[0]
    };

    const entries = getEntries();
    entries.unshift(newEntry);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {}

    renderEntries();

    // Reset Form
    nameInput.value = "";
    msgInput.value = "";
    alert("Terima kasih! Pesan dan rating Anda berhasil disematkan di Buku Tamu.");
  });

  renderEntries();
})();
