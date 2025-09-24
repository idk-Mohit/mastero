import "dotenv/config";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export const config = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT ?? "10", 10),
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT ?? "10", 10),
  },
  server: {
    port: process.env.SERVER_PORT
      ? parseInt(process.env.SERVER_PORT, 10)
      : 4000,
    host: process.env.SERVER_HOST || "localhost",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secretkey",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "supersecretrefreshkey",
    saltRounds: parseInt(process.env.SALT_ROUNDS ?? "10", 10),
  },
  cors: {
    origins: (process.env.CORS_ORIGINS || "http://localhost:3000")
      .split(",")
      .map((o) => o.trim()),
  },
};
