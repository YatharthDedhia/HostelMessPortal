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
            required: false
        },
        endDate: {
            type: Date,
            required: false
        },
        mealType: {
            type: String,
            require: false
        }
    }],
    deposits: [{
        date: {
            type: Date,
            require: false
        },
        amount:{
            type:Number,
            require:false
        }
    }],
    amount: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Account', accountSchema)