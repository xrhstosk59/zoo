<?php
// Router script for PHP built-in server
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$filepath = __DIR__ . $uri;

// Handle directory requests
if (is_dir($filepath)) {
    if (file_exists($filepath . '/index.html')) {
        $filepath .= '/index.html';
    } elseif (file_exists($filepath . '/index.php')) {
        $filepath .= '/index.php';
    } else {
        http_response_code(404);
        return true;
    }
}

// If file exists
if (file_exists($filepath)) {
    // If it's a PHP file, execute it
    if (pathinfo($filepath, PATHINFO_EXTENSION) === 'php') {
        // Change to the file's directory for relative paths
        chdir(dirname($filepath));
        include $filepath;
        return true;
    }
    // For static files (HTML, JS, CSS, etc), let the server serve them
    return false;
}

// 404 for non-existent files
http_response_code(404);
return true;
