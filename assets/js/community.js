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

        const streamers = await Promise.all(
            urls.map(async (url) => {
                let username = url
                    .replace("https://www.twitch.tv/", "")
                    .replace("http://www.twitch.tv/", "")
                    .replace("https://twitch.tv/", "")
                    .replace("http://twitch.tv/", "")
                    .trim();

                // Twitch user info (avatar, display name, bio, followers)
                let userInfo = null;
                try {
                    userInfo = await fetch(`https://decapi.me/twitch/user/${username}`).then(r => r.json());
                } catch {
                    userInfo = {};
                }

                const avatarUrl = userInfo.logo || "";
                const cleanName = userInfo.display_name || username;
                const followers = typeof userInfo.followers === "number" ? userInfo.followers : null;
                const bioFull = userInfo.bio || "";
                const bio = bioFull.length > 80 ? bioFull.slice(0, 77) + "..." : bioFull;

                // Twitch live status
                let uptimeText = "";
                let isLive = false;
                try {
                    uptimeText = await fetch(`https://decapi.me/twitch/uptime/${username}`).then(r => r.text());
                    isLive = !uptimeText.toLowerCase().includes("offline");
                } catch {
                    isLive = false;
                }

                // Game they’re playing
                let game = "";
                try {
                    game = await fetch(`https://decapi.me/twitch/game/${username}`).then(r => r.text());
                    if (game.toLowerCase().includes("offline")) game = "";
                } catch {
                    game = "";
                }

                // Stream preview thumbnail
                let thumbnailUrl = "";
                try {
                    thumbnailUrl = await fetch(`https://decapi.me/twitch/thumbnail/${username}`).then(r => r.text());
                } catch {
                    thumbnailUrl = "";
                }

                return {
                    username,
                    cleanName,
                    url,
                    avatarUrl,
                    followers,
                    bio,
                    game,
                    isLive,
                    thumbnailUrl
                };
            })
        );

        // Sort: LIVE first
        streamers.sort((a, b) => Number(b.isLive) - Number(a.isLive));

        // Render cards
        container.innerHTML = "";
        streamers.forEach(s => {
            const card = document.createElement("div");
            card.className = "post-card";
            if (s.isLive) card.classList.add("live-card");

            const liveBadge = s.isLive ? `<div class="live-badge">LIVE NOW</div>` : "";

            const avatar = s.avatarUrl
                ? `<img src="${s.avatarUrl}" class="avatar" alt="${s.cleanName} avatar">`
                : `<div class="avatar placeholder">No Image</div>`;

            const followersText = s.followers !== null
                ? `<div class="followers">Followers: ${s.followers}</div>`
                : "";

            const bioText = s.bio
                ? `<div class="bio">Bio: ${s.bio}</div>`
                : "";

            const gameText = s.game
                ? `<div class="game">Game: ${s.game}</div>`
                : "";

            const thumbnail = s.thumbnailUrl
                ? `<div class="thumbnail-wrapper"><img src="${s.thumbnailUrl}" class="thumbnail" alt="${s.cleanName} stream thumbnail"></div>`
                : "";

            const link = `<a class="post-link" href="${s.url}" target="_blank">${s.url}</a>`;

            card.innerHTML = `
                <div class="post-inner">
                    ${avatar}
                    <div class="post-content">
                        <div class="post-title-row">
                            <div class="post-title">${s.cleanName}</div>
                            ${liveBadge}
                        </div>
                        ${followersText}
                        ${bioText}
                        ${gameText}
                        ${thumbnail}
                        ${link}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        container.innerHTML = "<p>Failed to load streamer list.</p>";
    }
}

// Auto-refresh every 60 seconds
loadDiscussions();
setInterval(loadDiscussions, 60000);
