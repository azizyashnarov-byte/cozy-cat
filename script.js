// Ждём загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    
    const catContainer = document.getElementById("cat-container");
    const body = document.body;
    const messageText = document.getElementById("message-text");

    // --- НАСТРОЙКИ УЮТА ---

    // Палитра мягких фонов (Cozy Backgrounds)
    const backgroundColors = [
        "#fffaf0", // Floral White
        "#f0f9ff", // Alice Blue
        "#fdf2f8", // Lavender Blush
        "#eef2ff", // Человеческий серый-голубой
        "#f0fff4", // Honeydew
        "#fffbeb"  // Amber-50
    ];

    // Палитра оттенков котика (Cat Tints)
    // Мы меняем "filter: hue-rotate", чтобы сдвигать цвет самой картинки
    const catFilters = [
        "hue-rotate(0deg) brightness(1)",   // Стандарт
        "hue-rotate(20deg) brightness(1.05)", // Чуть теплее
        "hue-rotate(-15deg) brightness(0.95)",// Чуть холоднее
        "hue-rotate(180deg) sepia(0.3)"      // Необычный, но мягкий
    ];

    // Временные сообщения-заглушки (пока владелец не дал список)
    const placeholderMessages = [
        "Мяу! Нажми ещё раз 🐾",
        "Просто расслабься... 🧘‍♀️",
        "Тёплые обнимашки тебе! 🤗",
        "Ты чудо ✨",
        "Всё будет хорошо ❤️",
        "Муррр... Как уютно",
        "Спасибо, что ты есть 🐱"
    ];

    let lastBackgroundColorIndex = -1;
    let lastCatFilterIndex = -1;

    // --- ФУНКЦИИ МАГИИ ---

    // Получить случайный индекс, отличный от предыдущего
    function getNewIndex(max, lastIndex) {
        let newIndex = Math.floor(Math.random() * max);
        while (newIndex === lastIndex) {
            newIndex = Math.floor(Math.random() * max);
        }
        return newIndex;
    }

    // Главная функция нажатия
    function handleCatClick() {
        // 1. Смена фона
        const bgIndex = getNewIndex(backgroundColors.length, lastBackgroundColorIndex);
        body.style.backgroundColor = backgroundColors[bgIndex];
        lastBackgroundColorIndex = bgIndex;

        // 2. Смена цвета котика
        const catIndex = getNewIndex(catFilters.length, lastCatFilterIndex);
        catContainer.style.filter = catFilters[catIndex];
        lastCatFilterIndex = catIndex;

        // 3. Смена сообщения
        const msgIndex = Math.floor(Math.random() * placeholderMessages.length);
        
        // Сначала плавно убираем старый текст
        messageText.style.animation = 'none'; // Сброс анимации
        messageText.offsetHeight; // Триггер рефлоу для перезапуска
        
        messageText.textContent = placeholderMessages[msgIndex];
        
        // Плавно показываем новый текст
        messageText.style.animation = 'fadeIn 0.8s ease';
    }

    // --- ПОДКЛЮЧЕНИЕ ОБРАБОТЧИКА ---
    // Нажимаем именно на контейнер котика
    catContainer.addEventListener("click", handleCatClick);

});
