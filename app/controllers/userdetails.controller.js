// app/controllers/cache.controller.js

const {
    fetchAppianProfile,
    fetchAppianEngagements,
    fetchAppianInvoices
} = require('../services/appian.service');
const { getUserCredentialsByUserId } = require('../services/userStorage.service');


exports.getProfile = async (req, res) => {
    const { userId } = req.params;
    // ensure JWT user matches requested userId or allow admin
    if (!req.user || String(req.user.userId) !== String(userId)) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const creds = getUserCredentialsByUserId(userId);
    if (!creds) return res.status(404).json({ message: 'Credentials not found' });

    const profile = await fetchAppianProfile(creds.username, creds.password, userId);

    return res.json({ source: 'appian', data: profile });
};

exports.getEngagements = async (req, res) => {
    const { userId } = req.params;
    if (!req.user || String(req.user.userId) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });


    const creds = getUserCredentialsByUserId(userId);
    if (!creds) return res.status(404).json({ message: 'Credentials not found' });

    const data = await fetchAppianEngagements(creds.username, creds.password, userId);
    return res.json({ source: 'appian', data });
};

exports.getInvoicesExpenses = async (req, res) => {
    const { userId } = req.params;
    if (!req.user || String(req.user.userId) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });

    const creds = getUserCredentialsByUserId(userId);
    if (!creds) return res.status(404).json({ message: 'Credentials not found' });

    const data = await fetchAppianInvoices(creds.username, creds.password, userId);
    return res.json({ source: 'appian', data });
};

