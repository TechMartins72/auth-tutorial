import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(connection.connection.host);
    return connection;
  } catch (error) {
    console.log(`An error occured ${error}`);
    throw error;
  }
};
