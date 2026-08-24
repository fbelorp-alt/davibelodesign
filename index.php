<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/bootstrap.php';
$content = load_content();
$site = $content['site'] ?? [];
?>
<!DOCTYPE html>
<html lang="pt-BR" data-lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= e(($site['logo'] ?? 'DAVIBELO') . ($site['logoAccent'] ?? 'DESIGN')) ?> — Digital Experiences</title>
  <meta name="description" content="Estúdio criativo digital: websites, 3D, motion e branding." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/css/site.css" />
  <script>
    window.DBD_CONTENT = <?= json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
  </script>
</head>
<body>
  <div class="loader" id="loader">
    <div class="loader-inner">
      <div class="loader-logo"><span data-i18n-site="logo">DAVIBELO</span><span class="accent" data-i18n-site="logoAccent">DESIGN</span></div>
      <div class="loader-line"><div class="loader-progress"></div></div>
    </div>
  </div>

  <div class="noise"></div>
  <div class="grid-bg"></div>

  <div class="cursor" id="cursor"></div>
  <div class="cursor-ring" id="cursorRing"></div>

  <nav class="nav">
    <div class="logo">
      <span data-i18n-site="logo">DAVIBELO</span><span class="accent" data-i18n-site="logoAccent">DESIGN</span>
    </div>
    <div class="nav-links">
      <a href="#projetos" data-i18n="nav.projects">Projetos</a>
      <a href="#servicos" data-i18n="nav.services">Serviços</a>
      <a href="#processo" data-i18n="nav.process">Processo</a>
      <a href="#contato" class="nav-cta" data-i18n="nav.cta">Vamos criar</a>
      <button type="button" class="lang-switch" id="langSwitch" aria-label="Language">
        <span class="lang-active">PT</span><span class="lang-sep">/</span><span>EN</span>
      </button>
    </div>
  </nav>

  <section class="hero" id="hero">
    <div class="hero-stage" aria-hidden="true">
      <canvas id="webgl"></canvas>
      <div class="orb orb-a"></div>
      <div class="orb orb-b"></div>
    </div>
    <div class="hero-copy">
      <div class="eyebrow" data-i18n="hero.eyebrow">Estúdio Criativo Digital</div>
      <h1 class="hero-title">
        <span data-i18n="hero.line1">MAKE</span><br />
        <span class="stroke" data-i18n="hero.line2">THE</span><br />
        <span class="gradient" data-i18n="hero.line3">UNREAL.</span>
      </h1>
      <div class="hero-bottom">
        <p class="hero-text" data-i18n="hero.text"></p>
        <div class="hero-actions">
          <a href="#projetos" class="btn primary magnetic" data-i18n="hero.ctaPrimary">Ver projetos</a>
          <a href="#contato" class="btn magnetic" data-i18n="hero.ctaSecondary">Criar projeto</a>
        </div>
      </div>
    </div>
    <div class="scroll-indicator" data-i18n="hero.scroll">Role para explorar</div>
  </section>

  <div class="marquee">
    <div class="marquee-track" id="marqueeTrack"></div>
  </div>

  <section class="manifesto reveal">
    <div class="manifesto-content">
      <div class="small-title" data-i18n="manifesto.label"></div>
      <h2>
        <span data-i18n="manifesto.text"></span>
        <span class="muted" data-i18n="manifesto.muted1"></span>
        <span data-i18n="manifesto.text2"></span>
        <span class="muted" data-i18n="manifesto.muted2"></span>
      </h2>
    </div>
  </section>

  <section class="showcase" id="projetos">
    <div class="section-head reveal">
      <div>
        <div class="small-title" data-i18n="projectsSection.label"></div>
        <h2 class="section-title" data-i18n="projectsSection.title"></h2>
      </div>
      <div class="section-number" data-i18n="projectsSection.count"></div>
    </div>
    <div class="projects" id="projectsGrid"></div>
  </section>

  <section class="services" id="servicos">
    <div class="small-title" data-i18n="servicesSection.label"></div>
    <h2 class="section-title" data-i18n="servicesSection.title"></h2>
    <div class="service-list" id="servicesList"></div>
  </section>

  <section class="experience reveal">
    <div class="experience-content">
      <div class="small-title" data-i18n="goal.label"></div>
      <h2>
        <span data-i18n="goal.title"></span><br />
        <span class="stroke" data-i18n="goal.stroke"></span>
      </h2>
      <p data-i18n="goal.text"></p>
    </div>
  </section>

  <section class="process" id="processo">
    <div class="small-title" data-i18n="processSection.label"></div>
    <h2 class="section-title">
      <span data-i18n="processSection.title"></span><br />
      <span class="accent-text" data-i18n="processSection.titleAccent"></span>
    </h2>
    <div class="process-grid" id="processGrid"></div>
  </section>

  <section class="cta" id="contato">
    <div class="cta-label" data-i18n="cta.label"></div>
    <h2>
      <span data-i18n="cta.line1"></span><br />
      <span class="muted" data-i18n="cta.line2"></span><br />
      <span data-i18n="cta.line3"></span>
    </h2>
    <div class="cta-bottom">
      <p class="cta-description" data-i18n="cta.text"></p>
      <a id="ctaMail" href="#" class="big-button magnetic"><span data-i18n="cta.button"></span></a>
    </div>
  </section>

  <footer>
    <div data-i18n="footer.brand"></div>
    <div data-i18n="footer.tags"></div>
    <div data-i18n="footer.year"></div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="/assets/js/site.js"></script>
</body>
</html>
