require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
console.log('URI found:', uri ? 'Yes' : 'No');

mongoose.connect(uri).then(async () => {
  console.log('Connected');
  try {
    await mongoose.connection.db.collection('users').dropIndex('username_1');
    console.log('Index dropped successfully');
  } catch (e) {
    console.log('Index error:', e.message);
  }
  process.exit(0);
}).catch(e => {
  console.log('Connection error:', e.message);
  process.exit(1);
});