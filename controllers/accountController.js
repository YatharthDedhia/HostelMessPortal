const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Account = require('../models/Account');
const sendToken = require('../utils/jwttoken');
const User = require('../models/User');

const depositMoney=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findOne({"email":req.body.email})
    const account1=await Account.findOne({"user":user._id});
    const deposit = { amount: req.body.amount };
    const account = await Account.findOneAndUpdate(
        { "user": user._id },
        {
          $inc: { amount: req.body.amount },
          $push: { deposits: deposit },
        },
        { new: true ,
            // select: { _id: 0, deposits: { _id: 0 } } // exclude _id and deposits._id
        }
        
      );
    console.log(account);
    // let amount1=account.amount+amount2;
    res.status(200).json({
        success:true,
        account,
    })
    
    
});
const applyLeaves = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ "email": req.body.email });

  console.log(user._id);

  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  const leaveDays = Math.round((endDate.getTime() - startDate.getTime()) / oneDay) + 1;

  const leave = { startDate: req.body.startDate ,endDate:req.body.endDate,mealType:req.body.mealType };
  const account = await Account.findOneAndUpdate(
    { "user": user._id },
    {
      $push: { leaves: leave },
    },
    { new: true ,
        select: { _id: 0, deposits: { _id: 0 } } // exclude _id and deposits._id
    }
    
  );
  res.status(200).json({
    success:true,
    account,
})



  

});
module.exports = {
    // getAllAccounts,
    depositMoney,
    applyLeaves
}