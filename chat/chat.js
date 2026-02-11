// Your backend server URL
const server = "http://snrts.ddns.net:9877"; 
let currentRoom = "general";

// Load messages from the server
async function loadMessages() {
    try {
        const res = await fetch(`${server}/room?name=${currentRoom}`);
        const text = await res.text();
        document.getElementById("messages").innerText = text;
        autoScroll();
    } catch (err) {
        console.error("Load error:", err);
    }
}

// Send a message to the server
async function sendMessage() {
    const user = document.getElementById("username").value || "Anon";
    const msg = document.getElementById("message").value;

    if (!msg.trim()) return;

    try {
        await fetch(
            `${server}/send?room=${currentRoom}&user=${encodeURIComponent(user)}&msg=${encodeURIComponent(msg)}`
        );
        document.getElementById("message").value = "";
        loadMessages();
    } catch (err) {
        console.error("Send error:", err);
    }
}

// Switch chat rooms
function switchRoom(room) {
    currentRoom = room;
    document.getElementById("room-title").innerText = room;
    loadMessages();
}

// Auto-scroll to bottom
function autoScroll() {
    const box = document.getElementById("messages");
    box.scrollTop = box.scrollHeight;
}

// Auto-refresh messages every 1.5 seconds
setInterval(loadMessages, 1500);

// Allow Enter key to send messages
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
