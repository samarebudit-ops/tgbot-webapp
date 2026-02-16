const tg = window.Telegram?.WebApp;
if (tg) { tg.expand(); tg.ready(); }

const q = document.getElementById("q");
document.getElementById("sendBtn").onclick = () => {
  const text = (q.value || "").trim();
  if (!text) return;
  if (!tg) return alert("Открой через Telegram.");
  tg.sendData(JSON.stringify({ type: "text", text }));
  q.value = "";
};

document.querySelectorAll(".chip").forEach(btn=>{
  btn.onclick = () => {
    if (!tg) return alert("Открой через Telegram.");
    tg.sendData(JSON.stringify({ type: "mode", mode: btn.dataset.mode }));
  };
});
