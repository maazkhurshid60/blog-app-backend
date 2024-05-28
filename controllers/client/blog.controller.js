const Blog = require('../../models/blog.model');
const BlogComment = require('../../models/blog_comment.model');
const BlogCommentReply = require('../../models/blog_comment_reply.model');

const fs = require('fs');
const { checkBasicValidation, checkStringDataType } = require('../../utils/check_filed_basic_validation')

const addBlog = async (req, res) => {

    if(req.file === 'Invalid Image Format') {
        return res.status(400).json({
            error: "Invalid Image Format",
            success: false
        });
    }

    const reqBody = req.body;
    const {title, content} = reqBody;

    if(checkBasicValidation(title) ||
       checkBasicValidation(content)) {
        return res.status(400).json({
            error: "Required fields are missing",
            success: false
        });
    }

    if(!checkStringDataType(title) || !checkStringDataType(content)) {
        return res.status(400).json({
            error: "Invalid data types",
            success: false
        })
    }

    try {

        const uploadedFilePath = req.file.filename;

        const response = await Blog.create({
            title,
            content,
            imageUrl: uploadedFilePath,
            createdBy: req.user.id
        });

        return res.status(201).json({
            message: "Blog created successfully!",
            blogId: response._id,
            success: true
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "An expected error occured while creating Blog",
            success: false
        });
    }

}

const deleteBlog = async (req, res) => {

    const blogId = req.query.blogId;

    if(checkBasicValidation(blogId)) {
        return res.status(400).json({
            error: "Required field is missing",
            success: false,
        })
    }

    if(!checkStringDataType(blogId)) {
        return res.status(400).json({
            error: "Invalid data type",
            success: false,
        })
    }

    try {

        const blog = await Blog.findById(blogId);

        if(blog === null) {
            throw new Error('The Blog doesn\'t exist.')
        }

        await Blog.deleteOne({ _id: blogId });

        const blogImgPath = 'public/images/' + blog.imageUrl;

        fs.unlink(blogImgPath, (e) => {
            if(e) {
                console.log(`Error Occured While Deleteing File`)
            }
        });

        return res.status(200).json({
            message: "Blog deleted successfully!",
            success: true
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `An unexpected error occurred while deleting blog: ${error}`,
            success: false
        })
    }

}

const updateBlog = async (req, res) => {

    const reqBody = req.body;
    const {blogId, title, content} = reqBody;

    if(title !== undefined && title !== null) {
        if(!checkStringDataType(title)) {
            return res.status(400).json({
                error: "Invalid Data Type",
                success: false,
            })
        }
    }

    if(content !== undefined && content !== null) {
        if(!checkStringDataType(content)) {
            return res.status(400).json({
                error: "Invalid Data Type",
                success: false
            })
        }
    }

    if(checkBasicValidation(blogId)) {
        return res.status(400).json({
            error: "Required field is missing",
            success: false,
        })
    }

    if(!checkStringDataType(blogId)) {
        return res.status(400).json({
            error: "Invalid Data Type",
            success: false,
        })
    }

    try {

        if(req.file) {

            const oldBlog = await Blog.findById({ _id: blogId});
            const oldFilePath = oldBlog.imageUrl;
            
            const updatedFilePath = req.file.filename;
            
            await Blog.findByIdAndUpdate({
                _id : blogId
            }, {
                $set: {
                    title,
                    content,
                    imageUrl: updatedFilePath,
                }
            });
    
            fs.unlink(oldFilePath, (e) => {
                if(e) {
                    console.log(`Error Occured while deleting previous file`);
                }
            });
    
        } else {
    
            await Blog.findByIdAndUpdate({
                _id : blogId
            }, {
                $set: {
                    title,
                    content,
                }
            });
        }

        return res.status(200).json({
            message: `Blog Updated Successfully`,
            blogId: blogId,
            success: true,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `An unexpected error occurred while updating blog: ${error.message}`,
            success: false
        })
    }
}

const getBlog = async (req, res) => {

    const blogId = req.query.blogId;

    if(checkBasicValidation(blogId)) {
        return res.status(400).json({
            error: "Required field is missing",
            success: false,
        })
    }

    if(!checkStringDataType(blogId)) {
        return res.status(400).json({
            error: "Invalid Data Type",
            success: false,
        })
    }

    try {

        const blog = await Blog.findById({ _id: blogId }).populate('createdBy');

        if(!blog) {
            return res.status(404).json({
                error: "The blog doesn\'t exists.",
                success: false
            })
        }

        return res.status(200).json({
            message: "Get blog successfully",
            success: true,
            blog: blog,
        })

        
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            error: `Something went wrong. Error: ${error}`,
            success: false
        })
    }

}

const getAllBlogs = async (req, res) => {

    try {

        const blog = await Blog.find({}).populate('createdBy');

        if(!blog) {
            return res.status(404).json({
                error: "The blogs doesn\'t exists.",
                success: false
            })
        }

        return res.status(200).json({
            message: "Get All blog successfully",
            success: true,
            blog: blog,
        })

        
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            error: `Something went wrong. Error: ${error}`,
            success: false
        })
    }

}

