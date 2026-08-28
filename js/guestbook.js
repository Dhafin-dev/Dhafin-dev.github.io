/* ==========================================================================
   DYNAMIC GUESTBOOK WITH TRUE CLOUD DATABASE PERSISTENCE (FLICKER-FREE)
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

  const STORAGE_KEY = "dhafin_portfolio_guestbook_v3";

  // Cloud Realtime Storage Sync (Global Relay for GitHub Pages)
  const CLOUD_GUESTBOOK_URL = "https://jsonblob.com/api/jsonBlob/1277682390234710016";

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

  // Default Seed Community Entries
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

  // Supabase Client Initialization (if URL & Key are present)
  let supabaseClient = null;
  const sbUrl = PORTFOLIO_CONFIG?.api?.supabaseUrl;
  const sbKey = PORTFOLIO_CONFIG?.api?.supabasePublishableKey;

  if (sbUrl && sbKey && typeof window.supabase !== "undefined") {
    try {
      supabaseClient = window.supabase.createClient(sbUrl, sbKey);
    } catch (e) {
      console.warn("Supabase init info:", e);
    }
  }

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
      const timeStr = formatTimeAgo(entry.timestamp || (entry.created_at ? new Date(entry.created_at).getTime() : Date.now()));

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
  // CLOUD DATABASE SYNC ENGINE (REAL-TIME FETCH)
  // =========================================================================
  async function fetchCloudEntries() {
    // 1. Try Supabase if client is active
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("guestbook")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          saveLocalEntries(data);
          renderFeed(data);
          return;
        }
      } catch (err) {
        console.warn("Supabase fetch fallback:", err);
      }
    }

    // 2. Try Global Cloud Sync Relay
    try {
      const res = await fetch(CLOUD_GUESTBOOK_URL, { method: "GET" });
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData) && cloudData.length > 0) {
          saveLocalEntries(cloudData);
          renderFeed(cloudData);
        }
      }
    } catch (e) {
      // Offline fallback: render existing local storage
      renderFeed(getLocalEntries());
    }
  }

  // =========================================================================
  // 100% FLICKER-FREE STAR RATING ENGINE
  // =========================================================================
  let selectedRating = 5;

  if (starContainer && ratingInput) {
    const stars = starContainer.querySelectorAll(".star-item");

    function updateStarUI(val) {
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

    // Smooth hover delegation without hitbox shifts
    starContainer.addEventListener("mousemove", (e) => {
      const star = e.target.closest(".star-item");
      if (star) {
        const hoverVal = parseInt(star.getAttribute("data-value"), 10);
        updateStarUI(hoverVal);
      }
    });

    starContainer.addEventListener("click", (e) => {
      const star = e.target.closest(".star-item");
      if (star) {
        selectedRating = parseInt(star.getAttribute("data-value"), 10);
        ratingInput.value = selectedRating;
        updateStarUI(selectedRating);
      }
    });

    starContainer.addEventListener("mouseleave", () => {
      updateStarUI(selectedRating);
    });

    // Initial state
    updateStarUI(selectedRating);
  }

  // =========================================================================
  // SUBMIT HANDLER WITH CLOUD SAVE & CONFETTI
  // =========================================================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("guestbookName");
    const msgInput = document.getElementById("guestbookMsg");

    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    const rating = parseInt(ratingInput?.value || selectedRating || "5", 10);

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
      timestamp: Date.now(),
      created_at: new Date().toISOString()
    };

    // 1. Optimistic Local Update
    const entries = getLocalEntries();
    entries.unshift(newEntry);
    saveLocalEntries(entries);
    renderFeed(entries);

    // 2. Trigger Confetti Effect
    if (typeof confetti !== "undefined") {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#00f3ff', '#f59e0b', '#10b981', '#bc13fe']
      });
    }

    // 3. Save to Cloud in Background
    (async () => {
      // Save to Supabase if client is ready
      if (supabaseClient) {
        try {
          await supabaseClient.from("guestbook").insert([{
            name: newEntry.name,
            rating: newEntry.rating,
            message: newEntry.message,
            created_at: newEntry.created_at
          }]);
        } catch (err) {
          console.warn("Supabase insert error:", err);
        }
      }

      // Save to Cloud Sync Relay
      try {
        await fetch(CLOUD_GUESTBOOK_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entries.slice(0, 50))
        });
      } catch (err) {
        console.warn("Cloud relay save error:", err);
      }
    })();

    // 4. Reset Inputs
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

  // Initial Load (Local First, then Cloud Sync)
  renderFeed(getLocalEntries());
  fetchCloudEntries();
})();
