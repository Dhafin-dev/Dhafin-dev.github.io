/* ==========================================================================
   SMART AI ASSISTANT CHATBOT (GEMINI API + ADVANCED KNOWLEDGE ENGINE)
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

(function initChatbot() {
  const triggerBtn = document.getElementById("aiChatTrigger");
  const chatWindow = document.getElementById("aiChatWindow");
  const closeBtn = document.getElementById("aiChatClose");
  const messagesWrap = document.getElementById("aiChatMessages");
  const chatForm = document.getElementById("aiChatForm");
  const chatInput = document.getElementById("aiChatInput");

  if (!triggerBtn || !chatWindow || !chatForm || !chatInput) return;

  // Toggle Chat Window
  triggerBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("active");
    if (chatWindow.classList.contains("active")) {
      chatInput.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      chatWindow.classList.remove("active");
    });
  }

  // System Instruction Prompt for Gemini API
  const SYSTEM_INSTRUCTION = `
Anda adalah "Dhafin AI Assistant", asisten virtual resmi untuk portofolio Ahmad Dhafin Al Farisy.
Tugas Anda adalah menjawab pertanyaan pengunjung website seputar latar belakang, pendidikan, prestasi, proyek inovasi, keahlian, dan kontak Ahmad Dhafin dengan ramah, profesional, ringkas, dan persuasif.

Fakta Lengkap tentang Ahmad Dhafin Al Farisy:
- Mahasiswa S1 Sistem Informasi di Universitas Airlangga (UNAIR) angkatan 2024–2028.
- Terpilih sebagai Duta FST UNAIR 2026 (Faculty Ambassador & Role Model).
- 2x International Gold Medalist:
  1. Gold Medal ISIF 2024 (International Science and Invention Fair) dengan inovasi robot medis MERI (Medical Carrier Robot).
  2. Gold Medal I2ASPO 2024 (Indonesia International Applied Science Project Olympiad) dengan inovasi ATP Biawak (Portable UGV IoT Auto-Targeting Gun).
- Kemahiran Bahasa: EF SET C2 Proficient (Skor 84/100), ELPT UNAIR 557, UKBI 703 (Sangat Unggul).
- Keaktifan Organisasi: BEM FST UNAIR, SDGs Centre UNAIR (fokus inovasi teknologi & dampak sosial).
- Tech Stack: HTML, CSS, JavaScript, Python, PHP, Arduino, ESP32, Raspberry Pi, IoT, Robotics, Figma, Git.
- Kontak:
  - LinkedIn: https://www.linkedin.com/in/ahmdhafin/
  - Instagram: @ahmdhafin
  - Email Akademik: ahmad.dhafin.al-2024@fst.unair.ac.id
  - Email Pribadi: tugasdhafinbsa@gmail.com
  - GitHub: https://github.com/Dhafin-dev
`;

  const conversationHistory = [];

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;

    // Format markdown links & bold text into clean HTML
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">$1</a>');

    msg.innerHTML = formattedText;
    messagesWrap.appendChild(msg);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  // =========================================================================
  // SMART CONTEXTUAL NLP ENGINE (FALLBACK / OFFLINE INSTANT BRAIN)
  // =========================================================================
  function getSmartKnowledgeResponse(input) {
    const q = input.toLowerCase();

    // 1. Siapa Dhafin / Profil / Background
    if (q.includes("siapa") || q.includes("who is") || q.includes("tentang") || q.includes("profil") || q.includes("biodata") || q.includes("kenalan")) {
      return `**Ahmad Dhafin Al Farisy** adalah mahasiswa S1 Sistem Informasi di **Universitas Airlangga (UNAIR)** (angkatan 2024–2028). Beliau juga dipercaya sebagai **Duta FST UNAIR 2026** serta merupakan **2x International Gold Medalist** di bidang Robotika & IoT. Dhafin berfokus pada pengembangan software, prototipe hardware cerdas, dan kepemimpinan berwawasan sosial.`;
    }

    // 2. Robot MERI / ISIF
    if (q.includes("meri") || q.includes("medis") || q.includes("isif") || q.includes("carrier robot") || q.includes("rumah sakit")) {
      return `**MERI (Medical Carrier Robot)** adalah proyek inovasi robot medis yang meraih **Gold Medal di ajang International Science and Invention Fair (ISIF) 2024** kategori Technology. Robot ini dirancang untuk mendistribusikan obat dan logistik medis di ruang isolasi rumah sakit secara otomatis demi meminimalisir penularan penyakit bagi nakes.`;
    }

    // 3. ATP Biawak / I2ASPO / UGV / IoT
    if (q.includes("biawak") || q.includes("atp") || q.includes("i2aspo") || q.includes("ugv") || q.includes("targeting") || q.includes("iot")) {
      return `**ATP Biawak** adalah prototipe *Portable Unmanned Ground Vehicle (UGV)* terintegrasi IoT dan auto-targeting gun yang meraih **Gold Medal di Indonesia International Applied Science Project Olympiad (I2ASPO) 2024**. Proyek ini menerapkan mikrokontroler canggih dan telemetri data real-time untuk kebutuhan pengawasan taktis.`;
    }

    // 4. Duta FST UNAIR / Kepemimpinan
    if (q.includes("duta") || q.includes("fst") || q.includes("ambassador") || q.includes("unair") || q.includes("bem") || q.includes("sdgs")) {
      return `Sebagai **Duta FST UNAIR 2026**, Dhafin bertugas sebagai *role model*, komunikator sains, dan representasi fakultas dalam mempromosikan keunggulan inovasi dan akademik. Dhafin juga aktif berkontribusi di **BEM FST** dan **SDGs Centre UNAIR** untuk memajukan pembangunan berkelanjutan berbasis teknologi.`;
    }

    // 5. Bahasa / EF SET C2 / UKBI / ELPT
    if (q.includes("bahasa") || q.includes("english") || q.includes("c2") || q.includes("ukbi") || q.includes("elpt") || q.includes("inggris") || q.includes("toefl")) {
      return `Dhafin memiliki kemahiran bahasa tingkat tinggi dengan sertifikasi resmi:\n- 🌐 **EF SET C2 Proficient:** Skor **84/100** (Tingkat bilingual tertinggi).\n- 📜 **ELPT UNAIR:** Skor **557** (Melampaui syarat doktoral/S3).\n- 🇮🇩 **UKBI:** Skor **703** (Predikat Sangat Unggul dari Badan Bahasa Kemendikbud).`;
    }

    // 6. Kontak / Email / LinkedIn / Instagram / Kolaborasi
    if (q.includes("kontak") || q.includes("contact") || q.includes("email") || q.includes("linkedin") || q.includes("instagram") || q.includes("hubung") || q.includes("kolaborasi") || q.includes("api")) {
      return `Anda dapat terhubung langsung dengan Dhafin melalui:\n- 💼 **LinkedIn:** [ahmdhafin](https://www.linkedin.com/in/ahmdhafin/)\n- ✉️ **Email Akademik:** [ahmad.dhafin.al-2024@fst.unair.ac.id](mailto:ahmad.dhafin.al-2024@fst.unair.ac.id)\n- ✉️ **Email Pribadi:** [tugasdhafinbsa@gmail.com](mailto:tugasdhafinbsa@gmail.com)\n- 📷 **Instagram:** [@ahmdhafin](https://instagram.com/ahmdhafin)\n- 💻 **GitHub:** [Dhafin-dev](https://github.com/Dhafin-dev)`;
    }

    // 7. CV / Resume
    if (q.includes("cv") || q.includes("resume") || q.includes("download") || q.includes("unduh") || q.includes("dokumen")) {
      return `Anda bisa mengunduh Curriculum Vitae (CV) ATS terbaru milik Dhafin langsung melalui tombol di header atau klik tautan [Download Resume PDF](assets/docs/resume.pdf).`;
    }

    // 8. Skill / Tech Stack / Bahasa Pemrograman
    if (q.includes("skill") || q.includes("tech") || q.includes("bahasa pemrograman") || q.includes("keahlian") || q.includes("python") || q.includes("javascript") || q.includes("arduino") || q.includes("figma")) {
      return `Keahlian teknis utama Dhafin mencakup:\n- **Software & Web:** JavaScript, Python, PHP, HTML5, CSS3, Git & GitHub.\n- **Hardware & IoT:** Arduino, ESP32, ESP8266, Raspberry Pi, Sensorik & Robotika.\n- **Design & Tools:** Figma, Canva, CapCut, Microsoft Office Suite.`;
    }

    // 9. Prestasi / Penghargaan / Award
    if (q.includes("prestasi") || q.includes("award") || q.includes("juara") || q.includes("medali") || q.includes("lomba") || q.includes("honors")) {
      return `Prestasi unggulan internasional Dhafin meliputi:\n1. 🥇 **Gold Medal ISIF 2024** (Technology) – Robot Medis MERI.\n2. 🥇 **Gold Medal I2ASPO 2024** (IoT & Applications) – ATP Biawak UGV.\n3. 👑 **Duta FST UNAIR 2026**.\n4. 🎓 **C2 Proficient English & UKBI Sangat Unggul (703)**.`;
    }

    // 10. Default General Friendly Response
    return `Halo! Dhafin adalah mahasiswa Sistem Informasi UNAIR, Duta FST 2026, dan 2x International Gold Medalist (ISIF & I2ASPO). Anda bisa menanyakan hal spesifik seperti proyek **Robot MERI**, **ATP Biawak**, **Keahlian Teknis**, atau cara **Menghubungi Dhafin**.`;
  }

  // =========================================================================
  // SUBMIT HANDLER
  // =========================================================================
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;

    appendMessage("user", query);
    chatInput.value = "";

    // Show Typing Indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "chat-msg bot";
    typingIndicator.id = "botTyping";
    typingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dhafin AI sedang mengetik...';
    messagesWrap.appendChild(typingIndicator);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;

    conversationHistory.push({ role: "user", parts: [{ text: query }] });

    let reply = "";
    let geminiSuccess = false;

    // Check if valid Gemini API key is present
    const apiKey = PORTFOLIO_CONFIG?.api?.geminiKey;
    if (apiKey && apiKey.startsWith("AIzaSy")) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents: conversationHistory
          })
        });

        if (res.ok) {
          const data = await res.json();
          reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) geminiSuccess = true;
        }
      } catch (err) {
        geminiSuccess = false;
      }
    }

    // If Gemini was not used or failed, use the instant Smart Knowledge Engine
    if (!geminiSuccess) {
      reply = getSmartKnowledgeResponse(query);
    }

    if (document.getElementById("botTyping")) {
      document.getElementById("botTyping").remove();
    }

    conversationHistory.push({ role: "model", parts: [{ text: reply }] });
    appendMessage("bot", reply);
  });
})();