const likeBlog = async (req, res) => {

    const reqBody = req.body;
    const {blogId} = reqBody;

    if(checkBasicValidation(blogId)) {
        return res.status(400).json({
            error: "Required field is missing",
            success: false,
        })
    }

    if(!checkStringDataType(blogId)) {
        return res.status(400).json({
            error: "Invalid Data Type",
            success: false,
        })
    }

    try {

        const blog = await Blog.findById({ _id: blogId });

        const isUserPresent = blog.likes.find((id) => id.valueOf() === req.user.id);

        //Functionality to check if there is a dislike already present, if present then first remove the dislike and then like
        const isDislikePresentAlready = blog.disLikes.find((id) => id.valueOf() === req.user.id);

        if(isDislikePresentAlready !== undefined) {
            await Blog.findByIdAndUpdate({ _id: blogId }, {
                $pull: { disLikes: req.user.id },
            })
        }

        if(isUserPresent !== undefined) {
            await Blog.findByIdAndUpdate({ _id: blogId }, {
                $pull: {
                    likes: req.user.id
                }
            });

            return res.status(200).json({
                message: "Blog Like Toggled to UnLike Successfully!",
                success: true,
            })
        } else {
            await Blog.findByIdAndUpdate({ _id: blogId }, {
                $push: {
                    likes: req.user.id
                }
            });
            return res.status(200).json({
                message: "Blog Like Toggled to Like Successfully!",
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

const dislikeBlog = async (req, res) => {

    const reqBody = req.body;
    const {blogId} = reqBody;

    if(checkBasicValidation(blogId)) {
        return res.status(400).json({
            error: "Required field is missing",
            success: false,
        })
    }

    if(!checkStringDataType(blogId)) {
        return res.status(400).json({
            error: "Invalid Data Type",
            success: false,
        })
    }

    try {

        const blog = await Blog.findById({ _id: blogId });

        const isUserPresent = blog.disLikes.find((id) => id.valueOf() === req.user.id);

        //Functionality to check if there is a dislike already present, if present then first remove the dislike and then like
        const islikePresentAlready = blog.likes.find((id) => id.valueOf() === req.user.id);

        if(islikePresentAlready !== undefined) {
            await Blog.findByIdAndUpdate({ _id: blogId }, {
                $pull: { likes: req.user.id },
            })
        }

        if(isUserPresent !== undefined) {
            await Blog.findByIdAndUpdate({ _id: blogId }, {
                $pull: {
                    disLikes: req.user.id
                }
            });

            return res.status(200).json({
                message: "Blog DisLike Toggled to dis-UnLike Successfully!",
                success: true,
            })
        } else {
            await Blog.findByIdAndUpdate({ _id: blogId }, {
                $push: {
                    disLikes: req.user.id
                }
            });
            return res.status(200).json({
                message: "Blog DisLike Toggled to disLike Successfully!",
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

const addCommentOnBlog = async (req, res) => {

    const reqBody = req.body;
    const { blogId, comment } = reqBody;

    if(checkBasicValidation(blogId) ||
       checkBasicValidation(comment)) {
        return res.status(400).json({
            error: "Required fields are missing",
            success: false
        });
    }

    if(!checkStringDataType(blogId) || 
       !checkStringDataType(comment)) {
        return res.status(400).json({
            error: "Invalid data types",
            success: false
        })
    }

    try {

        const userId = req.user.id;

        const blogcomment = await BlogComment.create({
            comment: comment,
            blogId: blogId,
            createdBy: userId,
        });

        await Blog.findByIdAndUpdate({ _id: blogId }, {
            $push: {
                comments: blogcomment._id
            }
        })

        return res.status(201).json({
            message:`Blog Comment Id:${blogcomment._id} has been created successfully!`,
            success:true,
            comment: blogcomment,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `Something went wrong. Error ${error}`,
            success: false,
        })
    }

}

const addReplyOnBlogComment = async (req, res) => {
    const reqBody = req.body;
    const { reply, blogCommentId } = reqBody;


    if(checkBasicValidation(reply) ||
       checkBasicValidation(blogCommentId)) {
        return res.status(400).json({
            error: "Required fields are missing",
            success: false
        });
    }

    if(!checkStringDataType(reply) || 
       !checkStringDataType(blogCommentId)) {
        return res.status(400).json({
            error: "Invalid data types",
            success: false
        })
    }

    try {

        const userId = req.user.id;

        const blogCommentReply = await BlogCommentReply.create({
            reply: reply,
            blogCommentId: blogCommentId,
            createdBy: userId
        });

        await BlogComment.findByIdAndUpdate({ _id: blogCommentId }, {
            $push: {
                replies: blogCommentReply._id
            }
        });

        return res.status(201).json({
            message: "Reply created successfully!",
            success: true,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `Something went wrong. Error ${error}`,
            success: false,
        });
    }


}

const likeBlogComment = async (req, res) => {
    
    const reqBody = req.body;
    const { blogCommentId } = reqBody;

    try {

        const userId = req.user.id;

        const blogComment = await BlogComment.findById({ _id: blogCommentId });

        const isUserIdAlreadyPresent = blogComment.likes.find((id) => id.valueOf() === userId);

        if(isUserIdAlreadyPresent === undefined) {

            blogComment.likes.push(userId);

            await blogComment.save();

            return res.status(200).json({
                message: "Blog Comment Like Successfully!",
                success: true,
            })

        } else {

            blogComment.likes.pull(userId);

            await blogComment.save();

            return res.status(200).json({
                message: "Blog Comment Un-Like Successfully!",
                success: true,
            })

        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `Something went wrong. Error ${error}`,
            success: false,
        })
    }

}

const getAllBlogComments = async (req, res) => {

    const blogId = req.query.blogId;

    try {

        const comments = await BlogComment.find({ blogId: blogId }).populate(['createdBy', 'replies']);

        if(comments !== undefined) {
            return res.status(200).json({
                message: "Get all blog comments successfully",
                success: true,
                comments: comments,
            })
        } else {
            return res.status(200).json({
                message: "Get all blog comments successfully",
                success: true,
                comments: [],
            })
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `Something went wrong. Error ${error}`,
            success: false,
        })
    }

}

module.exports = {
    addBlog,
    deleteBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    likeBlog,
    dislikeBlog,
    addCommentOnBlog,
    addReplyOnBlogComment,
    likeBlogComment,
    getAllBlogComments
}