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

  /* GSAP */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".hero-title span", {
      y: 80,
      opacity: 0,
      stagger: 0.12,
      duration: 1.1,
      ease: "power3.out",
      delay: 1.7,
    });
    gsap.to(".orb-a", {
      scrollTrigger: { scrub: true },
      y: 180,
      x: -80,
    });
    gsap.to(".orb-b", {
      scrollTrigger: { scrub: true },
      y: -120,
      x: 60,
    });
  }

  /* Three.js scene */
  function initThree() {
    const canvas = document.getElementById("webgl");
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const object = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.65, 3),
      new THREE.MeshPhysicalMaterial({
        color: 0x164cff,
        metalness: 0.85,
        roughness: 0.14,
        transmission: 0.18,
        transparent: true,
        opacity: 0.9,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      })
    );
    scene.add(object);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.82, 2),
      new THREE.MeshBasicMaterial({
        color: 0x4d8dff,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      })
    );
    scene.add(wire);

    const ringGeo = new THREE.TorusGeometry(2.35, 0.015, 16, 180);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x66a0ff, transparent: true, opacity: 0.35 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ring2.rotation.x = Math.PI / 2.4;
    scene.add(ring1, ring2);

    const particleCount = 1100;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0x5b91ff, size: 0.016, transparent: true, opacity: 0.7 })
    );
    scene.add(particles);

    const light1 = new THREE.PointLight(0x377dff, 28, 16);
    light1.position.set(4, 3, 5);
    const light2 = new THREE.PointLight(0x00d9ff, 20, 14);
    light2.position.set(-4, -2, 3);
    scene.add(light1, light2, new THREE.AmbientLight(0x304060, 1));

    let targetX = 0, targetY = 0;
    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    });

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      object.rotation.x = t * 0.16;
      object.rotation.y = t * 0.24;
      wire.rotation.x = -t * 0.08;
      wire.rotation.y = -t * 0.14;
      ring1.rotation.z = t * 0.2;
      ring2.rotation.y = -t * 0.15;
      particles.rotation.y = t * 0.01;
      object.position.x += (targetX * 1.15 - object.position.x) * 0.025;
      object.position.y += (-targetY * 0.85 - object.position.y) * 0.025;
      wire.position.copy(object.position);
      ring1.position.copy(object.position);
      ring2.position.copy(object.position);
      camera.position.x += (targetX * 0.28 - camera.position.x) * 0.02;
      camera.position.y += (-targetY * 0.2 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      const scale = window.innerWidth < 700 ? 0.7 : 1;
      object.scale.setScalar(scale);
      wire.scale.setScalar(scale);
      ring1.scale.setScalar(scale);
      ring2.scale.setScalar(scale);
    };
    window.addEventListener("resize", onResize);
    onResize();
  }

  applyI18n();
  bindMagnetic();
  observeReveals();
  initThree();
})();
