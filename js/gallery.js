/* ==========================================================================
   PROJECTS GALLERY & FILTER SYSTEM
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initGallery() {
  const container = document.getElementById("projectsGrid");
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (!container || !PORTFOLIO_CONFIG?.projects) return;

  function renderProjects(filter = "all") {
    const list = filter === "all" 
      ? PORTFOLIO_CONFIG.projects 
      : PORTFOLIO_CONFIG.projects.filter(p => p.category === filter);

    container.innerHTML = list.map((p, index) => {
      // Dynamic SVG illustration placeholder for projects
      const iconClass = p.category === 'iot-robotics' ? 'fa-robot' : (p.category === 'web-software' ? 'fa-laptop-code' : 'fa-compass-drafting');
      const accentColor = p.category === 'iot-robotics' ? 'var(--accent-gold)' : (p.category === 'web-software' ? 'var(--accent-cyan)' : 'var(--accent-purple)');

      return `
        <div class="glass-card project-card" data-aos="fade-up" data-aos-delay="${index * 100}">
          <div class="project-img-wrapper" style="display: flex; align-items: center; justify-content: center; position: relative;">
            <div style="text-align: center; z-index: 1;">
              <i class="fas ${iconClass}" style="font-size: 3.8rem; color: ${accentColor}; filter: drop-shadow(0 0 20px ${accentColor});"></i>
              <div style="margin-top: 10px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${p.categoryLabel}</div>
            </div>
            <div class="project-img-overlay">
              <a href="${p.github}" target="_blank" class="social-circle-btn" title="View GitHub"><i class="fab fa-github"></i></a>
              <button class="social-circle-btn project-detail-btn" data-project-id="${p.id}" title="Details"><i class="fas fa-eye"></i></button>
            </div>
          </div>

          <div class="project-body">
            <span class="project-category-tag">${p.categoryLabel}</span>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.desc}</p>
            
            ${p.award ? `<div style="margin-bottom: 16px;"><span class="glass-badge gold" style="font-size: 0.78rem;">🥇 ${p.award}</span></div>` : ''}

            <div class="project-tech-tags">
              ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Initial Render
  renderProjects("all");

  // Filter Buttons Click
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      renderProjects(filter);
    });
  });

  // Project Detail Trigger in Modal
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".project-detail-btn");
    if (!btn) return;

    const id = btn.getAttribute("data-project-id");
    const proj = PORTFOLIO_CONFIG.projects.find(p => p.id === id);
    const modal = document.getElementById("detailModal");
    const modalBody = document.getElementById("modalBody");

    if (!proj || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="glass-badge cyan" style="margin-bottom: 12px;">${proj.categoryLabel}</span>
        <h2 style="font-size: 1.5rem; margin-bottom: 8px;">${proj.title}</h2>
        ${proj.award ? `<p style="color: var(--accent-gold); font-weight: 700; font-size: 0.95rem;">🏆 ${proj.award}</p>` : ''}
      </div>

      <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--glass-border);">
        <h4 style="font-size: 1.05rem; margin-bottom: 10px; color: #fff;">Tentang Proyek:</h4>
        <p style="line-height: 1.7; font-size: 0.95rem;">${proj.longDesc || proj.desc}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 1.05rem; margin-bottom: 12px; color: #fff;">Teknologi & Hardware Terpasang:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${proj.tech.map(t => `<span class="glass-badge purple" style="font-size: 0.82rem;">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 14px; margin-top: 20px;">
        <a href="${proj.github}" target="_blank" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.88rem;">
          <i class="fab fa-github"></i> Repository GitHub
        </a>
      </div>
    `;

    modal.classList.add("active");
  });
})();
