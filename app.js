document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram?.WebApp;
  const q = document.getElementById("q");

  function send(payload){
    if (!tg) {
      alert("Открой через Telegram (кнопкой Web App), а не в браузере.");
      return;
    }
    tg.sendData(JSON.stringify(payload));
    // ВАЖНО: многие клиенты доставляют данные при закрытии WebApp
    setTimeout(() => tg.close(), 150);
  }

  if (tg) {
    tg.expand();
    tg.ready();

    // Надёжный способ: MainButton
    tg.MainButton.setText("Отправить в бот");
    tg.MainButton.show();
    tg.MainButton.onClick(() => {
      const text = (q?.value || "").trim() || "ping";
      send({ type: "text", text });
      if (q) q.value = "";
    });
  }

  // Чипы тоже отправляют и закрывают
  document.querySelectorAll(".chip").forEach(btn=>{
    btn.addEventListener("click", () => {
      send({ type: "mode", mode: btn.dataset.mode });
    });
  });

  // Кнопка ➤
  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const text = (q?.value || "").trim();
      if (!text) return alert("Пустой текст");
      send({ type: "text", text });
      if (q) q.value = "";
    });
  }
});
