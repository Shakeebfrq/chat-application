const fs = require('fs');
const express =  require("express");
const socketio = require("socket.io");
const http = require("http");
const {newUser,getIndividualUsers,formatMessage,getActiveUser} = require('./helpers/helper');

const app =  express();
const server = http.createServer(app)
const io = socketio(server);

app.use(express.static('public'));

io.on('connection',socket =>{
    socket.on('joinRoom',({username,room})=>{
        const user = newUser(socket.id,username,room);
        socket.join(room);
    });
    socket.emit("message",formatMessage('messages are limited to this group'));

    socket.broadcast.to(user.room).emit('message',formatMessage("Airtribe",`${username} has joined the room`));
    io.to(user.room).emit("roomUsers",{
        room:user.room,
        users:getIndividualUsers(user.room)
    })
    socket.on('chatMessage',msg=>{
        const user = getActiveUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })

    socket.on('disconnect',()=>{
        const user = exitUser(socket.id)
        io.to(user.room).emit('message',formatMessage('Airtribe',`${user.username} has left the room`));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getIndividualUsers(user.room)
        });
    });

});
const PORT = 8000;

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));




