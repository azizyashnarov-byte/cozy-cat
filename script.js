const catContainer = document.getElementById("cat-container");
const messageText = document.getElementById("message-text");
const photoBox = document.getElementById("photo-box");
const photoInput = document.getElementById("photo-input");
const sendBtn = document.getElementById("send-btn");
const status = document.getElementById("status");
const preview = document.getElementById("preview");
const musicBtn = document.getElementById("music-btn");

let isTaskActive = false;
let currentFile = null;
let lastBgIndex = -1;
let lastFilterIndex = -1;

// --- АУДИО МУРЛЫКАНЬЯ (Снятие блокировки браузеров) ---
let audioCtx = null;
let purrOscillator = null;
let isPurring = false;

// Активация аудио-контекста при первом касании
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function togglePurr() {
  initAudio();

  if (isPurring) {
    if (purrOscillator) {
      try { purrOscillator.stop(); } catch(e) {}
      purrOscillator.disconnect();
    }
    isPurring = false;
    musicBtn.classList.remove("playing");
    musicBtn.textContent = "🎵";
  } else {
    // Создаем глухое мягкое мурлыканье
    purrOscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    purrOscillator.type = "sine";
    purrOscillator.frequency.setValueAtTime(28, audioCtx.currentTime);
    
    const mod = audioCtx.createOscillator();
    mod.frequency.setValueAtTime(2.5, audioCtx.currentTime);
    const modGain = audioCtx.createGain();
    modGain.gain.setValueAtTime(8, audioCtx.currentTime);
    
    mod.connect(modGain);
    modGain.connect(purrOscillator.frequency);
    
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
    
    purrOscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    purrOscillator.start();
    mod.start();
    
    isPurring = true;
    musicBtn.classList.add("playing");
    musicBtn.textContent = "🎶";
  }
}

musicBtn.addEventListener("click", togglePurr);

// --- ЦВЕТА И МАССИВЫ ---
const bgColors = [
  "#fffaf0", "#f0f9ff", "#fdf2f8", "#eef2ff", "#f0fff4", "#fffbeb",
  "#faf5ff", "#f0fdf4", "#fff1f2", "#f5f3ff"
];

const catFilters = [
  "hue-rotate(0deg)",
  "hue-rotate(25deg) brightness(1.05)",
  "hue-rotate(-20deg) brightness(0.95)",
  "hue-rotate(180deg) sepia(0.2)",
  "hue-rotate(140deg) brightness(1.1)",
  "hue-rotate(-40deg) brightness(1.02)"
];

const normalMessages = [
  "Мяу! Нажми ещё раз 🐾",
  "Просто расслабься и улыбнись 🧘‍♀️",
  "Тёплые обнимашки тебе через экран! 🤗",
  "Ты невероятное чудо ✨",
  "Всё обязательно будет хорошо ❤️",
  "Муррр... Как с тобой уютно 🐱",
  "Думаю о тебе прямо сейчас 💭",
  "Не забывай пить водичку и отдыхать 💧",
  "Ты делаешь этот мир значительно светлее ☀️",
  "Отправляю тебе виртуальный чмок! 💋",
  "Ты справляешься со всем лучше всех 🌸",
  "Сделай глубокий вдох и выдох... 🍃",
  "Кто тут самая милая? Ты! 🥰",
  "Пусть этот день принесёт тебе радость 🎁",
  "Я всегда рядом, даже если далеко 🌌",
  "Твоя улыбка — лучшее, что есть на свете 💖",
  "Погладь котика ещё раз! 🐾",
  "Ты заслуживаешь всего самого прекрасного ✨",
  "Надеюсь, ты сегодня вкусно поела 🍕",
  "Скучаю по тебе очень сильно... 🥺",
  "Ты мой самый любимый человечек ❤️",
  "Ты лучик солнца в пасмурный день 🌤️",
  "Мур-мур-мур! Котик передаёт привет 🐱",
  "Позволь себе немного отдохнуть ☕️",
  "Ты сильная, умная и очень красивая 🌺",
  "Всё получится, я в тебя верю! 🚀",
  "Завари себе вкусный чай 🍵",
  "Каждое твоё сообщение вызывает улыбку 😊",
  "Ты — моё главное вдохновение ✨",
  "Укутайся в пледик и расслабься 🛋️",
  "Обнимаю так крепко, как только могу! 🤗",
  "Пусть все заботы растворятся ☁️",
  "Ты украшение этого дня 🌷",
  "Ты прекрасна в любой момент 💖",
  "Сложные дни проходят, а ты остаёшься суперзвездой ⭐",
  "Сладких снов, если ты скоро ляжешь спать 🌙",
  "Ты даришь мне столько тепла! 🔥",
  "Мяу! Ты самая лучшая! 🐾",
  "Просто хочу, чтобы ты знала: ты важна ❤️",
  "Спасибо, что ты есть у меня ✨"
];

const hugMessages = [
  "Крепкие-крепкие обнимашки! Я держу тебя за руку ❤️",
  "Зажмурься и почувствуй, как я сильно тебя обнимаю 🤗",
  "Тепло моих обнимашек летит прямо к тебе сквозь любые километры ✨",
  "Ты в безопасности. Я рядом, муррр... 🐾"
];

