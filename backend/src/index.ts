import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config";
import router from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { seedDatabase } from "./config/seed";

async function start() {
  await seedDatabase(); // 👈 run schema before app listens

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    cors({
      origin: config.cors.origins,
      credentials: true,
    })
  );

  app.use("/", router);
  app.use(errorHandler);

  app.listen(config.server.port, () => {
    console.log(`🚀 Server started on port ${config.server.port}`);
  });
}

start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
