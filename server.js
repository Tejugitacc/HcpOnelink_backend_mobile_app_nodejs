const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());


const corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));

require('./app/routes/auth.routes')(app);
const userRoutes = require('./app/routes/userdetails.routes');
app.use('/api/user', userRoutes);


// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${process.env.PORT || 4000}`)
);


// node -e "console.log(require('crypto').randomBytes(24).toString('base64').slice(0,32))"

// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

