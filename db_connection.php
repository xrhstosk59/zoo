<?php
class Database {
    private $host;
    private $username;
    private $password;
    private $database;
    private $conn;

    public function __construct() {
        // Διάβασμα από environment variables με fallback σε default τιμές
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->username = getenv('DB_USERNAME') ?: 'root';
        $this->password = getenv('DB_PASSWORD') ?: '';
        $this->database = getenv('DB_DATABASE') ?: 'zwologikos_khpos';

        try {
            // Φόρτωση configuration
            $config = require_once __DIR__ . '/config.php';

            if (!isset($config['database'])) {
                throw new Exception("Database configuration not found");
            }

            $this->host = $config['database']['host'];
            $this->username = $config['database']['username'];
            $this->password = $config['database']['password'];
            $this->database = $config['database']['database'];

            // Σύνδεση στη βάση
            $this->conn = mysqli_connect($this->host, $this->username, $this->password, $this->database);

            if (!$this->conn) {
                throw new Exception(mysqli_connect_error());
            }

            // Ορισμός charset
            $charset = isset($config['database']['charset']) ? $config['database']['charset'] : 'utf8mb4';
            $this->conn->set_charset($charset);

            // Ρύθμιση error reporting βάσει environment
            $env = isset($config['environment']) ? $config['environment'] : 'production';
            if (isset($config['error_reporting'][$env])) {
                $errorSettings = $config['error_reporting'][$env];
                ini_set('display_errors', $errorSettings['display_errors']);
                ini_set('log_errors', $errorSettings['log_errors']);
                error_reporting($errorSettings['error_level']);
            }

        } catch (Exception $e) {
            error_log("Database Error: " . $e->getMessage());
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                "status" => "error",
                "message" => "Database connection error. Please check your configuration."
            ]);
            exit;
        }
    }

    public function getConnection() {
        if (!$this->conn) {
            throw new Exception("No database connection");
        }
        return $this->conn;
    }

    public function prepare($sql) {
        $stmt = $this->conn->prepare($sql);
        if(!$stmt) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }
        return $stmt;
    }

    public function query($sql) {
        $result = $this->conn->query($sql);
        if (!$result) {
            throw new Exception("Query error: " . $this->conn->error);
        }
        return $result;
    }

    public function close() {
        if ($this->conn) {
            $this->conn->close();
        }
    }

    public function beginTransaction() {
        $this->conn->begin_transaction();
    }

    public function commit() {
        $this->conn->commit();
    }

    public function rollback() {
        $this->conn->rollback();
    }
}

function getDatabase() {
    static $db = null;
    if ($db === null) {
        $db = new Database();
    }
    return $db->getConnection();
}
