if (!isLoggedIn() || !isAdmin()) {
  alert('Access denied. Admin only.');
  window.location.href = '/';
}

// add product
const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Use FormData for file upload
  const formData = new FormData();
  formData.append('name', document.getElementById('productName').value);
  formData.append('description', document.getElementById('productDescription').value);
  formData.append('price', parseFloat(document.getElementById('productPrice').value));
  formData.append('stock', parseInt(document.getElementById('productStock').value));
  formData.append('category', document.getElementById('productCategory').value);
  
  // Add image file if selected
  const imageFile = document.getElementById('productImage').files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${window.location.origin}/api/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData // Send FormData instead of JSON
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add product');
    }
    
    document.getElementById('addProductSuccess').textContent = 'Product added successfully!';
    document.getElementById('addProductError').textContent = '';
    addProductForm.reset();
    
    setTimeout(() => {
      document.getElementById('addProductSuccess').textContent = '';
    }, 3000);
  } catch (error) {
    document.getElementById('addProductError').textContent = 'Error: ' + error.message;
    document.getElementById('addProductSuccess').textContent = '';
  }
});

// Load all orders
const loadAllOrders = async () => {
  const ordersList = document.getElementById('adminOrdersList');
  
  try {
    const data = await apiRequest('/orders');
    const orders = data.data;
    
    if (orders.length === 0) {
      ordersList.innerHTML = '<div class="empty-cart">No orders found</div>';
      return;
    }

    ordersList.innerHTML = orders.map(order => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <h3>Order #${order._id.substring(0, 8)}</h3>
            <p>Customer: ${order.user.name} (${order.user.email})</p>
            <p>Placed on: ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
            <select onchange="updateOrderStatus('${order._id}', this.value)" style="margin-top: 10px; padding: 5px;">
              <option value="">Update Status</option>
              <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>
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

// Update order status
const updateOrderStatus = async (orderId, newStatus) => {
  if (!newStatus) return;
  
  try {
    await apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });
    
    alert('Order status updated successfully!');
    loadAllOrders();
  } catch (error) {
    alert('Error updating order status: ' + error.message);
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', loadAllOrders);
