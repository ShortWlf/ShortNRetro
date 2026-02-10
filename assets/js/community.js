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

            // Extract Twitch username
            let username = url
                .replace("https://www.twitch.tv/", "")
                .replace("http://www.twitch.tv/", "")
                .replace("https://twitch.tv/", "")
                .replace("http://twitch.tv/", "")
                .trim();

            // Capitalize properly (TruestSkeleton)
            const cleanName = username.charAt(0).toUpperCase() + username.slice(1);

            // Twitch avatar API
            const avatarUrl = `https://decapi.me/twitch/avatar/${username}`;

            const avatar = `
                <img src="${avatarUrl}" class="avatar" alt="${cleanName} avatar">
            `;

            const title = `<div class="post-title">${cleanName}</div>`;
            const link = `<a class="post-link" href="${url}" target="_blank">${url}</a>`;

            card.innerHTML = avatar + title + link;
            container.appendChild(card);
        });

    } catch (err) {
        container.innerHTML = "<p>Failed to load streamer list.</p>";
    }
}

loadDiscussions();
