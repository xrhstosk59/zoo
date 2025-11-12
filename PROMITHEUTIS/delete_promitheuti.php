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
    
    if (!isset($data['AFM'])) {
        throw new Exception("Δεν βρέθηκε το ΑΦΜ του προμηθευτή");
    }

    // Έλεγχος αν υπάρχει ο προμηθευτής
    $checkStmt = $db->prepare("SELECT 1 FROM PROMITHEUTIS WHERE AFM = ?");
    $checkStmt->bind_param("s", $data['AFM']);
    $checkStmt->execute();
    if ($checkStmt->get_result()->num_rows === 0) {
        throw new Exception("Δεν βρέθηκε προμηθευτής με αυτό το ΑΦΜ");
    }

    $db->begin_transaction();

    try {
        // Έλεγχος εξαρτήσεων σε TROFIMO
        $stmt = $db->prepare("SELECT Onoma FROM TROFIMO WHERE AFM_PROMITHEUTI = ?");
        $stmt->bind_param("s", $data['AFM']);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $trofima = [];
            while ($row = $result->fetch_assoc()) {
                $trofima[] = $row['Onoma'];
            }
            throw new Exception("Ο προμηθευτής δεν μπορεί να διαγραφεί γιατί προμηθεύει: " . implode(", ", $trofima));
        }

        // Διαγραφή προμηθευτή
        $stmt = $db->prepare("DELETE FROM PROMITHEUTIS WHERE AFM = ?");
        $stmt->bind_param("s", $data['AFM']);

        if (!$stmt->execute()) {
            throw new Exception("Σφάλμα κατά τη διαγραφή του προμηθευτή: " . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            throw new Exception("Δεν βρέθηκε προμηθευτής με αυτό το ΑΦΜ προς διαγραφή");
        }

        $db->commit();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Ο προμηθευτής διαγράφηκε επιτυχώς'
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

?>