const WHATSAPP_NUMBER = "254768394866";

// Product Data
const products = [
  {id: 1, name: "Wireless Headphones", desc: "Active noise cancelling, 30hr battery", price: 8999, oldPrice: 12999, category: "Electronics", image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500", badge: "HOT"},
  {id: 2, name: "Smart Watch Pro", desc: "Heart rate, GPS, waterproof up to 50m", price: 19999, oldPrice: 24999, category: "Electronics", image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500", badge: "BESTSELLER"},
  {id: 3, name: "Bluetooth Speaker", desc: "Portable, 12hr playtime, deep bass", price: 4999, category: "Electronics", image: "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=500", badge: ""},
  {id: 4, name: "Gaming Mouse", desc: "16000 DPI, RGB lighting, ultra fast", price: 5999, category: "Electronics", image: "https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=500", badge: ""},
  
  {id: 5, name: "Premium T-Shirt", desc: "100% organic cotton, slim fit", price: 1999, category: "Fashion", image: "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=500", badge: ""},
  {id: 6, name: "Winter Jacket", desc: "Waterproof, windproof, thermal lining", price: 7999, oldPrice: 9999, category: "Fashion", image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=500", badge: "SALE"},
  {id: 7, name: "Running Shoes", desc: "Lightweight, breathable, anti-slip sole", price: 6999, category: "Fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80", badge: ""},
  {id: 8, name: "Travel Backpack", desc: "20L capacity, laptop compartment", price: 3999, category: "Fashion", image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=500", badge: ""},
  {id: 15, name: "Perfume", desc: "Eau de parfum 50ml, long lasting scent", price: 3200, category: "Fashion", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=75", badge: ""},
  
  {id: 9, name: "Coffee Maker", desc: "12-cup programmable, auto shut-off", price: 4499, category: "Home", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=75", badge: ""},
  {id: 10, name: "Air Fryer XL", desc: "5.5L capacity, digital control, oil-free", price: 8999, category: "Home", image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=500", badge: "NEW"},
  {id: 11, name: "Cordless Vacuum", desc: "Powerful suction, 40min runtime", price: 12999, oldPrice: 15999, category: "Home", image: "https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=500", badge: ""},
  {id: 12, name: "LED Desk Lamp", desc: "Adjustable brightness, eye-care mode", price: 2499, category: "Home", image: "https://images.pexels.com/photos/1123260/pexels-photo-1123260.jpeg?auto=compress&cs=tinysrgb&w=500", badge: ""},
  {id: 13, name: "Water Heater", desc: "50L electric water heater, fast heating", price: 12000, category: "Home", image: "https://images.pexels.com/photos/30946797/pexels-photo-30946797.jpeg?auto=compress&cs=tinysrgb&w=500", badge: ""},
  {id: 14, name: "Duvet", desc: "Soft warm duvet 200x230cm, hypoallergenic", price: 3500, category: "Home", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=75", badge: "NEW"},
  
  {id: 16, name: "3-Seater Sofa", desc: "Fabric sofa with cushions, modern design", price: 45000, category: "Furniture", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=75", badge: ""},
  {id: 17, name: "Ergonomic Chair", desc: "Adjustable office chair with lumbar support", price: 12000, category: "Furniture", image: "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?w=600&auto=format&fit=crop&q=75", badge: "NEW"}
];

const categories = ["All", "Electronics", "Fashion", "Home", "Furniture"];

// App State
let currentCat = "All";
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let rateRating = 0;

// Map State
let map, marker, mapLoaded = false;
const sunton = [-1.2115, 36.9256]; // Default: Kasarani Nairobi

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
  badge.style.display = qty > 0 ? 'flex' : 'none';
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
  
  const isOpening = !modal.classList.contains('open');
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
  if (!cartDiv || !totalEl) return;
  
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
        <img src="${item.image}" onerror="this.onerror=null;this.src='https://via.placeholder.com/500x500?text=No+Image'">
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
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

// Product Rendering
function renderCategories() {
  const catDiv = document.getElementById('categories');
  if (!catDiv) return;
  catDiv.innerHTML = categories.map(cat => 
    `<button class="cat-btn ${cat === currentCat ? 'active' : ''}" 
     onclick="setCategory('${cat}')">${cat}</button>`
  ).join('');
}

function renderProducts() {
  const searchInput = document.getElementById('searchInput');
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  const filtered = products.filter(p => {
    const matchCat = currentCat === "All" || p.category === currentCat;
    const matchSearch = p.name.toLowerCase().includes(search) || 
                       p.desc.toLowerCase().includes(search);
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
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <div class="product-title">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-price">
          KSH ${p.price.toLocaleString()}
          ${p.oldPrice ? `<small>KSH ${p.oldPrice.toLocaleString()}</small>` : ''}
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

// Map Functions
function initMap() {
  if (mapLoaded) {
    setTimeout(() => map && map.invalidateSize(), 100);
    return;
  }

  const mapEl = document.getElementById('mapPreview');
  if (!mapEl || typeof L === 'undefined') {
    console.warn('Map element or Leaflet not found');
    return;
  }

  map = L.map('mapPreview', {
    zoomControl: true,
    scrollWheelZoom: true,
    dragging: true
  }).setView(sunton, 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  marker = L.marker(sunton, {draggable: true}).addTo(map);
  setLocation(sunton, "Sunton, Kasarani, Nairobi, Kenya");

  map.on('click', function(e) {
    marker.setLatLng(e.latlng);
    reverseGeocode(e.latlng.lat, e.latlng.lng);
  });

  marker.on('dragend', function(e) {
    const pos = marker.getLatLng();
    reverseGeocode(pos.lat, pos.lng);
  });

  mapLoaded = true;
}

function reverseGeocode(lat, lng) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
  .then(res => res.json())
  .then(data => {
    setLocation([lat, lng], data.display_name || `${lat}, ${lng}`);
  })
  .catch(() => setLocation([lat, lng], `${lat.toFixed(6)}, ${lng.toFixed(6)}`));
}

function setLocation(latLng, address) {
  const addrInput = document.getElementById('deliveryAddress');
  const statusEl = document.getElementById('locationStatus');
  if (!addrInput || !statusEl) return;
  
  addrInput.value = `https://maps.google.com/?q=${latLng[0]},${latLng[1]}`;
  statusEl.textContent = '✓ Location set';
  statusEl.style.color = 'var(--success)';
  checkLocationComplete();
}

function getLocation() {
  const statusEl = document.getElementById('locationStatus');
  if (!statusEl) return;

  if (!navigator.geolocation) {
    statusEl.textContent = "GPS not supported. Use search or tap map.";
    statusEl.style.color = "var(--danger)";
    return;
  }

  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    statusEl.textContent = "GPS needs HTTPS. Host site online or use search/tap map.";
    statusEl.style.color = "var(--danger)";
    return;
  }

  statusEl.textContent = "Requesting location...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const pos = [position.coords.latitude, position.coords.longitude];
      if (map) map.setView(pos, 17);
      if (marker) marker.setLatLng(pos);
      reverseGeocode(pos[0], pos[1]);
    },
    (error) => {
      let msg = "Could not get location. ";
      if (error.code === error.PERMISSION_DENIED) {
        msg += "Permission denied. Allow location in browser settings.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        msg += "Location unavailable. Turn on GPS.";
      } else if (error.code === error.TIMEOUT) {
        msg += "Request timed out.";
      }
      msg += " Use search or tap map instead.";
      statusEl.textContent = msg;
      statusEl.style.color = "var(--danger)";
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

let searchTimeout;
function setupLocationSearch() {
  const searchInput = document.getElementById('locationSearch');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    const query = this.value.trim();

    if (query.length < 3) {
      const resultsDiv = document.getElementById('searchResults');
      if (resultsDiv) resultsDiv.style.display = 'none';
      return;
    }

    searchTimeout = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ke&limit=5`)
      .then(res => res.json())
      .then(data => {
        const resultsDiv = document.getElementById('searchResults');
        if (!resultsDiv) return;
        
        if (data.length === 0) {
          resultsDiv.style.display = 'none';
          return;
        }

        resultsDiv.innerHTML = data.map(place =>
          `<div onclick="selectSearchResult(${place.lat}, ${place.lon}, '${place.display_name.replace(/'/g, "\\'")}')">${place.display_name}</div>`
        ).join('');
        resultsDiv.style.display = 'block';
      })
      .catch(() => {
        const resultsDiv = document.getElementById('searchResults');
        if (resultsDiv) resultsDiv.style.display = 'none';
      });
    }, 500);
  });
}

function selectSearchResult(lat, lon, address) {
  const pos = [parseFloat(lat), parseFloat(lon)];
  if (map) map.setView(pos, 17);
  if (marker) marker.setLatLng(pos);
  setLocation(pos, address);
  const resultsDiv = document.getElementById('searchResults');
  const searchInput = document.getElementById('locationSearch');
  if (resultsDiv) resultsDiv.style.display = 'none';
  if (searchInput) searchInput.value = address;
}

function checkLocationComplete() {
  const street = document.getElementById('streetAddress');
  const mapLink = document.getElementById('deliveryAddress');
  const statusEl = document.getElementById('locationStatus');
  if (!street || !mapLink || !statusEl) return;

  if (street.value.trim() && mapLink.value) {
    statusEl.textContent = '✓ Location complete';
    statusEl.style.color = 'var(--success)';
  }
}

// Checkout
function checkout() {
  if (cart.length === 0) return alert('Cart is empty');
  
  const street = document.getElementById('streetAddress');
  const mapLink = document.getElementById('deliveryAddress');
  
  if (!street || !mapLink) {
    alert("Location fields not found");
    return;
  }

  if (!street.value.trim()) {
    alert("Please enter your house/building, street, estate");
    return;
  }
  if (!mapLink.value) {
    alert("Please set your location on the map");
    return;
  }

  sendOrderToWhatsApp(street.value.trim(), mapLink.value);
  cart = [];
  saveCart();
  toggleCart();
  
  setTimeout(() => {
    const rateModal = document.getElementById('rateModal');
    if (rateModal) rateModal.classList.add('open');
  }, 2000);
}

function sendOrderToWhatsApp(street, mapLink) {
  let message = `🛒 New Order - ShopMart\n`;
  let total = 0;
  cart.forEach(item => {
    message += `${item.name} x${item.qty} - KSH ${(item.price * item.qty).toLocaleString()}\n`;
    total += item.price * item.qty;
  });
  message += `\n💰 Total: KSH ${total.toLocaleString()}`;
  message += `\n\n📍 Address: ${street}`;
  message += `\n🗺️ Map Link: ${mapLink}`;
  message += `\n\nOrder Time: ${new Date().toLocaleString()}`;
  
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// Settings Modal
function openSettings() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.add('open');
}

function closeSettings() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.remove('open');
}

// Feedback Modal
function openFeedback() {
  closeSettings();
  const modal = document.getElementById('feedbackModal');
  if (modal) modal.classList.add('open');
}

function closeFeedback() {
  const modal = document.getElementById('feedbackModal');
  const input = document.getElementById('feedbackText');
  if (modal) modal.classList.remove('open');
  if (input) input.value = '';
}

function sendFeedback() {
  const feedback = document.getElementById('feedbackText');
  if (!feedback) return;
  if (!feedback.value.trim()) return alert('Please enter your feedback');
  const message = `ShopMart Feedback:\n\n${feedback.value.trim()}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  closeFeedback();
}

// Rating Modal
function openRateModal() {
  closeSettings();
  const modal = document.getElementById('rateModal');
  if (modal) modal.classList.add('open');
}

function closeRateModal() {
  const modal = document.getElementById('rateModal');
  const comment = document.getElementById('rateComment');
  if (modal) modal.classList.remove('open');
  if (comment) comment.value = '';
  rateRating = 0;
  updateStars(0);
}

function updateStars(rating) {
  const stars = document.querySelectorAll('#rateStars i');
  stars.forEach((star, i) => {
    star.classList.toggle('active', i < rating);
    star.classList.toggle('fa-solid', i < rating);
    star.classList.toggle('fa-regular', i >= rating);
  });
}

function sendRating() {
  if (rateRating === 0) return alert('Please select a rating');
  const comment = document.getElementById('rateComment');
  const stars = '⭐'.repeat(rateRating);
  const message = `ShopMart Rating\nRating: ${stars} ${rateRating}/5\nComment: ${comment ? comment.value : 'No comment'}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  closeRateModal();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  updateCartBadge();
  setupLocationSearch();
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', renderProducts);
  }
  
  const rateStars = document.getElementById('rateStars');
  if (rateStars) {
    rateStars.addEventListener('click', (e) => {
      if (e.target.tagName === 'I') {
        rateRating = parseInt(e.target.dataset.val);
        updateStars(rateRating);
      }
    });
  }
  
  const streetInput = document.getElementById('streetAddress');
  if (streetInput) {
    streetInput.addEventListener('input', checkLocationComplete);
  }
});
function openWhatsAppSupport() {
  const message = `Hello ShopMart Support Team,\n\nI need help with:`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  closeSettings();
}

function openAboutPage() {
  window.location.href = '/about-shopmart.html';
  closeSettings();
}
window.addEventListener('resize', () => {
  if (map && document.getElementById('cartModal')?.classList.contains('open')) {
    map.invalidateSize();
  }
});
