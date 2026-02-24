async function fetchProducts() {
  try {
    const res = await fetch("/products");
    if (!res.ok) throw new Error("Failed to load products");
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

function renderStats(products) {
  const totalProductsEl = document.getElementById("stat-total-products");
  const totalQtyEl = document.getElementById("stat-total-qty");
  const lowStockEl = document.getElementById("stat-low-stock");

  const totalProducts = products.length;
  const totalQty = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const lowStock = products.filter((p) => (p.quantity || 0) <= 5).length;

  if (totalProductsEl) totalProductsEl.textContent = totalProducts;
  if (totalQtyEl) totalQtyEl.textContent = totalQty;
  if (lowStockEl) lowStockEl.textContent = lowStock;
}

function renderProductsTable(products) {
  const tbody = document.getElementById("products-body");
  const messageEl = document.getElementById("products-message");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!products.length) {
    if (messageEl) {
      messageEl.textContent = "No products yet. Add your first one above.";
    }
    return;
  } else if (messageEl) {
    messageEl.textContent = "";
  }

  for (const product of products) {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = product.name;

    const qtyTd = document.createElement("td");
    qtyTd.textContent = product.quantity;

    const actionsTd = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "table-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn-small";
    editBtn.textContent = "Update";
    editBtn.onclick = async () => {
      const newQtyStr = window.prompt(
        `Update quantity for "${product.name}"`,
        String(product.quantity)
      );
      if (newQtyStr === null) return;
      const newQty = Number(newQtyStr);
      if (Number.isNaN(newQty) || newQty < 0) {
        alert("Please enter a valid non-negative number.");
        return;
      }
      await updateProduct(product.name, newQty);
      await refreshProducts();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-small danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async () => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );
      if (!confirmed) return;
      await deleteProduct(product.name);
      await refreshProducts();
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actionsTd.appendChild(actions);

    tr.appendChild(nameTd);
    tr.appendChild(qtyTd);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);
  }
}

async function addOrUpdateProduct(name, quantity) {
  try {
    // Try to create first
    const res = await fetch("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity }),
    });

    if (res.ok) return;

    // If already exists, do PUT (update)
    await updateProduct(name, quantity);
  } catch (err) {
    console.error(err);
    alert("Failed to save product.");
  }
}

async function updateProduct(name, quantity) {
  try {
    const res = await fetch(`/products/${encodeURIComponent(name)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity }),
    });
    if (!res.ok) throw new Error("Failed to update product");
  } catch (err) {
    console.error(err);
    alert("Failed to update product.");
  }
}

async function deleteProduct(name) {
  try {
    const res = await fetch(`/products/${encodeURIComponent(name)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete product");
  } catch (err) {
    console.error(err);
    alert("Failed to delete product.");
  }
}

async function refreshProducts() {
  const products = await fetchProducts();
  renderStats(products);
  renderProductsTable(products);
}

document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("product-form");

  if (productForm) {
    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("product-name");
      const qtyInput = document.getElementById("product-qty");
      const name = nameInput.value.trim();
      const quantity = Number(qtyInput.value);
      if (!name || Number.isNaN(quantity) || quantity < 0) {
        alert("Please enter a valid name and quantity.");
        return;
      }
      await addOrUpdateProduct(name, quantity);
      nameInput.value = "";
      qtyInput.value = "";
      await refreshProducts();
    });
  }

  // If we're on the dashboard page, load data.
  if (document.getElementById("products-body")) {
    refreshProducts();
  }
});

