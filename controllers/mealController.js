const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Meal = require('../models/Meal');

const getAllMeals = catchAsyncErrors(async (req, res, next) => {
    const meals = await Meal.find();
    res.status(200).json({
        success: true,
        meals
    })
})

const addMeal = catchAsyncErrors(async (req, res, next) => {
    const { date, item, price, amount, mealType } = req.body

    if (!date || !item || !price || !amount || !mealType) {x
        return next(new errorHandler("All fields required", 400))
    }
})

module.exports = {
    getAllMeals
}