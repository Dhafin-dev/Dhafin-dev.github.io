/* ==========================================================================
   PORTFOLIO CONFIGURATION & DATA REPOSITORY
   Ahmad Dhafin Al Farisy
   ========================================================================== */

const PORTFOLIO_CONFIG = {
  profile: {
    name: "Ahmad Dhafin Al Farisy",
    title: "Information Systems Student | Duta FST UNAIR 2026 | Tech Innovator",
    university: "Universitas Airlangga (UNAIR)",
    period: "2024–2028",
    githubUsername: "Dhafin-dev",
    linkedinVanity: "ahmdhafin",
    linkedinUrl: "https://www.linkedin.com/in/ahmdhafin/",
    instagramUrl: "https://instagram.com/ahmdhafin",
    academicEmail: "ahmad.dhafin.al-2024@fst.unair.ac.id",
    personalEmail: "tugasdhafinbsa@gmail.com",
    cvPath: "assets/docs/resume.pdf"
  },

  // Service API Configuration
  api: {
    geminiKey: atob("QVEuQWI4Uk42S1praE9vN0FTOFFjbGVTMHJLVlpZR3Z6Q2F2NXo1VllHcUR2UFdFdHNZbkE="),
    emailJsServiceId: "service_kty4a8s",
    supabasePublishableKey: "sb_publishable_hai8DQrHTtgFkIJIKHk6pA_oPFUV6ur",
    supabaseUrl: "https://mhktrsdaehrdkrviklws.supabase.co"
  },

  // Timeline / Journey Data
  milestones: [
    {
      id: "m-isif-2024",
      year: "2024",
      title: "Gold Medal – International Science and Invention Fair (ISIF)",
      org: "ISIF / IYSA",
      category: "International Innovation",
      desc: "Meraih Medali Emas tingkat internasional di kategori Technology melalui riset dan prototipe MERI (Medical Carrier Robot to Prevent Spread of Infectious Diseases).",
      details: [
        "Memimpin perancangan mekanik dan sistem kontrol mikrokontroler robot pembawa obat/alat medis.",
        "Mengurangi risiko paparan virus/bakteri berbahaya bagi tenaga kesehatan di rumah sakit isolasi.",
        "Berkompetisi melawan puluhan tim riset internasional dari berbagai negara."
      ],
      badge: "🥇 Gold Medal",
      categoryType: "award"
    },
    {
      id: "m-i2aspo-2024",
      year: "2024",
      title: "Gold Medal – Indonesia International Applied Science Project Olympiad (I2ASPO)",
      org: "I2ASPO / IYSA",
      category: "IoT & Robotics",
      desc: "Meraih Medali Emas pada kategori IoT & Applications melalui inovasi ATP Biawak: Portable UGV with Auto-Targeting Gun.",
      details: [
        "Mengembangkan prototipe kendaraan darat tanpa awak (UGV) portabel dengan kendali IoT.",
        "Mengintegrasikan aktuator pelacak target otomatis untuk efisiensi keamanan taktis.",
        "Mendapat apresiasi juri internasional dalam penerapan teknologi cerdas terapan."
      ],
      badge: "🥇 Gold Medal",
      categoryType: "award"
    },
    {
      id: "m-duta-fst-2026",
      year: "2026",
      title: "Duta FST UNAIR 2026 (Faculty Ambassador & Role Model)",
      org: "Fakultas Sains dan Teknologi, Universitas Airlangga",
      category: "Leadership & Representation",
      desc: "Terpilih sebagai Duta FST UNAIR 2026 untuk merepresentasikan keunggulan akademik, sains, dan inovasi fakultas di tingkat universitas dan nasional.",
      details: [
        "Menjadi representasi citra dan figur teladan mahasiswa FST UNAIR.",
        "Memimpin delegasi promosi fakultas, seminar sains, dan dialog kemitraan.",
        "Menginisiasi kampanye kepedulian inovasi teknologi dan keberlanjutan (SDGs)."
      ],
      badge: "👑 Duta FST",
      categoryType: "leadership"
    },
    {
      id: "m-english-c2",
      year: "2024",
      title: "EF SET C2 Proficient (Score 84/100) & UKBI 703 (Sangat Unggul)",
      org: "EF Standard English Test & Badan Bahasa Kemendikbud",
      category: "Language & Communication",
      desc: "Mencapai tingkat kemahiran bahasa Inggris tertinggi (C2 Proficient) dan predikat Sangat Unggul dalam Uji Kemahiran Berbahasa Indonesia (UKBI).",
      details: [
        "EF SET Score: 84/100 (Tier C2 - Mastery/Bilingual level).",
        "ELPT UNAIR: 557 (Melampaui syarat kelulusan doktoral/S3).",
        "UKBI Score: 703 (Predikat Sangat Unggul)."
      ],
      badge: "📜 C2 Mastery",
      categoryType: "academic"
    }
  ],

  // Featured Projects Data
  projects: [
    {
      id: "p-meri-robot",
      title: "MERI: Medical Carrier Robot",
      category: "iot-robotics",
      categoryLabel: "Hardware & Robotics",
      desc: "Robot pintar pengantar logistik dan obat medis untuk mencegah penularan penyakit menular di area isolasi rumah sakit.",
      longDesc: "MERI dikembangkan sebagai solusi otomatisasi di fasilitas kesehatan. Dilengkapi sistem navigasi sensorik cerdas, kompartemen steril, dan kendali nirkabel untuk memudahkan perawat mengirimkan kebutuhan pasien tanpa kontak fisik langsung.",
      award: "ISIF 2024 International Gold Medal",
      tech: ["Arduino", "ESP32", "Sensors", "Robotics", "IoT", "C++"],
      github: "https://github.com/Dhafin-dev",
      demo: "#",
      featured: true
    },
    {
      id: "p-atp-biawak",
      title: "ATP Biawak: Portable UGV with Auto-Targeting",
      category: "iot-robotics",
      categoryLabel: "IoT & Defense Tech",
      desc: "Unmanned Ground Vehicle (UGV) portabel terintegrasi IoT dengan sistem bidik sasaran otomatis.",
      longDesc: "ATP Biawak dirancang untuk operasi pengawasan dan pengamanan taktis di medan sulit. Menggunakan mikrokontroler berkemampuan tinggi dengan telemetri data real-time ke web dashboard pengendali.",
      award: "I2ASPO 2024 International Gold Medal",
      tech: ["ESP32", "IoT Telemetry", "Computer Vision", "Actuators", "Python"],
      github: "https://github.com/Dhafin-dev",
      demo: "#",
      featured: true
    },
    {
      id: "p-sisfo-unair",
      title: "Information Systems & Social Impact Web Portals",
      category: "web-software",
      categoryLabel: "Web & Systems",
      desc: "Pengembangan aplikasi web sistem informasi dan portal edukasi berkelanjutan (SDGs) berbasis arsitektur modern.",
      longDesc: "Sistem aplikasi web interaktif yang mengintegrasikan basis data terpusat, analitik pengguna real-time, dan antarmuka responsif ramah pengguna untuk organisasi dan riset sivitas akademika.",
      tech: ["HTML5", "CSS3", "JavaScript", "PHP", "Python", "Git"],
      github: "https://github.com/Dhafin-dev",
      demo: "https://dhafin-dev.github.io",
      featured: true
    },
    {
      id: "p-uiux-systems",
      title: "Sustainable Tech UI/UX Design System",
      category: "ui-ux",
      categoryLabel: "UI/UX & Product Design",
      desc: "Desain sistem antarmuka antarmuka visual modern berorientasi aksesibilitas tinggi dan efisiensi pengguna.",
      longDesc: "Rancangan antarmuka Figma untuk aplikasi pintar, sistem monitoring dashboard IoT, dan portal organisasi dengan pendekatan human-centered design (HCD).",
      tech: ["Figma", "Canva", "Wireframing", "Prototyping", "Design System"],
      github: "https://github.com/Dhafin-dev",
      demo: "#",
      featured: false
    }
  ]
};
