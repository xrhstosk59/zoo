<?php
require_once '../db_connection.php';
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(0);
mb_internal_encoding('UTF-8');

try {
    $db = getDatabase();
    
    if (!$db) {
        throw new Exception("Πρόβλημα σύνδεσης με τη βάση δεδομένων");
    }

    if (!isset($_POST['email'])) {
        throw new Exception("Απαιτείται το email του επισκέπτη");
    }

    // Έλεγχος αν υπάρχει ο επισκέπτης
    $checkStmt = $db->prepare("SELECT 1 FROM EPISKEPTIS WHERE Email = ?");
    $checkStmt->bind_param("s", $_POST['email']);
    $checkStmt->execute();
    if ($checkStmt->get_result()->num_rows === 0) {
        throw new Exception("Ο επισκέπτης δεν βρέθηκε");
    }

    $updates = [];
    $types = "";
    $values = [];

    if (isset($_POST['onoma']) && !empty($_POST['onoma'])) {
        $updates[] = "Onoma = ?";
        $types .= "s";
        $values[] = htmlspecialchars($_POST['onoma'], ENT_QUOTES, 'UTF-8');
    }

    if (isset($_POST['eponymo']) && !empty($_POST['eponymo'])) {
        $updates[] = "Eponymo = ?";
        $types .= "s";
        $values[] = htmlspecialchars($_POST['eponymo'], ENT_QUOTES, 'UTF-8');
    }

    if (empty($updates)) {
        throw new Exception("Δεν παρέχονται δεδομένα για ενημέρωση");
    }

    $db->begin_transaction();

    try {
        $sql = "UPDATE EPISKEPTIS SET " . implode(", ", $updates) . " WHERE Email = ?";
        $types .= "s";
        $values[] = $_POST['email'];

        $stmt = $db->prepare($sql);
        $stmt->bind_param($types, ...$values);

        if (!$stmt->execute()) {
            throw new Exception("Σφάλμα κατά την ενημέρωση του επισκέπτη: " . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            throw new Exception("Ο επισκέπτης δεν βρέθηκε ή δεν έγιναν αλλαγές");
        }

        $db->commit();
        echo json_encode(['status' => 'success', 'message' => 'Ο επισκέπτης ενημερώθηκε επιτυχώς'], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

?>