const crypto = require('crypto');

const SECRET = process.env.PASSWORD_SECRET_KEY;
if (!SECRET || SECRET.length !== 32) {
  console.error('PASSWORD_SECRET_KEY must be 32 characters long in .env');
  throw new Error('Missing/invalid password secret key (32 chars required)');
}

const ALGO = 'aes-256-ctr';

function encrypt(text) {
  if (typeof text !== 'string') text = String(text);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(SECRET), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(hash) {
  if (!hash) return null;
  const [ivHex, encryptedHex] = hash.split(':');
  if (!ivHex || !encryptedHex) return null;
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(SECRET), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
