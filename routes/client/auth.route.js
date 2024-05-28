const express = require('express');
const { authMiddleware } = require('../../middlewares/auth.middleware')
const {
    signup,
    login,
    logout
} = require('../../controllers/client/auth.controller')

const router = express.Router();

//Client Login and Signup Routes
router.post('/auth/signup', signup);

router.post('/auth/login', login);

router.get('/auth/logout', authMiddleware, logout);

module.exports = router;