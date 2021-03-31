const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:[true, "please enter your email"],
        unique:true
    },
    course:String,
    applicationId:{
        type:Number,
        
    },
    password:{
        type:String,
        required:[true, "please enter your password"]
    }

})

module.exports = mongoose.model("student", studentSchema);

