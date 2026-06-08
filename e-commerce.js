const CONFIG = {
  API_URL: 'https://human-curious-comparison-pockets.trycloudflare.com/api',
  WHATSAPP_NUMBER: '254768394866',
  TIMEOUT: 10000,
  RETRY_COUNT: 2
};

let state = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  products: JSON.parse(localStorage.getItem('products_cache')) || [],
  categories: ['All','Electronics','Fashion','Home','Furniture','Sports','Accessories','Beauty'], // FORCED
  currentCategory: 'All',
  loading: false,
  map: null,
  marker: null,
  selectedLocation: null
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 App starting...');
  renderCategories();
  if (state.products.length > 0) renderProducts();
  updateCartBadge();
  
  loadProducts();
  
  let searchTimer;
  document.getElementById('searchInput')?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadProducts, 300);
  });
});

async function fetchWithRetry(url, options = {}, retries = CONFIG.RETRY_COUNT) {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
      
      const res = await fetch(url + `&t=${Date.now()}`, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      console.log(`Retry ${i + 1}/${retries}`);
    }
  }
}

// FORCED CATEGORIES - Delete this function ukishaweka categories halisi kwa DB
function loadCategories() {
  console.log('✅ Using forced categories:', state.categories);
  renderCategories();
}

function renderCategories() {
  const container = document.getElementById('categories');
  if (!container) return;
  
  container.innerHTML = state.categories.map(cat => `
    <button class="cat-btn ${cat === state.currentCategory ? 'active' : ''}"
      onclick="filterByCategory('${cat}')">${cat}</button>
  `).join('');
}

async function filterByCategory(cat) {
  if (state.currentCategory === cat || state.loading) return;
  state.currentCategory = cat;
  
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === cat);
  });
  
  showSkeleton();
  loadProducts();
}

function showSkeleton() {
  state.loading = true;
  document.getElementById('products').innerHTML = Array(6).fill(0).map(() => `
    <div class="product-card">
      <div class="img-wrap skeleton"></div>
      <div class="product-info">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="price-row">
          <div class="skeleton-line price"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>
    </div>
  `).join('');
}

async function loadProducts() {
  const grid = document.getElementById('products');
  
  try {
    const params = new URLSearchParams();
    if (state.currentCategory !== 'All') params.append('category', state.currentCategory);
    const search = document.getElementById('searchInput')?.value.trim();
    if (search) params.append('search', search);
    
    const res = await fetchWithRetry(`${CONFIG.API_URL}/products?${params}`);
    state.products = await res.json();
    
    console.log(`✅ Loaded ${state.products.length} products for category: ${state.currentCategory}`);
    localStorage.setItem('products_cache', JSON.stringify(state.products));
    renderProducts();
  } catch (err) {
    console.error('Load error:', err);
    
    if (state.products.length > 0) {
      renderProducts();
      grid.insertAdjacentHTML('afterbegin', 
        '<div style="grid-column:1/-1;text-align:center;padding:10px;background:var(--card);border-radius:8px;margin-bottom:10px;color:var(--gray);font-size:13px;cursor:pointer;" onclick="loadProducts()">⚠️ Offline mode - tap to refresh</div>'
      );
    } else {
      grid.innerHTML = `
        <div class="no-products" onclick="loadProducts()" style="cursor:pointer;">
          <i class="fas fa-wifi" style="font-size:2rem;margin-bottom:10px;display:block;"></i>
          Failed to load products<br>
          <small>${err.message}</small><br><br>
          <button style="padding:8px 16px;background:var(--primary);color:#fff;border:none;border-radius:6px;">Tap to retry</button>
        </div>
      `;
    }
  } finally {
    state.loading = false;
  }
}

