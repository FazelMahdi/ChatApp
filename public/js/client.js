var socket = io();


socket.on('connect', () => {
    console.log('Connected to server');

    // socket.emit('createMessage', {
    //     from: "Matt",
    //     text: "client message"
    // })
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log("new message", message)

    var li = jQuery('<li></li>')
    li.text(`${message.from}: ${message.text}`)

    jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {
        jQuery('[name=message]').val('')
    })
})

var locationButton = jQuery('#send-location')
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported')
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location ...');
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitue: position.coords.longitude
        })
    }, function () {
        console.log('Unable to fetch location')
        locationButton.removeAttr('disabled').text('Send Location');
    })
})

socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>')
    var a = jQuery('<a target="_blank"> My current lcoation</a>')

    li.text(`${message.from}: `)
    a.attr('href', message.url)
    li.append(a)
    jQuery('#messages').append(li)
})
