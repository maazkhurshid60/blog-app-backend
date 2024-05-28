const mongoose = require('mongoose');


async function connectToDB(address) {
    try {
        const dbConnection = await mongoose.connect(address);
        console.log('DB is connected at: ', dbConnection.connection.host);
    } catch (error) {
        console.log('Error while establishing DB connection: ',error);
        process.exit(1);
    }
}

module.exports = connectToDB