const fs = require('fs');
const path = require('path');
const { encrypt, decrypt } = require('../utils/crypto.util');

const USERS_DIR = path.join(__dirname, '../../cache/users');

if (!fs.existsSync(USERS_DIR)) fs.mkdirSync(USERS_DIR, { recursive: true });

function saveUserCredentials(userId, username, password) {
  if (!userId || !username || !password) {
    throw new Error('Missing fields to save credentials');
  }
  const filePath = path.join(USERS_DIR, `${userId}.json`);
  const encryptedPass = encrypt(password);
  const data = {
    userId,
    username,
    password: encryptedPass,
    savedAt: new Date().toISOString()
  };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getUserCredentialsByUserId(userId) {
  const filePath = path.join(USERS_DIR, `${userId}.json`);
  if (!fs.existsSync(filePath)) return null;
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return {
    userId: json.userId,
    username: json.username,
    password: decrypt(json.password)
  };
}

// optionally: fetch by username
function getUserCredentialsByUsername(username) {
  const files = fs.readdirSync(USERS_DIR);
  for (const f of files) {
    const json = JSON.parse(fs.readFileSync(path.join(USERS_DIR, f), 'utf8'));
    if (json.username === username) {
      return {
        userId: json.userId,
        username: json.username,
        password: decrypt(json.password)
      };
    }
  }
  return null;
}

module.exports = {
  saveUserCredentials,
  getUserCredentialsByUserId,
  getUserCredentialsByUsername
};
