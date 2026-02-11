// ------------------------------
// ROOM SWITCHING + TITLE UPDATE
// ------------------------------

let currentRoom = "general";

// Update title bar
function updateRoomTitle(room) {
    const title = document.getElementById("room-title");
    title.textContent = room.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// Switch room
function switchRoom(room) {
    currentRoom = room;
    updateRoomTitle(room);

    // Update active sidebar item
    document.querySelectorAll("#room-list li").forEach(li => {
        li.classList.toggle("active", li.dataset.room === room);
    });

    // Clear messages when switching rooms (for now)
    document.getElementById("messages").innerHTML = "";
}

// Attach click events to sidebar
document.querySelectorAll("#room-list li").forEach(li => {
    li.addEventListener("click", () => {
        const room = li.dataset.room;
        switchRoom(room);
    });
});

// Initialize title on load
updateRoomTitle(currentRoom);
