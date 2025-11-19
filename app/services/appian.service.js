// app/services/appian.service.js
const { viewProfileURL, getEngagementsURL, invoicesExpensesURL } = require('../constants/appianURL')

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


async function fetchAppianEngagements(username, password, userId) {
    const url = `${getEngagementsURL}?userId=${encodeURIComponent(userId)}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
        }
    });
    return await res.json();
}

async function fetchAppianInvoices(username, password,userId) {
    const url = `${invoicesExpensesURL}?userId=${encodeURIComponent(userId)}`;
    const res = await fetch(url, {
        method: 'POST',
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
