import express from "express";
import cookieParser from "cookie-parser";

import product from "./routes/productRoutes.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRoute.js";

import errorMiddleware from "./middleWare/error.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1", product);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

// Error middleware — always keep this at the end
app.use(errorMiddleware);

export default app;
