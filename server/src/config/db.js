const mongoose = require('mongoose');
const env = require('./env');

const connectDb = async () => {
  mongoose.set('strictQuery', true);
  const connection = await mongoose.connect(env.mongoUri);
  console.log(`MongoDB connected: ${connection.connection.name}`);
};

module.exports = connectDb;
