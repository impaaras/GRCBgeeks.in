const express = require('express')
const router = express.Router()

router.get('/chat', (req, res) =>{
    res.send('server is running at ')
})

module.exports =  router