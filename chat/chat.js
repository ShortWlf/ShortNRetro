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
        updateIRCFrame(room);
    });
});

// Initialize title on load
updateRoomTitle(currentRoom);

// ------------------------------
// LIBERACHAT IFRAME ROOM SWITCHING
// ------------------------------

const ircFrame = document.getElementById("irc-frame");

// Build LiberaChat URL for a given room id
function buildIRCUrl(room) {
    const channel = "#aghq_" + room;   // namespace to avoid other rooms

    // Random nickname each time
    const nick = "RetroUser" + Math.floor(Math.random() * 9999);

    // Random session token to force a NEW connection
    const session = "s" + Math.random().toString(36).substring(2);

    return `https://web.libera.chat/?nick=${encodeURIComponent(nick)}&channel=${encodeURIComponent(channel)}&session=${session}`;
}

// Update iframe when room changes
function updateIRCFrame(room) {
    if (!ircFrame) return;
    ircFrame.src = buildIRCUrl(room);
}

// Ensure iframe matches initial room on load
updateIRCFrame(currentRoom);
