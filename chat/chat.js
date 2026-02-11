// ------------------------------
// ROOM SWITCHING + TITLE UPDATE
// ------------------------------

let currentRoom = "general";

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

    // Update active sidebar item
    document.querySelectorAll("#room-list li").forEach(li => {
        li.classList.toggle("active", li.dataset.room === room);
    });
}

// Attach click events to sidebar items
document.querySelectorAll("#room-list li").forEach(li => {
    li.addEventListener("click", () => {
        const room = li.dataset.room;
        switchRoom(room);
        recreateIRCFrame(room);
    });
});

// Initialize title on load
updateRoomTitle(currentRoom);

// ------------------------------
// LIBERACHAT IFRAME ROOM SWITCHING
// ------------------------------

// Build LiberaChat URL for a given room id
function buildIRCUrl(room) {
    const channel = "#aghq_" + room;

    // Random nickname each time
    const nick = "RetroUser" + Math.floor(Math.random() * 9999);

    // Random session token to force a NEW connection
    const session = "s" + Math.random().toString(36).substring(2);

    // Cache buster to force a NEW iframe load
    const cache = "cb=" + Date.now() + Math.random();

    return `https://web.libera.chat/?nick=${encodeURIComponent(nick)}&channel=${encodeURIComponent(channel)}&session=${session}&${cache}`;
}

// DESTROY and RECREATE iframe to force new IRC session
function recreateIRCFrame(room) {
    const panel = document.getElementById("chat-panel");
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
    newFrame.src = buildIRCUrl(room);

    // Insert iframe RIGHT AFTER the title bar
    titleBar.insertAdjacentElement("afterend", newFrame);
}

// Load initial room
recreateIRCFrame(currentRoom);
