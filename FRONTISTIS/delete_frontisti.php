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

    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['ID'])) {
        throw new Exception("Δεν βρέθηκε το ID του φροντιστή");
    }

    // Έλεγχος αν υπάρχει ο φροντιστής
    $checkStmt = $db->prepare("SELECT 1 FROM FRONTISTIS WHERE ID = ?");
    $checkStmt->bind_param("i", $data['ID']);
    $checkStmt->execute();
    if ($checkStmt->get_result()->num_rows === 0) {
        throw new Exception("Δεν βρέθηκε φροντιστής με αυτό το ID");
    }

    $db->begin_transaction();

    try {
        // Έλεγχος εξαρτήσεων στο FRONTIZEI
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM FRONTIZEI WHERE ID = ?");
        $stmt->bind_param("i", $data['ID']);
        $stmt->execute();
        $count = $stmt->get_result()->fetch_assoc()['count'];
        if ($count > 0) {
            throw new Exception("Δεν είναι δυνατή η διαγραφή. Ο φροντιστής έχει ανατεθειμένα ζώα.");
        }

        // Διαγραφή φροντιστή
        $stmt = $db->prepare("DELETE FROM FRONTISTIS WHERE ID = ?");
        $stmt->bind_param("i", $data['ID']);
        if (!$stmt->execute()) {
            throw new Exception("Σφάλμα κατά τη διαγραφή: " . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            throw new Exception("Δεν βρέθηκε φροντιστής με αυτό το ID προς διαγραφή");
        }

        $db->commit();
        
        echo json_encode(['status' => 'success', 'message' => 'Ο φροντιστής διαγράφηκε επιτυχώς'], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

?>