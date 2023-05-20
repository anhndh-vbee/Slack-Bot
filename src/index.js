const express = require('express');
const config = require('./config/config');
const connectDB = require('./config/connectDB');
const router = require('./routes/route');
const app = express();
const errorHandler = require('./middlewares/errorHandler.middleware');
const port = config.PORT || 8088;
const hostName = config.HOST_NAME;
const path = require('path');
require('./services/refreshCheckin');
require('./services/emailService');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static file
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(router);

// error handler
app.use(errorHandler);

app.set('trust proxy', true);

connectDB();

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
