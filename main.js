// ================= YEAR =================
document.querySelectorAll("#year").forEach(y => {
  y.textContent = new Date().getFullYear();
});

// ================= CART STORAGE =================
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
let cart = getCart();

// ================= FAVORITES STORAGE =================
let favorites = [];
try {
  favorites = JSON.parse(localStorage.getItem("favorites")) || [];
} catch {
  favorites = [];
}
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// ================= CLONE ALL PRODUCTS =================
const allGrid = document.getElementById("allProductsGrid");
if (allGrid) {
  allGrid.innerHTML = "";
  document
    .querySelectorAll("#kitchen .product-card, #cleaning .product-card, #climate .product-card, #personal .product-card, #smart .product-card")
    .forEach(card => {
      allGrid.appendChild(card.cloneNode(true));
    });
}

// ================= RESTORE FAVORITES (cloned) =================
document.querySelectorAll(".product-card").forEach(card => {
  const name = card.querySelector("h3")?.innerText?.trim();
  if (!name) return;
  if (favorites.includes(name)) {
    card.querySelector(".fav-btn")?.classList.add("active");
  }
});

// ================= CART COUNT =================
function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (!countEl) return;

  const cart = getCart();
  const total = cart.reduce((sum, p) => sum + (p.qty || 0), 0);
  countEl.textContent = `(${total})`;
}
updateCartCount();

// ================= TOAST =================
function showToast(text) {
  const toast = document.createElement("div");
  toast.textContent = text;
  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.right = "30px";
  toast.style.background = "#0f172a";
  toast.style.color = "white";
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "8px";
  toast.style.fontWeight = "bold";
  toast.style.boxShadow = "0 10px 20px rgba(0,0,0,.3)";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ================= EVENT DELEGATION =================
document.addEventListener("click", (e) => {
  // ===== ADD TO CART =====
  const cartBtn = e.target.closest(".add-to-cart");
  if (cartBtn) {
    const product = {
      name: (cartBtn.dataset.name || "").trim(),
      price: Number(cartBtn.dataset.price || 0),
      image: cartBtn.dataset.image || "",
      qty: 1
    };

    if (!product.name || !product.price) return;

    const cart = getCart();
    const exist = cart.find(p => p.name === product.name);
    if (exist) {
      exist.qty = (exist.qty || 0) + 1;
    } else {
      cart.push(product);
    }

    saveCart(cart);
    updateCartCount();
    showToast("🛒 Savatchaga qo‘shildi");
    return;
  }

  // ===== FAVORITE =====
  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    const card = favBtn.closest(".product-card");
    const name = card?.querySelector("h3")?.innerText?.trim();
    if (!name) return;

    favBtn.classList.toggle("active");

    if (favorites.includes(name)) {
      favorites = favorites.filter(f => f !== name);
    } else {
      favorites.push(name);
    }
    saveFavorites();
    return;
  }

  // ===== CATEGORY FILTER =====
  const catLink = e.target.closest(".cat-link");
  if (catLink) {
    const cat = catLink.dataset.cat;
    filterByCategory(cat);
  }
});

// ================= CATEGORY FILTER =================
function filterByCategory(cat) {
  const title = document.getElementById("sectionTitle");
  const cards = document.querySelectorAll("#allProductsGrid .product-card");

  if (!cat) {
    if (title) title.textContent = "🔥 Barcha mahsulotlar";
    cards.forEach(c => (c.style.display = ""));
    return;
  }

  const map = {
    kitchen: "🍳 Oshxona",
    cleaning: "🧹 Tozalash",
    climate: "❄️ Isitish & Sovutish",
    personal: "💇 Parvarish",
    smart: "🏠 Aqlli uy"
  };
  if (title) title.textContent = map[cat] || "Mahsulotlar";

  cards.forEach(card => {
    card.style.display = card.dataset.category === cat ? "" : "none";
  });
}





// ================= SINGLE PRODUCT (OPEN) =================
function getTextPrice(num){
  return Number(num || 0).toLocaleString() + " so'm";
}

function pickCardData(card){
  const name = card.querySelector("h3")?.innerText?.trim() || "";
  const img = card.querySelector("img")?.getAttribute("src") || "";
  const cat = card.dataset.category || "";
  const priceBtn = card.querySelector(".add-to-cart");
  const price = Number(priceBtn?.dataset.price || 0);

  return {
    name,
    image: img,
    category: cat,
    price,
    desc: "Ushbu mahsulot uy uchun qulay va zamonaviy yechim."
  };
}

// Card bosilganda singlepage.html ga o‘tish (fav/add-to-cart bosilganda o‘tmaydi)
document.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  // agar fav yoki savat tugmasi bosilgan bo‘lsa singlega o'tmaydi
  if (e.target.closest(".fav-btn")) return;
  if (e.target.closest(".add-to-cart")) return;

  const product = pickCardData(card);
  if (!product.name) return;

  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "singlepage.html";
});

// ================= SINGLE PAGE RENDER =================
function renderSinglePage(){
  const nameEl = document.getElementById("spName");
  if(!nameEl) return; // demak bu sahifa singlepage emas

  let p = null;
  try {
    p = JSON.parse(localStorage.getItem("selectedProduct")) || null;
  } catch {
    p = null;
  }

  // agar tanlangan mahsulot bo‘lmasa
  if(!p){
    nameEl.textContent = "Mahsulot topilmadi";
    return;
  }

  const imgEl = document.getElementById("spImage");
  const priceEl = document.getElementById("spPrice");
  const catEl = document.getElementById("spCategory");
  const descEl = document.getElementById("spDesc");

  nameEl.textContent = p.name || "";
  if(imgEl) imgEl.src = p.image || "";
  if(priceEl) priceEl.textContent = getTextPrice(p.price);
  if(catEl) catEl.textContent = "Kategoriya: " + (p.category || "-");
  if(descEl) descEl.textContent = p.desc || "Ushbu mahsulot uy uchun qulay va zamonaviy yechim.";

  // fav holati
  const favBtn = document.getElementById("spFavBtn");
  if (favBtn) {
    const n = (p.name || "").trim();
    if (favorites.includes(n)) favBtn.classList.add("active");
  }

  // add to cart
  const addBtn = document.getElementById("spAddCart");
  if(addBtn){
    addBtn.onclick = () => {
      const item = {
        name: (p.name || "").trim(),
        price: Number(p.price || 0),
        image: p.image || "",
        qty: 1
      };

      if (!item.name || !item.price) return;

      const cart = getCart();
      const exist = cart.find(x => x.name === item.name);
      if(exist) exist.qty = (exist.qty || 0) + 1;
      else cart.push(item);

      saveCart(cart);
      updateCartCount();
      showToast("🛒 Savatchaga qo‘shildi");
    };
  }

  // fav toggle
  if (document.getElementById("spFavBtn")) {
    document.getElementById("spFavBtn").addEventListener("click", () => {
      const n = (p.name || "").trim();
      if (!n) return;

      const btn = document.getElementById("spFavBtn");
      btn.classList.toggle("active");

      if (favorites.includes(n)) favorites = favorites.filter(x => x !== n);
      else favorites.push(n);

      saveFavorites();
      updateFavCount?.();
    });
  }
}

// ================= FAVORITES COUNT (HEADER) =================
function updateFavCount(){
  const el = document.getElementById("favCount");
  if(!el) return;
  el.textContent = `(${favorites.length})`;
}

// ================= INIT (hamma sahifada) =================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateFavCount();
  renderSinglePage();
});
