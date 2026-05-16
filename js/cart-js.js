document.addEventListener("DOMContentLoaded", function () {
  initQuantityButtons();
  initCloseButtons();
});

// Функция инициализации кнопок изменения количества
function initQuantityButtons() {
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
  }
}
