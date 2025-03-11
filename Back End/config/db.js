require('dotenv').config();
const mysql = require('mysql2');

const connection= mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.connect((err) => {
  if (err) {
      console.error('Erro ao conectar ao MySQL:', err);
  } else {
      console.log('Conectado ao MySQL!');
  }
});

module.exports = connection;