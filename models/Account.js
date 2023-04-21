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
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: false
        },
        mealType: {
            type: String,
            require: true
        }
    }],
    deposits: [{
        date: {
            type: Date,
            require: true
        },
        amount:{
            type:Number,
            require:trueu
        }
    }],
    amount: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Account', accountSchema)