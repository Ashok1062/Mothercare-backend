const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
        ssl:true,
        tlsAllowInvalidCertificates:false
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

module.exports = dbConnection;
