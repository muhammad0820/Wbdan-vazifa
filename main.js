// ===== YEAR =====
document.querySelectorAll("#year").forEach(y=>{
  y.textContent = new Date().getFullYear();
});

// ===== CART STORAGE =====
function getCart(){
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ===== HEADER COUNT =====
function updateCartCount(){
  const cartCount = document.getElementById("cartCount");
  if(cartCount){
    cartCount.textContent = getCart().length;
  }
}
updateCartCount();


// ===== ADD TO CART (INDEX PAGE) =====
document.querySelectorAll(".add-to-cart").forEach(btn=>{
  btn.addEventListener("click", ()=>{

    const product = {
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image
    };

    const cart = getCart();
    cart.push(product);
    saveCart(cart);

    // Tugma effekt
    const oldText = btn.textContent;
    btn.textContent = "✅ Qo‘shildi";
    btn.style.background = "#22c55e";

    setTimeout(()=>{
      btn.textContent = oldText;
      btn.style.background = "";
    },1000);
  });
});


// ===== CART PAGE RENDER =====
const cartItemsBox = document.getElementById("cartItems");
const itemCount = document.getElementById("itemCount");
const totalPriceBox = document.getElementById("totalPrice");

if(cartItemsBox){

  const cart = getCart();
  cartItemsBox.innerHTML = "";
  let total = 0;

  if(cart.length === 0){
    cartItemsBox.innerHTML = `
      <p style="padding:40px;text-align:center;font-size:18px">
        Savatcha bo‘sh
      </p>
    `;
  }

  cart.forEach((item,index)=>{

    if(!item.name || !item.price) return;

    const div = document.createElement("div");
    div.className="cart-item";

    div.innerHTML = `
      <img src="${item.image}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>${item.price.toLocaleString()} so'm</p>
      </div>
      <button class="remove-btn" data-index="${index}">❌</button>
    `;

    cartItemsBox.appendChild(div);
    total += item.price;
  });

  itemCount.textContent = cart.length;
  totalPriceBox.textContent = total.toLocaleString()+" so'm";

  // REMOVE ITEM
  document.querySelectorAll(".remove-btn").forEach(btn=>{
    btn.onclick = ()=>{
      const cart = getCart();
      cart.splice(btn.dataset.index,1);
      saveCart(cart);
      location.reload();
    }
  });
}
