document.addEventListener("DOMContentLoaded", function () {
  // Инициализация Swiper слайдеров
  initSwipers();

  // Инициализация UI‑элементов
  initUIElements();

  // Инициализация корзины
  initCart();

  // Инициализация поиска и сортировки
  initSearchAndSorting();

  // Инициализация табов
  initTabs();

  // Инициализация навигации по категориям
  initCategoryNavigation();
});

// --- ИНИЦИАЛИЗАЦИЯ SWIPER ---
function initSwipers() {
  const swiperSlider = document.querySelector(".swiper-slider");
  if (swiperSlider) {
    new Swiper(".swiper-slider", {
      slidesPerView: 1.2,
      spaceBetween: 0,
      centeredSlides: true,
      initialSlide: 1,
      autoplay: { delay: 2000, disableOnInteraction: false },
      speed: 600,
    });
  }

  const tabsSlider = document.querySelector(".swiper-tabs");
  if (tabsSlider) {
    new Swiper(".swiper-tabs", {
      spaceBetween: 10,
      slidesPerView: "auto",
      slidesPerGroup: 1,
      grabCursor: true,
      freeMode: true,
      freeModeMomentum: true,
      freeModeMomentumRatio: 0.7,
      freeModeMomentumBounce: true,
      freeModeMinimumVelocity: 0.1,
      speed: 600,
    });
  }
}

// --- ИНИЦИАЛИЗАЦИЯ UI‑ЭЛЕМЕНТОВ ---
function initUIElements() {
  initScrollToTop();
  initBurgerMenu();
}

function initScrollToTop() {
  const scrollToTopBtn = document.getElementById("scrollToTop");

  function toggleScrollButton() {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;
    scrollToTopBtn.classList.toggle("visible", scrollPosition > 10);
  }

  window.addEventListener("scroll", toggleScrollButton);
  scrollToTopBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
  toggleScrollButton();
}

function initBurgerMenu() {
  const burgerBtn = document.getElementById("burgerMenuBtn");
  const burgerMenu = document.getElementById("burgerMenu");

  let startX = 0;
  let isSwiping = false;

  function toggleMenu() {
    burgerMenu.classList.toggle("active");
    burgerBtn.classList.toggle("active");
  }

  burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    if (!burgerMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
      if (burgerMenu.classList.contains("active")) toggleMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burgerMenu.classList.contains("active")) {
      toggleMenu();
    }
  });

  burgerMenu.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  burgerMenu.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    if (currentX - startX > 50) {
      isSwiping = false;
      toggleMenu();
    }
  });

  burgerMenu.addEventListener("touchend", () => (isSwiping = false));
}

