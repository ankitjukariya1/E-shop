// Seller Dashboard - Access Control
if (!isLoggedIn() || !isSeller()) {
  alert("Access denied. Seller accounts only.");
  window.location.href = "/";
}

// Load seller's products
const loadMyProducts = async () => {
  const productsList = document.getElementById("myProductsList");

  try {
    const data = await apiRequest("/products/seller/my-products");
    const products = data.data;

    // Update stats
    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("inStockProducts").textContent = products.filter(
      (p) => p.stock > 0,
    ).length;
    document.getElementById("outOfStockProducts").textContent = products.filter(
      (p) => p.stock === 0,
    ).length;

    if (products.length === 0) {
      productsList.innerHTML =
        '<div class="empty-cart">You haven\'t listed any products yet. Add your first product above!</div>';
      return;
    }

    productsList.innerHTML = `
      <div class="seller-products-grid">
        ${products
          .map(
            (product) => `
          <div class="seller-product-card">
            <img src="${product.image}" alt="${product.name}" class="seller-product-image" onerror="this.src='https://via.placeholder.com/300'">
            <div class="seller-product-info">
              <h3>${product.name}</h3>
              <span class="product-category">${product.category}</span>
              <div class="seller-product-details">
                <span class="product-price">₹${product.price.toFixed(2)}</span>
                <span class="stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}">
                  ${product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
              <div class="seller-product-meta">
                <span>⭐ ${product.rating.toFixed(1)} (${product.numReviews} reviews)</span>
                <span>Listed: ${new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="seller-product-actions">
                <button class="btn btn-edit" onclick="openEditModal('${product._id}')">✏️ Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">🗑️ Delete</button>
              </div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  } catch (error) {
    productsList.innerHTML = `<div class="error-message">Error loading products: ${error.message}</div>`;
  }
};

// Add product
const addProductForm = document.getElementById("addProductForm");
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("productName").value);
  formData.append(
    "description",
    document.getElementById("productDescription").value,
  );
  formData.append(
    "price",
    parseFloat(document.getElementById("productPrice").value),
  );
  formData.append(
    "stock",
    parseInt(document.getElementById("productStock").value),
  );
  formData.append("category", document.getElementById("productCategory").value);

  const imageFile = document.getElementById("productImage").files[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const token = getToken();
    const response = await fetch(`${window.location.origin}/api/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add product");
    }

    document.getElementById("addProductSuccess").textContent =
      "Product added successfully!";
    document.getElementById("addProductError").textContent = "";
    addProductForm.reset();

    setTimeout(() => {
      document.getElementById("addProductSuccess").textContent = "";
    }, 3000);

    // Reload products list
    loadMyProducts();
  } catch (error) {
    document.getElementById("addProductError").textContent =
      "Error: " + error.message;
    document.getElementById("addProductSuccess").textContent = "";
  }
});

// Open edit modal
const openEditModal = async (productId) => {
  try {
    const data = await apiRequest(`/products/${productId}`);
    const product = data.data;

    document.getElementById("editProductId").value = product._id;
    document.getElementById("editProductName").value = product.name;
    document.getElementById("editProductDescription").value =
      product.description;
    document.getElementById("editProductPrice").value = product.price;
    document.getElementById("editProductStock").value = product.stock;
    document.getElementById("editProductCategory").value = product.category;

    document.getElementById("editProductModal").classList.add("active");
  } catch (error) {
    alert("Error loading product: " + error.message);
  }
};

// Close edit modal
document.getElementById("closeEditModal").addEventListener("click", () => {
  document.getElementById("editProductModal").classList.remove("active");
  document.getElementById("editProductSuccess").textContent = "";
  document.getElementById("editProductError").textContent = "";
});

// Edit product form submit
document
  .getElementById("editProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const productId = document.getElementById("editProductId").value;
    const formData = new FormData();
    formData.append("name", document.getElementById("editProductName").value);
    formData.append(
      "description",
      document.getElementById("editProductDescription").value,
    );
    formData.append(
      "price",
      parseFloat(document.getElementById("editProductPrice").value),
    );
    formData.append(
      "stock",
      parseInt(document.getElementById("editProductStock").value),
    );
    formData.append(
      "category",
      document.getElementById("editProductCategory").value,
    );

    const imageFile = document.getElementById("editProductImage").files[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const token = getToken();
      const response = await fetch(
        `${window.location.origin}/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update product");
      }

      document.getElementById("editProductSuccess").textContent =
        "Product updated successfully!";
      document.getElementById("editProductError").textContent = "";

      setTimeout(() => {
        document.getElementById("editProductModal").classList.remove("active");
        document.getElementById("editProductSuccess").textContent = "";
        loadMyProducts();
      }, 1500);
    } catch (error) {
      document.getElementById("editProductError").textContent =
        "Error: " + error.message;
      document.getElementById("editProductSuccess").textContent = "";
    }
  });

// Delete product
const deleteProduct = async (productId) => {
  if (
    !confirm(
      "Are you sure you want to delete this product? This cannot be undone.",
    )
  ) {
    return;
  }

  try {
    await apiRequest(`/products/${productId}`, {
      method: "DELETE",
    });

    alert("Product deleted successfully!");
    loadMyProducts();
  } catch (error) {
    alert("Error deleting product: " + error.message);
  }
};

// Initialize
document.addEventListener("DOMContentLoaded", loadMyProducts);
