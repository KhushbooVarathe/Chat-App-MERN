const express = require('express');
const path=require('path')
const dotenv=require('dotenv');
const app=express();
dotenv.config();
const chatRoute =require('./routes/chatRoute')
const userRoute =require('./routes/userRoute')
const messageRoute =require('./routes/messageRoute')
require('./config/dbConnection')
const PORT=process.env.PORT || 5000
const cors =require('cors')
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests only from this origin
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }));
  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api',userRoute)
app.use('/api',chatRoute)
app.use('/api',messageRoute)

const server =app.listen(PORT,console.log(`Server running on port ${PORT}`))
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:'http://localhost:3000',
    }
});
io.on("connection",(socket)=>{
    console.log('socket: connected successfully ');
socket.on('setup',(userData)=>{
    socket.join(userData._id)
    socket.emit("connected")
});

socket.on('join chat',(room)=>{
    socket.join(room)
    console.log("user joined room",room);
});
socket.on('typing',(room)=>{
    console.log('room: ', room);
    socket.in(room).emit('typing')
})
socket.on('stop typing',(room)=>{
    console.log('room: ', room);
    socket.in(room).emit('stop typing')
})
socket.on("new message",(newMessageRecieved)=>{
    // console.log('newMessageRecieved: ', newMessageRecieved);
    var chat=newMessageRecieved.chat;
    if(!chat.users) return console.log("chat.users not defined");

    chat.users.forEach(user=>{
        console.log('user: ', user);
        if(user.id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved",newMessageRecieved)
    })
})
})