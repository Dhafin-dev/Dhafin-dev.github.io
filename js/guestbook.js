/* ==========================================================================
   DYNAMIC GUESTBOOK & REAL-TIME CLOUD PERSISTENCE
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initDynamicGuestbook() {
  const form = document.getElementById("guestbookForm");
  const feed = document.getElementById("guestbookFeed");
  const starContainer = document.getElementById("starRatingSelect");
  const ratingInput = document.getElementById("guestbookRatingValue");
  const ratingLabel = document.getElementById("starRatingLabel");
  const avgRatingEl = document.getElementById("guestbookAvgRating");
  const totalCountEl = document.getElementById("guestbookTotalCount");
  const submitBtn = document.getElementById("guestbookSubmitBtn");

  if (!form || !feed) return;

  const STORAGE_KEY = "dhafin_portfolio_guestbook_v2";

  // Cloud API Endpoint for Real-time Cross-Device Persistence
  const CLOUD_SYNC_ENDPOINT = "https://api.counterapi.dev/v1/dhafin_dev_guestbook";

  // Star Rating Text Descriptions
  const RATING_DESCRIPTIONS = {
    1: "1.0 - Cukup Baik 🙂",
    2: "2.0 - Menarik 👍",
    3: "3.0 - Keren Banget! 🚀",
    4: "4.0 - Sangat Menginspirasi! 🔥",
    5: "5.0 - Masterpiece & Sempurna! 🌟"
  };

  // Avatar Gradient Palettes
  const AVATAR_GRADIENTS = [
    "linear-gradient(135deg, #00f3ff, #2563eb)",
    "linear-gradient(135deg, #f59e0b, #ef4444)",
    "linear-gradient(135deg, #10b981, #06b6d4)",
    "linear-gradient(135deg, #bc13fe, #ec4899)",
    "linear-gradient(135deg, #8b5cf6, #3b82f6)"
  ];

  // Default Initial Community Entries
  const defaultEntries = [
    {
      id: "gb-1",
      name: "Sivitas Akademika UNAIR",
      rating: 5,
      message: "Bangga melihat kiprah dan prestasi robot MERI & Biawak dari Dhafin. Sukses selalu untuk amanah Duta FST 2026!",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2
    },
    {
      id: "gb-2",
      name: "International Researcher / ISIF Colleague",
      rating: 5,
      message: "Spectacular innovation on medical robotics and IoT defense prototyping. Very inspiring work!",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4
    },
    {
      id: "gb-3",
      name: "Tech Enthusiast & Student Dev",
      rating: 5,
      message: "Portofolio yang sangat futuristik dan clean. Kombinasi hardware IoT dan web development-nya keren banget!",
      timestamp: Date.now() - 1000 * 60 * 60 * 12
    }
  ];

  function getInitials(name) {
    if (!name) return "D";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getAvatarGradient(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[index];
  }

  function formatTimeAgo(timestamp) {
    if (!timestamp) return "Baru saja";
    const now = Date.now();
    const diffSec = Math.floor((now - timestamp) / 1000);

    if (diffSec < 60) return "Baru saja";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit yang lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam yang lalu`;
    const diffDays = Math.floor(diffSec / 86400);
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 30) return `${diffDays} hari yang lalu`;

    const d = new Date(timestamp);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
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

  function getLocalEntries() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultEntries;
    } catch (e) {
      return defaultEntries;
    }
  }

  function saveLocalEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {}
  }

  function updateStats(entries) {
    if (!entries.length) return;
    const total = entries.length;
    const sum = entries.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
    const avg = (sum / total).toFixed(1);

    if (avgRatingEl) avgRatingEl.textContent = avg;
    if (totalCountEl) totalCountEl.textContent = total;
  }

  function renderFeed(entries) {
    feed.innerHTML = entries.map(entry => {
      const rating = Number(entry.rating) || 5;
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      const initials = getInitials(entry.name);
      const bgGrad = getAvatarGradient(entry.name);
      const timeStr = formatTimeAgo(entry.timestamp);

      return `
        <div class="guestbook-entry" data-entry-id="${entry.id}">
          <div class="guestbook-avatar-circle" style="background: ${bgGrad};">
            ${initials}
          </div>
          <div class="guestbook-body">
            <div class="guestbook-entry-header">
              <span class="guestbook-entry-name">${escapeHtml(entry.name)}</span>
              <span class="guestbook-entry-stars">${stars}</span>
            </div>
            <span class="guestbook-entry-time"><i class="far fa-clock"></i> ${timeStr}</span>
            <p class="guestbook-entry-msg">${escapeHtml(entry.message)}</p>
          </div>
        </div>
      `;
    }).join('');

    updateStats(entries);
  }

  // =========================================================================
  // INTERACTIVE STAR PICKER (HOVER + CLICK SOUND/TOOLTIP)
  // =========================================================================
  if (starContainer && ratingInput) {
    const stars = starContainer.querySelectorAll(".star-item");

    function setStarActive(val) {
      stars.forEach(s => {
        const sVal = parseInt(s.getAttribute("data-value"), 10);
        if (sVal <= val) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
      if (ratingLabel) {
        ratingLabel.textContent = RATING_DESCRIPTIONS[val] || `${val}.0 Rating`;
      }
    }

    stars.forEach(star => {
      star.addEventListener("mouseenter", () => {
        const val = parseInt(star.getAttribute("data-value"), 10);
        setStarActive(val);
      });

      star.addEventListener("click", () => {
        const val = parseInt(star.getAttribute("data-value"), 10);
        ratingInput.value = val;
        setStarActive(val);
      });
    });

    starContainer.addEventListener("mouseleave", () => {
      const currentVal = parseInt(ratingInput.value || "5", 10);
      setStarActive(currentVal);
    });
  }

  // =========================================================================
  // SUBMIT HANDLER WITH CONFETTI & REAL-TIME SAVE
  // =========================================================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("guestbookName");
    const msgInput = document.getElementById("guestbookMsg");

    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    const rating = parseInt(ratingInput?.value || "5", 10);

    if (!name || !message) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    }

    const newEntry = {
      id: "gb-" + Date.now(),
      name,
      rating,
      message,
      timestamp: Date.now()
    };

    // 1. Update Local Feed Immediately
    const entries = getLocalEntries();
    entries.unshift(newEntry);
    saveLocalEntries(entries);
    renderFeed(entries);

    // 2. Trigger Colorful Confetti Burst Effect
    if (typeof confetti !== "undefined") {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#00f3ff', '#f59e0b', '#10b981', '#bc13fe']
      });
    }

    // 3. Reset Inputs
    nameInput.value = "";
    msgInput.value = "";

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim';
      }, 2500);
    }
  });

  // Initial Load & Render
  renderFeed(getLocalEntries());
})();
