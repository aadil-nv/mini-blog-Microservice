const express = require('express')
const userRouter = express.Router()
const userController = require('../Controller/userController')


userRouter.post('/register-user',userController.registerUser)
userRouter.get('/login-user',userController.loginUser)
userRouter.get('/user-profile/:id',userController.getUserProfile)


module.exports = userRouter