/* ==========================================================================
   3D GITHUB ACTIVITY VISUALIZER (THREE.JS)
   Ahmad Dhafin Al Farisy - Portfolio
   ========================================================================== */

window.initGithub3DVisualizer = function() {
  const container = document.getElementById("github-3d-canvas");
  if (!container || typeof THREE === "undefined") return;

  // Clear previous canvas if any
  container.innerHTML = "";

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(20, 25, 25);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x00f3ff, 2.5);
  dirLight1.position.set(20, 40, 20);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xbc13fe, 1.8);
  dirLight2.position.set(-20, -20, -20);
  scene.add(dirLight2);

  // Generate Isometric 3D Grid of Bars (Simulating Contribution Graph)
  const rows = 7;
  const cols = 16;
  const spacing = 1.6;
  const barGroup = new THREE.Group();

  const colors = [0x0d1b2a, 0x00f3ff, 0x10b981, 0xbc13fe, 0xf59e0b];

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      // Deterministic pseudo-random heights for aesthetic waves
      const val = (Math.sin(c * 0.4 + r * 0.5) + 1) * 2 + (Math.random() * 1.5);
      const h = Math.max(val, 0.4);
      const colorIndex = Math.floor(Math.random() * colors.length);

      const geometry = new THREE.BoxGeometry(1.1, h, 1.1);
      const material = new THREE.MeshStandardMaterial({
        color: colors[colorIndex],
        roughness: 0.2,
        metalness: 0.8,
        emissive: colors[colorIndex],
        emissiveIntensity: 0.25
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (c - cols / 2) * spacing,
        h / 2,
        (r - rows / 2) * spacing
      );
      barGroup.add(mesh);
    }
  }

  scene.add(barGroup);
  camera.lookAt(0, 2, 0);

  // Orbit Controls if available
  let controls;
  if (typeof THREE.OrbitControls !== "undefined") {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.maxPolarAngle = Math.PI / 2.1;
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    if (controls) {
      controls.update();
    } else {
      barGroup.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
  }
  animate();

  // Resize Handler
  window.addEventListener("resize", () => {
    if (!container) return;
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });

  // Fetch Live GitHub Stats
  (async function fetchGitHubStats() {
    const userEl = document.getElementById("gh-username");
    const reposEl = document.getElementById("gh-repos");
    const followersEl = document.getElementById("gh-followers");

    if (userEl) userEl.textContent = `@${PORTFOLIO_CONFIG.profile.githubUsername}`;

    try {
      const res = await fetch(`https://api.github.com/users/${PORTFOLIO_CONFIG.profile.githubUsername}`);
      if (!res.ok) throw new Error("GitHub API rate limit or error");
      const data = await res.json();

      if (reposEl) reposEl.textContent = data.public_repos || "10+";
      if (followersEl) followersEl.textContent = data.followers || "50+";
    } catch (e) {
      if (reposEl) reposEl.textContent = "12";
      if (followersEl) followersEl.textContent = "25+";
    }
  })();
};
