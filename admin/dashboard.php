<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';
require_login();
$csrf = csrf_token();
$content = load_content();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboard — DAVIBELODESIGN</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/css/admin.css" />
</head>
<body>
  <div class="admin-shell">
    <aside class="sidebar">
      <div class="brand">DAVIBELO<span>DESIGN</span></div>
      <button class="nav-btn active" data-section="overview">Visão geral</button>
      <button class="nav-btn" data-section="site">Cabeçalho / Site</button>
      <button class="nav-btn" data-section="hero">Hero</button>
      <button class="nav-btn" data-section="manifesto">Manifesto</button>
      <button class="nav-btn" data-section="projects">Projetos / Cards</button>
      <button class="nav-btn" data-section="services">Serviços</button>
      <button class="nav-btn" data-section="process">Processo</button>
      <button class="nav-btn" data-section="cta">CTA / Contato</button>
      <button class="nav-btn" data-section="security">Senha</button>
      <div class="sidebar-foot">
        <a class="btn-ghost" href="/" target="_blank" rel="noopener">Ver site ↗</a>
        <a class="btn-danger" href="/admin/logout.php">Sair</a>
      </div>
    </aside>

    <main class="main">
      <div class="topbar">
        <h1 id="sectionTitle">Visão geral</h1>
        <div class="topbar-actions">
          <button type="button" class="btn-ghost" id="btnReload">Recarregar</button>
          <button type="button" class="btn-primary" id="btnSave">Salvar alterações</button>
        </div>
      </div>

      <section id="sec-overview" class="sec">
        <div class="stats">
          <div class="stat"><b id="statProjects">0</b><span>Projetos</span></div>
          <div class="stat"><b id="statServices">0</b><span>Serviços</span></div>
          <div class="stat"><b id="statProcess">0</b><span>Etapas</span></div>
          <div class="stat"><b>PT/EN</b><span>Idiomas ativos</span></div>
        </div>
        <div class="panel">
          <h2>Bem-vindo ao painel</h2>
          <p class="hint">Edite qualquer seção pelo menu. Tudo tem versão em Português e Inglês. Imagens dos cards podem ser enviadas aqui e aparecem no site automaticamente.</p>
          <p class="hint">Dica: salve sempre após editar. Depois abra o site e use o botão PT / EN no canto superior.</p>
        </div>
      </section>

      <section id="sec-site" class="sec hidden"></section>
      <section id="sec-hero" class="sec hidden"></section>
      <section id="sec-manifesto" class="sec hidden"></section>
      <section id="sec-projects" class="sec hidden"></section>
      <section id="sec-services" class="sec hidden"></section>
      <section id="sec-process" class="sec hidden"></section>
      <section id="sec-cta" class="sec hidden"></section>

      <section id="sec-security" class="sec hidden">
        <div class="panel">
          <h2>Alterar senha do admin</h2>
          <p class="hint">Use uma senha forte. Você será desconectado após trocar se mudar o usuário.</p>
          <div class="grid-2">
            <div class="field"><label>Usuário</label><input id="secUser" type="text" /></div>
            <div class="field"><label>Senha atual</label><input id="secCurrent" type="password" /></div>
            <div class="field"><label>Nova senha</label><input id="secNext" type="password" /></div>
          </div>
          <button type="button" class="btn-primary" id="btnPassword">Atualizar senha</button>
        </div>
      </section>
    </main>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    window.DBD_ADMIN = {
      csrf: <?= json_encode($csrf) ?>,
      content: <?= json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>
    };
  </script>
  <script src="/assets/js/admin.js"></script>
</body>
</html>
