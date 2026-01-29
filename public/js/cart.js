if (!isLoggedIn()) {
  window.location.href = '/login.html';
}

let cart = null;

const loadCart = async () => {
  const cartItems = document.getElementById('cartItems');
  
  try {
    const data = await apiRequest('/cart');
    cart = data.data;
    displayCart();
  } catch (error) {
    cartItems.innerHTML = `<div class="error-message">Error loading cart: ${error.message}</div>`;
  }
};

// Display cart
const displayCart = () => {
  const cartItems = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  
  if (!cart || cart.items.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    cartSummary.innerHTML = '';
    updateCartCount();
    return;
  }

  cartItems.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100'">
      <div class="cart-item-info">
        <h3>${item.product.name}</h3>
        <p class="product-category">${item.product.category}</p>
      </div>
      <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
      <div class="cart-item-quantity">
        <button onclick="updateQuantity('${item.product._id}', ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity('${item.product._id}', ${item.quantity + 1})">+</button>
      </div>
      <div class="cart-item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
      <button class="btn btn-danger" onclick="removeItem('${item.product._id}')">Remove</button>
    </div>
  `).join('');

  cartSummary.innerHTML = `
    <h2>Order Summary</h2>
    <div class="cart-total">
      <span>Total:</span>
      <span>₹${cart.totalPrice.toFixed(2)}</span>
    </div>
    <button class="btn btn-primary" onclick="openCheckoutModal()">Proceed to Checkout</button>
    <button class="btn btn-danger" onclick="clearCart()" style="margin-top: 10px;">Clear Cart</button>
  `;
  
  updateCartCount();
};

// Update quantity
const updateQuantity = async (productId, newQuantity) => {
  if (newQuantity < 1) return;

  try {
    const data = await apiRequest(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: newQuantity })
    });
    
    cart = data.data;
    displayCart();
  } catch (error) {
    alert('Error updating quantity: ' + error.message);
  }
};

// Remove item
const removeItem = async (productId) => {
  if (!confirm('Remove this item from cart?')) return;

  try {
    const data = await apiRequest(`/cart/${productId}`, {
      method: 'DELETE'
    });
    
    cart = data.data;
    displayCart();
  } catch (error) {
    alert('Error removing item: ' + error.message);
  }
};

// Clear cart
const clearCart = async () => {
  if (!confirm('Clear entire cart?')) return;

  try {
    await apiRequest('/cart', {
      method: 'DELETE'
    });
    
    cart = { items: [], totalPrice: 0 };
    displayCart();
  } catch (error) {
    alert('Error clearing cart: ' + error.message);
  }
};

// Open checkout modal
const openCheckoutModal = () => {
  const modal = document.getElementById('checkoutModal');
  modal.classList.add('active');
};

// Close checkout modal
const closeCheckoutModal = () => {
  const modal = document.getElementById('checkoutModal');
  modal.classList.remove('active');
};

// Checkout form
const checkoutForm = document.getElementById('checkoutForm');
checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const shippingAddress = {
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    postalCode: document.getElementById('postalCode').value,
    country: document.getElementById('country').value
  };

  try {
    await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress })
    });
    
    alert('Order placed successfully!');
    closeCheckoutModal();
    window.location.href = '/orders.html';
  } catch (error) {
    alert('Error placing order: ' + error.message);
  }
});

// Update cart count
const updateCartCount = () => {
  const cartCount = document.getElementById('cartCount');
  if (cart && cart.items) {
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
  }
};

// Close modal on click outside
document.querySelector('.close').addEventListener('click', closeCheckoutModal);
window.addEventListener('click', (e) => {
  const modal = document.getElementById('checkoutModal');
  if (e.target === modal) {
    closeCheckoutModal();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', loadCart);
