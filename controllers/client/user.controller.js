const User = require('../../models/user.model');
const Blog = require('../../models/blog.model');

const { checkBasicValidation, checkStringDataType } = require('../../utils/check_filed_basic_validation')
const { hashContent, compareHashes } = require('../../services/hash.service');

const getUserDetails = async (req, res) => {

    const userId = req.query.userId;

    try {

        const userDetails = await User.findById({ _id: userId }).populate(['followers', 'followings']);

        if(userDetails !== undefined) {
            return res.status(200).json({
                message: "Get user details successfully!",
                success: true,
                user: userDetails
            })
        } else {
            throw new Error("No such user found!");
        }

        
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            error: `Something went wrong. Error: ${error}`,
            success: false
        })
    }

}

const resetUserPassword = async (req, res) => {

    const reqBody = req.body;
    const {oldPassword, newPassword} = reqBody;

    if(checkBasicValidation(oldPassword) || checkBasicValidation(newPassword)) {
        return res.status(400).json({
            error: "Required fields are missing",
            success: false,
        });
    }

    if(!checkStringDataType(oldPassword) || !checkStringDataType(newPassword)) {
        return res.status(400).json({
            error: "Invalid Data Types",
            success: false,
        });
    }

    try {

        const userId = req.user.id;

        const user = await User.findById({ _id: userId });

        if(user !== undefined) {

            const hashedUserPassword = user.password;

            const isOldPassValid = await compareHashes(oldPassword, hashedUserPassword);
            
            if(isOldPassValid) {

                const newHashedPassword = await hashContent(newPassword);

                user.password = newHashedPassword;

                await user.save();

                return res.status(200).json({
                    message: "User Password has been reset successfully!",
                    success: true,
                })

            } else {
                throw new Error('Old password is incorrect');
            }

        } else {
            throw new Error('User doesn\'t exists.');
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `Something went wrong. Error: ${error}`,
            success: false,
        });
    }

}

const deleteAccount = async (req, res) => {

    try {
        const userId = req.user.id;

        await Blog.deleteMany({
            createdBy: userId
        })

        await User.findByIdAndDelete({ _id: userId });

        return res.status(200).json({
            message: 'Your account has been deleted',
            error: true,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `Something went wrong. Error: ${error}`,
            success: false
        })
    }

}

const followOrUnFollowUser = async (req, res) => {

    const reqBody = req.body;
    const {userId} = reqBody;

    if(checkBasicValidation(userId)) {
        return res.status(400).json({
            error: "Required field is missing",
            success: false,
        })
    }

    if(!checkStringDataType(userId)) {
        return res.status(400).json({
            error: "Invalid Data Type",
            success: false,
        })
    }

    try {

        const loggedInUserId = req.user.id;

        const loggedInUser = await User.findById({ _id: loggedInUserId });

        const isUserAlreadyPresentInFollowings = loggedInUser.followings.find((obj) => obj.userId.valueOf() === userId);

        if(isUserAlreadyPresentInFollowings) {

            await User.findByIdAndUpdate({ _id: userId }, {
                $pull: {
                    followers: {
                        userId: loggedInUserId
                    },
                },
            });
    
            const newList = loggedInUser.followings.filter((obj) => obj.userId.valueOf() !== userId);

            loggedInUser.followings = newList;
    
            await loggedInUser.save();

            return res.status(200).json({
                message: "User Unfollowed Successfully!",
                success: true,
            })

        } else {

            await User.findByIdAndUpdate({ _id: userId }, {
                $push: {
                    followers: {
                        userId: loggedInUserId,
                        createdAt: Date.now(),
                    },
                },
            });
    
            loggedInUser.followings.push({
                userId: userId,
                createdAt: Date.now(),
            });
    
            await loggedInUser.save();

            return res.status(200).json({
                message: "User Followed Successfully!",
                success: true,
            })

        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `Something went wrong. Error: ${error}`,
            success: false
        })
    }

}

module.exports = {
    getUserDetails,
    resetUserPassword,
    deleteAccount,
    followOrUnFollowUser
}