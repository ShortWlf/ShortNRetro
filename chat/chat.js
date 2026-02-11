// ------------------------------
// DEFAULT ROOM + TITLE UPDATE
// ------------------------------

let currentRoom = "general";

window.addEventListener("load", () => {
    currentRoom = "general";

    document.querySelectorAll("#room-list li").forEach(li => {
        li.classList.toggle("active", li.dataset.room === "general");
    });

    updateRoomTitle("general");
});

// Update title bar text
function updateRoomTitle(room) {
    const title = document.getElementById("room-title");
    const pretty = room.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    title.textContent = pretty;
}

// Sidebar UI switching
function switchRoom(room) {
    currentRoom = room;
    updateRoomTitle(room);

    document.querySelectorAll("#room-list li").forEach(li => {
        li.classList.toggle("active", li.dataset.room === room);
    });
}

document.querySelectorAll("#room-list li").forEach(li => {
    li.addEventListener("click", () => {
        const room = li.dataset.room;
        switchRoom(room);
        recreateIRCFrame(room);
    });
});

// ------------------------------
// NEW LIBERACHAT URL FORMAT
// ------------------------------

function buildIRCUrl(room) {
    const channel = "#aghq_" + room;
    const encodedChannel = encodeURIComponent(channel);

    const nick = "RetroUser" + Math.floor(Math.random() * 9999);
    const session = crypto.randomUUID();

    // NEW FORMAT:
    // https://web.libera.chat/#ircs://irc.libera.chat:6697/%23aghq_general?nick=RetroUser1234&session=...
    return `https://web.libera.chat/#ircs://irc.libera.chat:6697/${encodedChannel}?nick=${encodeURIComponent(nick)}&session=${session}`;
}

// Recreate iframe
function recreateIRCFrame(room) {
    const titleBar = document.getElementById("title-bar");

    const oldFrame = document.getElementById("irc-frame");
    if (oldFrame) oldFrame.remove();

    const newFrame = document.createElement("iframe");
    newFrame.id = "irc-frame";
    newFrame.style.border = "0";
    newFrame.style.width = "100%";
    newFrame.style.height = "700px";
    newFrame.style.background = "#000";
    newFrame.loading = "eager";
    newFrame.src = buildIRCUrl(room);

    titleBar.insertAdjacentElement("afterend", newFrame);
}

// Load initial room
recreateIRCFrame(currentRoom);
