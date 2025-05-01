import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const runMigration = async () => {
  try {
    console.log("Running database migrations...");

    // Read the SQL file
    const sqlFile = path.join(__dirname, "init.sql");
    const sqlContent = fs.readFileSync(sqlFile, "utf8");

    // Execute the SQL commands
    await pool.query(sqlContent);

    console.log("Database migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
};

runMigration();
