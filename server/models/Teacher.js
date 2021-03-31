const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:[true, "please enter your email"],
        unique:true
    },
    department:String,
    id:Number,
    password:{
        type:String,
        required:[true, "please enter your password"]
    }

})

module.exports = mongoose.model("teacher", teacherSchema);

