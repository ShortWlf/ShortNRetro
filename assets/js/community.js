async function loadDiscussions() {
    const container = document.getElementById("feed-container");

    try {
        const response = await fetch("https://api.github.com/repos/ShortWlf/ShortNRetro/discussions");
        const data = await response.json();

        container.innerHTML = ""; // clear loading text

        data.forEach(post => {
            const card = document.createElement("div");
            card.className = "post-card";

            const title = `<div class="post-title">${post.title}</div>`;
            const meta = `<div class="post-meta">Posted by ${post.user.login} — ${new Date(post.created_at).toLocaleString()}</div>`;
            const body = `<div class="post-body">${post.body.slice(0, 200)}...</div>`;
            const link = `<a class="post-link" href="${post.html_url}" target="_blank">Read Full Post</a>`;

            card.innerHTML = title + meta + body + link;
            container.appendChild(card);
        });

    } catch (err) {
        container.innerHTML = "<p>Failed to load community posts.</p>";
    }
}

loadDiscussions();
