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

  const deposit = { amount: req.body.amount };
  const account = await Account.findOneAndUpdate(
    { "user": user._id },
    {
      $inc: { amount: req.body.amount },
      $push: { deposits: deposit },
    },
    // { new: true ,
    //     select: { _id: 0, deposits: { _id: 0 } } // exclude _id and deposits._id
    // }

  );
  console.log(account);
  // let amount1=account.amount+amount2;
  res.status(200).json({
    success: true,
    account,
  })


});
module.exports = {
  // getAllAccounts,
  depositMoney
}