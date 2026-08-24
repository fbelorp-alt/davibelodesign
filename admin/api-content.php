<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $content = load_content();
    json_response(['ok' => true, 'content' => $content]);
}

if ($method === 'POST') {
    require_login();
    $input = json_decode(file_get_contents('php://input') ?: '{}', true);
    if (!is_array($input)) {
        json_response(['ok' => false, 'error' => 'Invalid JSON'], 400);
    }
    if (!verify_csrf($input['csrf'] ?? null)) {
        json_response(['ok' => false, 'error' => 'Invalid CSRF'], 403);
    }
    $content = $input['content'] ?? null;
    if (!is_array($content)) {
        json_response(['ok' => false, 'error' => 'Missing content'], 400);
    }
    if (!save_json(CONTENT_FILE, $content)) {
        json_response(['ok' => false, 'error' => 'Could not save'], 500);
    }
    json_response(['ok' => true]);
}

json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
