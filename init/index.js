const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../modals/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    initDB();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  async function initDB() {
    try {
      await Listing.deleteMany({});
      const result = await Listing.insertMany(initData);
      console.log('Data was initialized');
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }
  

