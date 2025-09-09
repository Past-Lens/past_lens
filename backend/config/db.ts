import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);


    console.log(`MongoDB Connected: ${conn.connection.host}`);
    //consolr to show the database name
    console.log(`Database name: ${conn.connection.name}`);
    //console to show DATABASE_URL
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
    
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
