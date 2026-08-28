/* ==========================================================================
   ULTRA-DYNAMIC AI CONVERSATIONAL CHATBOT
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

  const conversationHistory = [];
  let lastTopic = "";

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;

    // Format markdown links, bullet points & bold text
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">$1</a>')
      .replace(/\n/g, '<br>');

    msg.innerHTML = formattedText;
    messagesWrap.appendChild(msg);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  // =========================================================================
  // ULTRA-DYNAMIC CONTEXTUAL AI SYNTHESIZER
  // =========================================================================
  function generateDynamicResponse(query) {
    const q = query.toLowerCase().trim();

    // 1. Handling User Correction / Misunderstanding
    if (q.includes("bukan") || q.includes("salah") || q.includes("tidak nyambung") || q.includes("ga nyambung") || q.includes("bkn") || q.includes("keliru")) {
      return `Mohon maaf atas kekurangjelasannya! 🙏\n\nBoleh beri tahu saya topik spesifik apa yang ingin Anda ketahui? Misalnya:\n- 🤖 **Detail Mekanisme Robot MERI / Biawak**\n- 🎓 **Perkuliahan Sistem Informasi & Riset UNAIR**\n- 👑 **Peran & Program Kerja Duta FST 2026**\n- 💻 **Tech Stack & Arsitektur Website Ini**\n- 📬 **Kerjasama Proyek / Kontak Langsung**\n\nSilakan ketik pertanyaan Anda!`;
    }

    // 2. Pertanyaan tentang API / Integrasi Sistem Web Ini
    if (q.includes("api") || q.includes("endpoint") || q.includes("arsitektur web") || q.includes("backend") || q.includes("database")) {
      return `Website portofolio ini dibangun dengan beberapa integrasi API & Service modern:\n- 🧠 **Google Gemini AI API:** Untuk asisten virtual cerdas ini.\n- 📊 **GitHub REST API:** Menarik statistik publik repositori \`@Dhafin-dev\` secara live untuk visualisasi 3D Three.js.\n- ✉️ **EmailJS Service:** Menghubungkan formulir kontak langsung ke email Dhafin.\n- ⚡ **Supabase Cloud:** Database cloud real-time untuk Buku Tamu.\n\nApakah ada integrasi atau kode teknis tertentu yang ingin Anda tanyakan?`;
    }

    // 3. Sapaan Ramah / Chit-chat
    if (q === "halo" || q === "hai" || q === "hi" || q === "hello" || q === "p" || q === "selamat pagi" || q === "selamat siang" || q === "selamat malam" || q.includes("apa kabar")) {
      return `Halo! Senang bisa menyapa Anda di website resmi Ahmad Dhafin Al Farisy. 😊\n\nSaya siap membantu menjawab pertanyaan seputar:\n- Inovasi robotika (MERI & ATP Biawak)\n- Kiprah Duta FST UNAIR 2026\n- Keahlian software & IoT\n- Kolaborasi atau kontak\n\nAda yang bisa saya bantu hari ini?`;
    }

    // 4. Ucapan Terima Kasih
    if (q.includes("terima kasih") || q.includes("makasih") || q.includes("thanks") || q.includes("thank you") || q.includes("thx")) {
      return `Sama-sama! Senang bisa membantu Anda. Jika ada hal lain yang ingin Anda ketahui seputar karya dan kiprah Dhafin, jangan ragu untuk bertanya lagi ya! 🚀`;
    }

    // 5. Siapa Dhafin / Latar Belakang / Biografi
    if (q.includes("siapa") || q.includes("who is") || q.includes("tentang dhafin") || q.includes("profil") || q.includes("biodata") || q.includes("background")) {
      lastTopic = "profile";
      return `**Ahmad Dhafin Al Farisy** adalah mahasiswa S1 **Sistem Informasi di Universitas Airlangga (UNAIR)** (angkatan 2024–2028).\n\nBeliau merupakan figur muda berprestasi yang memadukan keahlian teknik dan kepemimpinan:\n- 👑 **Duta FST UNAIR 2026** (Faculty Ambassador & Role Model)\n- 🥇 **2x International Gold Medalist** di bidang Robotika & IoT (ISIF & I2ASPO 2024)\n- 🌐 **EF SET C2 Proficient (84/100)** & **UKBI 703 (Sangat Unggul)**\n- 🌿 Aktif dalam inisiatif **SDGs Centre UNAIR** & BEM FST\n\nDhafin berfokus menciptakan teknologi terapan yang memberikan dampak sosial nyata.`;
    }

    // 6. Proyek Robot Medis MERI
    if (q.includes("meri") || q.includes("robot medis") || q.includes("isif") || q.includes("medical")) {
      lastTopic = "meri";
      return `**MERI (Medical Carrier Robot)** adalah salah satu karya riset unggulan Dhafin yang memenangkan **Gold Medal di International Science and Invention Fair (ISIF) 2024** kategori Technology.\n\n**Keunggulan & Cara Kerja MERI:**\n- Didesain khusus untuk rumah sakit isolasi guna mengantar obat dan logistik ke pasien menular tanpa kontak fisik langsung.\n- Menggunakan sistem kendali mikrokontroler presisi, sensor navigasi anti-tabrak, dan kompartemen higienis otomatis.\n- Bertujuan melindungi tenaga medis dari risiko paparan infeksi berbahaya.`;
    }

    // 7. Proyek Robot ATP Biawak
    if (q.includes("biawak") || q.includes("atp") || q.includes("i2aspo") || q.includes("ugv") || q.includes("targeting") || q.includes("pertahanan")) {
      lastTopic = "biawak";
      return `**ATP Biawak** adalah inovasi robotika taktis yang meraih **Gold Medal di Indonesia International Applied Science Project Olympiad (I2ASPO) 2024** (kategori IoT & Applications).\n\n**Spesifikasi Utama ATP Biawak:**\n- Berupa *Portable Unmanned Ground Vehicle (UGV)* yang lincah di berbagai medan.\n- Dilengkapi aktuator *auto-targeting* untuk bidik sasaran otomatis berbasis sensorik cerdas.\n- Menggunakan telemetri IoT nirkabel untuk kendali dan pemantauan jarak jauh melalui web dashboard.`;
    }

    // 8. Duta FST UNAIR 2026
    if (q.includes("duta") || q.includes("fst") || q.includes("ambassador") || q.includes("fakultas") || q.includes("sains dan teknologi")) {
      lastTopic = "duta";
      return `Sebagai **Duta FST UNAIR 2026**, Dhafin dipercaya sebagai representasi resmi fakultas untuk:\n- 🌟 Menjadi *role model* akademik dan integritas bagi mahasiswa.\n- 🎙️ Memimpin komunikasi sains, promosi universitas, dan relasi publik.\n- 🌿 Menggerakkan program inovasi teknologi berkelanjutan selaras dengan target **UN Sustainable Development Goals (SDGs)**.`;
    }

    // 9. Kemahiran Bahasa & Skor Sertifikasi
    if (q.includes("bahasa") || q.includes("english") || q.includes("inggris") || q.includes("c2") || q.includes("ukbi") || q.includes("elpt") || q.includes("skor") || q.includes("toefl")) {
      lastTopic = "language";
      return `Dhafin memiliki rekam jejak kemampuan bahasa kelas internasional:\n- 🌐 **EF SET English Certificate:** Level **C2 Proficient** dengan skor **84/100** (Tingkat kemahiran bilingual tertinggi).\n- 📜 **ELPT UNAIR:** Skor **557** (Melampaui standar kelulusan doktoral/S3).\n- 🇮🇩 **UKBI (Uji Kemahiran Berbahasa Indonesia):** Skor **703** dengan predikat **Sangat Unggul** dari Badan Pengembangan & Pembinaan Bahasa Kemendikbud.`;
    }

    // 10. Tech Stack & Keahlian Pemrograman
    if (q.includes("skill") || q.includes("tech") || q.includes("pemrograman") || q.includes("coding") || q.includes("python") || q.includes("javascript") || q.includes("arduino") || q.includes("figma") || q.includes("bahasa apa")) {
      lastTopic = "skills";
      return `Keahlian teknis Dhafin meliputi berbagai disiplin ilmu:\n- **💻 Software & Web:** JavaScript, Python, PHP, HTML5, CSS3, REST API, Git & GitHub.\n- **🤖 Hardware & IoT:** Arduino, ESP32, ESP8266, Raspberry Pi, Sensorik, Telemetri IoT & Robotika.\n- **🎨 Design & Media:** Figma (UI/UX Prototyping), Canva, CapCut Video Production, Microsoft Office Suite.`;
    }

    // 11. Unduh CV & Resume
    if (q.includes("cv") || q.includes("resume") || q.includes("unduh") || q.includes("download") || q.includes("berkas")) {
      return `Anda dapat mengunduh **Curriculum Vitae (CV) ATS** resmi Ahmad Dhafin Al Farisy berformat PDF melalui tautan berikut:\n\n📥 [Download CV ATS Ahmad Dhafin Al Farisy](assets/docs/resume.pdf)\n\nFile ini memuat seluruh rekam jejak akademik, keahlian teknis, pengalaman organisasi, dan piagam kompetisi Dhafin.`;
    }

    // 12. Kontak, Email & Media Sosial
    if (q.includes("kontak") || q.includes("email") || q.includes("hubungi") || q.includes("linkedin") || q.includes("instagram") || q.includes("github") || q.includes("kolaborasi") || q.includes("telepon") || q.includes("wa") || q.includes("pesan")) {
      return `Anda dapat terhubung langsung dengan Dhafin melalui saluran resmi berikut:\n- 💼 **LinkedIn:** [ahmdhafin](https://www.linkedin.com/in/ahmdhafin/)\n- ✉️ **Email Akademik:** [ahmad.dhafin.al-2024@fst.unair.ac.id](mailto:ahmad.dhafin.al-2024@fst.unair.ac.id)\n- ✉️ **Email Pribadi / Umum:** [tugasdhafinbsa@gmail.com](mailto:tugasdhafinbsa@gmail.com)\n- 📷 **Instagram:** [@ahmdhafin](https://instagram.com/ahmdhafin)\n- 💻 **GitHub:** [Dhafin-dev](https://github.com/Dhafin-dev)\n\nAnda juga bisa mengisi formulir kontak langsung di bagian bawah website ini!`;
    }

    // 13. Prestasi & Penghargaan Lengkap
    if (q.includes("prestasi") || q.includes("penghargaan") || q.includes("award") || q.includes("juara") || q.includes("medali") || q.includes("lomba") || q.includes("trofi")) {
      return `Daftar prestasi unggulan Ahmad Dhafin Al Farisy:\n1. 🥇 **Gold Medal ISIF 2024** (International Science and Invention Fair) – Kategori Technology (Robot MERI)\n2. 🥇 **Gold Medal I2ASPO 2024** (Indonesia International Applied Science Project Olympiad) – Kategori IoT (ATP Biawak)\n3. 👑 **Duta FST UNAIR 2026** (Faculty Ambassador & Role Model)\n4. 🎓 **C2 Proficient English (EF SET 84/100)**\n5. 🇮🇩 **Predikat Sangat Unggul UKBI (Skor 703)**`;
    }

    // 14. Organisasi & Pengalaman Kampus
    if (q.includes("organisasi") || q.includes("bem") || q.includes("sdgs") || q.includes("kegiatan") || q.includes("kampus") || q.includes("pengalaman")) {
      return `Selain aktif meneliti, Dhafin memiliki rekam jejak kepemimpinan kampus yang kuat:\n- 👑 **Duta FST UNAIR 2026:** Memimpin representasi dan diplomasi sains fakultas.\n- 🌿 **SDGs Centre UNAIR:** Berkontribusi dalam inisiatif pembangunan berkelanjutan dan teknologi hijau.\n- 🤝 **BEM FST UNAIR:** Aktif dalam departemen dan kepanitiaan inovasi mahasiswa.\n- 🎙️ **Public Speaking & MC:** Terbiasa memoderatori dan membawakan seminar sains teknologi.`;
    }

    // 15. Fallback Kontekstual yang Luwes
    return `Pertanyaan yang menarik! Mengenai *"**${query}**"*, Anda dapat mengeksplorasi keterkaitannya dengan riset robotika Dhafin (**Robot MERI** & **ATP Biawak**), peran sebagai **Duta FST UNAIR 2026**, atau keahlian **Web & IoT**. \n\nAda aspek khusus yang ingin kita bahas lebih dalam?`;
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
    typingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dhafin AI sedang berpikir...';
    messagesWrap.appendChild(typingIndicator);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;

    conversationHistory.push({ role: "user", parts: [{ text: query }] });

    let reply = "";
    let geminiSuccess = false;

    // Check if a real Google AI Studio key is provided
    const apiKey = PORTFOLIO_CONFIG?.api?.geminiKey;
    if (apiKey && apiKey.startsWith("AIzaSy")) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: "Anda adalah Dhafin AI Assistant. Jawab pertanyaan seputar Ahmad Dhafin Al Farisy (Sistem Informasi UNAIR, Duta FST 2026, 2x Gold Medalist ISIF/I2ASPO) dengan ramah dan akurat." }] },
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

    // Dynamic Intelligent Brain Response
    if (!geminiSuccess) {
      // Small simulated human delay for natural feel (350ms)
      await new Promise(resolve => setTimeout(resolve, 350));
      reply = generateDynamicResponse(query);
    }

    if (document.getElementById("botTyping")) {
      document.getElementById("botTyping").remove();
    }

    conversationHistory.push({ role: "model", parts: [{ text: reply }] });
    appendMessage("bot", reply);
  });
})();
