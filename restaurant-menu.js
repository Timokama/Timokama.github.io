const WHATSAPP_NUMBER = "254768394866";

const menuData = {
  categories: ['All', 'Burgers', 'Pizza', 'Drinks', 'Desserts', 'Snacks'],
  items: [
    {id: 1, name: "Classic Burger", desc: "Beef patty, lettuce, tomato, cheese, house sauce", price: 450, category: "Burgers", image: "https://images.pexels.com/photos/5488046/pexels-photo-5488046.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 2, name: "Cheese Burger", desc: "Double cheese, beef patty, pickles, onion", price: 550, category: "Burgers", image: "https://images.pexels.com/photos/12420469/pexels-photo-12420469.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 9, name: "BBQ Bacon Burger", desc: "Smoky BBQ sauce, crispy bacon, cheddar", price: 650, category: "Burgers", image: "https://images.pexels.com/photos/11653560/pexels-photo-11653560.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 3, name: "Pepperoni Pizza", desc: "Crispy pepperoni, mozzarella, tomato sauce", price: 900, category: "Pizza", image: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 4, name: "Margherita Pizza", desc: "Tomato, mozzarella, fresh basil, olive oil", price: 800, category: "Pizza", image: "https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 10, name: "Veggie Supreme", desc: "Bell peppers, mushrooms, onions, olives", price: 850, category: "Pizza", image: "https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 5, name: "Fresh Juice", desc: "Passion & Mango blend, no added sugar", price: 120, category: "Drinks", image: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 6, name: "Milkshake", desc: "Strawberry milkshake with whipped cream", price: 180, category: "Drinks", image: "https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 11, name: "Iced Coffee", desc: "Cold brew with milk and vanilla syrup", price: 150, category: "Drinks", image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 7, name: "Chocolate Cake", desc: "Moist chocolate slice with cream frosting", price: 200, category: "Desserts", image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 8, name: "Ice Cream Sundae", desc: "Vanilla ice cream with syrup, nuts, cherry", price: 180, category: "Desserts", image: "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 12, name: "Apple Pie", desc: "Warm apple pie with cinnamon and ice cream", price: 220, category: "Desserts", image: "https://images.pexels.com/photos/6163273/pexels-photo-6163273.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 13, name: "Chicken Wings", desc: "Spicy buffalo wings, 6 pcs with dip", price: 400, category: "Snacks", image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600"},
    {id: 14, name: "French Fries", desc: "Crispy golden fries with ketchup", price: 150, category: "Snacks", image: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600"}
  ]
};

let currentCat = 'All';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let rateRating = 0;
let map, marker, mapLoaded = false;
const sunton = [-1.2115, 36.9256];

// Theme Toggle
function initTheme() {
  const savedTheme = localStorage.getItem('tastehub_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark'? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('tastehub_theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;
  btn.innerHTML = theme === 'dark'? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Menu Rendering
function renderCategories() {
  const catDiv = document.getElementById('categories');
  if (!catDiv) return;
  catDiv.innerHTML = menuData.categories.map(cat =>
    `<button class="cat-btn ${cat === currentCat? 'active' : ''}" onclick="filterMenu('${cat}')">${cat}</button>`
  ).join('');
}

function renderMenu() {
  const menuDiv = document.getElementById('menu');
  if (!menuDiv) return;

  const filtered = currentCat === 'All'? menuData.items : menuData.items.filter(i => i.category === currentCat);

  menuDiv.innerHTML = `<h2>${currentCat}</h2><div class="menu-grid"></div>`;
  const grid = menuDiv.querySelector('.menu-grid');

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center; color:var(--gray); padding:40px;">No items in this category yet.</p>';
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="menu-item">
      <div class="img-wrap">
        <img src="${item.image}" alt="${item.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
      </div>
      <div class="menu-item-info">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="price-row">
          <div class="price-badge">KSH ${item.price.toLocaleString()}</div>
          <button class="add-cart-btn" onclick="addToCart(${item.id}, event)">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterMenu(cat) {
  currentCat = cat;
  window.location.hash = cat === 'All'? '' : cat;
  renderCategories();
  renderMenu();
}

// Cart Functions
function addToCart(id, e) {
  const item = menuData.items.find(i => i.id === id);
  if (!item) return;

  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({...item, qty: 1});

  saveCart();

  const btn = e?.target?.closest('button');
  if (btn) {
    btn.innerHTML = '<i class="fas fa-check"></i> Added';
    setTimeout(() => btn.innerHTML = 'Add', 1000);
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0? 'flex' : 'none';
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
      if (map) setTimeout(() => map.invalidateSize(), 100);
    }, 300);
  }
}

function renderCart() {
  const cartDiv = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!cartDiv ||!totalEl) return;

  if (cart.length === 0) {
    cartDiv.innerHTML = '<p style="text-align:center; color:var(--gray); padding: 20px;">Your cart is empty</p>';
    totalEl.textContent = '0';
    return;
  }

  let total = 0;
  cartDiv.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <img src="${item.image}" onerror="this.src='https://via.placeholder.com/60'">
        <div style="flex:1;">
          <strong>${item.name}</strong><br>
          <small>KSH ${item.price} x ${item.qty}</small>
          <div class="cart-qty">
            <button onclick="updateQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${item.id}, 1)">+</button>
            <button onclick="removeItem(${item.id})" style="color:var(--danger);">
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

// Map Functions
function initMap() {
  if (mapLoaded) {
    setTimeout(() => map && map.invalidateSize(), 100);
    return;
  }

  const mapEl = document.getElementById('mapPreview');
  if (!mapEl || typeof L === 'undefined') return;

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
  if (!addrInput ||!statusEl) return;

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

  if (location.protocol!== 'https:' && location.hostname!== 'localhost') {
    statusEl.textContent = "GPS needs HTTPS. Host site online or use search/tap map.";
    statusEl.style.color = "var(--danger)";
    return;
  }

  statusEl.textContent = "Requesting location...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const pos = [position.coords.latitude, position.coords.longitude];
      map.setView(pos, 17);
      marker.setLatLng(pos);
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
      document.getElementById('searchResults').style.display = 'none';
      return;
    }

    searchTimeout = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ke&limit=5`)
       .then(res => res.json())
       .then(data => {
          const resultsDiv = document.getElementById('searchResults');
          if (data.length === 0) {
            resultsDiv.style.display = 'none';
            return;
          }

          resultsDiv.innerHTML = data.map(place =>
            `<div onclick="selectSearchResult(${place.lat}, ${place.lon}, '${place.display_name.replace(/'/g, "\\'")}')">${place.display_name}</div>`
          ).join('');
          resultsDiv.style.display = 'block';
        });
    }, 500);
  });
}

