// mkdir-server/test-db.js
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/youtube-clone';

console.log('Testing MongoDB connection to:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB connected successfully');
  
  // Test if we can perform operations
  const testDoc = await mongoose.connection.db.collection('test').insertOne({
    test: 'connection_test',
    timestamp: new Date()
  });
  
  console.log('✅ Test document inserted:', testDoc.insertedId);
  
  const foundDoc = await mongoose.connection.db.collection('test').findOne({
    _id: testDoc.insertedId
  });
  
  console.log('✅ Test document retrieved:', foundDoc);
  
  await mongoose.connection.close();
  console.log('✅ Test completed successfully');
  process.exit(0);
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});