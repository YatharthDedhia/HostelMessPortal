const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Meal = require('../models/Meal');
const sendToken = require('../utils/jwttoken');

const getAllMeals = catchAsyncErrors(async (req, res, next) => {

});

module.exports = {
    getAllMeals
}