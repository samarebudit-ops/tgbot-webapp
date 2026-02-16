document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram?.WebApp;
  const q = document.getElementById("q");
  const sendBtn = document.getElementById("sendBtn");

  // мини-индикатор вверху (если элемента нет — создадим)
  let s = document.getElementById("tgstatus");
  if (!s) {
    s = document.createElement("div");
    s.id = "tgstatus";
    s.style.cssText = "font-size:12px;opacity:.85;margin:6px 2px;";
    document.body.prepend(s);
  }

  const set = (t) => s.textContent = t;

  if (!tg) {
    set("❌ Telegram.WebApp = null (открыто не как WebApp)");
  } else {
    tg.expand(); tg.ready();
    set("✅ WebApp connected. platform=" + tg.platform);
  }

  function send(payload){
    alert("sendData() called");           // <- чтобы 100% видеть вызов
    if (!tg) return alert("Открой через Telegram (Web App), не в браузере.");
    tg.sendData(JSON.stringify(payload)); // <- отправка в бота
    set("✅ SENT ✅ " + JSON.stringify(payload));
  }

  // кнопка ➤
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const text = (q?.value || "").trim();
      if (!text) return alert("Пустой текст");
      send({ type: "text", text });
    });
  }

  // чипы
  document.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      send({ type: "mode", mode: btn.dataset.mode });
    });
  });
});
