import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;


const pool = new Pool({
  user: process.env.DB_USER || "postgres",       
  host: process.env.DB_HOST || "localhost",           
  database: process.env.DB_NAME || "content_manager",     
  password: process.env.DB_PASSWORD || "",            
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3100,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Database connection established successfully.");
    client.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

export { pool, testConnection };
