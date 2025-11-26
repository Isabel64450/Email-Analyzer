import mariadb from "mariadb";
import dotenv from "dotenv";
dotenv.config()
export const db = mariadb.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});
async function testConnection() {
  try {
    const conn = await db.getConnection(); 
    
    
    conn.release();
  } catch (err) {
    console.error("❌ Erreur de connexion :", err);
  }
}

testConnection();