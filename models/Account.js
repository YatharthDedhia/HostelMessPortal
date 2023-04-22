const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    meals: [{
        // type: mongoose.Schema.Types.ObjectId,
        // required: false,
        // ref: 'Meal'
        date: {
            type: String,
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
        mealType: {
            type: String,
            require: true
        }
    }],
    leaves: [{
        startDate: {
            type: String,
            required: false
        },
        endDate: {
            type: String,
            required: false
        },
        mealType: {
            type: String,
            required: false
        }
    }],
    deposits: [{
        date: {
            type: Date,
            required: false
        },
        amount: {
            type: Number,
            required: false
        }
    }, { _id: true, timestamps: true, toJSON: { virtuals: true }, id: false }],
    amount: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Account', accountSchema)