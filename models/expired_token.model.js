const mongoose = require('mongoose');

const expiredTokenSchema = new mongoose.Schema({
   token: { type: String, required: true },
}, {timestamps: true});

const ExpiredToken = mongoose.model('ExpiredToken', expiredTokenSchema);

module.exports = ExpiredToken;