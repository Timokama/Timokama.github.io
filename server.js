require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { Pool } = require('pg');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));

// ===== DB Connection =====
const pool = new Pool({
  user: process.env.DB_USER || 'timo',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ecommerce_db',
  password: process.env.DB_PASSWORD || 'timo123',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => console.log('✅ Postgres connected'));
pool.on('error', (err) => console.log('❌ DB Error:', err.message));

pool.query('SELECT NOW()').then(() => {
  console.log('✅ Database test query successful');
}).catch(err => console.log('❌ Database test failed:', err.message));

// ===== Cache for Categories =====
let categoriesCache = { data: null, time: 0 };
const CACHE_DURATION = 5 * 60 * 1000;

// ===== WhatsApp Config =====
const ADMIN_NUMBER = process.env.ADMIN_NUMBER || '254768394866';

// ===== Routes =====

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'E-commerce API running with compression',
    time: new Date().toISOString(),
    db: 'connected'
  });
});

// GET CATEGORIES - with debug + fallback
app.get('/api/categories', async (req, res) => {
  try {
    if (categoriesCache.data && Date.now() - categoriesCache.time < CACHE_DURATION) {
      console.log('📦 Categories from cache:', categoriesCache.data);
      return res.json(categoriesCache.data);
    }

    console.log('🔍 Querying DB for categories...');
    const result = await pool.query(
      "SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category!= '' ORDER BY category ASC LIMIT 50"
    );

    console.log('📊 DB raw rows:', result.rows);

    if (result.rows.length === 0) {
      console.log('⚠️ No categories in DB, using fallback');
      const fallback = ['All', 'Electronics', 'Fashion', 'Home', 'Funiture', 'Sports', 'Accessories', 'Beauty'];
      categoriesCache = { data: fallback, time: Date.now() };
      return res.json(fallback);
    }

    const categories = ['All',...result.rows.map(r => r.category)];
    console.log('✅ Final categories:', categories);

    categoriesCache = { data: categories, time: Date.now() };
    res.set('Cache-Control', 'public, max-age=300');
    res.json(categories);
  } catch (err) {
    console.error('❌ DB Error /api/categories:', err.message);
    res.json(['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Accessories']);
  }
});

// GET PRODUCTS
app.get('/api/products', async (req, res) => {
  console.log('🔍 GET /api/products', req.query);
  try {
    const { category, search } = req.query;
    let query = 'SELECT id, name, price, description, image, category, old_price, badge FROM products WHERE 1=1';
    let params = [];
    let count = 0;

    if (category && category!== 'All') {
      count++;
      query += ` AND category ILIKE $${count}`;
      params.push(category);
    }

    if (search && search.trim()) {
      count++;
      query += ` AND (name ILIKE $${count} OR description ILIKE $${count})`;
      params.push(`%${search.trim()}%`);
    }

    query += ' ORDER BY id DESC LIMIT 100';

    console.log('SQL:', query, 'Params:', params);
    const result = await pool.query(query, params);
    console.log(`✅ Found ${result.rows.length} products`);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ DB Error /api/products:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Add product
app.post('/api/products', async (req, res) => {
  const { name, price, description, image, category, old_price, badge } = req.body;

  if (!name ||!price) {
    return res.status(400).json({ error: 'Name and price required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products(name, price, description, image, category, old_price, badge) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [name, price, description || null, image || null, category || 'General', old_price || null, badge || null]
    );

    categoriesCache = { data: null, time: 0 };
    console.log('✅ Product added, cache cleared');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB Error /api/products POST:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image, category, old_price, badge } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name=$1, price=$2, description=$3, image=$4, category=$5, old_price=$6, badge=$7 WHERE id=$8 RETURNING *',
      [name, price, description, image, category, old_price, badge, id]
    );

    categoriesCache = { data: null, time: 0 };
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    categoriesCache = { data: null, time: 0 };
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order WhatsApp
app.post('/api/order-whatsapp', (req, res) => {
  const { customerName, phone, items, total, location } = req.body;

  if (!customerName ||!phone ||!items ||!total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let message = `*🛒 NEW ORDER - SHOPMART*%0A%0A`;
  message += `*Customer:* ${customerName}%0A`;
  message += `*Phone:* ${phone}%0A`;
  if (location) message += `*Location:* ${location}%0A`;
  message += `%0A*Items:*%0A`;

  items.forEach(item => {
    message += `- ${item.name} x${item.qty} = Ksh ${(item.price * item.qty).toLocaleString()}%0A`;
  });

  message += `%0A*Total: Ksh ${total.toLocaleString()}*%0A`;
  message += `%0A_Thank you for ordering from ShopMart!_`;

  const whatsappUrl = `https://wa.me/${ADMIN_NUMBER}?text=${message}`;
  res.json({ whatsappUrl });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT} with compression`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`📂 Categories: http://localhost:${PORT}/api/categories`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  pool.end();
  process.exit(0);
});
