require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
    .then((connection) => {
        console.log('Conectado ao MySQL!');
        connection.release(); // Libera a conexão de volta para o pool
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MySQL:', err);
    });

module.exports = pool;