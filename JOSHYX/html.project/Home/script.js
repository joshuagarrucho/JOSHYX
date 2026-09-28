const PRODUCTS = {
  "black-baggy-denim": {
    name: "Black Baggy Denim",
    price: "PHP 1,000",
    image: "img/Baggy denim black.jpg",
    description: [
      "Relaxed, baggy fit throughout the leg",
      "Premium heavyweight denim",
      "Classic 4-pocket styling",
    ],
  },
  "black-sweatpants": {
    name: "Black Baggy Sweatpants",
    price: "PHP 900",
    image: "img/Black Baggy Sweatpants.webp",
    description: [
      "Ultra-soft cotton fleece blend",
      "Baggy, relaxed fit",
      "Adjustable drawstring waist",
    ],
  },
  "khaki-baggy-cargo-pants": {
    name: "Khaki Baggy Cargo Pants",
    price: "PHP 1,100",
    image: "img/Khaki Baggy Cargo Pants.png",
    description: [
      "Relaxed, baggy fit throughout the leg",
      "Durable cotton blend",
      "Multiple pocket design",
    ],
  },
  "ferrari-tee": {
    name: "Ferrari Tee T-Shirt",
    price: "PHP 900",
    image: "img/Ferrari Tee T-Shirt.jpg",
    description: [
      "Relaxed everyday fit",
      "Soft cotton fabric",
      "Graphic print detail",
    ],
  },
  "sakura-tee": {
    name: "Sakura Tee T-Shirt",
    price: "PHP 900",
    image: "img/Sakura Tee T-Shirt.png",
    description: [
      "Relaxed everyday fit",
      "Soft cotton fabric",
      "Graphic print detail",
    ],
  },
  "kaws-tee": {
    name: "Kaws Tee T-Shirt",
    price: "PHP 900",
    image: "img/Kaws Tee T-Shirt.png",
    description: [
      "Relaxed everyday fit",
      "Soft cotton fabric",
      "Graphic print detail",
    ],
  },
  "oversized-quarter-zip-pullover": {
    name: "Oversized Quarter-Zip Pullover",
    price: "PHP 2,000",
    image: "img/Oversized Quarter-Zip Pullover.avif",
    description: [
      "Oversized layering fit",
      "Quarter-zip neckline",
      "Warm, comfortable fabric",
    ],
  },
  "sweater-polo-shirt": {
    name: "Sweater Polo Shirt",
    price: "PHP 2,300",
    image: "img/Washable Milano Ribbed Skipper Polo Jumper.png",
    description: [
      "Ribbed knit construction",
      "Open polo collar",
      "Easy-care fabric",
    ],
  },
  "zip-up-blouson-jacket": {
    name: "Zip-Up Blouson Jacket",
    price: "PHP 2,500",
    image: "img/Zip-Up Blouson Jacket.png",
    description: [
      "Relaxed blouson silhouette",
      "Full zip closure",
      "Lightweight outer layer",
    ],
  },
  "white-art-cat-tee": {
    name: "White Art Cat T-Shirt",
    price: "PHP 900",
    image: "img/White Art Cat T-Shirt.jpg",
    description: [
      "Relaxed everyday fit",
      "Soft cotton fabric",
      "Graphic print detail",
    ],
  },
  "green-oversized-hoodie": {
    name: "Green Oversized Hoodie",
    price: "PHP 2,100",
    image: "img/Green Oversized Hoodie.webp",
    description: [
      "Oversized, relaxed fit",
      "Soft fleece interior",
      "Adjustable hood",
    ],
  },
  "grey-baggy-denim": {
    name: "Grey Baggy Denim",
    price: "PHP 1,000",
    image: "img/baggy denim.webp",
    description: [
      "Relaxed, baggy fit throughout the leg",
      "Premium heavyweight denim",
      "Classic 5-pocket styling",
    ],
  },
};

const PRODUCT_IDS_BY_NAME = Object.fromEntries(
  Object.entries(PRODUCTS).map(([id, product]) => [product.name.toLowerCase(), id]),
);

function initializeNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.getElementById("site-nav");

  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "Close" : "Menu";
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "Menu";
    });
  });
}

