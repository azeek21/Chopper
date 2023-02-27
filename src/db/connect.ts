import mongoose from "mongoose";

const  mongoClient = async () => {return mongoose.connect(process.env.MONGODB_URI!)}

export default mongoClient