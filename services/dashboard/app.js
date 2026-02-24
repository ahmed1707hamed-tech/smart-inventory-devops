const API_URL = 'http://localhost:8000';

// =======================
// State & Elements
// =======================
const state = {
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user'),
    role: localStorage.getItem('role') || 'viewer',
    products: [],
    activities: [],
    deleteTarget: null,

    // UI State
    currentSection: 'dashboard',
    inventoryPage: 1,
    itemsPerPage: 8,
    inventorySearch: '',
    inventoryFilter: 'all',

    // Config
    lowStockThreshold: parseInt(localStorage.getItem('lowStockThreshold')) || 5
};

// DOM Refs
const els = {
    loginForm: document.getElementById('login-form'),

    // Navigation
    navItems: document.querySelectorAll('.nav-item'),
    sections: document.querySelectorAll('.section'),
    pageHeader: document.getElementById('page-header'),

    // Inventory
    invList: document.getElementById('inventory-list'),
    invSearch: document.getElementById('inv-search'),
    invFilter: document.getElementById('inv-filter'),
    invAddBtn: document.getElementById('inv-add-btn'),
    prevBtn: document.getElementById('prev-page-btn'),
    nextBtn: document.getElementById('next-page-btn'),
    pageInfo: document.getElementById('page-info'),

    // Dashboard Specific
    dashActivityList: document.getElementById('dashboard-activity-list'),
    stockPieChart: document.getElementById('stockPieChart'),
    stockBarChart: document.getElementById('stockBarChart'),

    // Activity Section
    fullActivityList: document.getElementById('full-activity-list'),

    // Modals
    deleteModal: document.getElementById('delete-modal'),
    confirmDeleteBtn: document.getElementById('confirm-delete-btn'),

    // Stats
    stats: {
        products: document.getElementById('stat-total-products'),
        qty: document.getElementById('stat-total-qty'),
        low: document.getElementById('stat-low-stock')
    }
};

// =======================
// Initialization
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const isDashboard = window.location.pathname.includes('dashboard.html');

    if (isDashboard) {
        if (!state.token) window.location.href = 'index.html';
        initDashboard();
    } else {
        if (state.token) window.location.href = 'dashboard.html';
        initLogin();
    }
});

// =======================
// Logic: Login
// =======================
function initLogin() {
    if (!els.loginForm) return;

    els.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('username')?.value;
        const pass = document.getElementById('password')?.value;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: pass })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', data.username);
                localStorage.setItem('role', data.role);
                window.location.href = 'dashboard.html';
            } else {
                showToast("Invalid Credentials", "error");
            }
        } catch (err) {
            showToast("Server Offline", "error");
        }
    });
}

// =======================
// Logic: Dashboard & Navigation
// =======================
function initDashboard() {
    // User Profile
    const avatarEl = document.getElementById('user-avatar');
    const nameEl = document.getElementById('user-name');
    const roleEl = document.getElementById('user-role-display');

    if (avatarEl) avatarEl.textContent = (state.user || 'U')[0].toUpperCase();
    if (nameEl) nameEl.textContent = state.user;
    if (roleEl) roleEl.textContent = state.role;

    // Sidebar Navigation
    els.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const text = item.textContent.trim().toLowerCase();

            if (text.includes('dashboard')) switchSection('dashboard');
            else if (text.includes('inventory')) switchSection('inventory');
            else if (text.includes('activity')) switchSection('activity');
            else if (text.includes('settings')) switchSection('settings');
        });
    });

    // Inventory Controls
    if (els.invSearch) els.invSearch.addEventListener('input', (e) => { state.inventorySearch = e.target.value; state.inventoryPage = 1; renderInventory(); });
    if (els.invFilter) els.invFilter.addEventListener('change', (e) => { state.inventoryFilter = e.target.value; state.inventoryPage = 1; renderInventory(); });
    if (els.prevBtn) els.prevBtn.addEventListener('click', () => { if (state.inventoryPage > 1) { state.inventoryPage--; renderInventory(); } });
    if (els.nextBtn) els.nextBtn.addEventListener('click', () => { state.inventoryPage++; renderInventory(); });

    // Add Product Button (Inventory Section)
    if (els.invAddBtn) {
        if (state.role !== 'admin') {
            els.invAddBtn.style.display = 'none';
        } else {
            els.invAddBtn.addEventListener('click', () => {
                // For now, simpler prompt-based add for valid MVP
                const name = prompt("Enter Product Name:");
                if (!name) return;
                const qtyStr = prompt("Enter Quantity:", "0");
                const qty = parseInt(qtyStr);
                if (isNaN(qty)) { showToast("Invalid Quantity", "error"); return; }
                addProduct(name, qty);
            });
        }
    }

    // Modal
    els.confirmDeleteBtn?.addEventListener('click', confirmDelete);
    document.getElementById('logout-btn')?.addEventListener('click', logout);

    // Initial Load
    fetchData();
    // Poll for updates
    setInterval(fetchData, 5000);
}

