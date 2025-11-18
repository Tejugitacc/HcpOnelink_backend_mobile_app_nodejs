const { appianloginURL } = require('../constants/appianURL');
const { saveUserCredentials } = require("../services/userStorage.service");


exports.login = async (req, res) => {

  const { username, password } = req.body;
  console.log('Authfunction loaded',req.body);

  try {
    // Prepare Basic Auth (Appian username + Appian password)
    const base64Creds = Buffer.from(`${username}:${password}`).toString(
      'base64'
    );

    const response = await fetch(
      appianloginURL,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${base64Creds}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      }
    );

    const buffer = await response.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    console.log('DATA :', data);
    if (response.status === 200) {
      saveUserCredentials(username, password);
      console.log("User credentials saved for:", username);
    }
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Appian Proxy Error:', err);
    res.status(500).json({ error: err.message });
  }
};
