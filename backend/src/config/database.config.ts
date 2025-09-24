import { config } from ".";
import mysql from "mysql2/promise";

export const createDatabasePool = () => {
  try {
    const poolOptions = {
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
      connectionLimit: config.db.connectionLimit,
      queueLimit: config.db.queueLimit,
    };

    const pool = mysql.createPool(poolOptions);
    console.log("Database pool created successfully");
    return pool;
  } catch (err) {
    console.log("[Create database pool error]: ", err);
    throw new Error("Failed to create database pool");
  }
};

const dbPool = createDatabasePool();
export default dbPool;
