const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ------------------------------
// Appian LOGIN Proxy
// ------------------------------
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('========', req.body);

  try {
    const response = await fetch(
      'https://dsi-hcp-dev.appiancloud.com/suite/webapi/mobileuserlogin',
      {
        method: 'POST',

        headers: {
          Authorization: `Appian-API-Key ${process.env.APPIAN_API_KEY}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      }
    );
    console.log('======== response', response);

    console.log('Headers:', response.headers);

    const buffer = await response.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    console.log('DATA :', data);

    res.status(response.status).json(data);
  } catch (err) {
    console.error('Appian Proxy Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------
app.listen(process.env.PORT || 4000, () =>
  console.log(`Server running at http://localhost:${process.env.PORT || 4000}`)
);