function initializeCatalogLinks() {
  document.querySelectorAll(".product-card").forEach((card) => {
    const name = card.querySelector(".product-name")?.textContent.trim().toLowerCase();
    const productId = PRODUCT_IDS_BY_NAME[name];
    const product = PRODUCTS[productId];

    if (!product) {
      return;
    }

    const productUrl = `product.html?item=${encodeURIComponent(productId)}`;
    const productStage = card.querySelector(".product-stage");
    const stageLink = productStage?.querySelector("a");
    const image = productStage?.querySelector("img");
    const buyLink = card.querySelector(".btn-buy");

    card.dataset.productId = productId;

    if (image) {
      image.src = product.image;
      image.alt = product.name;
    }

    if (stageLink) {
      stageLink.href = productUrl;
      stageLink.setAttribute("aria-label", `View ${product.name}`);
      stageLink.style.display = "block";
      stageLink.style.width = "100%";
      stageLink.style.height = "100%";

      if (image && image.parentElement !== stageLink) {
        stageLink.append(image);
      }
    }

    if (buyLink instanceof HTMLAnchorElement) {
      buyLink.href = productUrl;
    }
  });
}

function initializeCatalogControls() {
  const cards = [...document.querySelectorAll(".product-card")];
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const searchInput = document.querySelector(".search-input");
  const searchButton = document.querySelector(".search-trigger");

  if (!cards.length) {
    return;
  }

  let activeFilter = "all";
  let searchQuery = "";

  const applyFilters = () => {
    cards.forEach((card) => {
      const categoryMatches = activeFilter === "all" || card.dataset.category === activeFilter;
      const productName = card.querySelector(".product-name")?.textContent.toLowerCase() || "";
      const searchMatches = productName.includes(searchQuery);
      card.classList.toggle("is-hidden", !categoryMatches || !searchMatches);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      applyFilters();
    });
  });

  const updateSearch = () => {
    searchQuery = searchInput?.value.trim().toLowerCase() || "";
    applyFilters();
  };

  if (searchInput) {
    searchInput.addEventListener("input", updateSearch);
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        updateSearch();
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", updateSearch);
  }
}

function initializeJoinForm() {
  const joinForm = document.getElementById("join-form");
  const formMessage = document.getElementById("form-message");
  const emailInput = joinForm?.querySelector('input[type="email"]');

  if (!joinForm || !formMessage || !emailInput) {
    return;
  }

  joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      formMessage.textContent = "Add your email first.";
      return;
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    formMessage.textContent = isValid ? "You're on the list." : "Enter a valid email.";

    if (isValid) {
      joinForm.reset();
    }
  });
}

function initializeRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -30px 0px",
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function getQuantity(input) {
  const quantity = Number.parseInt(input?.value, 10);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function initializeProductPage() {
  const title = document.getElementById("product-title");

  if (!title) {
    return;
  }

  const productId = new URLSearchParams(window.location.search).get("item");
  const product = PRODUCTS[productId];
  const price = document.getElementById("product-price");
  const descriptionList = document.getElementById("product-desc-list");
  const productImages = document.querySelectorAll(".product-image img");
  const buyNowButton = document.getElementById("buy-now-btn");
  const purchaseMessage = document.getElementById("purchase-message");

  if (!product) {
    title.textContent = "Product Not Found";
    if (price) {
      price.textContent = "---";
    }
    if (buyNowButton instanceof HTMLButtonElement) {
      buyNowButton.disabled = true;
    }
    return;
  }

  title.textContent = product.name;
  document.title = `${product.name} - JOSHYX`;

  if (price) {
    price.textContent = product.price;
  }

  productImages.forEach((image) => {
    image.src = product.image;
    image.alt = product.name;
  });

  if (descriptionList) {
    descriptionList.replaceChildren(
      ...product.description.map((description) => {
        const item = document.createElement("li");
        item.textContent = description;
        return item;
      }),
    );
  }

  const sizeButtons = [...document.querySelectorAll(".size-btn")];
  const decreaseButton = document.getElementById("decrease");
  const increaseButton = document.getElementById("increase");
  const quantityInput = document.getElementById("qty-input");

  sizeButtons.forEach((button) => {
    button.type = "button";
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    button.addEventListener("click", () => {
      sizeButtons.forEach((sizeButton) => {
        const isSelected = sizeButton === button;
        sizeButton.classList.toggle("active", isSelected);
        sizeButton.setAttribute("aria-pressed", String(isSelected));
      });
    });
  });

  if (quantityInput) {
    quantityInput.addEventListener("change", () => {
      quantityInput.value = String(getQuantity(quantityInput));
    });
  }

  decreaseButton?.addEventListener("click", () => {
    if (quantityInput) {
      quantityInput.value = String(Math.max(1, getQuantity(quantityInput) - 1));
    }
  });

  increaseButton?.addEventListener("click", () => {
    if (quantityInput) {
      quantityInput.value = String(getQuantity(quantityInput) + 1);
    }
  });

  if (!(buyNowButton instanceof HTMLButtonElement) || !purchaseMessage) {
    return;
  }

  buyNowButton.addEventListener("click", () => {
    const selectedSize = document.querySelector(".size-btn.active")?.textContent.trim() || "S";
    const quantity = getQuantity(quantityInput);
    const purchase = {
      item: productId,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
    };

    try {
      sessionStorage.setItem("joshyx-purchase", JSON.stringify(purchase));
    } catch {
      // browser storage unavailable
    }

    purchaseMessage.textContent = `${quantity} ${product.name} in size ${selectedSize} selected for checkout.`;
  });
}

function loadCart() {
  try {
    const stored = sessionStorage.getItem("joshyx-cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    sessionStorage.setItem("joshyx-cart", JSON.stringify(cart));
  } catch {
    // storage unavailable
  }
}

function getCartTotal(cart) {
  return cart.reduce((total, item) => total + item.quantity * Number(item.unitPrice || 0), 0);
}

function formatPrice(value) {
  return `PHP ${value.toLocaleString("en-PH")}`;
}

function normalizePrice(priceText) {
  return Number(priceText.replace(/[^0-9.-]+/g, "")) || 0;
}

function renderCart() {
  const cart = loadCart();
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (!cartItemsContainer || !cartTotal || !cartCount) {
    return;
  }

  const visibleItems = cart.length > 0;
  cartItemsContainer.innerHTML = "";

  if (!visibleItems) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    cart.forEach((item) => {
      const cartItem = document.createElement("article");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-size">Size: ${item.size}</p>
          <p class="cart-item-quantity">Qty: ${item.quantity}</p>
          <p class="cart-item-price">${formatPrice(item.quantity * item.unitPrice)}</p>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
  }

  const total = getCartTotal(cart);
  cartTotal.textContent = `Total: ${formatPrice(total)}`;
  cartCount.textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0));
}

function addToCart(product, quantity = 1, size = "S") {
  if (!product) {
    return;
  }

  const cart = loadCart();
  const existing = cart.find((item) => item.id === product.id && item.size === size);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      size,
      quantity,
      unitPrice: normalizePrice(product.price),
      image: product.image,
    });
  }

  saveCart(cart);
  renderCart();
}

function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const toggle = document.getElementById("cart-toggle");
  if (!drawer || !toggle) {
    return;
  }

  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  toggle.setAttribute("aria-expanded", "true");
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const toggle = document.getElementById("cart-toggle");
  if (!drawer || !toggle) {
    return;
  }

  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  toggle.setAttribute("aria-expanded", "false");
}

function initializeCart() {
  const toggleButton = document.getElementById("cart-toggle");
  const closeButton = document.getElementById("cart-close");
  const clearButton = document.getElementById("cart-clear");
  const drawer = document.getElementById("cart-drawer");

  if (toggleButton) {
    toggleButton.addEventListener("click", openCartDrawer);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeCartDrawer);
  }

  if (drawer) {
    drawer.addEventListener("click", (event) => {
      if (event.target === drawer) {
        closeCartDrawer();
      }
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      saveCart([]);
      renderCart();
    });
  }

  renderCart();
}

function attachAddToCartButtons() {
  const catalogButtons = [...document.querySelectorAll(".product-card .btn-cart")];
  const productButton = document.getElementById("product-add-to-cart");

  catalogButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const productId = card?.dataset.productId;
      const product = PRODUCTS[productId];

      if (!product) {
        return;
      }

      addToCart({ id: productId, ...product }, 1, "S");
    });
  });

  if (productButton) {
    productButton.addEventListener("click", () => {
      const productId = new URLSearchParams(window.location.search).get("item");
      const product = PRODUCTS[productId];
      const quantityInput = document.getElementById("qty-input");
      const selectedSize = document.querySelector(".size-btn.active")?.textContent.trim() || "S";
      const quantity = getQuantity(quantityInput);

      if (!product) {
        return;
      }

      addToCart({ id: productId, ...product }, quantity, selectedSize);
    });
  }
}

function initializePage() {
  initializeNavigation();
  initializeCatalogLinks();
  initializeCatalogControls();
  initializeJoinForm();
  initializeRevealAnimations();
  initializeProductPage();
  initializeCart();
  attachAddToCartButtons();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage, { once: true });
} else {
  initializePage();
}
