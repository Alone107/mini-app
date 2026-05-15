const swiperSlider = document.querySelector(".swiper-slider");

if (swiperSlider) {
  const swiper = new Swiper(".swiper-slider", {
    // Optional parameters

    slidesPerView: 1.2,
    spaceBetween: 0,
    centeredSlides: true,
    initialSlide: 1,

    // Автоматическое переключение слайдов (опционально)
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    // Плавная прокрутка
    speed: 600,
    // Зацикливание
    // If we need pagination
  });
}

const scrollToTopBtn = document.getElementById("scrollToTop");

// Функция для показа/скрытия кнопки
function toggleScrollButton() {
  // Определяем позицию прокрутки
  const scrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;

  // Показываем кнопку, если прокрутили больше 300 px
  if (scrollPosition > 10) {
    scrollToTopBtn.classList.add("visible");
  } else {
    scrollToTopBtn.classList.remove("visible");
  }
}

// Обработчик прокрутки
window.addEventListener("scroll", toggleScrollButton);

// Обработчик клика — плавная прокрутка наверх
scrollToTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Плавная прокрутка
  });
});

// Инициализация — проверяем положение при загрузке
toggleScrollButton();

// -------------------------------------------

const burgerBtn = document.getElementById("burgerMenuBtn");
const burgerMenu = document.getElementById("burgerMenu");

let startX = 0;
let isSwiping = false;

// Функция открытия/закрытия меню
function toggleMenu() {
  burgerMenu.classList.toggle("active");
  burgerBtn.classList.toggle("active");
}

// Открытие/закрытие по клику на бургер
burgerBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  toggleMenu();
});

// Закрытие меню при клике вне его области
document.addEventListener("click", function (e) {
  if (!burgerMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
    if (burgerMenu.classList.contains("active")) {
      toggleMenu();
    }
  }
});

// Закрытие меню при нажатии Escape
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && burgerMenu.classList.contains("active")) {
    toggleMenu();
  }
});

// Обработка начала касания (touchstart)
burgerMenu.addEventListener("touchstart", function (e) {
  startX = e.touches[0].clientX;
  isSwiping = true;
});

// Обработка движения пальца (touchmove)
burgerMenu.addEventListener("touchmove", function (e) {
  if (!isSwiping) return;

  const currentX = e.touches[0].clientX;
  const diffX = startX - currentX;

  // Если свайп влево (пользователь тянет меню вправо)
  if (diffX > 50) {
    // порог в 50 px для срабатывания
    isSwiping = false;
    toggleMenu(); // закрываем меню
  }
});

// Сброс флага при завершении касания
burgerMenu.addEventListener("touchend", function () {
  isSwiping = false;
});
