/* ============================================================
   Kiyim-kechak do'koni boshqaruv tizimi — script.js
   © 2026 · Muxlisa · Fashion Store Management System
   Barcha ma'lumotlar localStorage'da saqlanadi
   ============================================================ */

// ===================== DATA / STATE =====================

const USERS = [
  { email: 'admin@store.uz', password: 'admin123', name: 'Administrator', role: 'admin', avatar: 'A' },
  { email: 'seller@store.uz', password: 'seller123', name: 'Sotuvchi', role: 'seller', avatar: 'S' },
  { email: 'stock@store.uz', password: 'stock123', name: 'Omborchi', role: 'stock', avatar: 'O' }
];

let currentUser = null;
let cart = [];
let selectedSaleProduct = null;

// ===================== LOCAL STORAGE HELPERS =====================

function getProducts() {
  return JSON.parse(localStorage.getItem('muxlisa_products') || '[]');
}

function setProducts(products) {
  localStorage.setItem('muxlisa_products', JSON.stringify(products));
}

function getSales() {
  return JSON.parse(localStorage.getItem('muxlisa_sales') || '[]');
}

function setSales(sales) {
  localStorage.setItem('muxlisa_sales', JSON.stringify(sales));
}

// ===================== DEMO DATA =====================

function initDemoData() {
  if (localStorage.getItem('muxlisa_initialized')) return;

  const demoProducts = [
    { id: 1, name: "Erkaklar klassik ko'ylagi", category: 'erkaklar', size: 'M', color: 'Oq', price: 189000, stock: 25 },
    { id: 2, name: "Erkaklar klassik ko'ylagi", category: 'erkaklar', size: 'L', color: 'Ko\'k', price: 189000, stock: 18 },
    { id: 3, name: "Erkaklar klassik ko'ylagi", category: 'erkaklar', size: 'XL', color: 'Qora', price: 199000, stock: 12 },
    { id: 4, name: "Erkaklar jinsi shim", category: 'erkaklar', size: 'L', color: 'Moviy', price: 259000, stock: 30 },
    { id: 5, name: "Erkaklar jinsi shim", category: 'erkaklar', size: 'M', color: 'Qora', price: 259000, stock: 22 },
    { id: 6, name: "Erkaklar sport kostyumi", category: 'erkaklar', size: 'XL', color: 'Kulrang', price: 349000, stock: 8 },
    { id: 7, name: "Erkaklar kurtka", category: 'erkaklar', size: 'L', color: 'Qora', price: 450000, stock: 3 },
    { id: 8, name: "Erkaklar futbolka", category: 'erkaklar', size: 'S', color: 'Qizil', price: 89000, stock: 45 },
    { id: 9, name: "Ayollar ko'ylagi", category: 'ayollar', size: 'S', color: 'Pushti', price: 220000, stock: 20 },
    { id: 10, name: "Ayollar ko'ylagi", category: 'ayollar', size: 'M', color: 'Qizil', price: 220000, stock: 15 },
    { id: 11, name: "Ayollar yubka", category: 'ayollar', size: 'M', color: 'Qora', price: 175000, stock: 14 },
    { id: 12, name: "Ayollar bluzka", category: 'ayollar', size: 'S', color: 'Oq', price: 145000, stock: 28 },
    { id: 13, name: "Ayollar palto", category: 'ayollar', size: 'L', color: 'Jigarrang', price: 520000, stock: 5 },
    { id: 14, name: "Ayollar sport shimi", category: 'ayollar', size: 'M', color: 'Kulrang', price: 160000, stock: 2 },
    { id: 15, name: "Ayollar libosi", category: 'ayollar', size: 'S', color: 'Yashil', price: 310000, stock: 10 },
    { id: 16, name: "Bolalar futbolka", category: 'bolalar', size: 'S', color: 'Sariq', price: 65000, stock: 50 },
    { id: 17, name: "Bolalar jinsi shim", category: 'bolalar', size: 'S', color: 'Moviy', price: 120000, stock: 35 },
    { id: 18, name: "Bolalar kurtka", category: 'bolalar', size: 'M', color: 'Qizil', price: 195000, stock: 4 },
    { id: 19, name: "Bolalar sport kostyumi", category: 'bolalar', size: 'S', color: 'Ko\'k', price: 155000, stock: 18 },
    { id: 20, name: "Bolalar ko'ylagi", category: 'bolalar', size: 'S', color: 'Oq', price: 85000, stock: 1 },
  ];

  const today = new Date();
  const demoSales = [
    { id: 1, productId: 1, productName: "Erkaklar klassik ko'ylagi", category: 'erkaklar', size: 'M', color: 'Oq', qty: 2, price: 189000, total: 378000, date: today.toISOString(), seller: 'Sotuvchi' },
    { id: 2, productId: 4, productName: "Erkaklar jinsi shim", category: 'erkaklar', size: 'L', color: 'Moviy', qty: 1, price: 259000, total: 259000, date: today.toISOString(), seller: 'Sotuvchi' },
    { id: 3, productId: 9, productName: "Ayollar ko'ylagi", category: 'ayollar', size: 'S', color: 'Pushti', qty: 3, price: 220000, total: 660000, date: today.toISOString(), seller: 'Administrator' },
    { id: 4, productId: 16, productName: "Bolalar futbolka", category: 'bolalar', size: 'S', color: 'Sariq', qty: 5, price: 65000, total: 325000, date: today.toISOString(), seller: 'Sotuvchi' },
    { id: 5, productId: 11, productName: "Ayollar yubka", category: 'ayollar', size: 'M', color: 'Qora', qty: 1, price: 175000, total: 175000, date: new Date(today - 86400000).toISOString(), seller: 'Administrator' },
    { id: 6, productId: 8, productName: "Erkaklar futbolka", category: 'erkaklar', size: 'S', color: 'Qizil', qty: 4, price: 89000, total: 356000, date: new Date(today - 86400000).toISOString(), seller: 'Sotuvchi' },
    { id: 7, productId: 17, productName: "Bolalar jinsi shim", category: 'bolalar', size: 'S', color: 'Moviy', qty: 2, price: 120000, total: 240000, date: new Date(today - 172800000).toISOString(), seller: 'Sotuvchi' },
  ];

  setProducts(demoProducts);
  setSales(demoSales);
  localStorage.setItem('muxlisa_initialized', 'true');
}

