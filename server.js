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
const cacheRoutes = require('./app/routes/cache.routes');
app.use('/api/cache', cacheRoutes);


// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${process.env.PORT || 4000}`)
);
