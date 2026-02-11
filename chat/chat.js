const server = "http://108.77.59.161:9877";
let currentRoom = "general";

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

function switchRoom(room) {
    currentRoom = room;
    document.getElementById("room-title").innerText = room;
    loadMessages();
}

function autoScroll() {
    const box = document.getElementById("messages");
    box.scrollTop = box.scrollHeight;
}

setInterval(loadMessages, 1500);

document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
