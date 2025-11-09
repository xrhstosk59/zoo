<?php
/**
 * Configuration Template
 *
 * ΟΔΗΓΙΕΣ:
 * 1. Αντέγραψε αυτό το αρχείο και ονόμασέ το 'config.php'
 * 2. Συμπλήρωσε τα στοιχεία της βάσης δεδομένων σου
 * 3. ΜΗΝ κάνεις commit το config.php (είναι στο .gitignore)
 */

return [
    'database' => [
        'host' => 'localhost',
        'username' => 'YOUR_DATABASE_USERNAME',
        'password' => 'YOUR_DATABASE_PASSWORD',
        'database' => 'YOUR_DATABASE_NAME',
        'charset' => 'utf8mb4'
    ],

    // Environment: 'development' ή 'production'
    'environment' => 'development',

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
