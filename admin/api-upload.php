<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

if (!verify_csrf($_POST['csrf'] ?? null)) {
    json_response(['ok' => false, 'error' => 'Invalid CSRF'], 403);
}

if (empty($_FILES['file'])) {
    json_response(['ok' => false, 'error' => 'No file'], 400);
}

$file = $_FILES['file'];
if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    json_response(['ok' => false, 'error' => 'Upload failed'], 400);
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']) ?: '';
$allowed = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];

if (!isset($allowed[$mime])) {
    json_response(['ok' => false, 'error' => 'Only JPG, PNG, WEBP, GIF'], 400);
}

if (($file['size'] ?? 0) > 8 * 1024 * 1024) {
    json_response(['ok' => false, 'error' => 'Max 8MB'], 400);
}

if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

$name = 'img_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $allowed[$mime];
$dest = UPLOAD_DIR . '/' . $name;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    json_response(['ok' => false, 'error' => 'Could not move file'], 500);
}

json_response(['ok' => true, 'url' => '/uploads/' . $name]);
