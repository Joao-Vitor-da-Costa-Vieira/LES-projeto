const crypto = require('crypto');
const SALT = 'meuSaltSecreto'; // Mantenha isso em segredo

// Função para gerar hash da senha com salt
function hashSenhaComSalt(senha) {
  return crypto.createHash('sha256').update(senha + SALT).digest('hex').slice(0, 20);
}

module.exports = { hashSenhaComSalt };