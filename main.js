// ================= YEAR =================
document.querySelectorAll("#year").forEach(y=>{
  y.textContent = new Date().getFullYear();
});

// ================= CART STORAGE =================
function getCart(){
  try{
    return JSON.parse(localStorage.getItem("cart")) || [];
  }catch(e){
    return [];
  }
}

function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ================= HEADER COUNT =================
function updateCartCount(){
  const cartCount = document.getElementById("cartCount");
  if(cartCount){
    const cart = getCart();
    const validItems = cart.filter(item => item.name && item.price);
    cartCount.textContent = validItems.length;
  }
}
updateCartCount();


// ================= ADD TO CART (INDEX) =================
document.querySelectorAll(".add-to-cart").forEach(btn=>{
  btn.addEventListener("click", ()=>{

    const product = {
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image
    };

    // Agar data-lar bo‘lmasa qo‘shmaydi
    if(!product.name || !product.price) return;

    const cart = getCart();
    cart.push(product);
    saveCart(cart);

    // Tugma animatsiya
    const oldText = btn.textContent;
    btn.textContent = "✅ Qo‘shildi";
    btn.style.background = "#22c55e";

    setTimeout(()=>{
      btn.textContent = oldText;
      btn.style.background = "";
    },1000);
  });
});


// ================= CART PAGE RENDER =================
const cartItemsBox = document.getElementById("cartItems");
const itemCount = document.getElementById("itemCount");
const totalPriceBox = document.getElementById("totalPrice");

if(cartItemsBox && itemCount && totalPriceBox){

  const cart = getCart();

  // Faqat to‘g‘ri formatdagi mahsulotlar
  const validItems = cart.filter(item => item.name && item.price);

  cartItemsBox.innerHTML = "";
  let total = 0;

  // Agar bo‘sh bo‘lsa
  if(validItems.length === 0){
    cartItemsBox.innerHTML = `
      <p style="padding:40px;text-align:center;font-size:18px">
        🛒 Savatcha bo‘sh
      </p>
    `;
  }

  // Mahsulotlarni chiqarish
  validItems.forEach((item,index)=>{
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>${item.price.toLocaleString()} so'm</p>
      </div>
      <button class="remove-btn" data-index="${index}">❌</button>
    `;

    cartItemsBox.appendChild(div);
    total += item.price;
  });

  // Xulosa
  itemCount.textContent = validItems.length;
  totalPriceBox.textContent = total.toLocaleString() + " so'm";

  // ================= REMOVE ITEM =================
  document.querySelectorAll(".remove-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const cart = getCart();
      cart.splice(btn.dataset.index,1);
      saveCart(cart);
      location.reload();
    });
  });
}
