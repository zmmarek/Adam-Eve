document.getElementById("searchBtn").addEventListener("click", searchBooks);

async function searchBooks() {
    const query = document.getElementById("query").value.trim();
    if (!query) return;

    const apiKey = "AIzaSyCDvv9-OKI8Pwu8NtARzn3UzoreKyBAs5w"; // <-- Replace with your key
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

            const thumbnail = v.imageLinks?.thumbnail?.replace("http://", "https://") || "";
            const title = v.title || "N/A";
            const subtitle = v.subtitle || "";
            const authors = v.authors ? v.authors.join(", ") : "Unknown";
            const publishedDate = v.publishedDate || "";
            const pageCount = v.pageCount || "";
            const description = v.description || "";
            const previewLink = v.previewLink || "";
            const infoLink = v.infoLink || "";

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
                    ${description ? `<div class="description">${description}</div>` : ""}
                    ${previewLink ? `<a href="${previewLink}" target="_blank">Preview</a>` : ""}
                    ${infoLink ? `<a href="${infoLink}" target="_blank">More Info</a>` : ""}
                </div>
            `;
            resultsDiv.insertAdjacentHTML("beforeend", bookHTML);
        });

    } catch (err) {
        resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
        console.error(err);
    }
}
