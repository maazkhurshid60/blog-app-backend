const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    reply: {
        type: String,
        required: true,
    },
    blogCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogComment",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

const BlogCommentReply = mongoose.model('BlogCommentReply', replySchema);

module.exports = BlogCommentReply;