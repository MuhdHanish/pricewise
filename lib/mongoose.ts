import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);
    const databaseURI = process.env.MONGODB_URI;
    if (!databaseURI) {
        throw new Error("MongoDB URI is missing from environment variables.");
    }
    if (isConnected) {
        console.log("Database is already connected.");
        return;
    }
    try {
        await mongoose.connect(databaseURI);
        isConnected = true;
        console.log("Successfully connected to the database.");
    } catch (error: any) {
        throw new Error(`Database connection failed: ${error?.message}`);
    }
};