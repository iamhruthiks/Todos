import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import swaggerDocs from "./config/swagger.js";
import userRoutes from "./routes/userRoutes.js";
import todosRoutes from "./routes/todosRoutes.js";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// connect to mongoDB database
connectDB();

// routes
app.get("/", (req, res) => {
  res.send("Welcome To Todos!");
});
app.use("/api/users", userRoutes);
app.use("/api/todos", todosRoutes);

// API documentation
swaggerDocs(app);

// server port
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
