import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { usersRoute, productRoute, orderRoute } from "./routes/index.js";
import { dbConnection } from "./db/config.js";
import { errorHandler } from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  // add production URLs here later, e.g. "https://yourapp.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 🔥 Important for sending cookies/sessions
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes consumption
app.use("/api", usersRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);
// app.use("/api", paymentRoute);
app.use(errorHandler);

const startServer = async () => {
  try {
    await dbConnection();
    const server = app.listen(process.env.PORT, () => {
      console.log(`App is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(`An error occured here: ${error}`);
    process.exit(1);
  }
};

startServer();
