document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram?.WebApp;

  const statusEl = document.getElementById("tgstatus");
  const q = document.getElementById("q");
  const sendBtn = document.getElementById("sendBtn");

  function setStatus(ok, msg){
    if (!statusEl) return;
    statusEl.textContent = (ok ? "✅ WebApp: " : "❌ WebApp: ") + msg;
  }

  function send(payload){
    if (!tg) {
      alert("Открой через Telegram (кнопкой Web App), а не в браузере.");
      return;
    }
    tg.sendData(JSON.stringify(payload));
  }

  // Проверим, что элементы реально есть
  if (!q || !sendBtn) {
    alert("Ошибка UI: не найден q или sendBtn. Обнови страницу/кэш.");
    return;
  }

  // Telegram WebApp init
  if (tg) {
    tg.expand();
    tg.ready();
    setStatus(true, "connected");
    send({ type: "ping", t: Date.now() });
  } else {
    setStatus(false, "opened in browser");
  }

  // Клик по отправке
  sendBtn.addEventListener("click", () => {
    // Визуальный дебаг: чтобы ты точно видел, что клик работает
    sendBtn.textContent = "…";
    setTimeout(() => (sendBtn.textContent = "➤"), 300);

    const text = (q.value || "").trim();
    if (!text) { alert("Пустой текст"); return; }
    send({ type: "text", text });
    q.value = "";
  });

  // Чипы
  document.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Нажато: " + (btn.dataset.mode || "chip"));
      send({ type: "mode", mode: btn.dataset.mode });
    });
  });
});
