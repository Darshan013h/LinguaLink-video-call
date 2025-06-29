import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log(`\n MongoDB connected !! DB Host:${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error ",error);
        process.exit(1); // failure
    }
}