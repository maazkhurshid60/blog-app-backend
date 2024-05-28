const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        required: true
    }
}, );

const followingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        required: true
    }
},);

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationTokenExpiry: {
        type: Date
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordTokenExpiry: {
        type: Date
    },
    followers: [followerSchema],
    followings: [followingSchema],
}, {timestamps: true});


const User = mongoose.models.users || mongoose.model('User', userSchema);

module.exports = User;