// --- СИСТЕМА КОРЗИНЫ ---
function initCart() {
  const cart = {
    items: new Map(),
    totalCount: 0,
    totalPrice: 0,
  };

  const mainSection = document.querySelector(".catalog-main");
  const sliderSection = document.querySelector(".slider");
  const cartSection = document.querySelector(".cart");

  function getProductId(product) {
    return `${product.dataset.name}-${product.dataset.country}`;
  }

  function updateCartUI() {
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    cartCount.textContent = cart.totalCount;

    const isCartVisible = cart.totalCount > 0;

    if (isCartVisible > 0) {
      document.getElementById("cartBottomBar").classList.add("visible");
    }

    [".messenger-vidjet", ".scrollToTop", ".footer"].forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) element.classList.toggle("cart-visible", isCartVisible);
    });

    updateBottomBarVisibility();
  }

  function updateBottomBarVisibility() {
    const isCartVisible =
      cartSection && cartSection.classList.contains("visible");
    const bottomBar = document.getElementById("cartBottomBar");

    // Показываем плашку только когда корзина закрыта
    // И есть хотя бы один товар в корзине
    const hasItems = cart.totalCount > 0;

    if (hasItems) {
      bottomBar.classList.remove("hidden");
      bottomBar.classList.add("visible");
    } else {
      bottomBar.classList.remove("visible");
      bottomBar.classList.add("hidden");
    }
  }

  function addToCart(product, quantity = 1) {
    const productId = getProductId(product);
    const price = Number(product.dataset.price);

    if (cart.items.has(productId)) {
      cart.items.get(productId).quantity += quantity;
    } else {
      cart.items.set(productId, { product, quantity });
    }

    cart.totalCount += quantity;
    cart.totalPrice += price * quantity;
    updateCartUI();
  }

  function removeFromCart(productId) {
    if (!cart.items.has(productId)) return;

    const item = cart.items.get(productId);
    const price = Number(item.product.dataset.price);

    cart.totalCount -= item.quantity;
    cart.totalPrice -= price * item.quantity;
    cart.items.delete(productId);
    updateCartUI();
  }

  function updateQuantity(productId, newQuantity) {
    if (!cart.items.has(productId) || newQuantity < 1) return;

    const item = cart.items.get(productId);
    const price = Number(item.product.dataset.price);
    const quantityDiff = newQuantity - item.quantity;

    cart.totalCount += quantityDiff;
    cart.totalPrice += price * quantityDiff;
    item.quantity = newQuantity;
    updateCartUI();
  }

  function getProductWordForm(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "товаров";
    if (lastDigit === 1) return "товар";
    if (lastDigit >= 2 && lastDigit <= 4) return "товара";
    return "товаров";
  }

  function renderQuantityControls(product, originalButton) {
    const productId = getProductId(product);
    const item = cart.items.get(productId);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";
    controls.innerHTML = `
      <button class="quantity-btn minus">-</button>
      <span class="quantity-display">${item.quantity}</span>
      <button class="quantity-btn plus">+</button>
    `;

    const loader = document.createElement("div");
    loader.className = "quantity-loader";
    loader.innerHTML = `
  <div class="spinner"></div>
  <span class="loader-text">Загрузка...</span>
`;

    originalButton.replaceWith(controls);

    controls.querySelector(".minus").addEventListener("click", () => {
      if (item.quantity > 1) {
        updateQuantity(productId, item.quantity - 1);
        controls.querySelector(".quantity-display").textContent = item.quantity;
      } else {
        removeFromCart(productId);
        renderAddToCartButton(product, controls);
      }
    });

    controls.querySelector(".plus").addEventListener("click", () => {
      updateQuantity(productId, item.quantity + 1);
      controls.querySelector(".quantity-display").textContent = item.quantity;
    });
  }

  function renderAddToCartButton(product, controlsContainer) {
    const button = document.createElement("button");
    button.className = "product-btn";
    button.textContent = "В корзину";

    controlsContainer.replaceWith(button);

    button.addEventListener("click", function () {
      const product = this.closest(".product-item");
      addToCart(product);
      renderQuantityControls(product, this);
    });
  }

  function initProductButtons() {
    document.querySelectorAll(".product-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const product = this.closest(".product-item");
        const productImage = product.querySelector("img");
        const cartTarget = document.getElementById("cartButton"); // Целимся в кнопку корзины

        // Создаём клон изображения для анимации
        const flyingImage = productImage.cloneNode(true);
        flyingImage.className = "flying-image";

        // Получаем позиции для расчёта анимации
        const imageRect = productImage.getBoundingClientRect();
        const cartRect = cartTarget.getBoundingClientRect();

        // Рассчитываем смещение относительно корзины
        const deltaX =
          cartRect.left +
          cartRect.width / 2 -
          imageRect.left -
          imageRect.width / 2;
        const deltaY =
          cartRect.top +
          cartRect.height / 2 -
          imageRect.top -
          imageRect.height / 2;

        // Позиционируем клон в начальной точке
        flyingImage.style.left = imageRect.left + "px";
        flyingImage.style.top = imageRect.top + "px";
        flyingImage.style.width = imageRect.width + "px";
        flyingImage.style.height = imageRect.height + "px";

        document.body.appendChild(flyingImage);

        // Включаем анимацию загрузки в кнопке
        toggleLoading(this, true);

        const productId = getProductId(product);

        if (cart.items.has(productId)) {
          updateQuantity(productId, cart.items.get(productId).quantity + 1);
        } else {
          addToCart(product);
        }

        // Запускаем анимацию с рассчитанными параметрами
        requestAnimationFrame(() => {
          flyingImage.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;
          flyingImage.style.opacity = "0";
        });

        // Отключаем анимацию и показываем элементы управления через 800 мс
        setTimeout(() => {
          toggleLoading(this, false);
          renderQuantityControls(product, this);

          // Обновляем счётчик товаров в корзине
          updateCartCount();

          // Удаляем клон после завершения анимации
          if (flyingImage && flyingImage.parentNode) {
            flyingImage.parentNode.removeChild(flyingImage);
          }
        }, 1500);
      });
    });
  }

  // Функция обновления счётчика товаров в корзине

  // Функция управления анимацией загрузки
  function toggleLoading(button, isLoading) {
    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.classList.add("loading");
      button.disabled = true;

      const loader = document.createElement("div");
      loader.className = "button-loader";
      loader.innerHTML = `
      <div class="spinner"></div>
    `;
      button.innerHTML = "";
      button.appendChild(loader);
    } else {
      button.classList.remove("loading");
      button.disabled = false;
      button.textContent = button.dataset.originalText;
    }
  }

  // Обработчики для корзины

  // Обработчики для элементов корзины
  if (cartSection) {
    cartSection.addEventListener("click", (e) => {
      if (e.target.classList.contains("minus")) {
        const productId = e.target.dataset.id;
        const item = cart.items.get(productId);
        if (item && item.quantity > 1)
          updateQuantity(productId, item.quantity - 1);
      } else if (e.target.classList.contains("plus")) {
        const productId = e.target.dataset.id;
        updateQuantity(productId, cart.items.get(productId).quantity + 1);
      } else if (e.target.classList.contains("cart-item-close")) {
        removeFromCart(e.target.dataset.id);
      }
    });
  }

  initProductButtons();
}

