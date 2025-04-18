import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import config from "../config/config";

dotenv.config();

// Initialize database connection
const initializeDatabase = async () => {
  try {
    console.log(
      "Checking database connection and running migrations if needed..."
    );

    const pool = new Pool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    });

    // Test database connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful");

    // Check if tables exist by querying for users table
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    const tablesExist = tableCheckResult.rows[0].exists;

    // If tables don't exist, run migrations
    if (!tablesExist) {
      console.log("No tables found. Running migrations...");

      // Read and execute the migration SQL script
      const sqlFilePath = path.join(
        __dirname,
        "..",
        "db",
        "migrations",
        "init.sql"
      );
      const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

      await pool.query(sqlContent);
      console.log("✅ Database migrations completed successfully");
    } else {
      console.log("✅ Database tables already exist. Skipping migrations.");
    }

    return true;
  } catch (error) {
    console.error("❌ Database initialization error:", error);

    // If the database doesn't exist, provide instructions
    if ((error as any).message.includes("does not exist")) {
      console.error(`
        Database '${config.db.database}' does not exist. 
        Please create it with the following command:
        
        CREATE DATABASE ${config.db.database};
        
        Then restart the application.
      `);
    }

    return false;
  }
};

export default initializeDatabase;
