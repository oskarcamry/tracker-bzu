function renderMenu() {
    const select = document.getElementById('pizzaVid');
    select.innerHTML = '';

    menu.forEach((pizza, index) => {
        const variant = document.createElement('option');
        variant.value = index + 1;

        const emoji = pizza.isSpicy ? "🌶️" : "";
        variant.innerText = `${emoji}${pizza.title} - ${pizza.price}₽`;
        select.appendChild(variant);
});
};

function addPizza() {
    const title = document.getElementById('newTitle').value;
    const price = Number(document.getElementById('newPrice').value);
    const isSpicy = document.getElementById('newSpicy').checked;

    if (title && price > 0) {
        // Добавляем новый объект в наш массив
        menu.push({
            title: title,
            price: price,
            isSpicy: isSpicy,
            category: "Новинки"
        });



        // ПЕРЕРИСОВЫВАЕМ список, чтобы новая пицца появилась в <select>
        renderMenu();

        // Очищаем поля ввода
        document.getElementById('newTitle').value = '';
        document.getElementById('newPrice').value = '';
        document.getElementById('newSpicy').checked = false;
        
        alert("Пицца добавлена в меню!");
    } else {
        alert("Заполните название и цену!");
    }
}