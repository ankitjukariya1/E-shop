# E-Commerce Website

A complete full-stack e-commerce application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

### User Authentication
- User registration with password hashing (bcrypt)
- User login with JWT-based authentication
- Protected routes and role-based access control (User/Admin)

### Product Management
- View all products with search and filter
- Category-based filtering
- Price-based sorting
- Product details page with images and descriptions
- Stock management
- Admin panel to add/manage products

### Shopping Cart
- Add/remove products
- Update quantities
- Real-time price calculation
- Persistent cart for logged-in users
- Cart badge showing item count

### Order Processing
- Checkout with shipping address
- Order history for users
- Order status tracking (Pending, Processing, Shipped, Delivered, Cancelled)
- Admin panel to manage all orders
- Update order status

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Tokens)
- bcryptjs for password hashing
- express-validator
- CORS

### Frontend
- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript
- Fetch API for HTTP requests

## Project Structure

```
ecommerce-site/
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── models/              # Database schemas
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── middleware/          # Custom middleware
│   └── auth.js
├── utils/               # Helper functions
│   └── auth.js
├── public/              # Frontend files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── products.js
│   │   ├── productDetails.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── product.html
│   ├── cart.html
│   ├── orders.html
│   └── admin.html
├── .env                 # Environment variables
├── .env.example         # Environment template
├── index.js             # Main server file
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Steps

1. **Clone or navigate to the project directory**
```bash
cd "c:\Users\ankij\OneDrive\Desktop\ecommerce site"
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d
```

4. **Start MongoDB**
Make sure MongoDB is running on your system.

5. **Run the application**
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

6. **Access the application**
Open your browser and navigate to: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with search, filter, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:productId` - Update cart item quantity (Protected)
- `DELETE /api/cart/:productId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create new order (Protected)
- `GET /api/orders/myorders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## Usage Guide

### For Users

1. **Register/Login**
   - Navigate to the registration page
   - Create an account or login with existing credentials

2. **Browse Products**
   - View all products on the home page
   - Use search bar to find specific products
   - Filter by category
   - Sort by price or rating

3. **View Product Details**
   - Click on any product to see detailed information
   - Select quantity
   - Add to cart

4. **Shopping Cart**
   - View all items in cart
   - Update quantities
   - Remove items
   - Proceed to checkout

5. **Place Order**
   - Enter shipping address
   - Confirm order
   - View order history

### For Admins

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to Admin Panel

2. **Add Products**
   - Fill in product details
   - Set price, stock, and category
   - Submit to add product

3. **Manage Orders**
   - View all customer orders
   - Update order status
   - Track deliveries

## Creating Admin User

To create an admin user, you need to manually update the database or register a user and change their role in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or you can modify the User model temporarily to allow admin registration.

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT-based authentication
- Protected routes requiring authentication
- Role-based access control (Admin/User)
- Input validation
- CORS enabled

## Database Models

### User Schema
- name, email, password (hashed)
- role (user/admin)
- timestamps

### Product Schema
- name, description, price
- category, image, stock
- rating, numReviews
- createdBy (admin reference)

### Cart Schema
- user reference
- items (product, quantity, price)
- totalPrice (auto-calculated)

### Order Schema
- user reference
- items (product details, quantity, price)
- totalPrice
- status (Pending/Processing/Shipped/Delivered/Cancelled)
- shippingAddress
- paymentMethod

## Features in Detail

### Search & Filter
- Search products by name
- Filter by category
- Sort by price (ascending/descending)
- Sort by rating
- Pagination support

### Cart Management
- Add products with quantity
- Update quantities in cart
- Remove individual items
- Clear entire cart
- Real-time price calculation
- Stock validation

### Order Management
- Create orders from cart
- Automatic stock deduction
- Order status tracking
- Order history
- Shipping address management

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Future Enhancements

- Product reviews and ratings
- Wishlist functionality
- Payment gateway integration
- Email notifications
- Product image upload
- Advanced analytics dashboard
- Order tracking with real-time updates
- Coupon/discount system

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGO_URL in .env file
- Verify port 27017 is not blocked

### JWT Token Issues
- Check JWT_SECRET in .env file
- Ensure tokens are being sent in Authorization header
- Clear browser localStorage if needed

### CORS Issues
- Server includes CORS middleware
- Check if frontend is making requests to correct API URL

## License

ISC

## Author

Ankit

---

For questions or issues, please open an issue in the repository.
