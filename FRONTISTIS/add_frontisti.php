<?php
require_once '../db_connection.php';
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(0);
mb_internal_encoding('UTF-8');

try {
    $db = getDatabase();
    
    // Έλεγχος σύνδεσης με τη βάση
    if (!$db) {
        throw new Exception("Πρόβλημα σύνδεσης με τη βάση δεδομένων");
    }

    // Έλεγχος υποχρεωτικών πεδίων
    $required_fields = ['id', 'onoma', 'eponymo'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception("Λείπουν απαραίτητα πεδία ή είναι κενά");
        }
    }

    // Έναρξη συναλλαγής
    $db->begin_transaction();

    // Έλεγχος αν υπάρχει ήδη φροντιστής με το ίδιο ID
    $stmt = $db->prepare("SELECT ID FROM FRONTISTIS WHERE ID = ?");
    $stmt->bind_param("i", $_POST['id']);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        throw new Exception("Υπάρχει ήδη φροντιστής με αυτό το ID");
    }

    // Εισαγωγή φροντιστή
    $id = (int)$_POST['id'];
    $onoma = htmlspecialchars(trim($_POST['onoma']), ENT_QUOTES, 'UTF-8');
    $eponymo = htmlspecialchars(trim($_POST['eponymo']), ENT_QUOTES, 'UTF-8');

    $stmt = $db->prepare("INSERT INTO FRONTISTIS (ID, Onoma, Eponymo) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $id, $onoma, $eponymo);
    
    if (!$stmt->execute()) {
        throw new Exception("Σφάλμα κατά την εισαγωγή του φροντιστή: " . $stmt->error);
    }

    $db->commit();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Ο φροντιστής προστέθηκε επιτυχώς'
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    if (isset($db)) {
        $db->rollback();
    }
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

?>