const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// BoradCasting event
io.on('connection', (socket) => {
    console.log('New user Connection');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('disconnect', () => {
        console.log('User is disconnected')
    })

    socket.on('createMessage', (message) => {
        console.log("message", message)
        io.emit('newMessage', generateMessage(message.from, message.text));
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    })
})

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`server is run on port ${port}`);
})
