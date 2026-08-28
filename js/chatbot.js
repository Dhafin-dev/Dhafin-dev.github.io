/* ==========================================================================
   AI ASSISTANT CHATBOT (POWERED BY GOOGLE GEMINI API)
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

  // System Context Knowledge Base for Dhafin
  const SYSTEM_INSTRUCTION = `
Anda adalah "Dhafin AI Assistant", asisten virtual resmi untuk portofolio Ahmad Dhafin Al Farisy.
Tugas Anda adalah menjawab pertanyaan pengunjung website seputar latar belakang, pendidikan, prestasi, proyek inovasi, keahlian, dan kontak Ahmad Dhafin dengan ramah, profesional, ringkas, dan persuasif.

Fakta Utama tentang Ahmad Dhafin Al Farisy:
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

Aturan Menjawab:
- Jawab dalam Bahasa Indonesia yang santun, percaya diri, dan jelas (atau Bahasa Inggris jika penanya menggunakan bahasa Inggris).
- Jika pengunjung ingin menghubungi Dhafin, berikan email atau link LinkedIn.
- Selalu dukung branding Dhafin sebagai inovator teknologi dan pemimpin mahasiswa yang berintegritas.
`;

  const conversationHistory = [];

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;

    // Format simple markdown links into clickable chips
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    msg.innerHTML = formattedText;
    messagesWrap.appendChild(msg);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

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

    try {
      const apiKey = PORTFOLIO_CONFIG.api.geminiKey;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: conversationHistory
        })
      });

      typingIndicator.remove();

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak dapat memproses jawaban saat ini.";

      conversationHistory.push({ role: "model", parts: [{ text: reply }] });
      appendMessage("bot", reply);

    } catch (err) {
      if (document.getElementById("botTyping")) {
        document.getElementById("botTyping").remove();
      }

      // Friendly fallback response if API key has limits or is offline
      appendMessage("bot", `Terima kasih atas pertanyaannya! Dhafin adalah mahasiswa Sistem Informasi UNAIR, Duta FST 2026, dan 2x Gold Medalist (ISIF & I2ASPO). Anda bisa langsung menghubunginya via LinkedIn di [ahmdhafin](${PORTFOLIO_CONFIG.profile.linkedinUrl}) atau email [${PORTFOLIO_CONFIG.profile.personalEmail}](mailto:${PORTFOLIO_CONFIG.profile.personalEmail}).`);
    }
  });
})();
