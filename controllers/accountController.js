const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Account = require('../models/Account');
const sendToken = require('../utils/jwttoken');
const User = require('../models/User');

const depositMoney = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ "email": req.body.email })
  if (!user)
    return next(new errorHandler(`User not found`, 400));

  console.log(user._id);
  const account1 = await Account.findOne({ "user": user._id });
  if (!account1)
    return next(new errorHandler(`Account does not exist`, 400));

  const today = new Date()
  // var date_today = String(today.getDate) + "/" + String(today.getMonth() + 1) + "/" + String(today.getFullYear());
  const deposit = { amount: req.body.amount, date: today };
  const account = await Account.findOneAndUpdate(
    { "user": user._id },
    {
      $inc: { amount: req.body.amount },
      $push: { deposits: deposit },
    }
  );

  console.log(account);
  res.status(200).json({
    success: true,
    account,
  })


});

const applyLeaves = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ "email": req.body.email });
  if (!user)
    return next(new errorHandler(`User not found`, 400));
  // console.log(user._id);

  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  // const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  // const leaveDays = Math.round((endDate.getTime() - startDate.getTime()) / oneDay) + 1;

  const leave = { startDate: req.body.startDate, endDate: req.body.endDate, mealType: req.body.mealType };
  const account = await Account.findOneAndUpdate(
    { "user": user._id },
    {
      $push: { leaves: leave },
    }
  );
  res.status(200).json({
    success: true,
    account,
  })





});

module.exports = {
  // getAllAccounts,
  depositMoney,
  applyLeaves
}