import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "../src/routes/auth.routes";
import userRoutes from "../src/routes/users.routes";
import departmentRoutes from "../src/routes/departments.routes";
import productRoutes from "../src/routes/products.routes"
import dashboardRoutes from "../src/routes/dashboard.routes"


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
