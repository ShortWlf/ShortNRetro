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

    // Update title bar
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

// ------------------------------
// LIBERACHAT IFRAME ROOM SWITCHING
// ------------------------------

function buildIRCUrl(room) {
    // IMPORTANT: # MUST be encoded as %23
    const channel = "#aghq_" + room;
    const encodedChannel = encodeURIComponent(channel); // becomes %23aghq_room

    const nick = "RetroUser" + Math.floor(Math.random() * 9999);
    const session = "s" + Math.random().toString(36).substring(2);
    const cache = "cb=" + Date.now() + Math.random();

    return `https://web.libera.chat/?nick=${encodeURIComponent(nick)}&channel=${encodedChannel}&session=${session}&${cache}`;
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
