var socket = io();


socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('createMessage', {
        from: "Matt",
        text: "client message"
    })
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log("new message", message)
})