<?php
// Router script for PHP built-in server

$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);
$filePath = __DIR__ . $requestPath;

// If requesting a directory, look for index.html or index.php
if (is_dir($filePath)) {
    if (file_exists($filePath . '/index.html')) {
        $filePath = $filePath . '/index.html';
    } elseif (file_exists($filePath . '/index.php')) {
        $filePath = $filePath . '/index.php';
    }
}

// If file exists and is not a PHP file, serve it directly
if (file_exists($filePath) && !preg_match('/\.php$/', $filePath)) {
    return false; // Let PHP built-in server handle static files
}

// If it's a PHP file and exists, execute it
if (file_exists($filePath) && preg_match('/\.php$/', $filePath)) {
    require $filePath;
    return true;
}

// If file doesn't exist, return 404
http_response_code(404);
echo "404 - File not found";
return true;
