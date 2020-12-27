const mongoose = require('mongoose')


let UrlShortenerSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    fullUrl: {
        type: String,
        required: true
    }, 
    urlCode: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('UrlShortenerModel', UrlShortenerSchema)