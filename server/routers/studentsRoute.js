const studentControl = require('../controller/studentControl')
const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const authAdmin = require('../middleware/authAdmin');


router.post('/register', studentControl.register)
router.post('/studentslogin', studentControl.login)
router.post('/refresh_token', studentControl.getAccessToken)
router.post('/forgot', studentControl.forgetPassword)
router.post('/reset', auth, studentControl.resetPassword)
router.get('/info', auth, studentControl.getUserInfo)
router.get('/AllInfo', auth, authAdmin, studentControl.getUserAllInfo)
router.get('/logout', studentControl.logOut)
router.delete('/delete/:id', studentControl.deleteStudent)



module.exports = router;