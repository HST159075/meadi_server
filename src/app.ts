import express from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.rotes";
import medicineRoutes from "./routes/medicine.routes";
import sellerMedicineRoutes from "./routes/seller.medicine.route";
import orderRoutes from "./routes/order.routes";
import sellerOrderRoutes from "./routes/seller.order.routes.js";
import categoryRoutes from "./routes/category.routes";
import reviewRoutes from "./routes/review.routes";
import sellerRoutes from "./routes/seller.routes";
import userRoutes from "./routes/user.routes";

import { globalErrorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.all("/api/auth/*all", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("MediStore API is running..!!!");
});

app.use("/api/admin", adminRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/seller/medicines", sellerMedicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller/orders", sellerOrderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/users", userRoutes);

app.use(globalErrorHandler);

export default app;
