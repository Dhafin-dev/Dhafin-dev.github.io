/* ==========================================================================
   DYNAMIC GUESTBOOK (100% LIVE SUPABASE DATABASE - ZERO DUMMY CACHE)
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initLiveGuestbook() {
  const form = document.getElementById("guestbookForm");
  const feed = document.getElementById("guestbookFeed");
  const starContainer = document.getElementById("starRatingSelect");
  const ratingInput = document.getElementById("guestbookRatingValue");
  const avgRatingEl = document.getElementById("guestbookAvgRating");
  const totalCountEl = document.getElementById("guestbookTotalCount");
  const submitBtn = document.getElementById("guestbookSubmitBtn");

  if (!form || !feed) return;

  // Clear ALL previous legacy dummy cache keys from user browsers
  const legacyKeys = [
    "dhafin_portfolio_guestbook",
    "dhafin_portfolio_guestbook_v2",
    "dhafin_portfolio_guestbook_v3",
    "dhafin_portfolio_guestbook_live_v1",
    "dhafin_guestbook_pure_supabase_v1"
  ];
  legacyKeys.forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });

  const STORAGE_KEY = "dhafin_supabase_live_data_v2";

  // Avatar Gradient Palettes
  const AVATAR_GRADIENTS = [
    "linear-gradient(135deg, #00f3ff, #2563eb)",
    "linear-gradient(135deg, #f59e0b, #ef4444)",
    "linear-gradient(135deg, #10b981, #06b6d4)",
    "linear-gradient(135deg, #bc13fe, #ec4899)",
    "linear-gradient(135deg, #8b5cf6, #3b82f6)"
  ];

  // Supabase Client Initialization
  let supabaseClient = null;
  const sbUrl = PORTFOLIO_CONFIG?.api?.supabaseUrl;
  const sbKey = PORTFOLIO_CONFIG?.api?.supabasePublishableKey;

  if (sbUrl && sbKey && typeof window.supabase !== "undefined") {
    try {
      supabaseClient = window.supabase.createClient(sbUrl, sbKey);
    } catch (e) {
      console.warn("Supabase client init error:", e);
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
    const timeMs = typeof timestamp === "number" ? timestamp : new Date(timestamp).getTime();
    const diffSec = Math.floor((Date.now() - timeMs) / 1000);

    if (diffSec < 60) return "Baru saja";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit yang lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam yang lalu`;
    const diffDays = Math.floor(diffSec / 86400);
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 30) return `${diffDays} hari yang lalu`;

    const d = new Date(timeMs);
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
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLocalEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {}
  }

  function updateStats(entries) {
    if (!entries || !entries.length) {
      if (avgRatingEl) avgRatingEl.textContent = "5.0";
      if (totalCountEl) totalCountEl.textContent = "0";
      return;
    }
    const total = entries.length;
    const sum = entries.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
    const avg = (sum / total).toFixed(1);

    if (avgRatingEl) avgRatingEl.textContent = avg;
    if (totalCountEl) totalCountEl.textContent = total;
  }

  function renderFeed(entries) {
    if (!entries || !entries.length) {
      feed.innerHTML = `
        <div style="text-align: center; padding: 36px 16px; color: var(--text-muted); font-size: 0.9rem;">
          <i class="far fa-comment-dots" style="font-size: 2.2rem; color: var(--accent-cyan); display: block; margin-bottom: 12px; opacity: 0.8;"></i>
          Belum ada pesan ulasan. Jadilah yang pertama meninggalkan sapaan!
        </div>
      `;
      updateStats([]);
      return;
    }

    feed.innerHTML = entries.map(entry => {
      const rating = Number(entry.rating) || 5;
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      const initials = getInitials(entry.name);
      const bgGrad = getAvatarGradient(entry.name);
      const timeStr = formatTimeAgo(entry.created_at || entry.timestamp || Date.now());

      return `
        <div class="guestbook-entry" data-entry-id="${entry.id || ''}">
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
  // SUPABASE REAL-TIME FETCH ENGINE
  // =========================================================================
  async function fetchLiveEntries() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("guestbook")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (!error && data) {
          saveLocalEntries(data);
          renderFeed(data);
          return;
        }
      } catch (err) {
        console.warn("Supabase fetch notice:", err);
      }
    }

    // Direct REST API fallback
    try {
      const res = await fetch(`${sbUrl}/rest/v1/guestbook?select=*&order=created_at.desc`, {
        headers: {
          "apikey": sbKey,
          "Authorization": `Bearer ${sbKey}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          saveLocalEntries(data);
          renderFeed(data);
          return;
        }
      }
    } catch (e) {}

    renderFeed(getLocalEntries());
  }

  // =========================================================================
  // FLICKER-FREE STAR RATING ENGINE
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
    }

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

    updateStarUI(selectedRating);
  }

  // =========================================================================
  // SUBMIT HANDLER DIRECTLY TO SUPABASE
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
      name,
      rating,
      message,
      created_at: new Date().toISOString()
    };

    // 1. Optimistic Local Feed Update
    const currentEntries = getLocalEntries();
    currentEntries.unshift(newEntry);
    saveLocalEntries(currentEntries);
    renderFeed(currentEntries);

    // 2. Trigger Confetti Effect
    if (typeof confetti !== "undefined") {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.8 },
        colors: ['#00f3ff', '#f59e0b', '#10b981', '#bc13fe']
      });
    }

    // 3. Save to Supabase Database
    try {
      if (supabaseClient) {
        await supabaseClient.from("guestbook").insert([newEntry]);
      } else {
        await fetch(`${sbUrl}/rest/v1/guestbook`, {
          method: "POST",
          headers: {
            "apikey": sbKey,
            "Authorization": `Bearer ${sbKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
          },
          body: JSON.stringify(newEntry)
        });
      }
      setTimeout(fetchLiveEntries, 500);
    } catch (err) {
      console.error("Supabase live save error:", err);
    }

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

  // Fetch only real live data from Supabase on start
  fetchLiveEntries();

  // Auto-sync every 15 seconds
  setInterval(fetchLiveEntries, 15000);
})();
