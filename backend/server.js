import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import swaggerDocs from "./config/swagger.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// connect to mongoDB database
connectDB();

// API documentation
swaggerDocs(app);

// routes
app.get("/", (req, res) => {
  res.send("Welcome To Todos!");
});
app.use("/api/users", userRoutes);

// server port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