// ===================== LOGIN =====================

function fillDemo(email, password) {
  document.getElementById('loginEmail').value = email;
  document.getElementById('loginPassword').value = password;
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errEl = document.getElementById('loginError');

  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    errEl.style.display = 'block';
    return;
  }

  errEl.style.display = 'none';
  currentUser = user;
  showApp();
});

function showApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('appWrapper').classList.add('active');
  document.getElementById('mobileMenuBtn').style.display = '';

  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('userRole').textContent =
    currentUser.role === 'admin' ? 'Administrator' :
    currentUser.role === 'seller' ? 'Sotuvchi-kassir' : 'Omborchi';
  document.getElementById('userAvatar').textContent = currentUser.avatar;

  navigateTo('dashboard');
}

function logout() {
  currentUser = null;
  cart = [];
  document.getElementById('loginPage').style.display = '';
  document.getElementById('appWrapper').classList.remove('active');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').style.display = 'none';
}

// ===================== NAVIGATION =====================

function navigateTo(page) {
  // Update nav
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');

  // Update sections
  document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');

  // Render
  if (page === 'dashboard') renderDashboard();
  if (page === 'products') renderProducts();
  if (page === 'sales') renderSaleProducts();
  if (page === 'history') renderHistory();
  if (page === 'reports') renderReports();

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ===================== DASHBOARD =====================

function renderDashboard() {
  const products = getProducts();
  const sales = getSales();

  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);

  // Today's sales
  const today = new Date().toDateString();
  const todaySales = sales.filter(s => new Date(s.date).toDateString() === today);
  const todayTotal = todaySales.reduce((s, item) => s + item.total, 0);

  // Low stock (<=5)
  const lowStock = products.filter(p => p.stock <= 5);

  document.getElementById('statTotalProducts').textContent = totalProducts;
  document.getElementById('statTotalStock').textContent = formatNumber(totalStock);
  document.getElementById('statTodaySales').textContent = formatNumber(todayTotal);
  document.getElementById('statLowStock').textContent = lowStock.length;

  // Alert list
  const alertContainer = document.getElementById('lowStockAlerts');
  const alertList = document.getElementById('alertList');

  if (lowStock.length > 0) {
    alertContainer.style.display = 'block';
    alertList.innerHTML = lowStock.map(p => `
      <div class="alert-item">
        <span class="alert-icon">⚠️</span>
        <span><strong>${p.name}</strong> (${p.size} / ${p.color}) — faqat <strong style="color:var(--danger)">${p.stock} dona</strong> qoldi!</span>
      </div>
    `).join('');
  } else {
    alertContainer.style.display = 'none';
  }
}

// ===================== PRODUCTS =====================

