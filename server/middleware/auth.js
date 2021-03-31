const jwt = require('jsonwebtoken')

const auth = (req, res, next) =>{
    try {
        const token = req.header("Authorization")
        console.log(token)
        if(!token) return res.status(400).json({msg:"Invalid Authentication"})
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, student) =>{

            if(err)  return res.status(400).json({msg:"Invalid Authentication"})

            req.student = student
            next()
        })
    } catch (error) {
        return res.status(500).json({msg:error.message})
    }
}

module.exports = auth