const photoTasks = [
  "🐱 Изобрази котика и отправь мне фото!",
  "😾 Отправь мне фото, где ты делаешь смешную рожицу!",
  "☕️ Покажи, что ты сейчас пьёшь или ешь!",
  "🤳 Сделай самое милое селфи прямо сейчас!",
  "🧸 Отправь фото своего любимого предмета рядом!",
  "✌️ Сделай селфи с жестом «V» (милый знак)!",
  "👀 Покажи свои красивые глаза крупным планом!",
  "👟 Отправь фото своих ног/носочков прямо сейчас!",
  "🌤️ Покажи фото вида из твоего окна!",
  "❤️ Сделай фото, где ты руками показываешь сердечко!"
];

let messagesDeck = [];

function getNextMessage() {
  if (messagesDeck.length === 0) {
    messagesDeck = [...normalMessages].sort(() => Math.random() - 0.5);
  }
  return messagesDeck.pop();
}

function getNewIndex(max, last) {
  let newIdx = Math.floor(Math.random() * max);
  while (newIdx === last && max > 1) {
    newIdx = Math.floor(Math.random() * max);
  }
  return newIdx;
}

function spawnHeartsJS(count = 15) {
  const heartIcons = ["❤️", "💖", "💕", "💗", "💓", "🌸", "✨"];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.position = "fixed";
    heart.style.left = (Math.random() * 80 + 10) + "vw";
    heart.style.top = (Math.random() * 60 + 20) + "vh";
    heart.style.fontSize = (Math.random() * 20 + 20) + "px";
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "9999";
    heart.style.transition = "all 1.5s ease-out";
    heart.style.opacity = "1";

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translateY(-120px) scale(1.3) rotate(${(Math.random() - 0.5) * 60}deg)`;
      heart.style.opacity = "0";
    });

    setTimeout(() => { heart.remove(); }, 1500);
  }
}

// --- ЛОГИКА ДОЛГОГО НАЖАТИЯ (ОБНИМАШКИ) ---
let holdTimer = null;
let isHolding = false;

function startHold() {
  initAudio(); // Разблокируем звук
  if (isTaskActive) return;
  isHolding = false;
  holdTimer = setTimeout(() => {
    isHolding = true;
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    catContainer.classList.add("hugging");
    spawnHeartsJS(30);
    
    const randomHugMsg = hugMessages[Math.floor(Math.random() * hugMessages.length)];
    messageText.textContent = randomHugMsg;
  }, 1200);
}

function endHold() {
  clearTimeout(holdTimer);
  if (catContainer.classList.contains("hugging")) {
    setTimeout(() => {
      catContainer.classList.remove("hugging");
    }, 1000);
  }
}

catContainer.addEventListener("touchstart", startHold);
catContainer.addEventListener("touchend", endHold);
catContainer.addEventListener("mousedown", startHold);
catContainer.addEventListener("mouseup", endHold);

// Клик по котику
catContainer.addEventListener("click", () => {
  initAudio(); // Разблокируем звук
  if (isTaskActive) {
    status.textContent = "⚠️ Сначала отправь фото, чтобы продолжить!";
    return;
  }

  if (isHolding) {
    isHolding = false;
    return;
  }

  spawnHeartsJS(15);

  const isTask = Math.random() < 0.05;

  if (isTask) {
    isTaskActive = true;
    const randomTask = photoTasks[Math.floor(Math.random() * photoTasks.length)];
    messageText.textContent = randomTask;
    photoBox.style.display = "flex";
    status.textContent = "Задание обязательно к исполнению 🐾";
  } else {
    lastBgIndex = getNewIndex(bgColors.length, lastBgIndex);
    lastFilterIndex = getNewIndex(catFilters.length, lastFilterIndex);

    document.body.style.backgroundColor = bgColors[lastBgIndex];
    catContainer.style.filter = catFilters[lastFilterIndex];
    messageText.textContent = getNextMessage();
  }
});

async function processFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        const maxDim = 1000;

        if (w > maxDim || h > maxDim) {
          if (w > h) { h *= maxDim / w; w = maxDim; }
          else { w *= maxDim / h; h = maxDim; }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], "photo.jpg", { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        }, "image/jpeg", 0.8);
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

photoInput.addEventListener("change", (e) => {
  if (e.target.files && e.target.files[0]) {
    currentFile = e.target.files[0];
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      preview.src = evt.target.result;
      preview.style.display = "block";
      sendBtn.disabled = false;
      sendBtn.classList.add("active");
      status.textContent = "Фото выбрано, жми «Отправить»!";
    };
    reader.readAsDataURL(currentFile);
  }
});

sendBtn.addEventListener("click", async () => {
  if (!currentFile) return;

  status.textContent = "⚙️ Подготовка фото...";
  sendBtn.disabled = true;

  try {
    const cleanFile = await processFile(currentFile);
    status.textContent = "⏳ Отправка в Telegram...";

    const formData = new FormData();
    formData.append("photo", cleanFile, "photo.jpg");

    const res = await fetch("https://broken-wave-1cb1.azizyashnarov.workers.dev/send-photo", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (res.ok && data.success) {
      status.textContent = "✅ Отправлено!";
      
      setTimeout(() => {
        photoBox.style.display = "none";
        preview.style.display = "none";
        photoInput.value = "";
        currentFile = null;
        sendBtn.classList.remove("active");
        sendBtn.disabled = true;
        
        isTaskActive = false;
        messageText.textContent = "Спасибо за фото ❤️ Нажми на котика!";
      }, 1200);
    } else {
      status.textContent = `❌ Ошибка: ${data.error || "Не удалось отправить"}`;
      sendBtn.disabled = false;
    }
  } catch (err) {
    status.textContent = "❌ Ошибка сети при отправке.";
    sendBtn.disabled = false;
  }
});
