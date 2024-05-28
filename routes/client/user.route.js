const express = require('express');

const {
    getUserDetails,
    resetUserPassword,
    deleteAccount,
    followOrUnFollowUser
} = require('../../controllers/client/user.controller');

const router = express.Router();

router.get('/user/details', getUserDetails);

router.patch('/user/reset-password', resetUserPassword);

router.delete('/user/delete-account', deleteAccount);

router.patch('/user/follow-unfollow-user', followOrUnFollowUser);

module.exports = router;