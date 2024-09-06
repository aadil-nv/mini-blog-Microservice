const express = require('express')
const commentRouter = express.Router()
const commentController = require('../Controller/commentController')
const isAuthenticated =require('../MIddleware/isAuthenticated')

commentRouter.post('/add-comment',isAuthenticated,commentController.addComment)

module.exports = commentRouter