// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (!productId) {
  window.location.href = '/';
}

let currentQuantity = 1;

// Load product details
const loadProduct = async () => {
  const productDetails = document.getElementById('productDetails');
  
  try {
    const data = await apiRequest(`/products/${productId}`);
    const product = data.data;
    
    productDetails.innerHTML = `
      <div class="product-details-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-details-image" onerror="this.src='https://via.placeholder.com/500'">
      </div>
      <div class="product-details-info">
        <span class="product-category">${product.category}</span>
        <h1>${product.name}</h1>
        <div class="product-rating">⭐ ${product.rating.toFixed(1)} (${product.numReviews} reviews)</div>
        <p class="product-price">₹${product.price.toFixed(2)}</p>
        <p class="product-stock">${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <div class="product-details-description">
          <h3>Description</h3>
          <p>${product.description}</p>
        </div>
        ${product.stock > 0 ? `
          <div class="quantity-selector">
            <button onclick="decreaseQuantity()">-</button>
            <input type="number" id="quantityInput" value="1" min="1" max="${product.stock}" readonly>
            <button onclick="increaseQuantity(${product.stock})">+</button>
          </div>
          <button class="btn btn-primary" onclick="addToCart('${product._id}', ${product.price})">Add to Cart</button>
        ` : '<p class="error-message">This product is currently out of stock</p>'}
      </div>
    `;
  } catch (error) {
    productDetails.innerHTML = `<div class="error-message">Error loading product: ${error.message}</div>`;
  }
};

// Increase quantity
const increaseQuantity = (maxStock) => {
  const input = document.getElementById('quantityInput');
  if (currentQuantity < maxStock) {
    currentQuantity++;
    input.value = currentQuantity;
  }
};

// Decrease quantity
const decreaseQuantity = () => {
  const input = document.getElementById('quantityInput');
  if (currentQuantity > 1) {
    currentQuantity--;
    input.value = currentQuantity;
  }
};

// Add to cart
const addToCart = async (productId, price) => {
  if (!isLoggedIn()) {
    alert('Please login to add items to cart');
    window.location.href = '/login.html';
    return;
  }

  try {
    await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ 
        productId, 
        quantity: currentQuantity 
      })
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
  updateCartCount();
});
