const crypto = require("crypto");

const KEY = process.env.CRYPTO_KEY;
const IV = process.env.CRYPTO_IV;

// Validate
if (!KEY || !IV) {
  console.error("❌ Missing CRYPTO_KEY or CRYPTO_IV in .env");
  throw new Error("Encryption keys missing!");
}

const ALGO = "aes-256-ctr";
const SECRET = process.env.PASSWORD_SECRET_KEY; // must be 32 chars

function encrypt(text) {
  if (!text) {
    console.error("❌ encrypt() received undefined text");
    return null;
  }
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(SECRET), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(hash) {
  const [ivHex, encryptedHex] = hash.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(SECRET), iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final()
  ]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