function renderProducts() {
  let products = getProducts();
  const search = document.getElementById('productSearch').value.toLowerCase();
  const catFilter = document.getElementById('filterCategory').value;
  const sizeFilter = document.getElementById('filterSize').value;
  const colorFilter = document.getElementById('filterColor').value;

  if (search) products = products.filter(p => p.name.toLowerCase().includes(search));
  if (catFilter) products = products.filter(p => p.category === catFilter);
  if (sizeFilter) products = products.filter(p => p.size === sizeFilter);
  if (colorFilter) products = products.filter(p => p.color === colorFilter);

  updateColorFilter();

  const tbody = document.getElementById('productsTableBody');
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--text-secondary);">📭 Mahsulot topilmadi</td></tr>';
    return;
  }

  tbody.innerHTML = products.map((p, i) => {
    const catBadge = p.category === 'erkaklar' ? 'badge-erkak' :
                     p.category === 'ayollar' ? 'badge-ayol' : 'badge-bola';
    const catLabel = p.category === 'erkaklar' ? '👨 Erkaklar' :
                     p.category === 'ayollar' ? '👩 Ayollar' : '👶 Bolalar';
    const stockBadge = p.stock <= 5 ? 'badge-low' : 'badge-ok';
    const stockIcon = p.stock <= 5 ? '⚠️' : '✅';

    return `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${p.name}</strong></td>
        <td><span class="badge ${catBadge}">${catLabel}</span></td>
        <td>${p.size}</td>
        <td>${p.color}</td>
        <td><strong>${formatNumber(p.price)}</strong></td>
        <td><span class="badge ${stockBadge}">${stockIcon} ${p.stock} dona</span></td>
        <td>
          <div class="action-btns">
            <button class="btn btn-info btn-sm" onclick="editProduct(${p.id})">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateColorFilter() {
  const products = getProducts();
  const colors = [...new Set(products.map(p => p.color))].sort();
  const sel = document.getElementById('filterColor');
  const current = sel.value;
  sel.innerHTML = '<option value="">Barcha ranglar</option>' +
    colors.map(c => `<option value="${c}" ${c === current ? 'selected' : ''}>${c}</option>`).join('');
}

function openProductModal(editId) {
  document.getElementById('productModal').classList.add('active');
  document.getElementById('productForm').reset();
  document.getElementById('editProductId').value = '';

  if (editId) {
    const p = getProducts().find(x => x.id === editId);
    if (p) {
      document.getElementById('productModalTitle').textContent = '✏️ Mahsulotni tahrirlash';
      document.getElementById('editProductId').value = p.id;
      document.getElementById('pName').value = p.name;
      document.getElementById('pCategory').value = p.category;
      document.getElementById('pSize').value = p.size;
      document.getElementById('pColor').value = p.color;
      document.getElementById('pPrice').value = p.price;
      document.getElementById('pStock').value = p.stock;
    }
  } else {
    document.getElementById('productModalTitle').textContent = '➕ Yangi mahsulot qo\'shish';
  }
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

function saveProduct() {
  const name = document.getElementById('pName').value.trim();
  const category = document.getElementById('pCategory').value;
  const size = document.getElementById('pSize').value;
  const color = document.getElementById('pColor').value.trim();
  const price = parseInt(document.getElementById('pPrice').value);
  const stock = parseInt(document.getElementById('pStock').value);
  const editId = document.getElementById('editProductId').value;

  if (!name || !category || !size || !color || isNaN(price) || isNaN(stock)) {
    showToast('Iltimos, barcha maydonlarni to\'ldiring!', 'warning');
    return;
  }

  let products = getProducts();

  if (editId) {
    // Edit
    products = products.map(p => {
      if (p.id === parseInt(editId)) {
        return { ...p, name, category, size, color, price, stock };
      }
      return p;
    });
    showToast('✅ Mahsulot muvaffaqiyatli tahrirlandi!', 'success');
  } else {
    // Add new
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    products.push({ id: maxId + 1, name, category, size, color, price, stock });
    showToast('✅ Yangi mahsulot muvaffaqiyatli qo\'shildi!', 'success');
  }

  setProducts(products);
  closeProductModal();
  renderProducts();
}

function editProduct(id) {
  openProductModal(id);
}

function deleteProduct(id) {
  if (!confirm('Haqiqatan ham bu mahsulotni o\'chirmoqchimisiz?')) return;
  let products = getProducts().filter(p => p.id !== id);
  setProducts(products);
  renderProducts();
  showToast('🗑️ Mahsulot o\'chirildi!', 'info');
}

// ===================== SALES (KASSA) =====================

function renderSaleProducts() {
  let products = getProducts().filter(p => p.stock > 0);
  const search = document.getElementById('saleSearch').value.toLowerCase();
  const catFilter = document.getElementById('saleCatFilter').value;

  if (search) products = products.filter(p => p.name.toLowerCase().includes(search));
  if (catFilter) products = products.filter(p => p.category === catFilter);

  const grid = document.getElementById('saleProductGrid');
  if (products.length === 0) {
    grid.innerHTML = '<p style="text-align:center; color:var(--text-secondary); padding:2rem;">📭 Mavjud mahsulot topilmadi</p>';
    return;
  }

  const catEmoji = { erkaklar: '👔', ayollar: '👗', bolalar: '🧒' };

  grid.innerHTML = products.map(p => `
    <div class="sale-product-card" onclick="openSaleModal(${p.id})">
      <div class="sp-emoji">${catEmoji[p.category] || '👕'}</div>
      <div class="sp-name">${p.name}</div>
      <div class="sp-info">${p.size} · ${p.color}</div>
      <div class="sp-price">${formatNumber(p.price)} so'm</div>
      <div class="sp-stock">📦 ${p.stock} dona mavjud</div>
    </div>
  `).join('');
}

function openSaleModal(productId) {
  const product = getProducts().find(p => p.id === productId);
  if (!product) return;

  selectedSaleProduct = product;
  document.getElementById('saleModal').classList.add('active');
  document.getElementById('saleModalProductInfo').textContent =
    `${product.name} (${product.size} / ${product.color}) — ${formatNumber(product.price)} so'm`;
  document.getElementById('saleModalStock').textContent = `📦 Omborda: ${product.stock} dona`;
  document.getElementById('saleQty').value = 1;
  document.getElementById('saleQty').max = product.stock;
}

function closeSaleModal() {
  document.getElementById('saleModal').classList.remove('active');
  selectedSaleProduct = null;
}

function addToCartConfirm() {
  if (!selectedSaleProduct) return;
  const qty = parseInt(document.getElementById('saleQty').value);

  if (isNaN(qty) || qty < 1) {
    showToast('Soni kamida 1 bo\'lishi kerak!', 'warning');
    return;
  }

  if (qty > selectedSaleProduct.stock) {
    showToast(`Omborda faqat ${selectedSaleProduct.stock} dona mavjud!`, 'error');
    return;
  }

  // Check if already in cart
  const existing = cart.find(c => c.productId === selectedSaleProduct.id);
  if (existing) {
    const newQty = existing.qty + qty;
    if (newQty > selectedSaleProduct.stock) {
      showToast(`Omborda faqat ${selectedSaleProduct.stock} dona mavjud! Savatda allaqachon ${existing.qty} dona bor.`, 'error');
      return;
    }
    existing.qty = newQty;
  } else {
    cart.push({
      productId: selectedSaleProduct.id,
      name: selectedSaleProduct.name,
      size: selectedSaleProduct.size,
      color: selectedSaleProduct.color,
      category: selectedSaleProduct.category,
      price: selectedSaleProduct.price,
      qty: qty,
      maxStock: selectedSaleProduct.stock
    });
  }

  closeSaleModal();
  renderCart();
  showToast(`🛒 ${selectedSaleProduct.name} savatga qo'shildi!`, 'success');
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-icon">🛒</div>
        <p>Savat bo'sh</p>
        <p style="font-size:0.75rem; margin-top:0.3rem;">Mahsulotni bosib savatga qo'shing</p>
      </div>
    `;
    totalEl.textContent = '0 so\'m';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map((item, idx) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-details">${item.size} · ${item.color}</div>
        </div>
        <div class="cart-item-qty">
          <button onclick="changeCartQty(${idx}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeCartQty(${idx}, 1)">+</button>
        </div>
        <div class="cart-item-price">${formatNumber(lineTotal)}</div>
        <button class="cart-item-remove" onclick="removeCartItem(${idx})">✕</button>
      </div>
    `;
  }).join('');

  totalEl.textContent = formatNumber(total) + ' so\'m';
}

