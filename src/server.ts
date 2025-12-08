import express from "express";
import { connectToDatabase } from "./config/db.js";
import router from "./routes/task.routes.js";

//* Initialize Express application
const app = express();

//* Connect to MongoDB database
connectToDatabase();

//* Middleware for parsing JSON requests
app.use(express.json());

//* Use task routes
app.use(router);

//* Health check endpoint
app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "development") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
export default app;
