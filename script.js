document.getElementById("searchBtn").addEventListener("click", searchBooks);

async function searchBooks() {
    const query = document.getElementById("query").value.trim();
    if (!query) return;

    const apiKey = "AIzaSyCDvv9-OKI8Pwu8NtARzn3UzoreKyBAs5w";
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${apiKey}`;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        resultsDiv.innerHTML = "";

        if (!data.items || data.items.length === 0) {
            resultsDiv.innerHTML = "<p>No books found.</p>";
            return;
        }

        data.items.forEach(item => {
            const v = item.volumeInfo;

            let thumbnail = "";
            if (v.imageLinks && v.imageLinks.thumbnail) {
                thumbnail = v.imageLinks.thumbnail.replace("http://", "https://");
            }

            const title         = v.title || "N/A";
            const subtitle      = v.subtitle || "";
            const authors       = v.authors ? v.authors.join(", ") : "Unknown";
            const publishedDate = v.publishedDate || "";
            const pageCount     = v.pageCount || "";

            const bookHTML = `
                <div class="book">
                    ${thumbnail ? `<img src="${thumbnail}" alt="Book cover">` : "<p>No Cover Available</p>"}
                    <h3>${title}</h3>
                    ${subtitle ? `<p><em>${subtitle}</em></p>` : ""}
                    <p class="meta">
                        <strong>Author(s):</strong> ${authors}<br>
                        <strong>Published:</strong> ${publishedDate}<br>
                        <strong>Pages:</strong> ${pageCount}
                    </p>
                    <button
                        class="saveBtn"
                        data-title="${title}"
                        data-authors="${authors}"
                        data-date="${publishedDate}"
                        data-pages="${pageCount}">
                        Save Book
                    </button>
                </div>
            `;

            resultsDiv.insertAdjacentHTML("beforeend", bookHTML);

            // ✅ Attach listener only to the ONE button just inserted, not all buttons
            const newBtn = resultsDiv.querySelector(".book:last-child .saveBtn");
            newBtn.addEventListener("click", () => {
                const book = {
                    title:         newBtn.dataset.title,
                    authors:       newBtn.dataset.authors,
                    publishedDate: newBtn.dataset.date,
                    pageCount:     newBtn.dataset.pages
                };
                saveBook(book);
            });
        });

    } catch (err) {
        resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
        console.error(err);
    }
}

async function saveBook(book) {
    try {
        const res = await fetch("save_book.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book)
        });

        const data = await res.json();

        if (data.status === "success") {
            alert("Book saved!");
        } else {
            // ✅ Now shows the actual error message from PHP
            alert("Error saving book: " + (data.message || "Unknown error"));
        }
    } catch (err) {
        alert("Network error: " + err.message);
        console.error(err);
    }
}
