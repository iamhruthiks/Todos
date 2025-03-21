import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connection to mongoDB is successful!");
  } catch (error) {
    console.error("error connecting to mongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
