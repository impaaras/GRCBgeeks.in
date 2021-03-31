const Student = require('../models/Students')

const authAdmin =  async (req, res, next) => {
    try {
        const student = await Student.findOne({_id:req.student.id})
        if(student.role != 1)
          return res.status(500).json({msg:"Admin resources access denied"})

          next()

    } catch (error) {
        return res.status(500).json({msg:error.message})
    }
}

module.exports = authAdmin