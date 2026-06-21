import express from "express";
import helmet from "helmet";
import compression from "compression";
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
dotenv.config();

app.use(helmet());
app.use(compression());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api/auth", authRoutes); 

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
};

export default app;