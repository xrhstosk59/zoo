<?php
/**
 * Configuration File
 * Reads from environment variables (Railway) or uses defaults (local)
 */

// Check if running on Railway (environment variables set)
$isRailway = getenv('RAILWAY_ENVIRONMENT') !== false || getenv('MYSQLDATABASE') !== false;

if ($isRailway) {
    // Railway environment - use environment variables
    $dbConfig = [
        'host' => getenv('MYSQLHOST') ?: 'localhost',
        'username' => getenv('MYSQLUSER') ?: 'root',
        'password' => getenv('MYSQLPASSWORD') ?: '',
        'database' => getenv('MYSQLDATABASE') ?: 'student_2410',
        'port' => getenv('MYSQLPORT') ?: '3306',
        'charset' => 'utf8mb4'
    ];

    // Add port to host if provided
    if (!empty($dbConfig['port']) && $dbConfig['port'] != '3306') {
        $dbConfig['host'] = $dbConfig['host'] . ':' . $dbConfig['port'];
    }
} else {
    // Local development - use your local settings
    $dbConfig = [
        'host' => 'localhost',
        'username' => 'root',
        'password' => '',
        'database' => 'student_2410',
        'charset' => 'utf8mb4'
    ];
}

return [
    'database' => $dbConfig,

    // Environment: 'development' or 'production'
    'environment' => $isRailway ? 'production' : 'development',

    // Error reporting settings
    'error_reporting' => [
        'development' => [
            'display_errors' => 1,
            'log_errors' => 1,
            'error_level' => E_ALL
        ],
        'production' => [
            'display_errors' => 0,
            'log_errors' => 1,
            'error_level' => E_ALL
        ]
    ]
];
