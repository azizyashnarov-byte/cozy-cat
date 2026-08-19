const catContainer = document.getElementById("cat-container");
const messageText = document.getElementById("message-text");
const photoBox = document.getElementById("photo-box");
const photoInput = document.getElementById("photo-input");
const sendBtn = document.getElementById("send-btn");
const status = document.getElementById("status");
const preview = document.getElementById("preview");

// Создаём контейнер для сердечек прямо в скрипте
const heartsContainer = document.createElement("div");
heartsContainer.id = "hearts-container";
document.body.appendChild(heartsContainer);

let isTaskActive = false;
let currentFile = null;

const bgColors = ["#fffaf0", "#f0f9ff", "#fdf2f8", "#eef2ff", "#f0fff4", "#fffbeb"];
const catFilters = [
  "hue-rotate(0deg)",
  "hue-rotate(25deg) brightness(1.05)",
  "hue-rotate(-20deg) brightness(0.95)",
  "hue-rotate(180deg) sepia(0.2)"
];

const normalMessages = [
  "Мяу! Нажми ещё раз 🐾",
  "Просто расслабься... 🧘‍♀️",
  "Тёплые обнимашки тебе! 🤗",
  "Ты чудо ✨",
  "Всё будет хорошо ❤️",
  "Муррр... Как уютно",
  "Думаю о тебе 💭"
];

const photoTasks = [
  "🐱 Изобрази котика и отправь мне фото!",
  "😾 Отправь мне фото, где ты злая!",
  "☕️ Покажи, что ты сейчас пьёшь или ешь!",
  "🤳 Сделай самое милое селфи!"
];

// Функция генерации множества сердечек при нажатии
function createHearts() {
  const heartIcons = ["❤️", "💖", "💕", "💗", "💓", "🌸"];
  const count = 15; // Количество сердечек за один клик

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    
    // Рандомная позиция по всей ширине и высоте экрана
    heart.style.left = Math.random() * 90 + 5 + "vw";
    heart.style.top = Math.random() * 60 + 20 + "vh";
    
    // Рандомный размер
    heart.style.fontSize = Math.random() * 15 + 15 + "px";

    heartsContainer.appendChild(heart);

    // Удаляем сердечко после завершения анимации
    setTimeout(() => {
      heart.remove();
    }, 2000);
  }
}

catContainer.addEventListener("click", () => {
  if (isTaskActive) {
    status.textContent = "⚠️ Сначала отправь фото, чтобы продолжить!";
    return;
  }

  // Запускаем салют из сердечек!
  createHearts();

  const isTask = Math.random() < 0.05;

  if (isTask) {
    isTaskActive = true;
    const randomTask = photoTasks[Math.floor(Math.random() * photoTasks.length)];
    messageText.textContent = randomTask;
    photoBox.style.display = "flex";
    status.textContent = "Задание обязательно к исполнению 🐾";
  } else {
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const randomFilter = catFilters[Math.floor(Math.random() * catFilters.length)];
    const randomMsg = normalMessages[Math.floor(Math.random() * normalMessages.length)];

    document.body.style.backgroundColor = randomBg;
    catContainer.style.filter = randomFilter;
    messageText.textContent = randomMsg;
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
