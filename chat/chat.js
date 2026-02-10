// CONFIG — your C# bot will run on this address
const BOT_URL = "http://snrts.ddns.net:9877";

// Current room
let currentRoom = "general";

// Load messages for the selected room
async function loadMessages() {
  try {
    const res = await fetch(`${BOT_URL}/room?name=${currentRoom}`);
    const text = await res.text();

    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    text.split("\n").forEach(line => {
      if (!line.trim()) return;
      const div = document.createElement("div");
      div.className = "message";
      div.textContent = line;
      messagesDiv.appendChild(div);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    console.log("Error loading messages:", err);
  }
}

// Send a message
async function sendMessage() {
  const user = document.getElementById("username").value || "Anon";
  const msg = document.getElementById("message").value;

  if (!msg.trim()) return;

  await fetch(`${BOT_URL}/send?room=${currentRoom}&user=${encodeURIComponent(user)}&msg=${encodeURIComponent(msg)}`, {
    method: "POST"
  });

  document.getElementById("message").value = "";
  loadMessages();
}

// Room switching
document.querySelectorAll("#room-list li").forEach(li => {
  li.addEventListener("click", () => {
    document.querySelectorAll("#room-list li").forEach(el => el.classList.remove("active"));
    li.classList.add("active");

    currentRoom = li.getAttribute("data-room");
    loadMessages();
  });
});

// Send button
document.getElementById("send-btn").addEventListener("click", sendMessage);

// Auto-refresh
setInterval(loadMessages, 2000);

// Initial load
loadMessages();
