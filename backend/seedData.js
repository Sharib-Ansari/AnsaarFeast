require('dotenv').config();
const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URI;

if (!mongoURL) {
  console.error('ERROR: MONGO_URI environment variable is missing.');
  process.exit(1);
}

// 9 Required Categories
const categories = [
  { CategoryName: 'Starter' },
  { CategoryName: 'Veg' },
  { CategoryName: 'Non-Veg' },
  { CategoryName: 'Fast Food' },
  { CategoryName: 'Pizza' },
  { CategoryName: 'Burger' },
  { CategoryName: 'Chowmein' },
  { CategoryName: 'Desserts' },
  { CategoryName: 'Drinks' },
];

// 27 Food Items (3 per category) with stable Unsplash CDN images and exact options structure
const foodItems = [
  // --- STARTER ---
  {
    CategoryName: 'Starter',
    name: 'Paneer Tikka',
    img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '140', full: '260' }],
    description: 'Marinated cottage cheese cubes grilled with Indian spices and bell peppers.',
  },
  {
    CategoryName: 'Starter',
    name: 'Crispy Veg Spring Rolls',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '120', full: '220' }],
    description: 'Crispy fried rolls stuffed with shredded vegetables and sweet chili dip.',
  },
  {
    CategoryName: 'Starter',
    name: 'Chicken Malai Tikka',
    img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '180', full: '340' }],
    description: 'Tender chicken pieces marinated in cream, cheese, and mild spices.',
  },

  // --- VEG ---
  {
    CategoryName: 'Veg',
    name: 'Shahi Paneer',
    img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '160', full: '300' }],
    description: 'Cottage cheese cooked in a rich, creamy cashew and tomato gravy.',
  },
  {
    CategoryName: 'Veg',
    name: 'Dal Makhani',
    img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '130', full: '240' }],
    description: 'Slow-cooked black lentils simmered with butter and fresh cream.',
  },
  {
    CategoryName: 'Veg',
    name: 'Mix Veg Curry',
    img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '120', full: '220' }],
    description: 'Assorted seasonal vegetables cooked in an aromatic gravy.',
  },

  // --- NON-VEG ---
  {
    CategoryName: 'Non-Veg',
    name: 'Butter Chicken',
    img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '220', full: '420' }],
    description: 'Roasted chicken cooked in a velvety tomato, butter, and cream sauce.',
  },
  {
    CategoryName: 'Non-Veg',
    name: 'Chicken Korma',
    img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '200', full: '380' }],
    description: 'Tender chicken simmered in a spiced almond and yogurt gravy.',
  },
  {
    CategoryName: 'Non-Veg',
    name: 'Mutton Rogan Josh',
    img: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '260', full: '500' }],
    description: 'Classic Kashmiri braised lamb curry flavored with saffron and spices.',
  },

  // --- FAST FOOD ---
  {
    CategoryName: 'Fast Food',
    name: 'Loaded French Fries',
    img: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&auto=format&fit=crop&q=80',
    options: [{ regular: '90', large: '150' }],
    description: 'Crispy golden fries topped with melted cheese, jalapeños, and herbs.',
  },
  {
    CategoryName: 'Fast Food',
    name: 'Paneer Kathi Roll',
    img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80',
    options: [{ single: '110', double: '190' }],
    description: 'Flaky paratha wrap filled with spiced paneer, onions, and tangy chutney.',
  },
  {
    CategoryName: 'Fast Food',
    name: 'Chicken Nuggets',
    img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
    options: [{ regular: '130', large: '230' }],
    description: 'Bite-sized crispy chicken nuggets served with garlic mayonnaise.',
  },

  // --- PIZZA ---
  {
    CategoryName: 'Pizza',
    name: 'Margherita Pizza',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    options: [{ regular: '160', medium: '290', large: '440' }],
    description: 'Classic Neapolitan pizza with rich tomato sauce, fresh mozzarella, and basil.',
  },
  {
    CategoryName: 'Pizza',
    name: 'Veg Supreme Pizza',
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80',
    options: [{ regular: '210', medium: '380', large: '540' }],
    description: 'Topped with bell peppers, sweet corn, olives, mushrooms, and extra cheese.',
  },
  {
    CategoryName: 'Pizza',
    name: 'Chicken BBQ Pizza',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
    options: [{ regular: '240', medium: '420', large: '590' }],
    description: 'Smoky BBQ sauce, grilled chicken strips, red onions, and mozzarella cheese.',
  },

  // --- BURGER ---
  {
    CategoryName: 'Burger',
    name: 'Classic Veg Burger',
    img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    options: [{ single: '80', double: '140' }],
    description: 'Crispy veg patty topped with fresh lettuce, tomatoes, and mayonnaise.',
  },
  {
    CategoryName: 'Burger',
    name: 'Crispy Chicken Burger',
    img: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80',
    options: [{ single: '130', double: '220' }],
    description: 'Juicy crispy chicken fillet with spicy mayo, pickles, and iceberg lettuce.',
  },
  {
    CategoryName: 'Burger',
    name: 'Double Cheese Burger',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    options: [{ single: '160', double: '270' }],
    description: 'Loaded with double patties, double cheddar cheese slices, and special sauce.',
  },

  // --- CHOWMEIN ---
  {
    CategoryName: 'Chowmein',
    name: 'Veg Hakka Noodles',
    img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '110', full: '200' }],
    description: 'Stir-fried noodles tossed with crunchy vegetables, soy sauce, and sesame.',
  },
  {
    CategoryName: 'Chowmein',
    name: 'Chicken Schezwan Noodles',
    img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '150', full: '270' }],
    description: 'Spicy wok-tossed noodles with shredded chicken and Schezwan chili sauce.',
  },
  {
    CategoryName: 'Chowmein',
    name: 'Singapuri Veg Chowmein',
    img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
    options: [{ half: '130', full: '230' }],
    description: 'Thin yellow noodles tossed with paneer, vegetables, curry powder, and spices.',
  },

  // --- DESSERTS ---
  {
    CategoryName: 'Desserts',
    name: 'Gulab Jamun (2 Pcs)',
    img: 'https://aashdinein.com/cdn/shop/files/Aash-WebImages-GulabJamun.webp?v=1773064338',
    options: [{ half: '60', full: '110' }],
    description: 'Soft milk solids fried and soaked in cardamom-flavored sugar syrup.',
  },
  {
    CategoryName: 'Desserts',
    name: 'Chocolate Lava Cake',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
    options: [{ single: '110', double: '200' }],
    description: 'Warm chocolate sponge cake with a molten chocolate center.',
  },
  {
    CategoryName: 'Desserts',
    name: 'Rasmalai (2 Pcs)',
    img: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Rasmalai_Indian_Sweet.JPG',
    options: [{ half: '80', full: '150' }],
    description: 'Soft cottage cheese patties soaked in saffron-infused thickened milk.',
  },

  // --- DRINKS ---
  {
    CategoryName: 'Drinks',
    name: 'Cold Coffee Shake',
    img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80',
    options: [{ small: '90', large: '150' }],
    description: 'Thick blended espresso coffee served with vanilla ice cream and chocolate drizzle.',
  },
  {
    CategoryName: 'Drinks',
    name: 'Fresh Mango Lassi',
    img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80',
    options: [{ small: '80', large: '130' }],
    description: 'Traditional yogurt drink blended with sweet Alphonso mango pulp.',
  },
  {
    CategoryName: 'Drinks',
    name: 'Fresh Lemon Soda',
    img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
    options: [{ small: '50', large: '80' }],
    description: 'Refreshing sparkling soda with fresh lemon juice, mint, and rock salt.',
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully to MongoDB');

    const db = mongoose.connection.db;
    const catColl = db.collection('Categories');
    const foodColl = db.collection('food_items');

    console.log('\n--- Seeding Categories ---');
    for (const cat of categories) {
      await catColl.updateOne(
        { CategoryName: cat.CategoryName },
        { $set: cat },
        { upsert: true }
      );
      console.log(`✓ Upserted Category: ${cat.CategoryName}`);
    }

    console.log('\n--- Seeding Food Items ---');
    for (const item of foodItems) {
      await foodColl.updateOne(
        { name: item.name },
        { $set: item },
        { upsert: true }
      );
      console.log(`✓ Upserted Food Item: [${item.CategoryName}] ${item.name}`);
    }

    console.log('\n========================================');
    console.log(`Seeding Complete!`);
    console.log(`Categories processed: ${categories.length}`);
    console.log(`Food items processed: ${foodItems.length}`);
    console.log('========================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
