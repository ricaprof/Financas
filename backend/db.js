import mysql from 'mysql2/promise'; //Usar em produção
//import mysql from 'mysql2'; // Usar em desenvolvimento
import dotenv from 'dotenv';


dotenv.config();
/*Banco em Produção */
export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0
});

