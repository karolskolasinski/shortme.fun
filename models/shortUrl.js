const mongoose = require('mongoose');
const nanoId = require('nanoid');

const shortUrlSchema = mongoose.Schema({
    full: {
        type: String,
        required: true,
    },
    short: {
        type: String,
        required: true,
        default: nanoId.nanoid(7),
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    }
});

module.exports = mongoose.model('shortUrl', shortUrlSchema);

