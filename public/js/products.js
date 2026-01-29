let currentPage = 1;
let currentCategory = 'All';
let currentSort = '';
let searchQuery = '';

const loadProducts = async () => {
  const productsGrid = document.getElementById('productsGrid');
  productsGrid.innerHTML = '<div class="loading">Loading products...</div>';

  try {
    let url = `/products?page=${currentPage}`;
    
    if (currentCategory !== 'All') {
      url += `&category=${currentCategory}`;
    }
    
    if (currentSort) {
      url += `&sort=${currentSort}`;
    }
    
    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }

    const data = await apiRequest(url);
    displayProducts(data.data);
    setupPagination(data.page, data.pages);
  } catch (error) {
    productsGrid.innerHTML = `<div class="error-message">Error loading products: ${error.message}</div>`;
  }
};

const displayProducts = (products) => {
  const productsGrid = document.getElementById('productsGrid');
  
  if (products.length === 0) {
    productsGrid.innerHTML = '<div class="loading">No products found</div>';
    return;
  }

  productsGrid.innerHTML = products.map(product => `
    <div class="product-card" onclick="viewProduct('${product._id}')">
      <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300'">
      <span class="product-category">${product.category}</span>
      <h3>${product.name}</h3>
      <p class="product-price">₹${product.price.toFixed(2)}</p>
      <div class="product-rating">⭐ ${product.rating.toFixed(1)}</div>
      <p class="product-stock">${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
      <button class="btn btn-primary" onclick="event.stopPropagation(); addToCartFromList('${product._id}')" ${product.stock === 0 ? 'disabled' : ''}>
        Add to Cart
      </button>
    </div>
  `).join('');
};

// Setup pagination
const setupPagination = (currentPage, totalPages) => {
  const pagination = document.getElementById('pagination');
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = '';
  
  if (currentPage > 1) {
    html += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
  }
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<button disabled>${i}</button>`;
    } else {
      html += `<button onclick="changePage(${i})">${i}</button>`;
    }
  }
  
  if (currentPage < totalPages) {
    html += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
  }
  
  pagination.innerHTML = html;
};

// Change page
const changePage = (page) => {
  currentPage = page;
  loadProducts();
  window.scrollTo(0, 0);
};

// View product details
const viewProduct = (productId) => {
  window.location.href = `/product.html?id=${productId}`;
};

// Add to cart from list
const addToCartFromList = async (productId) => {
  if (!isLoggedIn()) {
    alert('Please login to add items to cart');
    window.location.href = '/login.html';
    return;
  }

  try {
    await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 })
    });
    
    alert('Product added to cart!');
    updateCartCount();
  } catch (error) {
    alert('Error adding to cart: ' + error.message);
  }
};

// Update cart count
const updateCartCount = async () => {
  const cartCount = document.getElementById('cartCount');
  
  if (!isLoggedIn()) {
    cartCount.textContent = '0';
    return;
  }

  try {
    const data = await apiRequest('/cart');
    const count = data.data.items.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
  } catch (error) {
    console.error('Error updating cart count:', error);
  }
};

// Filter by category
document.getElementById('categoryFilter').addEventListener('change', (e) => {
  currentCategory = e.target.value;
  currentPage = 1;
  loadProducts();
});

// Sort products
document.getElementById('sortFilter').addEventListener('change', (e) => {
  currentSort = e.target.value;
  currentPage = 1;
  loadProducts();
});

// Search products
document.getElementById('searchBtn').addEventListener('click', () => {
  searchQuery = document.getElementById('searchInput').value;
  currentPage = 1;
  loadProducts();
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchQuery = e.target.value;
    currentPage = 1;
    loadProducts();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartCount();
});
