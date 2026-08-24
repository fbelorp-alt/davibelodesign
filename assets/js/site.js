(() => {
  const content = window.DBD_CONTENT || {};
  let lang = localStorage.getItem("dbd_lang") || "pt";

  const get = (path) =>
    path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), content);

  const t = (path) => {
    const node = get(path);
    if (node && typeof node === "object" && (lang in node)) return node[lang];
    if (typeof node === "string") return node;
    return "";
  };

  function applyI18n() {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.documentElement.dataset.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const path = el.getAttribute("data-i18n");
      const value = t(path);
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-site]").forEach((el) => {
      const key = el.getAttribute("data-i18n-site");
      const value = content.site?.[key];
      if (value != null) el.textContent = value;
    });

    const switchBtn = document.getElementById("langSwitch");
    if (switchBtn) {
      switchBtn.innerHTML =
        lang === "pt"
          ? '<span class="lang-active">PT</span><span class="lang-sep">/</span><span>EN</span>'
          : '<span>PT</span><span class="lang-sep">/</span><span class="lang-active">EN</span>';
    }

    renderMarquee();
    renderProjects();
    renderServices();
    renderProcess();

    const mail = content.site?.email || "contato@davibelodesign.com.br";
    const cta = document.getElementById("ctaMail");
    if (cta) cta.href = `mailto:${mail}`;
  }

  function renderMarquee() {
    const track = document.getElementById("marqueeTrack");
    if (!track) return;
    const text = t("marquee") || "";
    const chunk = `<span><b>${text.split("—")[0] || "WEB DESIGN"}</b> — ${text.replace(/^[^—]*—\s*/, "")}</span>`;
    track.innerHTML = chunk + chunk + chunk + chunk;
  }

  function renderProjects() {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    const projects = content.projects || [];
    grid.innerHTML = projects
      .map((p, i) => {
        const copy = p[lang] || p.pt || {};
        const accent = p.accent || "a";
        const small = i % 4 === 1 || i % 4 === 2 ? " small" : "";
        const img = p.image
          ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(copy.title || "")}" />`
          : "";
        const bgStyle = p.image ? ` style="background-image:url('${escapeAttr(p.image)}')"` : "";
        return `
          <a class="project${small} reveal show" href="${escapeAttr(p.link || "#")}" ${p.link && p.link !== "#" ? 'target="_blank" rel="noopener"' : ""}>
            <div class="project-image">
              <div class="project-bg project-${accent}"${bgStyle}></div>
              <div class="project-overlay"></div>
              <div class="device">${img}</div>
            </div>
            <div class="arrow">↗</div>
            <div class="project-info">
              <div class="project-tag">${escapeHtml(copy.tag || "")}</div>
              <h3>${escapeHtml(copy.title || "")}</h3>
              <p>${escapeHtml(copy.desc || "")}</p>
            </div>
          </a>`;
      })
      .join("");
    bindProjectTilt();
    bindMagnetic();
    observeReveals();
  }

  function renderServices() {
    const list = document.getElementById("servicesList");
    if (!list) return;
    const services = content.services || [];
    list.innerHTML = services
      .map((s, i) => {
        const copy = s[lang] || s.pt || {};
        const num = String(i + 1).padStart(2, "0");
        return `
          <div class="service reveal show">
            <div class="service-number">${num}</div>
            <div class="service-name">${escapeHtml(copy.name || "")}</div>
            <div class="service-detail">${escapeHtml(copy.detail || "")}</div>
          </div>`;
      })
      .join("");
  }

  function renderProcess() {
    const grid = document.getElementById("processGrid");
    if (!grid) return;
    const steps = content.process || [];
    grid.innerHTML = steps
      .map((p) => {
        const copy = p[lang] || p.pt || {};
        return `
          <div class="process-card reveal show">
            <div class="num">${escapeHtml(p.num || "")}</div>
            <h3>${escapeHtml(copy.title || "")}</h3>
            <p>${escapeHtml(copy.text || "")}</p>
          </div>`;
      })
      .join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }
  function escapeAttr(str) {
    return escapeHtml(str).replaceAll("'", "&#39;");
  }

  /* Language */
  document.getElementById("langSwitch")?.addEventListener("click", () => {
    lang = lang === "pt" ? "en" : "pt";
    localStorage.setItem("dbd_lang", lang);
    applyI18n();
  });

  /* Preloader */
  window.addEventListener("load", () => {
    setTimeout(() => document.getElementById("loader")?.classList.add("hide"), 1800);
  });

  /* Cursor */
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  if (cursor && ring && window.matchMedia("(pointer:fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });
    const loop = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  function bindMagnetic() {
    document.querySelectorAll("a, .project, .service, .big-button, .lang-switch").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor?.classList.add("big");
        ring?.classList.add("big");
      });
      el.addEventListener("mouseleave", () => {
        cursor?.classList.remove("big");
        ring?.classList.remove("big");
      });
    });

    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  function bindProjectTilt() {
    document.querySelectorAll(".project").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const device = card.querySelector(".device");
        if (device) {
          device.style.transform = `translate(-50%,-50%) rotateX(${8 - y * 16}deg) rotateY(${-14 + x * 22}deg) scale(1.04)`;
        }
      });
      card.addEventListener("mouseleave", () => {
        const device = card.querySelector(".device");
        if (device) device.style.transform = "translate(-50%,-50%) rotateX(8deg) rotateY(-14deg)";
      });
    });
  }

  /* Reveal */
  let revealObserver;
  function observeReveals() {
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  }

  /* GSAP — light motion only (never hide text permanently) */
  if (window.gsap) {
    const titleSpans = document.querySelectorAll(".hero-title span");
    gsap.set(titleSpans, { opacity: 1, y: 0 });
    gsap.from(titleSpans, {
      y: 36,
      opacity: 0,
      stagger: 0.1,
      duration: 0.9,
      ease: "power3.out",
      delay: 1.9,
      onComplete: () => gsap.set(titleSpans, { clearProps: "transform,opacity" }),
    });
  }

  /* Three.js — interactive Earth globe (hero only) */
  function initThree() {
    const canvas = document.getElementById("webgl");
    const stage = document.querySelector(".hero-stage") || document.getElementById("hero");
    if (!canvas || !stage || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const dayMap = loader.load("/assets/img/earth/earth_day.jpg");
    const cloudsMap = loader.load("/assets/img/earth/earth_clouds.png");
    const normalMap = loader.load("/assets/img/earth/earth_normal.jpg");
    const specularMap = loader.load("/assets/img/earth/earth_specular.jpg");

    dayMap.colorSpace = THREE.SRGBColorSpace;
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
    normalMap.colorSpace = THREE.NoColorSpace;
    specularMap.colorSpace = THREE.NoColorSpace;
    [dayMap, cloudsMap, normalMap, specularMap].forEach((tex) => {
      tex.anisotropy = maxAniso;
    });

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 64, 64),
      new THREE.MeshPhongMaterial({
        map: dayMap,
        normalMap,
        normalScale: new THREE.Vector2(0.7, 0.7),
        specularMap,
        specular: new THREE.Color(0x222222),
        shininess: 12,
      })
    );
    globeGroup.add(earth);

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.575, 64, 64),
      new THREE.MeshPhongMaterial({
        map: cloudsMap,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      })
    );
    globeGroup.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.7, 64, 64),
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(0.3, 0.7, 1.0, 1.0) * intensity;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      })
    );
    globeGroup.add(atmosphere);

    const starCount = 700;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 28;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4;
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starsGeo,
      new THREE.PointsMaterial({ color: 0xb8d4ff, size: 0.016, transparent: true, opacity: 0.55 })
    );
    scene.add(stars);

    const sun = new THREE.DirectionalLight(0xffffff, 2.6);
    sun.position.set(5, 2.2, 4);
    const fill = new THREE.DirectionalLight(0x7eb6ff, 0.7);
    fill.position.set(-3, 0.5, 2);
    const ambient = new THREE.AmbientLight(0x3a4d6e, 0.85);
    scene.add(sun, fill, ambient);

    let targetRotY = 0.45;
    let targetRotX = 0.1;
    let currentRotY = 0.45;
    let currentRotX = 0.1;
    let lastPointerAt = 0;
    let visible = true;

    const onPointerMove = (e) => {
      if (!visible) return;
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      const y = (e.clientY - rect.top) / Math.max(rect.height, 1);
      targetRotY = (x - 0.5) * Math.PI * 1.2;
      targetRotX = (y - 0.5) * 0.65;
      lastPointerAt = performance.now();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      if (!visible) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const pointerActive = performance.now() - lastPointerAt < 140;

      if (!pointerActive) {
        targetRotY += dt * 0.1;
        targetRotX = THREE.MathUtils.lerp(targetRotX, Math.sin(t * 0.3) * 0.06, 0.02);
      }

      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotX = Math.max(-0.5, Math.min(0.5, currentRotX));

      earth.rotation.y = currentRotY;
      earth.rotation.x = currentRotX;
      clouds.rotation.y = currentRotY * 1.06 + t * 0.015;
      clouds.rotation.x = currentRotX;
      atmosphere.rotation.copy(earth.rotation);
      stars.rotation.y = t * 0.006;

      camera.lookAt(globeGroup.position);
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      const w = stage.clientWidth || window.innerWidth;
      const h = stage.clientHeight || window.innerHeight;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      const mobile = window.innerWidth < 900;
      globeGroup.scale.setScalar(mobile ? 0.8 : 1.0);
      globeGroup.position.set(mobile ? 0.35 : 2.15, mobile ? 0.2 : 0.05, 0);
      camera.position.z = mobile ? 5.8 : 5.9;
    };

    window.addEventListener("resize", resize);
    resize();

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = !!entry?.isIntersecting;
          stage.style.opacity = visible ? "1" : "0";
        },
        { threshold: 0.05 }
      );
      io.observe(document.getElementById("hero"));
    }
  }

  applyI18n();
  bindMagnetic();
  observeReveals();
  initThree();
})();
