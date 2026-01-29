// Check if user is logged in
if (!isLoggedIn()) {
  window.location.href = '/login.html';
}

// Load orders
const loadOrders = async () => {
  const ordersList = document.getElementById('ordersList');
  
  try {
    const data = await apiRequest('/orders/myorders');
    const orders = data.data;
    
    if (orders.length === 0) {
      ordersList.innerHTML = '<div class="empty-cart">You have no orders yet</div>';
      return;
    }

    ordersList.innerHTML = orders.map(order => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <h3>Order #${order._id.substring(0, 8)}</h3>
            <p>Placed on: ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
        </div>
        
        <div class="order-items">
          <h4>Items:</h4>
          ${order.items.map(item => `
            <div class="order-item">
              <div>
                <strong>${item.name}</strong> x ${item.quantity}
              </div>
              <div>₹${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="order-shipping">
          <h4>Shipping Address:</h4>
          <p>${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
          <p>${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>
        </div>
        
        <div class="cart-total">
          <span><strong>Total:</strong></span>
          <span><strong>₹${order.totalPrice.toFixed(2)}</strong></span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    ordersList.innerHTML = `<div class="error-message">Error loading orders: ${error.message}</div>`;
  }
};

// Update cart count
const updateCartCount = async () => {
  const cartCount = document.getElementById('cartCount');
  
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
  loadOrders();
  updateCartCount();
});
