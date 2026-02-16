const tg = window.Telegram?.WebApp;

function send(payload){
  if (!tg) {
    alert("Открой через Telegram (кнопкой бота), а не в браузере.");
    return;
  }
  tg.sendData(JSON.stringify(payload));
}

if (tg) {
  tg.expand();
  tg.ready();
  send({ type: "ping", t: Date.now() }); // авто-пинг при открытии
}

const q = document.getElementById("q");

document.getElementById("sendBtn").onclick = () => {
  const text = (q.value || "").trim();
  if (!text) return;
  send({ type: "text", text });
  q.value = "";
};

document.querySelectorAll(".chip").forEach(btn=>{
  btn.onclick = () => send({ type: "mode", mode: btn.dataset.mode });
});
