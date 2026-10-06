require('dotenv').config();
const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URI;

module.exports = function connectDB(onConnected) {
  mongoose
    .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      console.log('Connected to MongoDB');

      const db = mongoose.connection.db;
      const foodCollection = db.collection('food_items');
      const categoryCollection = db.collection('Categories');

      const foodData = await foodCollection.find({}).toArray();
      const catData = await categoryCollection.find({}).toArray();

      global.foodData = foodData;
      global.foodCategory = catData;

      if (onConnected) onConnected();
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
};