function switchSection(sectionName) {
    state.currentSection = sectionName;

    // Update Sidebar
    els.navItems.forEach(el => {
        el.classList.remove('active');
        if (el.textContent.toLowerCase().includes(sectionName)) el.classList.add('active');
    });

    // Update Sections
    els.sections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === `sec-${sectionName}`) sec.classList.add('active');
    });

    // Update Header
    els.pageHeader.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

    // Refresh specific section views
    if (sectionName === 'inventory') renderInventory();
    if (sectionName === 'activity') renderActivityLog(els.fullActivityList, 0, true); // Full log
}

// =======================
// Data Handling
// =======================
async function fetchData() {
    try {
        const [prodRes, actRes, healthRes] = await Promise.all([
            fetch(`${API_URL}/products`),
            fetch(`${API_URL}/activities`),
            fetch(`${API_URL}/health`)
        ]);

        if (prodRes.ok) {
            state.products = await prodRes.json();
            updateStats();
            updateChart();
            if (state.currentSection === 'inventory') renderInventory();
        }

        if (actRes.ok) {
            state.activities = await actRes.json();
            renderActivityLog(els.dashActivityList, 5); // Mini log
            if (state.currentSection === 'activity') renderActivityLog(els.fullActivityList, 0, true); // Full log
        }

        if (healthRes.ok) {
            const h = await healthRes.json();
            document.getElementById('env-badge').textContent = `ENV: ${h.env}`;
        }
    } catch (err) {
        console.error("Fetch error", err);
        showToast("Connection Lost", "error");
    }
}

// =======================
// Render Logic
// =======================
function renderInventory() {
    if (!els.invList) return;

    // Filter
    let items = state.products.filter(p => p.name.toLowerCase().includes(state.inventorySearch.toLowerCase()));

    if (state.inventoryFilter === 'low') items = items.filter(p => p.quantity <= state.lowStockThreshold && p.quantity > 0);
    if (state.inventoryFilter === 'out') items = items.filter(p => p.quantity === 0);

    // Pagination
    const totalPages = Math.ceil(items.length / state.itemsPerPage) || 1;
    if (state.inventoryPage > totalPages) state.inventoryPage = totalPages;
    if (state.inventoryPage < 1) state.inventoryPage = 1;

    const start = (state.inventoryPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const pageItems = items.slice(start, end);

    // DOM
    els.invList.innerHTML = '';

    if (pageItems.length === 0) {
        els.invList.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-secondary);">No products found.</div>`;
    }

    pageItems.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-row';

        let badge = `<span class="badge badge-success">In Stock</span>`;
        if (p.quantity === 0) badge = `<span class="badge badge-danger">Out of Stock</span>`;
        else if (p.quantity <= state.lowStockThreshold) badge = `<span class="badge badge-warning">Low Stock</span>`;

        const actions = state.role === 'admin' ? `
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                 <button class="btn btn-icon" onclick="promptEdit('${p.name}', ${p.quantity})">✏️</button>
                 <button class="btn btn-danger" style="padding: 0.4rem;" onclick="openDeleteModal('${p.name}')">🗑️</button>
            </div>
        ` : '';

        div.innerHTML = `
            <div style="flex: 2; font-weight: 500;">${p.name}</div>
            <div style="flex: 1;">${badge}</div>
            <div style="flex: 1; font-family: monospace;">${p.quantity}</div>
            <div style="flex: 1;">${actions}</div>
        `;
        els.invList.appendChild(div);
    });

    // Update Controls
    if (els.pageInfo) els.pageInfo.textContent = `Page ${state.inventoryPage} of ${totalPages}`;
    if (els.prevBtn) els.prevBtn.disabled = state.inventoryPage === 1;
    if (els.nextBtn) els.nextBtn.disabled = state.inventoryPage === totalPages;
}

