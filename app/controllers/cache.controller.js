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

    console.log("BODY:  userId", req.body, userId);
    // 1. Check cache
    const cache = getCachedData(userId, 'profile');
    console.log("BODY: cache", cache);
    if (cache) return res.json({ source: 'cache', data: cache });

    const creds = getUserCredentials(username);
    console.log("BODY: cache", creds);
    
    if (!creds) return res.status(404).json({ error: "User not found" });
  
    const { username: un, password: pw } = creds;

    // 2. Fetch from Appian
    const profile = await fetchAppianProfile(un, pw,userId);

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

    const engagements = await fetchAppianEngagements(username, password);

    storeCache(userId, 'engagements', engagements);

    res.json({ source: 'appian', data: engagements });
};


/// ---- Invoices ----
exports.getInvoices = async (req, res) => {
    const { userId } = req.params;
    const { username, password } = req.body;

    const cache = getCachedData(userId, 'invoices');
    if (cache) return res.json({ source: 'cache', data: cache });

    const invoice = await fetchAppianInvoices(username, password);

    storeCache(userId, 'invoices', invoice);

    res.json({ source: 'appian', data: invoice });
};
