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
    console.log("✅ Connexion MariaDB réussie !");
    const res = await conn.query("SELECT 1 AS test");
    console.log("🔎 Résultat de test :", res);
    conn.release(); // toujours libérer la connexion
  } catch (err) {
    console.error("❌ Erreur de connexion :", err);
  }
}

testConnection();