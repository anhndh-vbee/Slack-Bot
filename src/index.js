const express = require('express');
const config = require('./config/config');
const connectDB = require('./config/connectDB');
const router = require('./routes/route');
const app = express();
const errorHandler = require('./middlewares/errorHandler.middleware');
const port = config.PORT || 8088;
const hostName = config.HOST_NAME;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

// error handler
app.use(errorHandler);

app.set('trust proxy', true)

connectDB();

app.listen(port, hostName, () => {
    console.log(`Server is running at ${hostName}:${port}`);
})
