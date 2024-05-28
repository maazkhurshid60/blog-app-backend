const express = require('express');

const {
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
} = require('../../controllers/client/blog.controller');

const upload = require('../../services/fileupload.service');

const router = express.Router();

//Client Side Routes will be defined here

//Client Blog related routes
router.post('/blog/add-blog', upload.single('image'), addBlog);

router.delete('/blog/delete-blog', deleteBlog);

router.patch('/blog/update-blog', upload.single('image'), updateBlog);

router.get('/blog/get-blog', getBlog);

router.get('/blog/get-all-blogs', getAllBlogs);

router.patch('/blog/like', likeBlog);

router.patch('/blog/dislike', dislikeBlog);

router.post('/blog/add-comment', addCommentOnBlog);

router.post('/blog/add-comment-reply', addReplyOnBlogComment);

router.patch('/blog/like-blog-comment', likeBlogComment);

router.get('/blog/get-all-blog-comments', getAllBlogComments);

module.exports = router;