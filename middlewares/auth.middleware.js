const { verifyToken } = require('../services/auth.service')
const ExpiredToken = require('../models/expired_token.model')

const authMiddleware = async (req, res, next) => {

    try {
        
        const authorizationHeaderValue = req.headers?.authorization;

        if(!authorizationHeaderValue) {
            throw new Error('Un-Authorized Access');
        }
    
        const token = authorizationHeaderValue.split(' ')[1];

        const response = await ExpiredToken.find({ token });

        if(response.length !== 0) {
            throw new Error('Token has expired');
        }

        const user = verifyToken(token);

        if(user) {
            req.user = user;
        }

        return next();

        
    } catch (error) {
        return res.status(500).json({
            error: `${error}`,
            success: false
        })   
    }

}


module.exports = {
    authMiddleware
}