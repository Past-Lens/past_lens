import express, { Application, Request, Response } from "express";
import { config as configDotenv } from "dotenv";
import connectDB from "./config/db";

import authRouter from "./routes/auth.route";
import cors from "cors";



configDotenv();

connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());

const port: number = parseInt(process.env.PORT || "5000", 10);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.use("/api/auth", authRouter);

app.listen(port, () => console.log(` Server running on port ${port}`));
