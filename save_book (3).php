<?php
header("Content-Type: application/json");

$host = "localhost";
$db   = "zmmarek_books";
$user = "zmmarek_bookuser";
$pass = "@D@m&3v369420";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['title'])) {
    echo json_encode(["status" => "error", "message" => "Invalid or missing JSON input"]);
    exit;
}

$title     = $conn->real_escape_string($data['title']);
$authors   = $conn->real_escape_string($data['authors'] ?? '');
$published = $conn->real_escape_string($data['publishedDate'] ?? '');
$pageCount = intval($data['pageCount'] ?? 0);

$sql = "INSERT INTO books (title, authors, published_date, page_count)
        VALUES ('$title', '$authors', '$published', $pageCount)";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}

$conn->close();
?>