// --- ИНИЦИАЛИЗАЦИЯ ПОИСКА И СОРТИРОВКИ ---
function initSearchAndSorting() {
  const searchInput = document.getElementById("searchInput");
  const closeSearchBtn = document.getElementById("closeSearch");
  const productList = document.getElementById("productList");
  const products = Array.from(productList.querySelectorAll(".product-item"));
  const sortSearch = document.getElementById("sortSearch");
  const sortSearchMenu = document.querySelector(".sort-options");
  const sortRadios = document.querySelectorAll('input[name="sort"]');

  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    products.forEach((product) => {
      const name = product.dataset.name.toLowerCase();
      product.style.display =
        searchTerm === "" || name.includes(searchTerm) ? "block" : "none";
    });
    applySorting();
  }

  function applySorting() {
    const selectedRadio = document.querySelector('input[name="sort"]:checked');
    const sortValue = selectedRadio ? selectedRadio.value : "default";
    const visibleProducts = products.filter((p) => p.style.display !== "none");

    visibleProducts.sort((a, b) => {
      switch (sortValue) {
        case "price-asc":
          return Number(a.dataset.price) - Number(b.dataset.price);
        case "price-desc":
          return Number(b.dataset.price) - Number(a.dataset.price);
        case "rating":
          const ratingA = Number(a.dataset.rating) || 0;
          const ratingB = Number(b.dataset.rating) || 0;
          return ratingB - ratingA;
        case "new":
          const dateA = new Date(a.dataset.date || 0);
          const dateB = new Date(b.dataset.date || 0);
          return dateB - dateA;
        default:
          return 0;
      }
    });

    visibleProducts.forEach((product) => productList.appendChild(product));
  }

  searchInput.addEventListener("input", filterProducts);
  closeSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    filterProducts();
    searchInput.focus();
  });
  searchInput.addEventListener("input", () =>
    closeSearchBtn.classList.toggle("active", searchInput.value !== ""),
  );

  sortRadios.forEach((radio) =>
    radio.addEventListener("change", () => {
      applySorting();
      sortSearchMenu.classList.remove("active");
    }),
  );

  sortSearch.addEventListener("click", (e) => {
    e.stopPropagation();
    sortSearchMenu.classList.add("active");
  });

  document.addEventListener("click", (e) => {
    if (!sortSearch.contains(e.target) && !sortSearchMenu.contains(e.target)) {
      sortSearchMenu.classList.remove("active");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") sortSearchMenu.classList.remove("active");
  });

  applySorting();
}

// --- ИНИЦИАЛИЗАЦИЯ ТАБОВ ---
function initTabs() {
  const tabCategories = document.querySelectorAll(".tab-category");
  const products = document.querySelectorAll(".product-item");

  function filterProductsByCountry(country) {
    products.forEach((product) => {
      const productCountry = product.dataset.country;
      product.style.display =
        country === "Все" || country === productCountry ? "flex" : "none";
    });
  }

  tabCategories.forEach((tab) =>
    tab.addEventListener("click", function () {
      tabCategories.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      const country = this.dataset.tabCategory;
      filterProductsByCountry(country);
    }),
  );

  // Инициализация: показываем все товары при загрузке
  filterProductsByCountry("Все");
}

// --- ИНИЦИАЛИЗАЦИЯ НАВИГАЦИИ ПО КАТЕГОРИЯМ ---
function initCategoryNavigation() {
  const catalogSection = document.querySelector(".catalog");
  const mainSection = document.querySelector(".catalog-main");
  const categoryItems = document.querySelectorAll(".catalog-category-item");
  const breadcrumbsText = document.querySelector(
    ".row-category-breadcrumbs-text",
  );

  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const category = this.dataset.category;

      // Обновляем текст в хлебных крошках
      if (breadcrumbsText) {
        breadcrumbsText.textContent = category;
      }

      // Плавно скрываем .catalog
      catalogSection.classList.add("hidden");

      // Через время показываем .catalog-main (ждём завершения анимации)
      setTimeout(() => {
        mainSection.classList.remove("visible");
        mainSection.style.display = "block"; // сначала показываем
        setTimeout(() => {
          mainSection.classList.add("visible"); // затем добавляем видимость с анимацией
        }, 10);
      }, 100); // 100 мс = длительность анимации
    });
  });

  // Опционально: кнопка «назад» для возврата к выбору категорий
  const backButton = document.querySelector(".row-category-breadcrumbs img");
  if (backButton) {
    backButton.addEventListener("click", function () {
      // Скрываем .catalog-main
      mainSection.classList.remove("visible");

      setTimeout(() => {
        mainSection.style.display = "none";
      }, 10);

      // Через время показываем .catalog
      setTimeout(() => {
        catalogSection.classList.remove("hidden");
      }, 10);
    });
  }
}
