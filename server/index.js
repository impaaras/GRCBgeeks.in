
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')


dotenv.config();
const cookieParser = require('cookie-parser')
const { Router } = require("express");
const fileUpload = require('express-fileupload')
const control = require('./routers/studentsRoute.js');
const {addStudent, removeStudent, getStudent, getStudentInRoom } = require('./Chat')
// const router = require('./routers/studentsRoute.js');



const PORT = process.env.PORT || 6000;
const app = express();
app.use(express.json());
app.use(control); 
// const server = http.createServer(app);
app.use(fileUpload({
    useTempFiles:true
}))
app.use(cookieParser());
app.use(bodyParser())
app.use(cors());


// chat application 
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server);
const chat = require('./routers/chatRouter')

app.use(chat)

io.on('connect', (socket) =>{
     socket.on('join', ({name,room}, callback)=>{
        const {error, student} = addStudent({id:socket.id, name, room});

        socket.emit('message', {student:'admin',  text:`${student.name} welcome to chat room ${student.room}`})
        socket.broadcast.to(student.room).emit('message', {user:'admin', text:`${student.name}, has joined!!`})
        if(error) return callback(error);
        socket.join(student.room)

        callback()
    })

    socket.on('sendMessage', (message, callback) =>{
        const student = getStudent(socket.id)

        io.to(student.room).emit('message', {student:student.name, text:message})

        callback()
    })

    socket.on("disconnect", () =>{
        const student = removeStudent(socket.id);
        if(student){
            io.to(student.room).emit('message', {student:'admin',  text:`${student.name} has left`})
        }
    })
    
} )


// Mongodb connnectionn
const URI = process.env.CONNECT__URL
mongoose.connect(URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:true
}).then(() =>{
    console.log('connection succesfull');
}).catch((err) =>{
    console.log(err.message);
})
mongoose.set('useFindAndModify', false);

// routes 
// const routes = new express.Router();
// router.get("/page", (req, res) =>{
//     res.json("hello guys")
// })

app.use('/student', require('./routers/studentsRoute'))
app.use('/teacher', require('./routers/teacherRoutes'))
// app.use(router);


app.use('/register', (req, res) =>{
    res.json({msg:"helo to everyone"});
})

// server connection
server.listen(PORT, (req,res) =>{
    console.log(`connection at ${PORT}`);
})

