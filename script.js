// ---------------- CART DATA ----------------
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// ---------------- ELEMENTS ----------------
const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const cartClose = document.getElementById("cart-close");

const whatsappBtn = document.getElementById("whatsapp-btn");
const customerModal = document.getElementById("customer-modal");
const closeModalBtn = document.getElementById("close-modal");
const sendWhatsappBtn = document.getElementById("send-whatsapp");

// ---------------- OPEN / CLOSE CART ----------------
cartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cartPanel.classList.toggle("open");
});

cartClose.addEventListener("click", () => {
  cartPanel.classList.remove("open");
});

// ---------------- ADD TO CART ----------------
document.querySelectorAll(".add-cart-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const img = btn.dataset.img;

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
    existingItem.qty += 1;
    } else {
    cart.push({ name, price, img, qty: 1 });
    }


    updateCartUI();
    flyToCart(btn, img);
  });
});

// ---------------- UPDATE CART UI ----------------
function updateCartUI() {
  cartItems.innerHTML = "";
  cartTotal = 0;
  cartCount = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p style='color:gold;'>Your cart is empty</p>";
    cartCountEl.textContent = 0;
    cartTotalEl.textContent = 0;
    return;
  }

  cart.forEach((item, index) => {
    cartTotal += item.price * item.qty;
    cartCount += item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.img}">
      <div class="cart-info">
        <strong>${item.name}</strong><br>
        ₹${item.price} × 
        <span class="qty editable-qty">${item.qty}</span>
      </div>

      <div class="qty-controls">
        <button class="qty-btn minus">−</button>
        <button class="qty-btn plus">+</button>
      </div>

      <button class="remove-btn">✕</button>
    `;

    // + button
    div.querySelector(".plus").onclick = () => {
      item.qty++;
      updateCartUI();
    };

    // − button
    div.querySelector(".minus").onclick = () => {
      if (item.qty > 1) {
        item.qty--;
      } else {
        cart.splice(index, 1);
      }
      updateCartUI();
    };

    // Remove button
    div.querySelector(".remove-btn").onclick = () => {
      cart.splice(index, 1);
      updateCartUI();
    };

    // Editable quantity (DOUBLE CLICK)
    const qtySpan = div.querySelector(".editable-qty");

    qtySpan.addEventListener("dblclick", () => {
      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.value = item.qty;
      input.className = "qty-input";

      qtySpan.replaceWith(input);
      input.focus();
      input.select();

      const saveQty = () => {
        let newQty = parseInt(input.value);
        if (isNaN(newQty) || newQty < 1) newQty = 1;
        item.qty = newQty;
        updateCartUI();
      };

      input.addEventListener("blur", saveQty);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveQty();
      });
    });

    cartItems.appendChild(div);
  });

  cartCountEl.textContent = cartCount;
  cartTotalEl.textContent = cartTotal;
}


// ---------------- FLY TO CART ----------------
function flyToCart(button, imgSrc) {
  const img = document.createElement("img");
  img.src = imgSrc;
  img.style.position = "fixed";
  img.style.width = "80px";
  img.style.zIndex = 1000;

  const b = button.getBoundingClientRect();
  img.style.top = b.top + "px";
  img.style.left = b.left + "px";
  document.body.appendChild(img);

  const c = cartBtn.getBoundingClientRect();
  img.animate(
    [
      { transform: "translate(0,0)", opacity: 1 },
      {
        transform: `translate(${c.left - b.left}px, ${c.top - b.top}px) scale(0.2)`,
        opacity: 0
      }
    ],
    { duration: 700, easing: "ease-in-out" }
  );

  setTimeout(() => img.remove(), 700);
}

// ---------------- BUY ON WHATSAPP (STEP 1) ----------------
whatsappBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  customerModal.style.display = "flex";
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  customerModal.style.display = "none";
});

// ---------------- SEND TO WHATSAPP (STEP 2) ----------------
sendWhatsappBtn.addEventListener("click", () => {
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill all customer details");
    return;
  }

  let msg = `🛍️ *New Saree Order – Sridurgaganapathy*%0A%0A`;
  msg += `👤 Name: ${name}%0A`;
  msg += `📞 Phone: ${phone}%0A`;
  msg += `🏠 Address: ${address}%0A%0A`;
  msg += `🧵 Sarees Ordered:%0A`;

  cart.forEach((item, i) => {
  msg += `${i + 1}. ${item.name} × ${item.qty} – ₹${item.price * item.qty}%0A`;
  });

  msg += `%0A💰 *Total: ₹${cartTotal}*`;

  const shopNumber = "919500092462"; // your number
  window.open(`https://wa.me/${shopNumber}?text=${msg}`, "_blank");

  customerModal.style.display = "none";
});
// ---------------- EXPLORE PREMIUM SAREES SCROLL ----------------
const explorePremiumBtn = document.getElementById("explore-premium");
const premiumSection = document.getElementById("premium-products");

explorePremiumBtn.addEventListener("click", () => {
  premiumSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});
// -------- Premium Section Scroll Animation --------
//const premiumSection = document.getElementById("premium-products");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show-premium");
      }
    });
  },
  { threshold: 0.3 }
);

observer.observe(premiumSection);
