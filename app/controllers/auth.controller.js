const { appianloginURL } = require('../constants/appianURL');
const { signToken } = require('../services/token.service');
const { saveUserCredentials } = require("../services/userStorage.service");
const { SERVER_ERROR_CODE } = require("../constants/errorcodes")
const { SUCCESS_STATUS_CODE } = require("../constants/errorcodes")



exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Missing username/password' });

  try {
    // verify; we will call the Appian login webapi (mobileuserlogin)
    const base64 = Buffer.from(`${username}:${password}`).toString('base64');
    const response = await fetch(appianloginURL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${base64}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const buffer = await response.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');
    let apiResult;
    try { apiResult = JSON.parse(text); } catch { apiResult = { raw: text }; }

    if (response.status !== SUCCESS_STATUS_CODE) {
      return res.status(response.status).json(apiResult);
    }

    // appian login worked — we need a userId from API (dsiID etc). Adjust according to your API response
    // Example: apiResult.dsiID might be [48149] or a number
    const userIdFromApi = Array.isArray(apiResult.dsiID) ? apiResult.dsiID[0] : apiResult.dsiID || apiResult.userId;

    const userId = userIdFromApi || username;

    // store encrypted creds on server (by userId)
    saveUserCredentials(userId, username, password);

    // create JWT (we include userId and username in token; NOT password)
    const token = signToken({ userId, username });

    return res.json({ success: true, token, username, userId, message: 'Login OK' });

  } catch (err) {
    console.error('Login error', err);
    return res.status(SERVER_ERROR_CODE).json({ success: false, message: err.message });
  }
};

