/* ==========================================================================
   INTERACTIVE JOURNEY & DETAIL MODAL
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initJourney() {
  const container = document.getElementById("timelineContainer");
  const modal = document.getElementById("detailModal");
  const modalClose = document.getElementById("modalClose");
  const modalBody = document.getElementById("modalBody");

  if (!container || !PORTFOLIO_CONFIG?.milestones) return;

  // Render Milestones
  container.innerHTML = `
    <div class="timeline-line"></div>
    ${PORTFOLIO_CONFIG.milestones.map((m, index) => {
      const isLeft = index % 2 === 0;
      return `
        <div class="timeline-item ${isLeft ? 'left' : 'right'}" data-aos="fade-up" data-aos-delay="${index * 100}">
          <div class="timeline-dot"></div>
          <div class="glass-card timeline-card" data-milestone-id="${m.id}">
            <span class="timeline-year">${m.year} • ${m.category}</span>
            <h3 class="timeline-title">${m.title}</h3>
            <span class="timeline-org">${m.org}</span>
            <p class="timeline-snippet">${m.desc}</p>
            <div class="timeline-click-hint">
              <i class="fas fa-arrow-up-right-from-square"></i> Lihat Rincian & Dokumentasi
            </div>
          </div>
        </div>
      `;
    }).join('')}
  `;

  // Handle Modal Popup
  document.addEventListener("click", (e) => {
    const card = e.target.closest("[data-milestone-id]");
    if (!card) return;

    const id = card.getAttribute("data-milestone-id");
    const item = PORTFOLIO_CONFIG.milestones.find(m => m.id === id);
    if (!item || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="glass-badge gold" style="margin-bottom: 12px;">${item.badge}</span>
        <h2 style="font-size: 1.5rem; margin-bottom: 6px;">${item.title}</h2>
        <p style="color: var(--accent-cyan); font-weight: 600; font-size: 0.95rem;">${item.org} (${item.year})</p>
      </div>

      <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--glass-border);">
        <h4 style="font-size: 1.05rem; margin-bottom: 10px; color: #fff;">Ringkasan Prestasi & Kontribusi:</h4>
        <p style="line-height: 1.7; font-size: 0.95rem;">${item.desc}</p>
      </div>

      <div>
        <h4 style="font-size: 1.05rem; margin-bottom: 12px; color: #fff;">Poin Penting & Inovasi:</h4>
        <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px;">
          ${item.details.map(d => `
            <li style="display: flex; gap: 10px; font-size: 0.92rem; color: var(--text-secondary);">
              <i class="fas fa-check-circle" style="color: var(--accent-cyan); margin-top: 4px;"></i>
              <span>${d}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    modal.classList.add("active");
  });

  // Close Modal
  if (modalClose && modal) {
    modalClose.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }
})();
