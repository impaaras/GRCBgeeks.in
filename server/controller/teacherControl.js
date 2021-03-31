const teacher = require('../models/Students');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// module.exports  = {
    const teacherControl = {
        register: async (req, res) =>{
            try {
                const {name, email, department, id, password} = req.body
    
                if(!name || !email || !department || !id || !password) 
                    return res.status(400).json({msg:"please fill all the filled"});
                if(!validateEmail(email))
                     return res.status(400).json({msg:"Invalid email."})
               const user = await Teacher.findOne({email})
                  if(user) return res.status(400).json({msg:"This is email is already exists"})
    
               if(password.length < 6)
                 return res.status(400).json({msg:"password must be at least 6 and above characters"})
                const passwordHash = await bcrypt.hash(password, 12)
               const newTeacher = new Teacher ({
                name, email, department, id, password : passwordHash
              })
               await newTeacher.save()
    
                return res.json({msg:"Register successfull"})
            } catch (error) {
                return res.status(500).json({msg:error.message});
            }
        },
        login:async (req, res) =>
        {
            try {
                const {email, password} = req.body
                const teacher = await Teacher.findOne({email})
                if(!teacher) return res.status(400).json({msg:"This email does not exist"})
    
                // const isMatch = await bcrypt.compare(password, student.password)
                // if(!isMatch) return res.status(400).json({msg:"Password is incorrect"})
    
                const refresh_token = createRefreshToken({id:teacher._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly:true,
                    path:'/teacher/refresh_token',
                    maxAge:7*24*60*60*1000
                })
                res.json({msg:"Login successfull", teacher})
    
            } catch (error) {
                return res.status(500).json({msg:error.message})
            }
        },
        getAccessToken: (req, res) =>{
            try {
                const rf_token = req.cookies.refreshtoken
                console.log({rf_token})
                if(!rf_token) return res.status(400).json({msg:"Please login now!"})
                jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, student) =>{
                    if(err) return res.status(400).json({msg:"please login now!"})
    
                    const access_token = createAccessToken({id:student._id})
                     res.json({access_token})
                })
            } catch (error) {
                return res.status(500).json({msg:error.message})
            }
        },
        forgetPassword: async (req, res) =>{
            try {
                const {email, password} = req.body
                const teacher = await Teacher.findOne({email})
                if(!student) return res.status(500).json({msg:"This email does not exist"})
    
                const access_token = createAccessToken({id:teacher._id})
                const url = `${CLIENT}/student/reset/${access_token}`
                    res.json({msg:'Your password will be reset'})
            } catch (error) {
                return res.status(500).json({msg:error.message})
            }
        },
        resetPassword: async (req, res) =>{
           try {
               const {email, password} = req.body
               const passwordHash = await bcrypt.hash(password, 12)
               console.log(req.student)
               await Teacher.findOneAndUpdate({_id:req.student.id}, {
                   password:passwordHash
               })
               return res.json({refresh_token})
    
               res.json({msg:"Password successfull changed!"})
           } catch (error) {
               res.status(500).json({msg:error.message})
           }
        },
        getUserInfo: async (req, res) =>{
            try {
                const teacher = await Teacher.findById(req.student.id).select("-password")
    
                res.json({teacher})
            } catch (error) {
                return res.status(500).json({msg:error.message})
            }
        },
        getUserAllInfo: async (req, res) =>{
            try {
                const teacher = await Teacher.find().select("-password")
    
                res.json(teacher)
            } catch (error) {
                return res.status(500).json({msg:error.message})
            }
        },
        logOut: async (req, res) =>{
            try {
                res.clearCookie('refreshtoken', {path:'/student/refresh_token'})
    
                return res.json({msg:"Logged Out"})
            } catch (error) {
                return res.status(500).json({msg:error.message})
            }
        },
        deleteStudent: async (req, res) =>{
            try {
                await Teacher.findByIdAndDelete(req.params.id)
    
                res.json({msg:"Deleted Success!"})
            } catch (error) {
                return res.status(500).json({msg:error.message})
            }
        }
    }
    
    
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }
    
    const createActivationToken  = (payload) =>{
        return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn:'5m'})
    } 
    const createAccessToken  = (payload) =>{
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'5m'})
    } 
    const createRefreshToken  = (payload) =>{
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'7d'})
    } 
    

module.exports = teacherControl;