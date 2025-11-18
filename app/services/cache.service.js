// app/services/cache.service.js
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '../../cache');
const EXPIRY_HOURS = 24;

if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
}

function cacheFilePath(userId, type) {
    return path.join(CACHE_DIR, `${userId}-${type}.json`);
}

function isCacheValid(filePath) {
    if (!fs.existsSync(filePath)) return false;

    const stats = fs.statSync(filePath);
    const ageHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);

    return ageHours < EXPIRY_HOURS;
}

function getCachedData(userId, type) {
    const file = cacheFilePath(userId, type);
    if (!isCacheValid(file)) return null;

    const content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content);
}

function storeCache(userId, type, data) {
    const file = cacheFilePath(userId, type);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
    getCachedData,
    storeCache
};
