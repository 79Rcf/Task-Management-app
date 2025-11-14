import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

const productionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

// Configuration pour Développement local
const developmentConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "content_manager",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT) || 5432,
};

// Pool selon l'environnement
const pool = new Pool(isProduction ? productionConfig : developmentConfig);

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
