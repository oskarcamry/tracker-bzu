document.addEventListener('DOMContentLoaded', () => {
    // Элементы
    const proteinInput = document.getElementById('protein-input');
    const carbsInput = document.getElementById('carbs-input');
    const weightInput = document.getElementById('weight-input');
    const addMealBtn = document.getElementById('add-meal-btn');
    const saveDayBtn = document.getElementById('save-day-btn');
    const reportBody = document.getElementById('report-body');

    // Текущие счетчики (в памяти)
    let dailyP = 0;
    let dailyC = 0;

    // Инициализация
    loadDailyProgress();
    displayReport();

    // 1. Добавление приема пищи (на протяжении дня)
    addMealBtn.addEventListener('click', () => {
        const p = parseFloat(proteinInput.value) || 0;
        const c = parseFloat(carbsInput.value) || 0;

        dailyP += p;
        dailyC += c;

        updateDisplay();
        saveCurrentState(); // сохраняем, чтобы не пропало при обновлении страницы

        proteinInput.value = '';
        carbsInput.value = '';
        
        // Маленькая анимация подтверждения
        addMealBtn.innerText = "Добавлено!";
        setTimeout(() => addMealBtn.innerText = "Добавить в дневник", 1000);
    });

    // 2. Сохранение итогов дня в отчет
    saveDayBtn.addEventListener('click', () => {
        const weight = weightInput.value;
        if (!weight) {
            alert("Введи вес перед закрытием дня");
            return;
        }

        const entry = {
            date: new Date().toLocaleDateString('ru-RU'),
            protein: dailyP,
            carbs: dailyC,
            weight: weight
        };

        let history = JSON.parse(localStorage.getItem('healthReport')) || [];
        
        // Если за сегодня запись уже была — обновляем её, если нет — добавляем
        const existingIndex = history.findIndex(item => item.date === entry.date);
        if (existingIndex !== -1) {
            history[existingIndex] = entry;
        } else {
            history.push(entry);
        }

        localStorage.setItem('healthReport', JSON.stringify(history));
        
        // Сбрасываем дневные данные
        dailyP = 0;
        dailyC = 0;
        saveCurrentState();
        updateDisplay();
        displayReport();
        
        alert("День успешно сохранен в отчет!");
    });

    function updateDisplay() {
        document.getElementById('today-p').innerText = dailyP;
        document.getElementById('today-c').innerText = dailyC;
    }

    // Сохранение "черновика" дня
    function saveCurrentState() {
        localStorage.setItem('tempDay', JSON.stringify({ p: dailyP, c: dailyC }));
    }

    // Загрузка "черновика" (если закрыл вкладку и зашел позже)
    function loadDailyProgress() {
        const temp = JSON.parse(localStorage.getItem('tempDay'));
        if (temp) {
            dailyP = temp.p;
            dailyC = temp.c;
            updateDisplay();
        }
    }

    function displayReport() {
        const history = JSON.parse(localStorage.getItem('healthReport')) || [];
        reportBody.innerHTML = history.slice().reverse().map(item => `
            <tr>
                <td>${item.date}</td>
                <td>${item.protein}г</td>
                <td>${item.carbs}г</td>
                <td>${item.weight}кг</td>
            </tr>
        `).join('');
    }

    document.getElementById('clear-btn').addEventListener('click', () => {
        if (confirm('Удалить всю историю?')) {
            localStorage.removeItem('healthReport');
            displayReport();
        }
    });
});

