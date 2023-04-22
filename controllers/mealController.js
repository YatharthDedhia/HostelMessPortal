const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Meal = require('../models/Meal');

const getAllMeals = catchAsyncErrors(async (req, res, next) => {
    const meals = await Meal.find({
        "date": {
            "$regex": "^[0-9]{2}/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getFullYear() + "$"
        }
    })

    res.status(200).json({
        success: true,
        meals
    })
})

const addMeal = catchAsyncErrors(async (req, res, next) => {
    const { date, item, price, amount, mealType } = req.body
    if (!date || !item || !price || !amount || !mealType) {
        return next(new errorHandler("All fields required", 400))
    }

    const meal = await Meal.create({
        date, item, price, mealType
    });

    console.log(meal);
    res.status(201).json({
        success: true,
        meal
    })
})

module.exports = {
    getAllMeals,
    addMeal
}