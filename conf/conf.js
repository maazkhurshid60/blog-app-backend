const env = require('dotenv');

env.config();

const myConfigs = {
    port: process.env.PORT,
    mongoDBUrl: String(process.env.MONGODB_ENDPOINT_URL),
    tokenSecret: String(process.env.TOKEN_SECRET),
}

module.exports = myConfigs;