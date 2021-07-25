const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    console.log(`MongoDB Connected To: ${conn.connection.host}`);
  } catch (error) {
    next(error);
  }
};

module.exports = connectDB;
