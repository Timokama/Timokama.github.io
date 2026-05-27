<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mama's Kitchen | Digital Menu</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    :root {
      --primary: #d62828;
      --dark: #1a1a1a;
      --light: #f8f9fa;
      --accent: #fcbf49;
    }
    * { margin:0; padding:0; box-sizing:border-box; font-family: 'Segoe UI', sans-serif; }
    body { background: var(--light); color: var(--dark); }

    header {
      background: var(--primary); color: #fff; text-align: center;
      padding: 25px 15px; position: sticky; top: 0; z-index: 10;
    }
    header h1 { font-size: 1.8rem; margin-bottom: 5px; }
    header p { opacity: 0.9; font-size: 0.95rem; }

   .categories {
      display: flex; overflow-x: auto; gap: 10px; padding: 15px;
      background: #fff; border-bottom: 1px solid #eee;
      position: sticky; top: 85px; z-index: 9;
    }
   .categories::-webkit-scrollbar { display: none; }
   .category-btn {
      padding: 10px 18px; border: 2px solid var(--primary);
      border-radius: 25px; background: #fff; color: var(--primary);
      white-space: nowrap; cursor: pointer; font-weight: 600;
      transition: 0.2s;
    }
   .category-btn.active,.category-btn:hover {
      background: var(--primary); color: #fff;
    }

   .menu-section { padding: 20px; max-width: 900px; margin: auto; }
   .menu-section h2 { color: var(--primary); margin-bottom: 15px; font-size: 1.4rem; }

   .menu-grid { display: grid; gap: 15px; }
   .menu-item {
      background: #fff; padding: 15px; border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: flex; gap: 15px; align-items: center;
    }
   .menu-item img {
      width: 80px; height: 80px; object-fit: cover; border-radius: 10px;
    }
   .menu-item-info { flex: 1; }
   .menu-item-info h3 { font-size: 1.1rem; margin-bottom: 5px; }
   .menu-item-info p { font-size: 0.9rem; color: #666; margin-bottom: 8px; }
   .price { color: var(--primary); font-weight: 700; font-size: 1.2rem; }

   .admin-toggle {
      position: fixed; bottom: 20px; right: 20px;
      background: var(--accent); color: #000; border: none;
      padding: 12px 18px; border-radius: 50px; font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer;
      z-index: 20;
    }

   .admin-panel {
      display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); z-index: 30; padding: 20px; overflow-y: auto;
    }
   .admin-panel.open { display: block; }
   .admin-content {
      background: #fff; max-width: 600px; margin: 40px auto;
      padding: 25px; border-radius: 12px;
    }
   .admin-content input,.admin-content textarea,.admin-content select {
      width: 100%; padding: 10px; margin-bottom: 12px;
      border: 1px solid #ddd; border-radius: 8px;
    }
   .admin-content button {
      padding: 12px 20px; border: none; border-radius: 8px;
      cursor: pointer; font-weight: 600;
    }
   .btn-save { background: var(--primary); color: #fff; }
   .btn-close { background: #ccc; margin-left: 10px; }

    footer { text-align: center; padding: 30px; color: #777; font-size: 0.9rem; }
  </style>
</head>
<body>

  <header>
    <h1><i class="fas fa-utensils"></i> Mama's Kitchen</h1>
    <p>Scan, Order, Enjoy. Updated live.</p>
  </header>

  <div class="categories" id="categories"></div>

  <div class="menu-section" id="menu"></div>

  <button class="admin-toggle" onclick="toggleAdmin()">
    <i class="fas fa-edit"></i> Edit Menu
  </button>

  <div class="admin-panel" id="adminPanel">
    <div class="admin-content">
      <h2>Add/Edit Item</h2>
      <input type="text" id="itemName" placeholder="Item Name">
      <textarea id="itemDesc" placeholder="Description"></textarea>
      <input type="number" id="itemPrice" placeholder="Price in KSH">
      <select id="itemCategory"></select>
      <input type="text" id="itemImage" placeholder="Image URL">
      <div>
        <button class="btn-save" onclick="saveItem()">Save Item</button>
        <button class="btn-close" onclick="toggleAdmin()">Close</button>
      </div>
      <hr style="margin: 20px 0;">
      <button class="btn-save" onclick="exportMenu()">Export Menu JSON</button>
      <button onclick="importMenu()">Import Menu JSON</button>
    </div>
  </div>

  <footer>
    <p>Powered by Timokama | Scan again anytime for updated menu</p>
  </footer>

  <script>
    // Default menu data
    let menuData = JSON.parse(localStorage.getItem('menuData')) || {
      categories: ["Mains", "Drinks", "Snacks", "Desserts"],
      items: [
        {id: 1, name: "Nyama Choma", desc: "Grilled beef with kachumbari", price: 400, category: "Mains", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200"},
        {id: 2, name: "Ugali & Sukuma", desc: "Classic Kenyan combo", price: 150, category: "Mains", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200"},
        {id: 3, name: "Fresh Juice", desc: "Passion & Mango blend", price: 120, category: "Drinks", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200"},
        {id: 4, name: "Samosa", desc: "Crispy beef samosa, 2 pcs", price: 80, category: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df6638f3f4f3?w=200"}
      ]
    };

    let currentCategory = "Mains";
    let editingId = null;

    function saveToStorage() {
      localStorage.setItem('menuData', JSON.stringify(menuData));
    }

    function renderCategories() {
      const catDiv = document.getElementById('categories');
      const catSelect = document.getElementById('itemCategory');
      catDiv.innerHTML = '';
      catSelect.innerHTML = '';

      menuData.categories.forEach(cat => {
        catDiv.innerHTML += `<button class="category-btn ${cat === currentCategory? 'active' : ''}"
          onclick="setCategory('${cat}')">${cat}</button>`;
        catSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
      });
    }

    function renderMenu() {
      const menuDiv = document.getElementById('menu');
      const filtered = menuData.items.filter(i => i.category === currentCategory);

      menuDiv.innerHTML = `<h2>${currentCategory}</h2><div class="menu-grid"></div>`;
      const grid = menuDiv.querySelector('.menu-grid');

      if (filtered.length === 0) {
        grid.innerHTML = '<p>No items in this category yet.</p>';
        return;
      }

      filtered.forEach(item => {
        grid.innerHTML += `
          <div class="menu-item">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="menu-item-info">
              <h3>${item.name}</h3>
              <p>${item.desc}</p>
              <div class="price">KSH ${item.price.toLocaleString()}</div>
            </div>
          </div>
        `;
      });
    }

    function setCategory(cat) {
      currentCategory = cat;
      renderCategories();
      renderMenu();
    }

    function toggleAdmin() {
      document.getElementById('adminPanel').classList.toggle('open');
      if (!editingId) clearForm();
    }

    function saveItem() {
      const item = {
        id: editingId || Date.now(),
        name: document.getElementById('itemName').value,
        desc: document.getElementById('itemDesc').value,
        price: parseInt(document.getElementById('itemPrice').value),
        category: document.getElementById('itemCategory').value,
        image: document.getElementById('itemImage').value || 'https://via.placeholder.com/200'
      };

      if (!item.name ||!item.price) {
        alert('Name and price are required');
        return;
      }

      if (editingId) {
        menuData.items = menuData.items.map(i => i.id === editingId? item : i);
      } else {
        menuData.items.push(item);
      }

      saveToStorage();
      renderMenu();
      toggleAdmin();
      editingId = null;
    }

    function clearForm() {
      document.getElementById('itemName').value = '';
      document.getElementById('itemDesc').value = '';
      document.getElementById('itemPrice').value = '';
      document.getElementById('itemImage').value = '';
    }

    function exportMenu() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(menuData, null, 2));
      const a = document.createElement('a');
      a.setAttribute("href", dataStr);
      a.setAttribute("download", "menu.json");
      a.click();
    }

    function importMenu() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
          menuData = JSON.parse(event.target.result);
          saveToStorage();
          renderCategories();
          renderMenu();
        };
        reader.readAsText(file);
      };
      input.click();
    }

    // Init
    renderCategories();
    renderMenu();
  </script>
</body>
</html>
