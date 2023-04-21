const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    meals: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Meal'
    }],
    leaves: [{
        date: {
            type: Date,
            required: true
        },
        mealType: {
            type: String,
            require: true
        }
    }],
    amount: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Account', accountSchema)