const API_BASE = "https://tg-bot-webhook-kx1i.onrender.com"; // Render API

function el(id){ return document.getElementById(id); }

function addMsg(role, text){
  const wrap = el("messages");
  const row = document.createElement("div");
  row.className = "msg " + role;
  row.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
  wrap.appendChild(row);
  wrap.scrollTop = wrap.scrollHeight;
}

function escapeHtml(s){
  return (s||"").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

async function postJSON(path, body){
  const r = await fetch(API_BASE + path, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || ("HTTP " + r.status));
  return j;
}

document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram?.WebApp;
  const input = el("input");
  const sendBtn = el("sendBtn");
  const imgBtn = el("imgBtn");
  const imgFile = el("imgFile");

  if (!tg){
    addMsg("bot", "Открой это внутри Telegram (WebApp), а не в браузере.");
    return;
  }

  tg.expand(); tg.ready();
  tg.MainButton.setText("➤ Отправить").show();

  const initData = tg.initData || "";
  addMsg("bot", "❄️🔥 Я на связи. Напиши вопрос или отправь картинку.");

  async function sendText(){
    const text = (input.value || "").trim();
    if (!text) return;
    input.value = "";
    addMsg("user", text);
    addMsg("bot", "❄️🔥 Думаю...");

    try{
      const j = await postJSON("/api/chat", {initData, text});
      // заменяем последнюю "Думаю..." на ответ
      el("messages").lastChild.querySelector(".bubble").textContent = j.answer;
    }catch(e){
      el("messages").lastChild.querySelector(".bubble").textContent = "⚠️ " + e.message;
    }
  }

  async function sendImage(file){
    addMsg("user", "📷 Отправляю изображение...");
    addMsg("bot", "❄️🔥 Анализирую...");
    const dataUrl = await new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = () => rej(new Error("Не удалось прочитать файл"));
      fr.readAsDataURL(file);
    });

    try{
      const j = await postJSON("/api/vision", {initData, imageDataUrl: dataUrl});
      el("messages").lastChild.querySelector(".bubble").textContent = j.answer;
    }catch(e){
      el("messages").lastChild.querySelector(".bubble").textContent = "⚠️ " + e.message;
    }
  }

  sendBtn.addEventListener("click", sendText);
  tg.MainButton.onClick(sendText);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendText();
  });

  imgBtn.addEventListener("click", () => imgFile.click());
  imgFile.addEventListener("change", () => {
    const f = imgFile.files?.[0];
    imgFile.value = "";
    if (f) sendImage(f);
  });

  // быстрые режимы
  document.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      input.value = btn.dataset.prompt || "";
      input.focus();
    });
  });
});
