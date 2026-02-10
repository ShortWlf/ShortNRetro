async function loadDiscussions() {
    const container = document.getElementById("feed-container");

    try {
        // Fetch ONLY Discussion #2
        const response = await fetch("https://api.github.com/repos/ShortWlf/ShortNRetro/discussions/2");
        const post = await response.json();

        container.innerHTML = ""; // clear loading text

        // Extract URLs from the post body
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = post.body.match(urlRegex);

        if (!urls || urls.length === 0) {
            container.innerHTML = "<p>No streamers listed yet.</p>";
            return;
        }

        urls.forEach(url => {
            const card = document.createElement("div");
            card.className = "post-card";

            // Extract hostname for title (e.g., twitch.tv/truestskeleton)
            const hostname = url.replace("https://", "").replace("http://", "");

            const title = `<div class="post-title">${hostname}</div>`;
            const link = `<a class="post-link" href="${url}" target="_blank">${url}</a>`;

            card.innerHTML = title + link;
            container.appendChild(card);
        });

    } catch (err) {
        container.innerHTML = "<p>Failed to load streamer list.</p>";
    }
}

loadDiscussions();
