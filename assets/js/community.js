async function safeFetch(url, type = "text") {
    try {
        const res = await fetch(url, {
            cache: "no-store",
            headers: { "User-Agent": "ShortNRetroSite" }
        });
        if (!res.ok) return null;
        return type === "json" ? await res.json() : await res.text();
    } catch {
        return null;
    }
}

async function loadDiscussions() {
    const container = document.getElementById("feed-container");

    // Fetch ONLY Discussion #2 with required header
    const post = await safeFetch(
        "https://api.github.com/repos/ShortWlf/ShortNRetro/discussions/2",
        "json"
    );

    if (!post || !post.body) {
        container.innerHTML = "<p>Failed to load streamer list.</p>";
        return;
    }

    container.innerHTML = "";

    // Extract URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = post.body.match(urlRegex);

    if (!urls || urls.length === 0) {
        container.innerHTML = "<p>No streamers listed yet.</p>";
        return;
    }

    const streamers = urls.map(url => {
        let username = url
            .replace("https://www.twitch.tv/", "")
            .replace("http://www.twitch.tv/", "")
            .replace("https://twitch.tv/", "")
            .replace("http://twitch.tv/", "")
            .trim();

        return {
            username,
            cleanName: username.charAt(0).toUpperCase() + username.slice(1),
            url,
            avatarUrl: "", // we add this back later
            isLive: false  // we add this back later
        };
    });

    // Render minimal cards
    streamers.forEach(s => {
        const card = document.createElement("div");
        card.className = "post-card";

        const avatar = `<div class="avatar placeholder">No Image</div>`;
        const link = `<a class="post-link" href="${s.url}" target="_blank">${s.url}</a>`;

        card.innerHTML = `
            <div class="post-inner">
                ${avatar}
                <div class="post-content">
                    <div class="post-title-row">
                        <div class="post-title">${s.cleanName}</div>
                    </div>
                    ${link}
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

loadDiscussions();
setInterval(loadDiscussions, 60000);
