document.addEventListener("DOMContentLoaded", function () {
  initQuantityButtons();
  initCloseButtons();
});

// Функция инициализации кнопок изменения количества
function initQuantityButtons() {
  // Удаляем старые обработчики, чтобы избежать дублирования
  document.querySelectorAll(".minus, .plus").forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });

  // Перепривязываем обработчики
  const minusButtons = document.querySelectorAll(".minus");
  const plusButtons = document.querySelectorAll(".plus");

  minusButtons.forEach((button) => {
    button.addEventListener("click", handleMinusClick);
  });

  plusButtons.forEach((button) => {
    button.addEventListener("click", handlePlusClick);
  });
}

// Обработчик клика на кнопку «−»
function handleMinusClick() {
  const input = this.closest(".cart-item-col").querySelector(".quantity-input");
  let currentValue = parseInt(input.value);

  if (currentValue > 1) {
    input.value = currentValue - 1;
  }
}

// Обработчик клика на кнопку «+»
function handlePlusClick() {
  const input = this.closest(".cart-item-col").querySelector(".quantity-input");
  let currentValue = parseInt(input.value);
  input.value = currentValue + 1;

  // Находим изображение товара внутри текущего элемента корзины
  const productImage =
    this.closest(".cart-item").querySelector(".cart-item-img img");
  // Находим целевую корзину (иконку корзины)
  const cartTarget = document.getElementById("cartButton");

  // Запускаем анимацию, если элементы найдены
  if (productImage && cartTarget) {
    startFlyingImageAnimation(productImage, cartTarget);
  }
}

// Функция инициализации кнопок удаления
function initCloseButtons() {
  const closeButtons = document.querySelectorAll(".cart-item-close");

  closeButtons.forEach((button) => {
    button.addEventListener("click", handleCloseClick);
  });
}

// Обработчик клика на кнопку удаления (x)
function handleCloseClick() {
  const cartItem = this.closest(".cart-item");
  if (cartItem) {
    cartItem.remove();
    // Переинициализируем кнопки после удаления товара
    initQuantityButtons();
  }
}

// Функция анимации полёта изображения
function startFlyingImageAnimation(productImage, cartTarget) {
  // Проверяем существование элементов
  if (!productImage || !cartTarget) {
    console.warn(
      "Не найдены элементы для анимации: productImage или cartTarget",
    );
    return;
  }

  try {
    // Создаём клон изображения для анимации
    const flyingImage = productImage.cloneNode(true);
    flyingImage.className = "flying-image";

    // Получаем позиции для расчёта анимации
    const imageRect = productImage.getBoundingClientRect();
    const cartRect = cartTarget.getBoundingClientRect();

    // Рассчитываем смещение относительно корзины
    const deltaX =
      cartRect.left + cartRect.width / 2 - imageRect.left - imageRect.width / 2;
    const deltaY =
      cartRect.top + cartRect.height / 2 - imageRect.top - imageRect.height / 2;

    // Позиционируем клон в начальной точке
    flyingImage.style.position = "fixed";
    flyingImage.style.left = imageRect.left + "px";
    flyingImage.style.top = imageRect.top + "px";
    flyingImage.style.width = imageRect.width + "px";
    flyingImage.style.height = imageRect.height + "px";
    flyingImage.style.zIndex = "1000";
    flyingImage.style.transition =
      "transform 1.5s ease-in-out, opacity 1.5s ease-in-out";

    document.body.appendChild(flyingImage);

    // Запускаем анимацию с рассчитанными параметрами
    requestAnimationFrame(() => {
      flyingImage.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;
      flyingImage.style.opacity = "0";
    });

    // Удаляем клон после завершения анимации
    setTimeout(() => {
      if (flyingImage && flyingImage.parentNode) {
        flyingImage.parentNode.removeChild(flyingImage);
      }
    }, 1500);
  } catch (error) {
    console.error("Ошибка при запуске анимации:", error);
  }
}
