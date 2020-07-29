var socket = io();

function scrollFunction() {

    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    // Height
    var clinetHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clinetHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}
socket.on('connect', () => {
    console.log('Connected to server');

    var params = jQuery.deparam(window.location.search)
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('no error')
        }
    })
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>');
    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user))
    });
    jQuery('#users').html(ol);
})
socket.on('newMessage', (message) => {
    var fromatedTime = moment(message.createdAt).format('hh:mm a');

    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: fromatedTime
    })

    jQuery('#messages').append(html);
    scrollFunction();
})

socket.on('newLocationMessage', function (message) {
    var fromatedTime = moment(message.createdAt).format('hh:mm a');

    var template = jQuery('#location-message-form').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: fromatedTime
    })

    jQuery('#messages').append(html);
    scrollFunction();

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

