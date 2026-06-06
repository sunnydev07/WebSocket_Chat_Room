const http = require('http');
const express = require('express');
const app = express();
const {Server} = require('socket.io');
const path = require('path');
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
});
server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}...`);
})
io.on("connection", (socket)=>{
    socket.on('message', ({room,msg,username})=>{
        socket.to(room).emit('new-message', {
            msg,
            username,
            time: Date.now()
        });
    })
    socket.on('join-room', (room)=>{
       socket.join(room);
    })
    socket.on('leave-room', (room)=>{
        socket.leave(room);
    })
    socket.on('typing', ({room,username})=>{
        socket.to(room).emit('user-typing', {username});
    })
    socket.on('stop-typing', ({room,username})=>{
        socket.to(room).emit('user-stop-typing', {username});
    })
    // socket.on("disconnect", ()=>{
    //     console.log("Disconnected from the Server");
    // })  
})
