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

        const streamers = await Promise.all(urls.map(async (url) => {
            let username = url
                .replace("https://www.twitch.tv/", "")
                .replace("http://www.twitch.tv/", "")
                .replace("https://twitch.tv/", "")
                .replace("http://twitch.tv/", "")
                .trim();

            // Fetch Twitch user info (stable avatar)
            const userInfo = await fetch(`https://decapi.me/twitch/user/${username}`).then(r => r.json());

            const avatarUrl = userInfo.logo || "";
            const cleanName = userInfo.display_name || username;

            // Twitch live status
            const uptime = await fetch(`https://decapi.me/twitch/uptime/${username}`).then(r => r.text());
            const isLive = !uptime.toLowerCase().includes("offline");

            return {
                username,
                cleanName,
                url,
                avatarUrl,
                isLive
            };
        }));

        // Sort: LIVE first
        streamers.sort((a, b) => b.isLive - a.isLive);

        // Render cards
        container.innerHTML = "";
        streamers.forEach(s => {
            const card = document.createElement("div");
            card.className = "post-card";

            if (s.isLive) {
                card.classList.add("live-card");
            }

            const liveBadge = s.isLive ? `<div class="live-badge">LIVE NOW</div>` : "";
            const avatar = s.avatarUrl
                ? `<img src="${s.avatarUrl}" class="avatar" alt="${s.cleanName} avatar">`
                : `<div class="avatar placeholder">No Image</div>`;

            const title = `<div class="post-title">${s.cleanName}</div>`;
            const link = `<a class="post-link" href="${s.url}" target="_blank">${s.url}</a>`;

            card.innerHTML = liveBadge + avatar + title + link;
            container.appendChild(card);
        });

    } catch (err) {
        container.innerHTML = "<p>Failed to load streamer list.</p>";
    }
}

// Auto-refresh every 60 seconds
loadDiscussions();
setInterval(loadDiscussions, 60000);
