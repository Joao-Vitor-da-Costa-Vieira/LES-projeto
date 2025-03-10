const crypto = require('crypto');

function hashSenha(senha) {
  const hash = crypto.createHash('sha256');
  hash.update(senha);
  return hash.digest('hex');
}

module.exports = {
  hashSenha
};