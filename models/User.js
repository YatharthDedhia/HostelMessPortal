const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    stream: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Student"
    },
    idcard: {
        type: String,
        required: true
    },
    barcode: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        require: false,
        default: ""
    }
})

// Generate Barcode based on Name and ID

module.exports = mongoose.model('User', userSchema)