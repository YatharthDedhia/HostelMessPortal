const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Account = require('../models/Account');
const sendToken = require('../utils/jwttoken');

const getAllAccounts = catchAsyncErrors(async (req, res, next) => {

});

module.exports = {
    getAllAccounts
}