function renderProducts() {
  const grid = document.getElementById('products');
  if (state.products.length === 0) {
    grid.innerHTML = `<div class="no-products">No items in ${state.currentCategory}</div>`;
    return;
  }
  
  grid.innerHTML = state.products.map(p => `
    <div class="product-card">
      <div class="img-wrap">
        <img src="${p.image}" class="product-img" alt="${p.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        ${p.description ? `<p class="product-desc">${p.description}</p>` : ''}
        <div class="price-row">
          <div class="price-badge">KSH ${Number(p.price).toLocaleString()}</div>
          <button class="add-cart-btn" onclick="addToCart(${p.id}, event)">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(id, e) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;
  const existing = state.cart.find(i => i.id === id);
  existing ? existing.qty++ : state.cart.push({...product, qty: 1});
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartBadge();
  const btn = e.target.closest('button');
  btn.innerHTML = '<i class="fas fa-check"></i> Added';
  setTimeout(() => btn.innerHTML = 'Add', 800);
}

function updateCartBadge() {
  const qty = state.cart.reduce((s,i) => s + i.qty, 0);
  const badge = document.getElementById('cartCount');
  badge.textContent = qty;
  badge.style.display = qty > 0 ? 'flex' : 'none';
}

function toggleCart() {
  const modal = document.getElementById('cartModal');
  modal.classList.toggle('open');
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (state.cart.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--gray);">Your cart is empty</p>';
    document.getElementById('cartTotal').textContent = '0';
    return;
  }
  
  container.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1">
        <div style="font-weight:600;margin-bottom:4px;">${item.name}</div>
        <div style="color:var(--primary);font-weight:700;">KSH ${item.price.toLocaleString()}</div>
        <div class="cart-qty">
          <button onclick="updateQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${item.id})" style="background:none;border:none;color:var(--danger);font-size:1.2rem;cursor:pointer;">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
  
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cartTotal').textContent = total.toLocaleString();
}

function updateQty(id, change) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartBadge();
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartBadge();
  renderCart();
}

async function checkout() {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  
  if (!name || !phone) {
    alert('Please enter your name and phone number');
    return;
  }
  
  if (state.cart.length === 0) {
    alert('Cart is empty');
    return;
  }
  
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const location = document.getElementById('streetAddress').value.trim();
  
  try {
    const res = await fetch(`${CONFIG.API_URL}/order-whatsapp`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ customerName: name, phone, items: state.cart, total, location })
    });
    
    const data = await res.json();
    window.open(data.whatsappUrl, '_blank');
    state.cart = [];
    localStorage.removeItem('cart');
    updateCartBadge();
    toggleCart();
  } catch (err) {
    alert('Failed to create order');
  }
}

function openSettings() { document.getElementById('settingsModal').classList.add('open'); }
function closeSettings() { document.getElementById('settingsModal').classList.remove('open'); }
function toggleTheme() {
  const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
function openFeedback() { closeSettings(); document.getElementById('feedbackModal').classList.add('open'); }
function closeFeedback() { document.getElementById('feedbackModal').classList.remove('open'); }
function sendFeedback() {
  const text = document.getElementById('feedbackText').value.trim();
  if (!text) return alert('Please write feedback');
  window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Feedback: ' + text)}`, '_blank');
  closeFeedback();
}
function openRateModal() { closeSettings(); document.getElementById('rateModal').classList.add('open'); }
function closeRateModal() { document.getElementById('rateModal').classList.remove('open'); }
function sendRating() {
  const stars = document.querySelectorAll('#rateStars i.active').length;
  const comment = document.getElementById('rateComment').value.trim();
  if (stars === 0) return alert('Please select rating');
  window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(`Rating: ${stars} stars. ${comment}`)}`, '_blank');
  closeRateModal();
}
function openWhatsAppSupport() {
  window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}`, '_blank');
}

function getLocation() {
  if (!navigator.geolocation) return alert('Geolocation not supported');
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    initMap(lat, lng);
  }, err => alert('Location access denied'));
}

function initMap(lat, lng) {
  if (!state.map) {
    state.map = L.map('mapPreview').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(state.map);
    state.map.on('click', e => setMarker(e.latlng.lat, e.latlng.lng));
  } else {
    state.map.setView([lat, lng], 15);
  }
  setMarker(lat, lng);
}

function setMarker(lat, lng) {
  if (state.marker) state.map.removeLayer(state.marker);
  state.marker = L.marker([lat, lng]).addTo(state.map);
  state.selectedLocation = { lat, lng };
  document.getElementById('locationStatus').textContent = `Location set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
