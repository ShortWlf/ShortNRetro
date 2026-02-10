async function loadDiscussions() {
    const container = document.getElementById("feed-container");

    try {
        // GitHub API requires headers now
        const response = await fetch(
            "https://api.github.com/repos/ShortWlf/ShortNRetro/discussions/2",
            {
                headers: {
                    "Accept": "application/vnd.github.v3+json",
                    "User-Agent": "ShortNRetroSite"
                }
            }
        );

        const post = await response.json();

        container.innerHTML = ""; // clear loading text

        if (!post || !post.body) {
            container.innerHTML = "<p>Failed to load streamer list.</p>";
            return;
        }

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

            // Extract Twitch username
            let username = url
                .replace("https://www.twitch.tv/", "")
                .replace("http://www.twitch.tv/", "")
                .replace("https://twitch.tv/", "")
                .replace("http://twitch.tv/", "")
                .trim();

            const cleanName = username.charAt(0).toUpperCase() + username.slice(1);

            const title = `<div class="post-title">${cleanName}</div>`;
            const link = `<a class="post-link" href="${url}" target="_blank">${url}</a>`;

            card.innerHTML = title + link;
            container.appendChild(card);
        });

    } catch (err) {
        container.innerHTML = "<p>Failed to load streamer list.</p>";
    }
}

loadDiscussions();
setInterval(loadDiscussions, 60000);
