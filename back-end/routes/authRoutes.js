const express = require('express')
const auth = express.Router()
c
const {authenUser, loginUser} = require('../controllers/userController')

auth.post('/authen-new-user', authenUser)
auth.post('/check-user-login', loginUser)
module.exports = auth