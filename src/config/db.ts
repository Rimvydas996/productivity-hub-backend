import mongoose from "mongoose";

//  * * Connects to MongoDB database using Mongoose.
//  * * Exits the process if connection fails.
//  */

export const connectToDatabase = async (): Promise<void> => {
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASS;
  const cluster = process.env.DB_CLUSTER;
  const dbName = process.env.DB_NAME;

  const uri = `mongodb+srv://${user}:${pass}@${cluster}.mongodb.net/?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, { dbName });
    console.log("Prisijungta prie duomenu bazes");
  } catch (error) {
    console.error("Klaida jungianties prie MongoDB:", error);
    process.exit(1);
  }
};
