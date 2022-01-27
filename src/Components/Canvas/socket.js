const {
    userJoin,
    getCurrentUser,
    userLeave
} = require('./SocketUsers');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {

    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        console.log(user.username + " joined " + user.room);
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            console.log(user.username + " has left " + user.room);
        }
    });

    socket.on('newMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        if (user) socket.broadcast.to(user.room).emit('addMessage', msg);
    });

    socket.on('requestCanvasClear', () => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('clearCanvas');
    })

    socket.on('newObject', (object) => {
        const user = getCurrentUser(socket.id);
        socket.broadcast.to(user.room).emit('addObject', object);
    });

    socket.on('newModification', (object) => {
        const user = getCurrentUser(socket.id);
        socket.broadcast.to(user.room).emit('modifyObject', object);
    });
});
server.listen(8080, () => {
    console.log('listening on *:8080');
});

