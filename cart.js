// ===== КОШИК =====
let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');

function saveCart() {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  const list      = document.getElementById('cartItemsList');
  const emptyEl   = document.getElementById('cartEmpty');
  const layoutEl  = document.getElementById('cartLayout');
  const countEl   = document.getElementById('cartCount');

  if (cart.length === 0) {
    layoutEl.style.display = 'none';
    emptyEl.style.display  = 'block';
    countEl.style.display  = 'none';
    return;
  }

  layoutEl.style.display = 'grid';
  emptyEl.style.display  = 'none';

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent   = totalQty % 1 === 0 ? totalQty : totalQty.toFixed(1);
  countEl.style.display = 'flex';

  list.innerHTML = cart.map((item, idx) => {
    const subtotal   = Math.round(item.price * item.qty);
    const qtyDisplay = item.qty % 1 === 0 ? item.qty : item.qty.toFixed(1);
    return `
      <div class="cart-item-row">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price-unit">${item.price} грн / ${item.unit}</div>
        </div>
        <div class="qty-stepper">
          <button class="qty-btn" onclick="changeQty(${idx}, -${item.unit === 'кг' ? 0.5 : 1})">
            <i class="fas fa-minus"></i>
          </button>
          <span class="qty-value">${qtyDisplay} ${item.unit}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, ${item.unit === 'кг' ? 0.5 : 1})">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="cart-item-subtotal">
          ${subtotal} грн
          <small>${item.price} × ${qtyDisplay}</small>
        </div>
        <button class="remove-btn" onclick="removeItem(${idx})" title="Видалити">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>`;
  }).join('');

  updateSummary();
}

function changeQty(idx, delta) {
  cart[idx].qty = Math.round((cart[idx].qty + delta) * 10) / 10;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  renderCart();
}

function removeItem(idx) {
  cart.splice(idx, 1);
  saveCart();
  renderCart();
}

function updateSummary() {
  const totalWeight = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice  = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('summaryItems').textContent =
    cart.length + ' поз.';
  document.getElementById('summaryWeight').textContent =
    (totalWeight % 1 === 0 ? totalWeight : totalWeight.toFixed(1)) + ' кг / шт';
  document.getElementById('summaryTotal').textContent =
    Math.round(totalPrice) + ' грн';
}

// ===== ФОРМА ЗАМОВЛЕННЯ =====
function submitOrder() {
  const nameEl  = document.getElementById('fieldName');
  const phoneEl = document.getElementById('fieldPhone');

  nameEl.style.borderColor  = '';
  phoneEl.style.borderColor = '';

  if (!nameEl.value.trim()) {
    nameEl.style.borderColor = '#e74c3c';
    nameEl.focus();
    return;
  }
  if (!phoneEl.value.trim()) {
    phoneEl.style.borderColor = '#e74c3c';
    phoneEl.focus();
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled     = true;
  btn.innerHTML    = '<i class="fas fa-spinner fa-spin"></i> Відправляємо...';

  // Тут можна додати реальний POST-запит на сервер
  setTimeout(() => {
    sessionStorage.removeItem('cart');
    cart = [];
    document.getElementById('orderFormContent').style.display = 'none';
    document.getElementById('orderSuccess').style.display     = 'block';
    document.getElementById('cartCount').style.display        = 'none';
  }, 1200);
}

// ===== ІНІЦІАЛІЗАЦІЯ =====
document.addEventListener('DOMContentLoaded', renderCart);
