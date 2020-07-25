var moment = require('moment')


var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
}
var generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `http://www.google.com/map?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
}

module.exports = { generateMessage, generateLocationMessage }