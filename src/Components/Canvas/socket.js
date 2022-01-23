const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log("A user has joined the room");
    
    socket.on('disconnect', () => {
        console.log("A user has left the room");
    });

    socket.on('newObject', (object) => {
        socket.broadcast.emit('addObject', object);
    });

    socket.on('newModification', (object) => {
        socket.broadcast.emit('modifyObject', object);
    });
});
server.listen(8080, () => {
    console.log('listening on *:8080');
});

