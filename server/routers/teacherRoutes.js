const routes = require('express').Router()
const teacherRegister = require('../controller/teacherControl')
const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const authAdmin = require('../middleware/authAdmin');

routes.post('/teacherRegister', teacherRegister.register)
// routes.post('/register', teacherRegister.register)
routes.post('/teacherlogin', teacherRegister.login)
routes.post('/refresh_token', teacherRegister.getAccessToken)
routes.post('/forgot', teacherRegister.forgetPassword)
routes.post('/reset', auth, teacherRegister.resetPassword)
routes.get('/info', auth, teacherRegister.getUserInfo)
routes.get('/AllInfo', auth, authAdmin, teacherRegister.getUserAllInfo)
routes.get('/logout', teacherRegister.logOut)
routes.delete('/delete/:id', teacherRegister.deleteStudent)



module.exports = routes;