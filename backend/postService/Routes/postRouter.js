const express = require('express')
const postRouter = express.Router()
const postController = require('../Controller/postController')
const isAuthenticated = require('../MIddleware/isAuthenticated')



postRouter.post('/post-blog',isAuthenticated,postController.postBlog)
postRouter.get('/get-post/:id',postController.getPost)


module.exports= postRouter