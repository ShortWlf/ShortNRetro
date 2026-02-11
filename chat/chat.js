// ------------------------------
// DEFAULT ROOM + TITLE UPDATE
// ------------------------------

let currentRoom = "general";

// Force default room on page load
window.addEventListener("load", () => {
    currentRoom = "general";

    // Reset sidebar highlight
    document.querySelectorAll("#room-list li").forEach(li => {
        li.classList.toggle("active", li.dataset.room === "general");
    });

    updateRoomTitle("general");
});

// Update title bar text from room id
function updateRoomTitle(room) {
    const title = document.getElementById("room-title");
    const pretty = room
        .replace(/-/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
    title.textContent = pretty;
}

// Core room switch logic (UI only)
function switchRoom(room) {
    currentRoom = room;
    updateRoomTitle(room);

    document.querySelectorAll("#room-list li").forEach(li => {
        li.classList.toggle("active", li.dataset.room === room);
    });
}

// Sidebar click events
document.querySelectorAll("#room-list li").forEach(li => {
    li.addEventListener("click", () => {
        const room = li.dataset.room;
        switchRoom(room);
        recreateIRCFrame(room);
    });
});

// ------------------------------
// LIBERACHAT IFRAME ROOM SWITCHING
// ------------------------------

function buildIRCUrl(room) {
    const channel = "#aghq_" + room;

    // MUST encode # → %23
    const encodedChannel = encodeURIComponent(channel);

    const nick = "RetroUser" + Math.floor(Math.random() * 9999);

    // New session token
    const session = crypto.randomUUID();

    // Strong cache buster
    const cache = crypto.randomUUID();

    // LiberaChat requires channels= (plural)
    return `https://web.libera.chat/?nick=${encodeURIComponent(nick)}&channels=${encodedChannel}&session=${session}&${cache}`;
}

// DESTROY and RECREATE iframe to force new IRC session
function recreateIRCFrame(room) {
    const titleBar = document.getElementById("title-bar");

    // Remove old iframe
    const oldFrame = document.getElementById("irc-frame");
    if (oldFrame) oldFrame.remove();

    // Create new iframe
    const newFrame = document.createElement("iframe");
    newFrame.id = "irc-frame";
    newFrame.style.border = "0";
    newFrame.style.width = "100%";
    newFrame.style.height = "700px";
    newFrame.style.background = "#000";
    newFrame.loading = "eager"; // force full reload
    newFrame.src = buildIRCUrl(room);

    // Insert iframe RIGHT AFTER the title bar
    titleBar.insertAdjacentElement("afterend", newFrame);
}

// Load initial room
recreateIRCFrame(currentRoom);
