// app/services/appian.service.js

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { viewProfileURL } = require('../constants/appianURL')

async function fetchAppianProfile(username, password, userId) {
    const base64Creds = Buffer.from(`${username}:${password}`).toString('base64');

    const url = `${viewProfileURL}?userId=${encodeURIComponent(userId)}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${base64Creds}`,
            'Accept': 'application/json'
        }
    });

    return res.json();
}


async function fetchAppianEngagements(username, password) {
    const res = await fetch(process.env.APPIAN_ENGAGEMENTS_API, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
        }
    });
    return await res.json();
}

async function fetchAppianInvoices(username, password) {
    const res = await fetch(process.env.APPIAN_INVOICES_API, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
        }
    });
    return await res.json();
}

module.exports = {
    fetchAppianProfile,
    fetchAppianEngagements,
    fetchAppianInvoices
};
