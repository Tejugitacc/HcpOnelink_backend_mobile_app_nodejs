// app/controllers/cache.controller.js

const { getCachedData, storeCache } = require('../services/cache.service');
const {
    fetchAppianProfile,
    fetchAppianEngagements,
    fetchAppianInvoices
} = require('../services/appian.service');
const { getUserCredentials } = require("../services/userStorage.service");



/// ---- Profile Endpoint ----
exports.getProfile = async (req, res) => {

    const { username } = req.body;
    const userId = req.params.userId;


    // 1. Check cache
    const cache = getCachedData(userId, 'profile');

    if (cache) return res.json({ source: 'cache', data: cache });

    const creds = getUserCredentials(username);

    if (!creds) return res.status(404).json({ error: "User not found" });

    const { username: un, password: pw } = creds;

    // 2. Fetch from Appian
    const profile = await fetchAppianProfile(un, pw, userId);

    // 3. Save cache
    storeCache(userId, 'profile', profile);

    res.json({ source: 'appian', data: profile });
};


/// ---- Engagements ----
exports.getEngagements = async (req, res) => {
    const { userId } = req.params;
    const { username, password } = req.body;
  
    const cache = getCachedData(userId, 'engagements');

    if (cache) return res.json({ source: 'cache', data: cache });

    const creds = getUserCredentials(username);

    if (!creds) return res.status(404).json({ error: "User not found" });

    const { username: un, password: pw } = creds;

    const engagements = await fetchAppianEngagements(un, pw ? pw : password, userId);

    storeCache(userId, 'engagements', engagements);

    res.json({ source: 'appian', data: engagements });
};


/// ---- Invoices ----
exports.getInvoices = async (req, res) => {
    const { userId } = req.params;
    const { username, password } = req.body;
    console.log("BODY:  userId", req.body, userId);
    const cache = getCachedData(userId, 'invoices');
    console.log("BODY: cache", cache);
    if (cache) return res.json({ source: 'cache', data: cache });

    const creds = getUserCredentials(username);

    if (!creds) return res.status(404).json({ error: "User not found" });

    const { username: un, password: pw } = creds;

    console.log("BODY: cache", creds);

    const invoice = await fetchAppianInvoices(un, pw ? pw : password, userId);

    storeCache(userId, 'invoices&Expenses', invoice);

    res.json({ source: 'appian', data: invoice });
};
