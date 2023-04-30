const express = require('express');
const config = require('./config/config');
const connectDB = require('./config/connectDB');
const router = require('./routes/route');
const app = express();

const port = config.PORT || 8088;
const hostName = config.HOST_NAME;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

connectDB();

app.listen(port, hostName, () => {
    console.log(`Server is running at ${hostName}:${port}`);
})
