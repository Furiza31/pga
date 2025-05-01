import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables from .env file
dotenv.config();

// Create a new Pool instance with connection parameters from env vars
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Database connection error:', err.stack));

// Export the pool for use in other modules
export default pool;