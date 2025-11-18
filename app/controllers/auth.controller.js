// Appian LOGIN Proxy
// ------------------------------
exports.login = async (req, res) => {
  console.log('========', req.body);
  const { username, password } = req.body;
  console.log('Authfunction loaded');

  try {
    // Prepare Basic Auth (Appian username + Appian password)
    const base64Creds = Buffer.from(`${username}:${password}`).toString(
      'base64'
    );

    const response = await fetch(
      'https://dsi-hcp-dev.appiancloud.com/suite/webapi/mobileuserlogin',
      {
        method: 'POST',

        headers: {
          Authorization: `Basic ${base64Creds}`, // <<< UPDATED
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
    //  const helpercall = helpers.DecodeResponse(response);
    // console.log('helper function DATA :', helpercall);
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Appian Proxy Error:', err);
    res.status(500).json({ error: err.message });
  }
};
