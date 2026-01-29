// seed script to populate database
// run with: node utils/seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

// sample products data
const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 2499,
    category: 'Electronics',
    image: '/images/products/placeholder.svg',
    stock: 50,
    rating: 4.5
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, and notifications.',
    price: 4999,
    category: 'Electronics',
    image: '/images/products/placeholder.svg',
    stock: 30,
    rating: 4.7
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
    price: 499,
    category: 'Clothing',
    image: '/images/products/placeholder.svg',
    stock: 100,
    rating: 4.3
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with excellent cushioning and support.',
    price: 1899,
    category: 'Sports',
    image: '/images/products/placeholder.svg',
    stock: 45,
    rating: 4.6
  },
  {
    name: 'Programming Book',
    description: 'Comprehensive guide to modern JavaScript and web development.',
    price: 799,
    category: 'Books',
    image: '/images/products/placeholder.svg',
    stock: 75,
    rating: 4.8
  },
  {
    name: 'Desk Lamp',
    description: 'Adjustable LED desk lamp with touch controls and USB charging port.',
    price: 899,
    category: 'Home',
    image: '/images/products/placeholder.svg',
    stock: 60,
    rating: 4.4
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with extra cushioning for comfort during workouts.',
    price: 599,
    category: 'Sports',
    image: '/images/products/placeholder.svg',
    stock: 80,
    rating: 4.5
  },
  {
    name: 'Facial Cream',
    description: 'Moisturizing facial cream with natural ingredients for all skin types.',
    price: 699,
    category: 'Beauty',
    image: '/images/products/placeholder.svg',
    stock: 90,
    rating: 4.6
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Database connected');

    // Create admin user
    await User.deleteMany({});
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin user created');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');

    // Create regular user
    const user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    console.log('✅ Test user created');
    console.log('   Email: user@example.com');
    console.log('   Password: user123');

    // Create sample products
    await Product.deleteMany({});
    const products = await Product.insertMany(
      sampleProducts.map(product => ({
        ...product,
        createdBy: admin._id
      }))
    );
    console.log(`✅ ${products.length} sample products created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('You can now login with the credentials above.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
