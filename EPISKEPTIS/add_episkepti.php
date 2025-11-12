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

    // Έλεγχος απαιτούμενων πεδίων
    $required_fields = ['email', 'onoma', 'eponymo'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception("Το πεδίο $field είναι υποχρεωτικό");
        }
    }

    // Έλεγχος εγκυρότητας email
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Μη έγκυρη διεύθυνση email");
    }

    $db->begin_transaction();

    // Έλεγχος αν υπάρχει ήδη ο επισκέπτης
    $stmt = $db->prepare("SELECT Email FROM EPISKEPTIS WHERE Email = ?");
    $stmt->bind_param("s", $_POST['email']);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        throw new Exception("Το email υπάρχει ήδη");
    }

    // Εισαγωγή επισκέπτη
    $email = trim($_POST['email']);
    $onoma = trim(htmlspecialchars($_POST['onoma'], ENT_QUOTES, 'UTF-8'));
    $eponymo = trim(htmlspecialchars($_POST['eponymo'], ENT_QUOTES, 'UTF-8'));

    $stmt = $db->prepare("INSERT INTO EPISKEPTIS (Email, Onoma, Eponymo) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $onoma, $eponymo);
    
    if (!$stmt->execute()) {
        throw new Exception("Σφάλμα κατά την εισαγωγή του επισκέπτη: " . $stmt->error);
    }

    $db->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Ο επισκέπτης καταχωρήθηκε επιτυχώς'
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