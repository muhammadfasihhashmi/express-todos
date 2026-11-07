import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import todoRouter from "./routes/todo.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

const app = express();

app.use(express.json());

app.use("/todos", authMiddleware, todoRouter);

app.use("/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorMiddleware);

const port = process.env.PORT || 3000;
async function startServer() {
  await connectDB();

  app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
  });
}
startServer();
