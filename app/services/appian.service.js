// app/services/appian.service.js
const { viewProfileURL, getEngagementsURL, invoicesExpensesURL, updateProfileURL } = require('../constants/appianURL')

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

async function updateAppianProfile(username, password, payload) {
    const res = await fetch(updateProfileURL, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const text = await res.text(); // ← read raw text instead of .json()

    try {
        return JSON.parse(text);   // try to parse JSON
    } catch (e) {
        return { 
            error: "Appian returned non-JSON response",
            raw: text 
        };
    }
}


module.exports = {
    fetchAppianProfile,
    fetchAppianEngagements,
    fetchAppianInvoices,
    updateAppianProfile
};
