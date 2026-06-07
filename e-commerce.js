// ===== CONFIG - BADILISHA HII NA LINK YAKO YA CLOUDFLARE =====
const API_URL = "https://loud-redhead-establishing-descending.trycloudflare.com";
const WHATSAPP_NUMBER = "254768394866";

// ===== THEME =====
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
  if (btn) btn.innerHTML = theme === 'dark'? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ===== STATE =====
let currentCat = "All";
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let map, marker;

// ===== CART FUNCTIONS =====
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
  
  const btn = e.target.closest('button');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Added';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }, 1200);
}

function toggleCart() {
  const modal = document.getElementById('cartModal');
  modal.classList.toggle('open');
  
  if (modal.classList.contains('open')) {
    renderCart();
    setTimeout(initMap, 300);
  }
}

function renderCart() {
  const cartDiv = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    cartDiv.innerHTML = '<p style="text-align:center; color:var(--muted); padding:40px;">Your cart is empty</p>';
    totalEl.textContent = '0';
    return;
  }

  let total = 0;
  cartDiv.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <img src="${item.image}" onerror="this.src='https://via.placeholder.com/70x70?text=No+Img'">
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

// ===== PRODUCTS =====
const categories = ["All", "Electronics", "Fashion", "Home", "Furniture"];

async function loadProducts() {
  const grid = document.getElementById('products');
  try {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) throw new Error('Network response was not ok');
    products = await res.json();
    renderProducts();
  } catch (err) {
    console.error('Failed to load products:', err);
    grid.innerHTML = `
      <div class="loading" style="color:var(--danger)">
        <i class="fas fa-exclamation-triangle"></i><br>
        Failed to connect to backend.<br>
        <small>Make sure Cloudflare Tunnel is running: cloudflared tunnel --url http://localhost:5000</small>
      </div>
    `;
  }
}

function renderCategories() {
  const catDiv = document.getElementById('categories');
  catDiv.innerHTML = categories.map(cat => 
    `<button class="cat-btn ${cat === currentCat? 'active' : ''}" 
     onclick="setCategory('${cat}')">${cat}</button>`
  ).join('');
}

function renderProducts() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter(p => {
    const matchCat = currentCat === "All" || p.category === currentCat;
    const matchSearch = p.name.toLowerCase().includes(search) || 
                       p.description.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  const grid = document.getElementById('products');
  
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="loading">No products found</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/500x500?text=No+Image'">
      <div class="product-info">
        ${p.badge? `<span class="product-badge">${p.badge}</span>` : ''}
        <div class="product-title">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-price">
          KSH ${p.price.toLocaleString()}
          ${p.old_price? `<small>KSH ${p.old_price.toLocaleString()}</small>` : ''}
        </div>
        <button class="add-cart-btn" onclick="addToCart(${p.id}, event)">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

function setCategory(cat) {
  currentCat = cat;
  renderCategories();
  renderProducts();
}

// ===== MAP =====
function initMap() {
  if (map) {
    map.invalidateSize();
    return;
  }
  
  map = L.map('map').setView([-1.2864, 36.8172], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);
  
  map.on('click', function(e) {
    if (marker) map.removeLayer(marker);
    marker = L.marker(e.latlng).addTo(map);
    document.getElementById('customerLocation').value = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
  });
}

// ===== CHECKOUT =====
async function checkout() {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const location = document.getElementById('customerLocation').value.trim();
  
  if (!name ||!phone ||!location) {
    alert('Please fill all fields and select location on map');
    return;
  }
  
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  try {
    const res = await fetch(`${API_URL}/api/order-whatsapp`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({customerName: name, phone, items: cart, total, location})
    });
    
    const data = await res.json();
    if (data.whatsappUrl) {
      window.open(data.whatsappUrl, '_blank');
      cart = [];
      saveCart();
      toggleCart();
      document.getElementById('customerName').value = '';
      document.getElementById('customerPhone').value = '';
      document.getElementById('customerLocation').value = '';
    } else {
      alert('Failed to generate WhatsApp link');
    }
  } catch (err) {
    alert('Failed to process order. Check backend connection.');
    console.error(err);
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderCategories();
  loadProducts();
  updateCartBadge();
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', renderProducts);
  }
  
  // Close modal on outside click
  document.getElementById('cartModal').addEventListener('click', (e) => {
    if (e.target.id === 'cartModal') toggleCart();
  });
});
