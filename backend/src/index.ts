import express from "express";
import { config } from "./config";
import cookieParser from "cookie-parser";
import router from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/", router);

app.use(errorHandler);

app.listen(config.server.port, async () => {
  console.log("Server started on port 3000");
});
