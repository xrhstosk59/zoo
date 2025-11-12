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
    
    if (!isset($data['Email'])) {
        throw new Exception("Δεν βρέθηκε το email του επισκέπτη");
    }

    // Έλεγχος αν υπάρχει ο επισκέπτης
    $checkStmt = $db->prepare("SELECT 1 FROM EPISKEPTIS WHERE Email = ?");
    $checkStmt->bind_param("s", $data['Email']);
    $checkStmt->execute();
    if ($checkStmt->get_result()->num_rows === 0) {
        throw new Exception("Δεν βρέθηκε ο επισκέπτης");
    }

    $db->begin_transaction();

    try {
        // Βρίσκουμε όλα τα εισιτήρια του επισκέπτη
        $stmt = $db->prepare("
            SELECT DISTINCT e.Kodikos, e.Hmerominia_Ekdoshs
            FROM EISITIRIO e
            LEFT JOIN APAITEI a ON e.Kodikos = a.Kodikos
            WHERE e.Email = ?
        ");
        $stmt->bind_param("s", $data['Email']);
        if (!$stmt->execute()) {
            throw new Exception("Σφάλμα κατά την αναζήτηση εισιτηρίων: " . $stmt->error);
        }
        $result = $stmt->get_result();

        // Διαγραφή από APAITEI για κάθε εισιτήριο
        while ($row = $result->fetch_assoc()) {
            $delStmt = $db->prepare("DELETE FROM APAITEI WHERE Kodikos = ? AND Hmerominia_Ekdoshs = ?");
            $delStmt->bind_param("is", $row['Kodikos'], $row['Hmerominia_Ekdoshs']);
            if (!$delStmt->execute()) {
                throw new Exception("Σφάλμα κατά τη διαγραφή από APAITEI: " . $delStmt->error);
            }
        }

        // Διαγραφή από EISITIRIO
        $stmt = $db->prepare("DELETE FROM EISITIRIO WHERE Email = ?");
        $stmt->bind_param("s", $data['Email']);
        if (!$stmt->execute()) {
            throw new Exception("Σφάλμα κατά τη διαγραφή εισιτηρίων του επισκέπτη: " . $stmt->error);
        }

        // Διαγραφή του επισκέπτη
        $stmt = $db->prepare("DELETE FROM EPISKEPTIS WHERE Email = ?");
        $stmt->bind_param("s", $data['Email']);
        if (!$stmt->execute()) {
            throw new Exception("Σφάλμα κατά τη διαγραφή του επισκέπτη: " . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            throw new Exception("Δεν βρέθηκε ο επισκέπτης");
        }

        $db->commit();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Ο επισκέπτης διαγράφηκε επιτυχώς'
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