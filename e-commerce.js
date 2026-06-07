// Config - Badilisha hii na Cloudflare link yako
const API_URL = "https://accompanying-tickets-depend-building.trycloudflare.com";
const WHATSAPP_NUMBER = "254768394866";

// Theme Toggle
function initTheme() {
  const savedTheme = localStorage.getItem('shopmart_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark'? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('shopmart_theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;
  btn.innerHTML = theme === 'dark'? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// App State
let currentCat = "All";
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let rateRating = 0;
let products = []; // Sasa itatoka kwa API

// Map State
let map, marker, mapLoaded = false;
const sunton = [-1.2115, 36.9256];

// Load products from backend
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    products = await res.json();
    renderProducts();
  } catch (err) {
    console.error('Failed to load products:', err);
    document.getElementById('products').innerHTML = 
      '<p style="text-align:center; grid-column:1/-1; padding:40px;">Failed to load products. Check backend connection.</p>';
  }
}

const categories = ["All", "Electronics", "Fashion", "Home", "Furniture"];

// Cart Functions
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const qty = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = qty;
  badge.style.display = qty > 0? 'flex' : 'none';
}

function addToCart(id, e) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({...product, qty: 1});
  
  saveCart();
  
  const btn = e?.target?.closest('button');
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Added';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }, 1200);
  }
}

function toggleCart() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  
  const isOpening =!modal.classList.contains('open');
  renderCart();
  modal.classList.toggle('open');

  if (isOpening) {
    setTimeout(() => {
      initMap();
      if (map) map.invalidateSize();
    }, 350);
  }
}

function renderCart() {
  const cartDiv = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!cartDiv ||!totalEl) return;
  
  if (cart.length === 0) {
    cartDiv.innerHTML = '<p style="text-align:center; color:var(--gray); padding:30px;">Your cart is empty</p>';
    totalEl.textContent = '0';
    return;
  }

  let total = 0;
  cartDiv.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <img src="${item.image}" onerror="this.onerror=null;this.src='https://via.placeholder.com/60x60?text=No+Img'">
        <div style="flex:1;">
          <strong>${item.name}</strong>
          <div style="color:var(--primary); font-weight:700;">KSH ${item.price.toLocaleString()}</div>
          <div class="cart-qty">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            <button class="qty-btn" onclick="removeItem(${item.id})" style="color:var(--danger); border-color:var(--danger);">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  totalEl.textContent = total.toLocaleString();
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) cart = cart.filter(i => i.id!== id);
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id!== id);
  saveCart();
  renderCart();
}

// Product Rendering
function renderCategories() {
  const catDiv = document.getElementById('categories');
  if (!catDiv) return;
  catDiv.innerHTML = categories.map(cat => 
    `<button class="cat-btn ${cat === currentCat? 'active' : ''}" 
     onclick="setCategory('${cat}')">${cat}</button>`
  ).join('');
}

function renderProducts() {
  const searchInput = document.getElementById('searchInput');
  const search = searchInput? searchInput.value.toLowerCase() : '';
  const filtered = products.filter(p => {
    const matchCat = currentCat === "All" || p.category === currentCat;
    const matchSearch = p.name.toLowerCase().includes(search) || 
                       p.description.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  const grid = document.getElementById('products');
  if (!grid) return;
  
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding:40px; font-size:1.1rem;">No products found</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <img src="${p.image}" class="product-img" 
           onerror="this.onerror=null;this.src='https://via.placeholder.com/500x500?text=No+Image'">
      <div class="product-info">
        ${p.badge? `<span class="product-badge">${p.badge}</span>` : ''}
        <div class="product-title">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-price">
          KSH ${p.price.toLocaleString()}
          ${p.old_price? `<small>KSH ${p.old_price.toLocaleString()}</small>` : ''}
        </div>
        <button class="add-cart-btn" onclick="addToCart(${p.id}, event)">
          <i class="fas fa-cart-plus"></i> Add
        </button>
      </div>
    </div>
  `).join('');
}

function setCategory(cat, event) {
  if (event) event.preventDefault();
  currentCat = cat;
  renderCategories();
  renderProducts();
  
  const target = cat.trim().toLowerCase();
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === target);
  });
  document.querySelectorAll('.quick-links a').forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    link.classList.toggle('active', text === target);
  });
}

// Map + Checkout functions ziko same kama ulipewa...
// ... weka hapa Block 4 na 5 zote bila kubadilisha chochote

// Init
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderCategories();
  loadProducts(); // Badala ya renderProducts()
  updateCartBadge();
  setupLocationSearch();
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', renderProducts);
  }
});
