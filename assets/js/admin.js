(() => {
  const state = {
    content: structuredClone(window.DBD_ADMIN.content),
    lang: "pt",
    section: "overview",
  };

  const titles = {
    overview: "Visão geral",
    site: "Cabeçalho / Site",
    hero: "Hero",
    manifesto: "Manifesto",
    projects: "Projetos / Cards",
    services: "Serviços",
    process: "Processo",
    cta: "CTA / Contato",
    security: "Senha",
  };

  const toastEl = document.getElementById("toast");
  const toast = (msg, isError = false) => {
    toastEl.textContent = msg;
    toastEl.classList.toggle("error", isError);
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), 2600);
  };

  const uid = (prefix) => `${prefix}_${Date.now().toString(36)}`;

  const field = (label, path, multiline = false) => {
    const id = path.replace(/\./g, "_");
    const tag = multiline ? "textarea" : "input";
    const rows = multiline ? ' rows="3"' : "";
    return `<div class="field"><label>${label}</label><${tag} data-path="${path}" id="${id}"${rows}></${tag}></div>`;
  };

  const getPath = (obj, path) =>
    path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

  const setPath = (obj, path, value) => {
    const parts = path.split(".");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  };

  const bindFields = (root) => {
    root.querySelectorAll("[data-path]").forEach((el) => {
      const path = el.getAttribute("data-path");
      const val = getPath(state.content, path);
      el.value = val == null ? "" : String(val);
      el.addEventListener("input", () => setPath(state.content, path, el.value));
    });
  };

  const langTabs = (targetId) => `
    <div class="lang-tabs" data-lang-for="${targetId}">
      <button type="button" class="active" data-lang="pt">Português</button>
      <button type="button" data-lang="en">English</button>
    </div>`;

  const renderSite = () => {
    const el = document.getElementById("sec-site");
    el.innerHTML = `
      <div class="panel">
        <h2>Identidade</h2>
        <p class="hint">Logo, e-mail e redes. O cabeçalho do site usa estes dados.</p>
        <div class="grid-2">
          ${field("Logo (parte 1)", "site.logo")}
          ${field("Logo destaque", "site.logoAccent")}
          ${field("E-mail", "site.email")}
          ${field("WhatsApp (opcional)", "site.whatsapp")}
          ${field("Instagram URL", "site.social.instagram")}
          ${field("Behance URL", "site.social.behance")}
          ${field("LinkedIn URL", "site.social.linkedin")}
        </div>
      </div>
      <div class="panel">
        <h2>Menu de navegação</h2>
        ${langTabs("nav")}
        <div data-lang-panel="nav-pt" class="grid-2">
          ${field("Projetos", "nav.pt.projects")}
          ${field("Serviços", "nav.pt.services")}
          ${field("Processo", "nav.pt.process")}
          ${field("CTA", "nav.pt.cta")}
        </div>
        <div data-lang-panel="nav-en" class="grid-2 hidden">
          ${field("Projects", "nav.en.projects")}
          ${field("Services", "nav.en.services")}
          ${field("Process", "nav.en.process")}
          ${field("CTA", "nav.en.cta")}
        </div>
      </div>
      <div class="panel">
        <h2>Rodapé</h2>
        ${langTabs("footer")}
        <div data-lang-panel="footer-pt" class="grid-2">
          ${field("Marca", "footer.pt.brand")}
          ${field("Tags", "footer.pt.tags")}
          ${field("Ano", "footer.pt.year")}
        </div>
        <div data-lang-panel="footer-en" class="grid-2 hidden">
          ${field("Brand", "footer.en.brand")}
          ${field("Tags", "footer.en.tags")}
          ${field("Year", "footer.en.year")}
        </div>
      </div>`;
    bindFields(el);
    bindLangTabs(el);
  };

  const renderHero = () => {
    const el = document.getElementById("sec-hero");
    el.innerHTML = `
      <div class="panel">
        <h2>Hero / Cabeçalho visual</h2>
        <p class="hint">Títulos, textos e botões da primeira dobra — em PT e EN.</p>
        ${langTabs("hero")}
        <div data-lang-panel="hero-pt">
          <div class="grid-2">
            ${field("Eyebrow", "hero.pt.eyebrow")}
            ${field("Linha 1", "hero.pt.line1")}
            ${field("Linha 2 (stroke)", "hero.pt.line2")}
            ${field("Linha 3 (gradiente)", "hero.pt.line3")}
            ${field("Texto", "hero.pt.text", true)}
            ${field("Botão principal", "hero.pt.ctaPrimary")}
            ${field("Botão secundário", "hero.pt.ctaSecondary")}
            ${field("Label 1", "hero.pt.label1")}
            ${field("Label 2", "hero.pt.label2")}
            ${field("Scroll", "hero.pt.scroll")}
          </div>
        </div>
        <div data-lang-panel="hero-en" class="hidden">
          <div class="grid-2">
            ${field("Eyebrow", "hero.en.eyebrow")}
            ${field("Line 1", "hero.en.line1")}
            ${field("Line 2 (stroke)", "hero.en.line2")}
            ${field("Line 3 (gradient)", "hero.en.line3")}
            ${field("Text", "hero.en.text", true)}
            ${field("Primary CTA", "hero.en.ctaPrimary")}
            ${field("Secondary CTA", "hero.en.ctaSecondary")}
            ${field("Label 1", "hero.en.label1")}
            ${field("Label 2", "hero.en.label2")}
            ${field("Scroll", "hero.en.scroll")}
          </div>
        </div>
      </div>
      <div class="panel">
        <h2>Faixa marquee</h2>
        ${field("Texto PT", "marquee.pt")}
        ${field("Texto EN", "marquee.en")}
      </div>`;
    bindFields(el);
    bindLangTabs(el);
  };

  const renderManifesto = () => {
    const el = document.getElementById("sec-manifesto");
    el.innerHTML = `
      <div class="panel">
        <h2>Manifesto</h2>
        ${langTabs("manifesto")}
        <div data-lang-panel="manifesto-pt" class="grid-2">
          ${field("Label", "manifesto.pt.label")}
          ${field("Texto 1", "manifesto.pt.text")}
          ${field("Muted 1", "manifesto.pt.muted1")}
          ${field("Texto 2", "manifesto.pt.text2")}
          ${field("Muted 2", "manifesto.pt.muted2")}
        </div>
        <div data-lang-panel="manifesto-en" class="grid-2 hidden">
          ${field("Label", "manifesto.en.label")}
          ${field("Text 1", "manifesto.en.text")}
          ${field("Muted 1", "manifesto.en.muted1")}
          ${field("Text 2", "manifesto.en.text2")}
          ${field("Muted 2", "manifesto.en.muted2")}
        </div>
      </div>
      <div class="panel">
        <h2>Seção objetivo</h2>
        ${langTabs("goal")}
        <div data-lang-panel="goal-pt" class="grid-2">
          ${field("Label", "goal.pt.label")}
          ${field("Título", "goal.pt.title")}
          ${field("Stroke", "goal.pt.stroke")}
          ${field("Texto", "goal.pt.text", true)}
        </div>
        <div data-lang-panel="goal-en" class="grid-2 hidden">
          ${field("Label", "goal.en.label")}
          ${field("Title", "goal.en.title")}
          ${field("Stroke", "goal.en.stroke")}
          ${field("Text", "goal.en.text", true)}
        </div>
      </div>`;
    bindFields(el);
    bindLangTabs(el);
  };

  const projectCard = (p, index) => `
    <div class="item-card" data-id="${p.id}">
      <div class="item-card-head">
        <strong>Projeto ${index + 1}</strong>
        <button type="button" class="btn-danger btn-remove-project" data-id="${p.id}">Remover</button>
      </div>
      ${p.image ? `<img class="thumb" src="${p.image}" alt="" />` : `<div class="thumb"></div>`}
      <div class="upload-row">
        <input type="file" accept="image/*" data-upload-project="${p.id}" />
        <button type="button" class="btn-ghost btn-clear-image" data-id="${p.id}">Limpar imagem</button>
      </div>
      <div class="grid-2">
        ${field("Accent (a/b/c)", `projects.${index}.accent`)}
        ${field("Link", `projects.${index}.link`)}
      </div>
      ${langTabs(`project-${p.id}`)}
      <div data-lang-panel="project-${p.id}-pt" class="grid-2">
        ${field("Tag PT", `projects.${index}.pt.tag`)}
        ${field("Título PT", `projects.${index}.pt.title`)}
        ${field("Descrição PT", `projects.${index}.pt.desc`)}
      </div>
      <div data-lang-panel="project-${p.id}-en" class="grid-2 hidden">
        ${field("Tag EN", `projects.${index}.en.tag`)}
        ${field("Title EN", `projects.${index}.en.title`)}
        ${field("Description EN", `projects.${index}.en.desc`)}
      </div>
    </div>`;

  const renderProjects = () => {
    const el = document.getElementById("sec-projects");
    const list = state.content.projects || [];
    el.innerHTML = `
      <div class="panel">
        <h2>Títulos da seção</h2>
        ${langTabs("projectsSection")}
        <div data-lang-panel="projectsSection-pt" class="grid-2">
          ${field("Label", "projectsSection.pt.label")}
          ${field("Título", "projectsSection.pt.title")}
          ${field("Contagem", "projectsSection.pt.count")}
        </div>
        <div data-lang-panel="projectsSection-en" class="grid-2 hidden">
          ${field("Label", "projectsSection.en.label")}
          ${field("Title", "projectsSection.en.title")}
          ${field("Count", "projectsSection.en.count")}
        </div>
      </div>
      <div class="panel">
        <div class="item-card-head">
          <h2 style="margin:0">Cards de projetos</h2>
          <button type="button" class="btn-primary" id="btnAddProject">+ Novo projeto</button>
        </div>
        <p class="hint">Envie imagens 16:10 para o efeito 3D dos cards. JPG/PNG/WEBP até 8MB.</p>
        <div class="card-list">${list.map(projectCard).join("")}</div>
      </div>`;
    bindFields(el);
    bindLangTabs(el);

    el.querySelector("#btnAddProject")?.addEventListener("click", () => {
      state.content.projects.push({
        id: uid("p"),
        image: "",
        accent: "a",
        link: "#",
        pt: { tag: "Novo / Projeto", title: "Novo projeto", desc: "Descrição" },
        en: { tag: "New / Project", title: "New project", desc: "Description" },
      });
      renderProjects();
      updateStats();
    });

    el.querySelectorAll(".btn-remove-project").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.content.projects = state.content.projects.filter((p) => p.id !== btn.dataset.id);
        renderProjects();
        updateStats();
      });
    });

    el.querySelectorAll(".btn-clear-image").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = state.content.projects.find((x) => x.id === btn.dataset.id);
        if (p) p.image = "";
        renderProjects();
      });
    });

    el.querySelectorAll("[data-upload-project]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;
        const url = await uploadFile(file);
        if (!url) return;
        const p = state.content.projects.find((x) => x.id === input.dataset.uploadProject);
        if (p) p.image = url;
        renderProjects();
        toast("Imagem enviada");
      });
    });
  };

  const renderServices = () => {
    const el = document.getElementById("sec-services");
    const list = state.content.services || [];
    el.innerHTML = `
      <div class="panel">
        <h2>Títulos</h2>
        ${langTabs("servicesSection")}
        <div data-lang-panel="servicesSection-pt" class="grid-2">
          ${field("Label", "servicesSection.pt.label")}
          ${field("Título", "servicesSection.pt.title")}
        </div>
        <div data-lang-panel="servicesSection-en" class="grid-2 hidden">
          ${field("Label", "servicesSection.en.label")}
          ${field("Title", "servicesSection.en.title")}
        </div>
      </div>
      <div class="panel">
        <div class="item-card-head">
          <h2 style="margin:0">Lista de serviços</h2>
          <button type="button" class="btn-primary" id="btnAddService">+ Serviço</button>
        </div>
        <div class="card-list">
          ${list
            .map(
              (s, i) => `
            <div class="item-card">
              <div class="item-card-head">
                <strong>Serviço ${i + 1}</strong>
                <button type="button" class="btn-danger btn-remove-service" data-id="${s.id}">Remover</button>
              </div>
              ${langTabs(`service-${s.id}`)}
              <div data-lang-panel="service-${s.id}-pt" class="grid-2">
                ${field("Nome PT", `services.${i}.pt.name`)}
                ${field("Detalhe PT", `services.${i}.pt.detail`)}
              </div>
              <div data-lang-panel="service-${s.id}-en" class="grid-2 hidden">
                ${field("Name EN", `services.${i}.en.name`)}
                ${field("Detail EN", `services.${i}.en.detail`)}
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>`;
    bindFields(el);
    bindLangTabs(el);
    el.querySelector("#btnAddService")?.addEventListener("click", () => {
      state.content.services.push({
        id: uid("s"),
        pt: { name: "Novo serviço", detail: "Detalhe" },
        en: { name: "New service", detail: "Detail" },
      });
      renderServices();
      updateStats();
    });
    el.querySelectorAll(".btn-remove-service").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.content.services = state.content.services.filter((s) => s.id !== btn.dataset.id);
        renderServices();
        updateStats();
      });
    });
  };

  const renderProcess = () => {
    const el = document.getElementById("sec-process");
    const list = state.content.process || [];
    el.innerHTML = `
      <div class="panel">
        <h2>Títulos</h2>
        ${langTabs("processSection")}
        <div data-lang-panel="processSection-pt" class="grid-2">
          ${field("Label", "processSection.pt.label")}
          ${field("Título", "processSection.pt.title")}
          ${field("Destaque", "processSection.pt.titleAccent")}
        </div>
        <div data-lang-panel="processSection-en" class="grid-2 hidden">
          ${field("Label", "processSection.en.label")}
          ${field("Title", "processSection.en.title")}
          ${field("Accent", "processSection.en.titleAccent")}
        </div>
      </div>
      <div class="panel">
        <div class="item-card-head">
          <h2 style="margin:0">Etapas</h2>
          <button type="button" class="btn-primary" id="btnAddProcess">+ Etapa</button>
        </div>
        <div class="card-list">
          ${list
            .map(
              (p, i) => `
            <div class="item-card">
              <div class="item-card-head">
                <strong>Etapa ${i + 1}</strong>
                <button type="button" class="btn-danger btn-remove-process" data-id="${p.id}">Remover</button>
              </div>
              ${field("Número / label", `process.${i}.num`)}
              ${langTabs(`process-${p.id}`)}
              <div data-lang-panel="process-${p.id}-pt" class="grid-2">
                ${field("Título PT", `process.${i}.pt.title`)}
                ${field("Texto PT", `process.${i}.pt.text`, true)}
              </div>
              <div data-lang-panel="process-${p.id}-en" class="grid-2 hidden">
                ${field("Title EN", `process.${i}.en.title`)}
                ${field("Text EN", `process.${i}.en.text`, true)}
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>`;
    bindFields(el);
    bindLangTabs(el);
    el.querySelector("#btnAddProcess")?.addEventListener("click", () => {
      state.content.process.push({
        id: uid("pr"),
        num: "0X / STEP",
        pt: { title: "Nova etapa", text: "Descrição" },
        en: { title: "New step", text: "Description" },
      });
      renderProcess();
      updateStats();
    });
    el.querySelectorAll(".btn-remove-process").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.content.process = state.content.process.filter((p) => p.id !== btn.dataset.id);
        renderProcess();
        updateStats();
      });
    });
  };

  const renderCta = () => {
    const el = document.getElementById("sec-cta");
    el.innerHTML = `
      <div class="panel">
        <h2>Chamada final / Contato</h2>
        ${langTabs("cta")}
        <div data-lang-panel="cta-pt" class="grid-2">
          ${field("Label", "cta.pt.label")}
          ${field("Linha 1", "cta.pt.line1")}
          ${field("Linha 2", "cta.pt.line2")}
          ${field("Linha 3", "cta.pt.line3")}
          ${field("Texto", "cta.pt.text", true)}
          ${field("Botão", "cta.pt.button")}
        </div>
        <div data-lang-panel="cta-en" class="grid-2 hidden">
          ${field("Label", "cta.en.label")}
          ${field("Line 1", "cta.en.line1")}
          ${field("Line 2", "cta.en.line2")}
          ${field("Line 3", "cta.en.line3")}
          ${field("Text", "cta.en.text", true)}
          ${field("Button", "cta.en.button")}
        </div>
      </div>`;
    bindFields(el);
    bindLangTabs(el);
  };

  const bindLangTabs = (root) => {
    root.querySelectorAll(".lang-tabs").forEach((tabs) => {
      tabs.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          const lang = btn.dataset.lang;
          const key = tabs.dataset.langFor;
          tabs.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
          root.querySelectorAll(`[data-lang-panel^="${key}-"]`).forEach((panel) => {
            panel.classList.toggle("hidden", !panel.getAttribute("data-lang-panel").endsWith(`-${lang}`));
          });
        });
      });
    });
  };

  const updateStats = () => {
    document.getElementById("statProjects").textContent = String(state.content.projects?.length || 0);
    document.getElementById("statServices").textContent = String(state.content.services?.length || 0);
    document.getElementById("statProcess").textContent = String(state.content.process?.length || 0);
  };

  const showSection = (name) => {
    state.section = name;
    document.querySelectorAll(".sec").forEach((s) => s.classList.add("hidden"));
    document.getElementById(`sec-${name}`)?.classList.remove("hidden");
    document.getElementById("sectionTitle").textContent = titles[name] || name;
    document.querySelectorAll(".nav-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.section === name);
    });
  };

  async function uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("csrf", window.DBD_ADMIN.csrf);
    try {
      const res = await fetch("/admin/api-upload.php", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) {
        toast(data.error || "Falha no upload", true);
        return null;
      }
      return data.url;
    } catch {
      toast("Erro de upload", true);
      return null;
    }
  }

  async function saveContent() {
    try {
      const res = await fetch("/admin/api-content.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
        body: JSON.stringify({ csrf: window.DBD_ADMIN.csrf, content: state.content }),
      });
      const data = await res.json();
      if (!data.ok) {
        toast(data.error || "Erro ao salvar", true);
        return;
      }
      toast("Salvo com sucesso");
    } catch {
      toast("Erro ao salvar", true);
    }
  }

  async function reloadContent() {
    const res = await fetch("/admin/api-content.php");
    const data = await res.json();
    if (!data.ok) return toast("Falha ao recarregar", true);
    state.content = data.content;
    renderAll();
    toast("Conteúdo recarregado");
  }

  function renderAll() {
    renderSite();
    renderHero();
    renderManifesto();
    renderProjects();
    renderServices();
    renderProcess();
    renderCta();
    updateStats();
    document.getElementById("secUser").value = "admin";
  }

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => showSection(btn.dataset.section));
  });
  document.getElementById("btnSave").addEventListener("click", saveContent);
  document.getElementById("btnReload").addEventListener("click", reloadContent);
  document.getElementById("btnPassword").addEventListener("click", async () => {
    const payload = {
      csrf: window.DBD_ADMIN.csrf,
      user: document.getElementById("secUser").value.trim(),
      current: document.getElementById("secCurrent").value,
      next: document.getElementById("secNext").value,
    };
    const res = await fetch("/admin/api-password.php", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.ok) return toast(data.error || "Erro", true);
    toast("Senha atualizada");
    document.getElementById("secCurrent").value = "";
    document.getElementById("secNext").value = "";
  });

  renderAll();
  showSection("overview");
})();
