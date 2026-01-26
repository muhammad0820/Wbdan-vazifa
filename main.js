// ===== YEAR =====
document.querySelectorAll("#year").forEach(y => {
  y.textContent = new Date().getFullYear();
});

// ===== CART STORAGE =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ===== HEADER COUNT =====
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}
updateCartCount();

// ===== ADD TO CART =====
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = {
      name: btn.dataset.name.trim(),
      price: parseInt(btn.dataset.price),
      image: btn.dataset.image,
      quantity: 1
    };
    if (!product.name || isNaN(product.price)) return;

    const cart = getCart();
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push(product);
    }
    saveCart(cart);

    const old = btn.textContent;
    btn.textContent = "✅ Qo‘shildi";
    btn.style.background = "#22c55e";
    setTimeout(() => {
      btn.textContent = old;
      btn.style.background = "";
    }, 1000);
  });
});

// ===== CART PAGE RENDER =====
const cartItemsBox = document.getElementById("cartItems");
const itemCount = document.getElementById("itemCount"); // Agar HTMLda id="~" bo'lsa, buni document.getElementById("~") qilib o'zgartiring, lekin tavsiya: HTMLni to'g'rilang
const totalPriceBox = document.getElementById("totalPrice");
if (cartItemsBox) {
  const cart = getCart();
  cartItemsBox.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    cartItemsBox.innerHTML = `
      <p style="padding:40px;text-align:center;font-size:18px">
        🛒 Savatcha bo‘sh
      </p>`;
  } else {
    cart.forEach((item, index) => {
      if (!item.name || isNaN(item.price) || !item.quantity) return;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${item.image}">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <div class="quantity-controls">
            <button class="qty-btn minus" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn plus" data-index="${index}">+</button>
          </div>
          <p>${(item.price * item.quantity).toLocaleString()} so'm</p>
        </div>
        <button class="remove-btn" data-index="${index}">❌</button>
      `;
      cartItemsBox.appendChild(div);
      total += item.price * item.quantity;
      totalItems += item.quantity;
    });
  }

  if (itemCount) {
    itemCount.textContent = totalItems; // Umumiy mahsulotlar soni (miqdorlar bilan)
  }
  if (totalPriceBox) {
    totalPriceBox.textContent = total.toLocaleString() + " so'm";
  }

  // Event listeners for quantity and remove
  document.querySelectorAll(".qty-btn.plus").forEach(btn => {
    btn.onclick = () => {
      const cart = getCart();
      const index = parseInt(btn.dataset.index);
      cart[index].quantity++;
      saveCart(cart);
      location.reload();
    };
  });

  document.querySelectorAll(".qty-btn.minus").forEach(btn => {
    btn.onclick = () => {
      const cart = getCart();
      const index = parseInt(btn.dataset.index);
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1);
      }
      saveCart(cart);
      location.reload();
    };
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.onclick = () => {
      const cart = getCart();
      const index = parseInt(btn.dataset.index);
      cart.splice(index, 1);
      saveCart(cart);
      location.reload();
    };
  });
}