const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user Connection');

    socket.broadcast.emit('newMessage', {
        from: "Fazel",
        text: "Test Messsage",
        createAt: 1235
    })

    socket.on('disconnect', () => {
        console.log('User is disconnected')
    })

    socket.on('createMessage', (message) => {
        console.log("message", message)
    })
})

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`server is run on port ${port}`);
})
