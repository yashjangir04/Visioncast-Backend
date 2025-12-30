const mongoose = require('mongoose');
const video = require('./video-model');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;