<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input') ?: '{}', true);
if (!is_array($input) || !verify_csrf($input['csrf'] ?? null)) {
    json_response(['ok' => false, 'error' => 'Invalid CSRF'], 403);
}

$current = (string) ($input['current'] ?? '');
$next = (string) ($input['next'] ?? '');
$user = trim((string) ($input['user'] ?? ''));

$config = load_config();
if (!password_verify($current, $config['admin_pass_hash'] ?? '')) {
    json_response(['ok' => false, 'error' => 'Senha atual incorreta'], 400);
}
if (strlen($next) < 8) {
    json_response(['ok' => false, 'error' => 'Nova senha: mínimo 8 caracteres'], 400);
}
if ($user !== '') {
    $config['admin_user'] = $user;
}
$config['admin_pass_hash'] = password_hash($next, PASSWORD_DEFAULT);
if (!save_json(CONFIG_FILE, $config)) {
    json_response(['ok' => false, 'error' => 'Não foi possível salvar'], 500);
}
json_response(['ok' => true]);
