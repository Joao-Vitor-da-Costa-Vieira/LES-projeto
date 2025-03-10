require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const mysql = require('mysql2/promise');

// Configuração do pool de conexões usando variáveis de ambiente
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT),
  queueLimit: 0
});

pool.getConnection()
  .then((connection) => {
    console.log('Conectado ao banco de dados com sucesso!');
    connection.release();
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

module.exports = pool;