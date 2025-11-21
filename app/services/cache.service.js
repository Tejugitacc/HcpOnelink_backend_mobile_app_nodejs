const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '../../cache');
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function cacheFile(userId, type) {
  return path.join(CACHE_DIR, `${userId}-${type}.json`);
}

function getCachedData(userId, type) {
  const file = cacheFile(userId, type);
  if (!fs.existsSync(file)) return null;
  const stat = fs.statSync(file);
  const age = Date.now() - stat.mtimeMs;
  if (age > EXPIRY_MS) return null;
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return json;
}

function storeCache(userId, type, data) {
  const file = cacheFile(userId, type);
  fs.writeFileSync(file, JSON.stringify({ retrievedAt: new Date().toISOString(), data }, null, 2));
}

module.exports = { getCachedData, storeCache };