function changeCartQty(idx, delta) {
  const item = cart[idx];
  const newQty = item.qty + delta;

  if (newQty < 1) {
    removeCartItem(idx);
    return;
  }
  if (newQty > item.maxStock) {
    showToast(`Omborda faqat ${item.maxStock} dona mavjud!`, 'warning');
    return;
  }

  item.qty = newQty;
  renderCart();
}

function removeCartItem(idx) {
  cart.splice(idx, 1);
  renderCart();
}

function completeSale() {
  if (cart.length === 0) {
    showToast('Savat bo\'sh! Avval mahsulot tanlang.', 'warning');
    return;
  }

  if (!confirm('Sotuvni yakunlashni tasdiqlaysizmi?')) return;

  let products = getProducts();
  let sales = getSales();
  const maxSaleId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) : 0;
  let saleId = maxSaleId;

  cart.forEach(item => {
    saleId++;
    // Add sale record
    sales.push({
      id: saleId,
      productId: item.productId,
      productName: item.name,
      category: item.category,
      size: item.size,
      color: item.color,
      qty: item.qty,
      price: item.price,
      total: item.price * item.qty,
      date: new Date().toISOString(),
      seller: currentUser ? currentUser.name : 'Noma\'lum'
    });

    // Decrease stock
    const product = products.find(p => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.qty);
    }
  });

  setProducts(products);
  setSales(sales);

  const total = cart.reduce((s, item) => s + item.price * item.qty, 0);
  cart = [];
  renderCart();
  renderSaleProducts();

  showToast(`✅ Sotuv muvaffaqiyatli amalga oshirildi! Jami: ${formatNumber(total)} so'm`, 'success');
}

