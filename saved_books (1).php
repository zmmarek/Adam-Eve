<?php
$host = "localhost";
$db   = "zmmarek_books";
$user = "zmmarek_bookuser";
$pass = "@D@m&3v369420";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT * FROM books ORDER BY id DESC");
$books = [];
while ($row = $result->fetch_assoc()) {
    $books[] = $row;
}
$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Saved Books</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <h1>Saved Books</h1>
    <p><a href="index.html">← Back to Search</a></p>

    <div class="results">
        <?php if ($total === 0): ?>
            <p>No books saved yet. <a href="index.html">Search for some!</a></p>
        <?php else: ?>
            <?php foreach ($books as $book): ?>
            <div class="book" id="book-<?= $book['id'] ?>">
                <h3><?= htmlspecialchars($book['title']) ?></h3>
                <p class="meta">
                    <strong>Author(s):</strong> <?= htmlspecialchars($book['authors']) ?><br>
                    <?php if (!empty($book['published_date'])): ?>
                    <strong>Published:</strong> <?= htmlspecialchars($book['published_date']) ?><br>
                    <?php endif; ?>
                    <?php if (!empty($book['page_count']) && $book['page_count'] > 0): ?>
                    <strong>Pages:</strong> <?= $book['page_count'] ?>
                    <?php endif; ?>
                </p>
                <button onclick="deleteBook(<?= $book['id'] ?>)">Remove</button>
            </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

<script>
async function deleteBook(id) {
    if (!confirm("Remove this book from your library?")) return;
    try {
        const res = await fetch("delete_book.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.status === "success") {
            const card = document.getElementById("book-" + id);
            card.style.opacity = "0";
            card.style.transition = "opacity 0.3s";
            setTimeout(() => card.remove(), 300);
        } else {
            alert("Error: " + (data.message || "Could not remove book"));
        }
    } catch (err) {
        alert("Network error: " + err.message);
    }
}
</script>

</body>
</html>
