const JWT = require('jsonwebtoken');
const myConfigs = require('../conf/conf');

const generateToken = (user) => {

    const payload = {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
    }

    const token = JWT.sign(payload, myConfigs.tokenSecret, {
        expiresIn: '1d',
        algorithm: "HS256"
    });

    return token;

}

const verifyToken = (token) => {

    try {
        const payload = JWT.verify(token, myConfigs.tokenSecret);
        if(payload) {
            return payload
        } 
    } catch (error) {
        throw error
    }

}


module.exports = {
    generateToken,
    verifyToken
}