function selectSearchResult(lat, lon, address) {
  const pos = [parseFloat(lat), parseFloat(lon)];
  map.setView(pos, 17);
  marker.setLatLng(pos);
  setLocation(pos, address);
  document.getElementById('searchResults').style.display = 'none';
  document.getElementById('locationSearch').value = address;
}

function checkLocationComplete() {
  const street = document.getElementById('streetAddress');
  const mapLink = document.getElementById('deliveryAddress');
  const statusEl = document.getElementById('locationStatus');
  if (!street ||!mapLink ||!statusEl) return;

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

  if (!street ||!street.value.trim()) {
    alert("Please enter your house/building, street, estate");
    return;
  }
  if (!mapLink ||!mapLink.value) {
    alert("Please set your location on the map");
    return;
  }

  sendOrderToWhatsApp(street.value.trim(), mapLink.value);
  cart = [];
  saveCart();
  toggleCart();

  setTimeout(() => {
    document.getElementById('rateModal')?.classList.add('open');
  }, 2000);
}

function sendOrderToWhatsApp(address, mapLink) {
  let message = '🍔 New Order from TasteHub\n';
  let total = 0;
  cart.forEach(item => {
    message += `${item.name} x${item.qty} - KSH ${item.price * item.qty}\n`;
    total += item.price * item.qty;
  });
  message += `\nTotal: KSH ${total.toLocaleString()}`;
  message += `\n\n📍 Delivery Address: ${address}`;
  message += `\n🗺️ Map Link: ${mapLink}`;
  message += `\n\nOrder Time: ${new Date().toLocaleString()}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// Settings Modal
function openSettings() {
  document.getElementById('settingsModal')?.classList.add('open');
}

function closeSettings() {
  document.getElementById('settingsModal')?.classList.remove('open');
}

// Feedback Modal
function openFeedback() {
  closeSettings();
  document.getElementById('feedbackModal')?.classList.add('open');
}

function closeFeedback() {
  const modal = document.getElementById('feedbackModal');
  const input = document.getElementById('feedbackText');
  modal?.classList.remove('open');
  if (input) input.value = '';
}

function sendFeedback() {
  const feedback = document.getElementById('feedbackText')?.value.trim();
  if (!feedback) return alert('Please enter your feedback');
  const message = `TasteHub Feedback:\n\n${feedback}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  closeFeedback();
}

// Rating Modal
function openRateModal() {
  closeSettings();
  document.getElementById('rateModal')?.classList.add('open');
}

function closeRateModal() {
  const modal = document.getElementById('rateModal');
  const comment = document.getElementById('rateComment');
  modal?.classList.remove('open');
  if (comment) comment.value = '';
  rateRating = 0;
  updateStars(0);
}

function updateStars(rating) {
  document.querySelectorAll('#rateStars i').forEach((star, i) => {
    star.classList.toggle('active', i < rating);
    star.classList.toggle('fa-solid', i < rating);
    star.classList.toggle('fa-regular', i >= rating);
  });
}

function sendRating() {
  if (rateRating === 0) return alert('Please select a rating');
  const comment = document.getElementById('rateComment')?.value;
  const stars = '⭐'.repeat(rateRating);
  const message = `TasteHub Rating\nRating: ${stars} ${rateRating}/5\nComment: ${comment || 'No comment'}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  closeRateModal();
}

function openWhatsAppSupport() {
  const message = `Hello TasteHub Support Team,\n\nI need help with:`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  closeSettings();
}

function openAboutPage() {
  window.location.href = 'about-tastehub.html';
  closeSettings();
}

// Routing & Init
function setCategoryFromHash() {
  const hash = decodeURIComponent(window.location.hash.replace('#', ''));
  if (menuData.categories.includes(hash)) {
    currentCat = hash;
  }
}

window.addEventListener('hashchange', () => {
  setCategoryFromHash();
  renderCategories();
  renderMenu();
});

window.addEventListener('resize', () => {
  if (map && document.getElementById('cartModal')?.classList.contains('open')) {
    map.invalidateSize();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setCategoryFromHash();
  renderCategories();
  renderMenu();
  updateCartBadge();
  setupLocationSearch();

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
