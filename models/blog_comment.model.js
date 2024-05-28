const mongoose = require('mongoose');

const blogCommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BlogCommentReply'
        }
    ]
}, {timestamps: true});

const BlogComment = mongoose.models.blogcomments || mongoose.model('BlogComment', blogCommentSchema);

module.exports = BlogComment;