<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';

$error = '';

if (is_logged_in()) {
    header('Location: /admin/dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = trim((string) ($_POST['user'] ?? ''));
    $pass = (string) ($_POST['pass'] ?? '');
    $config = load_config();

    if ($user === ($config['admin_user'] ?? '')
        && password_verify($pass, $config['admin_pass_hash'] ?? '')) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_user'] = $user;
        csrf_token();
        header('Location: /admin/dashboard.php');
        exit;
    }
    $error = 'Usuário ou senha inválidos.';
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin — DAVIBELODESIGN</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/css/admin.css" />
</head>
<body class="login-page">
  <div class="login-card">
    <div class="login-brand">DAVIBELO<span>DESIGN</span></div>
    <h1>Painel Admin</h1>
    <p class="login-sub">Edite textos, imagens, cards e seções do site.</p>
    <?php if ($error): ?>
      <div class="alert"><?= e($error) ?></div>
    <?php endif; ?>
    <form method="post" class="login-form">
      <label>Usuário
        <input type="text" name="user" autocomplete="username" required />
      </label>
      <label>Senha
        <input type="password" name="pass" autocomplete="current-password" required />
      </label>
      <button type="submit" class="btn-primary">Entrar</button>
    </form>
  </div>
</body>
</html>
