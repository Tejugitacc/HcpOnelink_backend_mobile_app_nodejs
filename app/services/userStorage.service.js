const fs = require("fs");
const path = require("path");
const { encrypt, decrypt } = require("../utils/crypto.util");

const USERS_DIR = path.join(__dirname, "../../cache/users");

if (!fs.existsSync(USERS_DIR)) {
  fs.mkdirSync(USERS_DIR, { recursive: true });
}

function saveUserCredentials(username, password) {

  if (!username || !password) {
    console.error("❌ saveUserCredentials() received missing username/password");
    return;
  }
  
  const encryptedPassword = encrypt(password);

  const filePath = path.join(USERS_DIR, `${username}.json`);
  const data = {
    username,
    password: encryptedPassword,
    createdAt: new Date().toISOString()
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getUserCredentials(username) {
  const filePath = path.join(USERS_DIR, `${username}.json`);
  if (!fs.existsSync(filePath)) return null;

  const file = fs.readFileSync(filePath, "utf8");
  const json = JSON.parse(file);

  return {
    username: json.username,
    password: decrypt(json.password)
  };
}

module.exports = {
  saveUserCredentials,
  getUserCredentials
};
