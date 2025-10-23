import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error(
                'DATABASE_URL is not defined in environment variables'
            );
        }

        const conn = await mongoose.connect(process.env.DATABASE_URL);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database name: ${conn.connection.name}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
