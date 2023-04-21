const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema({
    date: {
        type: Date,
        require: true
    },
    item: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    mealType: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Meal', mealSchema)