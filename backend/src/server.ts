import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import departmentRoutes from "./routes/departments.routes.js";
import productRoutes from "./routes/products.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


// middlewares
app.use(cors({
  origin: process.env.Frontend_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); 
app.use(cookieParser());

// health check
app.get("/health", (_req, res) => {
  res.send("Backend running");
});

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/departments", departmentRoutes);
app.use("/products", productRoutes);
app.use("/dashboard", dashboardRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