// ===================== SALES HISTORY =====================

function renderHistory() {
  const sales = getSales().sort((a, b) => new Date(b.date) - new Date(a.date));
  const tbody = document.getElementById('historyTableBody');

  if (sales.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-secondary);">📭 Sotuvlar tarixi bo\'sh</td></tr>';
    return;
  }

  tbody.innerHTML = sales.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${formatDate(s.date)}</td>
      <td><strong>${s.productName}</strong></td>
      <td>${s.size} / ${s.color}</td>
      <td>${s.qty} dona</td>
      <td><strong>${formatNumber(s.total)} so'm</strong></td>
      <td>${s.seller}</td>
    </tr>
  `).join('');
}

// ===================== REPORTS =====================

function renderReports() {
  const sales = getSales();
  const products = getProducts();

  // Total revenue
  const totalRevenue = sales.reduce((s, item) => s + item.total, 0);
  const totalSalesCount = sales.reduce((s, item) => s + item.qty, 0);
  const avgSale = sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0;

  document.getElementById('reportTotalRevenue').textContent = formatNumber(totalRevenue);
  document.getElementById('reportTotalSalesCount').textContent = totalSalesCount;
  document.getElementById('reportAvgSale').textContent = formatNumber(avgSale);

  // Top products
  const productSales = {};
  sales.forEach(s => {
    const key = s.productName;
    if (!productSales[key]) productSales[key] = { name: key, qty: 0, total: 0 };
    productSales[key].qty += s.qty;
    productSales[key].total += s.total;
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const topList = document.getElementById('topProductsList');
  topList.innerHTML = topProducts.length > 0
    ? topProducts.map((p, i) => `
        <li>
          <span>${getMedal(i)} ${p.name}</span>
          <strong>${p.qty} dona · ${formatNumber(p.total)} so'm</strong>
        </li>
      `).join('')
    : '<li style="text-align:center; color:var(--text-secondary);">Ma\'lumot yo\'q</li>';

  // Stock status
  const stockList = document.getElementById('stockStatusList');
  const sortedByStock = [...products].sort((a, b) => a.stock - b.stock).slice(0, 5);
  stockList.innerHTML = sortedByStock.length > 0
    ? sortedByStock.map(p => {
        const icon = p.stock <= 5 ? '🔴' : p.stock <= 15 ? '🟡' : '🟢';
        return `<li><span>${icon} ${p.name} (${p.size}/${p.color})</span><strong>${p.stock} dona</strong></li>`;
      }).join('')
    : '<li style="text-align:center; color:var(--text-secondary);">Ma\'lumot yo\'q</li>';

  // Category sales
  const catSales = { erkaklar: 0, ayollar: 0, bolalar: 0 };
  sales.forEach(s => {
    if (catSales.hasOwnProperty(s.category)) catSales[s.category] += s.total;
  });

  const catList = document.getElementById('categorySalesList');
  const catEmoji = { erkaklar: '👨', ayollar: '👩', bolalar: '👶' };
  const catNames = { erkaklar: 'Erkaklar', ayollar: 'Ayollar', bolalar: 'Bolalar' };
  catList.innerHTML = Object.keys(catSales).map(cat => `
    <li>
      <span>${catEmoji[cat]} ${catNames[cat]}</span>
      <strong>${formatNumber(catSales[cat])} so'm</strong>
    </li>
  `).join('');
}

// ===================== HELPERS =====================

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatDate(isoStr) {
  const d = new Date(isoStr);
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getMedal(index) {
  return ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index] || '';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===================== INIT =====================

initDemoData();
