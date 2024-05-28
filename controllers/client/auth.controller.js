const User = require('../../models/user.model');
const ExpiredToken = require('../../models/expired_token.model')
const { hashContent, compareHashes } = require('../../services/hash.service');
const { generateToken } = require('../../services/auth.service')
const { emailValidator } = require('../../utils/email_checker')
const { checkBasicValidation, checkStringDataType } = require('../../utils/check_filed_basic_validation')

const signup = async (req, res) => {

    const reqBody = req.body;
    const {fullname, username, email, password} = reqBody;

    if(checkBasicValidation(fullname) || 
       checkBasicValidation(username) || 
       checkBasicValidation(email) || 
       checkBasicValidation(password)) {
        return res.status(400).json({
            error: "Required data is missing",
            success: false,
        })
    }
    
    if(!checkStringDataType(fullname) || 
       !checkStringDataType(username) || 
       !checkStringDataType(email) || 
       !checkStringDataType(password)) {
        return res.status(400).json({
            error: "Data is of invalid data types",
            success: false
        })
    }

    if(!emailValidator(email)) {
        return res.status(400).json({
            error: "Invalid email",
            success: false
        });
    }

    const isUsernameAlreadyExists = await User.findOne({username});

    if(isUsernameAlreadyExists !== null) {
        return res.status(400).json({
            error: "Username already exists. Please try something else",
            success: false
        });
    }

    const isEmailAlreadyExists = await User.findOne({email});

    if(isEmailAlreadyExists !== null) {
        return res.status(400).json({
            error: "Email already registered.",
            success: false
        });
    }

    const hashedPassword = await hashContent(password.trim());

    try {
        const userCreated = await User.create({
            fullname: fullname.trim(),
            username: username.trim(),
            email: email.trim(),
            password: hashedPassword
        });
    
        const userId = userCreated._id;
    
        return res.status(201).json({
            message: `User ${username} has been created successfully`,
            userId: userId,
            success: true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "An unexpected error occurred while creating the account.",
            success: false
        })
    }

}

const login = async (req, res) => {

    const reqBody = req.body;
    const {content, password} = reqBody;
    let user = null;

    if(checkBasicValidation(content) || 
       checkBasicValidation(password)) {
        return res.status(400).json({
            error: "Required data is missing",
            success: false,
        })
    }

    if(!checkStringDataType(content) || 
       !checkStringDataType(password)) {
        return res.status(400).json({
            error: "Data is of invalid data types",
            success: false
        })
    }

    if(emailValidator(content)) {
        user = await User.findOne({email : content});
    } else {
        user = await User.findOne({username: content})
    }

    if(user === null) {
        return res.status(404).json({
            error: "User doesn\'t exists. Please try again.",
            success: false
        });
    }

    const hashedPassword = user.password;

    const isPasswordMatched = await compareHashes(password, hashedPassword);

    if(!isPasswordMatched) {
        return res.status(400).json({
            error: "Provided credentials are incorrent. Please try again",
            success: false,
        })
    }

    try {

        const token = generateToken(user);

        if(token) {
            
            return res.status(200).json({
                message: "User logged in successfully",
                success: true,
                user: {...user._doc, password: ""},
                token: token
            })
        } else {
            throw new Error('An unexpected error occurred while logging the user.');
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "An unexpected error occurred while logging the user.",
            success: false
        })
    }

}

const logout = async (req, res) => {
    if(req.user) {
        try {
            const authorizationHeaderValue = req.headers?.authorization;

            if(!authorizationHeaderValue) {
                throw new Error('Un-Athorized Access');
            }
        
            const token = authorizationHeaderValue.split(' ')[1];

            await ExpiredToken.create({
                token: token
            });

            return res.status(200).json({
                message: "User Logout successfully!",
                success: true,
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: `An unexpected error occured while logout: Error ${error}`,
                success: false
            })
        }
    }
}


module.exports = {
    signup,
    login,
    logout
}