function renderActivityLog(container, limit = 0, isFullView = false) {
    if (!container) return;
    container.innerHTML = '';

    const items = limit > 0 ? state.activities.slice(0, limit) : state.activities;

    items.forEach(a => {
        const div = document.createElement('div');
        div.className = isFullView ? 'product-row' : 'log-item';

        let color = '#94a3b8';
        if (a.action === 'Added') color = '#34d399';
        if (a.action === 'Deleted') color = '#f87171';
        if (a.action === 'Updated') color = '#60a5fa';

        if (isFullView) {
            // Table Row Style for Full View
            div.innerHTML = `
                <div style="flex: 0 0 50px; display: flex; justify-content: center;"><div class="log-dot" style="background: ${color}"></div></div>
                <div style="flex: 1; font-weight: 600; color: ${color};">${a.action}</div>
                <div style="flex: 3; color: var(--text-primary);">${a.details}</div>
                <div style="flex: 1; text-align: right; color: var(--text-muted); font-size: 0.85rem;">${a.timestamp}</div>
            `;
        } else {
            // Widget Style for Dashboard
            div.innerHTML = `
                <div class="log-dot" style="background: ${color}"></div>
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-primary); font-weight: 600;">${a.action}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${a.details}</div>
                    <div style="font-size: 0.70rem; color: var(--text-muted);">${a.timestamp}</div>
                </div>
            `;
        }
        container.appendChild(div);
    });
}

// =======================
// Actions
// =======================
async function addProduct(name, qty) {
    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity: qty })
    });

    if (res.ok) {
        showToast("Product Added", "success");
        fetchData();
    } else {
        const d = await res.json();
        showToast(d.detail || "Error", "error");
    }
}

window.promptEdit = async (name, oldQty) => {
    if (state.role !== 'admin') return;
    const newQtyStr = prompt(`Update quantity for ${name}:`, oldQty);
    if (newQtyStr === null) return;

    const newQty = parseInt(newQtyStr);
    if (isNaN(newQty)) { showToast("Invalid Quantity", "error"); return; }

    const res = await fetch(`${API_URL}/products/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity: newQty })
    });

    if (res.ok) {
        showToast("Updated Successfully", "success");
        fetchData();
    } else {
        showToast("Update Failed", "error");
    }
};

window.openDeleteModal = (name) => {
    state.deleteTarget = name;
    document.getElementById('delete-item-name').textContent = `Product: ${name}`;
    els.deleteModal.classList.add('open');
};

window.closeModal = () => {
    els.deleteModal.classList.remove('open');
    state.deleteTarget = null;
};

async function confirmDelete() {
    if (!state.deleteTarget) return;

    const res = await fetch(`${API_URL}/products/${state.deleteTarget}`, { method: 'DELETE' });
    if (res.ok) {
        showToast("Product Deleted", "success");
        fetchData();
        closeModal();
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// =======================
// Utils
// =======================
function updateStats() {
    // Only animate if values change, simplified here
    if (els.stats.products) els.stats.products.textContent = state.products.length;
    if (els.stats.qty) els.stats.qty.textContent = state.products.reduce((a, b) => a + b.quantity, 0);
    if (els.stats.low) els.stats.low.textContent = state.products.filter(p => p.quantity <= state.lowStockThreshold).length;
}
// Charts
// =======================
let pieChart = null;
let barChart = null;

function updateChart() {
    updatePieChart();
    updateBarChart();
}

function updatePieChart() {
    const ctx = document.getElementById('stockPieChart');
    if (!ctx) return;

    // Only update if current view is dashboard to save resources? 
    // Chart.js handles generic updates well though.

    const low = state.products.filter(p => p.quantity <= state.lowStockThreshold).length;
    const healthy = state.products.length - low;

    if (pieChart) {
        pieChart.data.datasets[0].data = [healthy, low];
        pieChart.update();
    } else {
        pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Healthy', 'Low/Out'],
                datasets: [{
                    data: [healthy, low],
                    backgroundColor: ['#10b981', '#f87171'],
                    borderColor: 'transparent'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: '#94a3b8' } }
                }
            }
        });
    }
}

function updateBarChart() {
    const ctx = document.getElementById('stockBarChart');
    if (!ctx) return;

    // Top 10 products by quantity
    const sorted = [...state.products].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
    const labels = sorted.map(p => p.name);
    const data = sorted.map(p => p.quantity);

    if (barChart) {
        barChart.data.labels = labels;
        barChart.data.datasets[0].data = data;
        barChart.update();
    } else {
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantity',
                    data: data,
                    backgroundColor: '#6366f1',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function showToast(msg, type) {
    Toastify({
        text: msg,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
            background: type === 'error' ? "#ef4444" : "#10b981",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            borderRadius: "8px"
        }
    }).showToast();
}
