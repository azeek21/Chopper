import mongoose from "mongoose";

const mongoClient = async () => {
  return mongoose.connect(process.env.MONGODB_URI!, {
    dbName: process.env.MONGODB_NAME!,
  });
};

export default mongoClient;
