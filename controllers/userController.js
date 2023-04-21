const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors=require('../middleware/catchAsyncErrors');
const User=require('../models/userModel');
const sendToken=require('../utils/jwttoken');
const sendEmail=require('../utils/sendEmail');
const crypto=require("crypto");
// const getResetPasswordToken=require('../models/userModel')
//register user
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const  {name,email,password}=req.body;
    const user=await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl"
        },
    });
    sendToken(user,201,res);
});

//Login User
exports.loginUser=catchAsyncErrors(async (req,res,next)=>{
    const {email,password}=req.body;
    if(!email||!password)
    {
        return next(new errorHandler("Please Enter Email and password",400))
    }
    const user=await User.findOne({email}).select("+password");
    if(!user)
    {
        return next(new errorHandler("Invalid email or Password",401));
    }
    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched)
    {
        return next(new errorHandler("Invalid email or Password",401));
    }
   sendToken(user,200,res);
})
//Logout User
exports.logOut=catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
res.status(200).json({
    success:true,
    message:"Logged Out",
});
});
exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user)
    {
        return next(new errorHandler("User not found",404));
    }
    const resetToken=user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/ap1/v1/password/${resetToken}`;
    const message=`Your password rest token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore`;

    try{
        await sendEmail({
            email:user.email,
            subject:"Password recovery email",
            message,
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});
        return next(new errorHandler(error.message,500));
    }
})
//Reset Password
exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{
    const resetPasswordToken=crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");

  const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()},
  })

  if(!user)
    {
        return next(new errorHandler("Reset Password token is not valid or has been expired",401));
    }
    if(req.body.password!==req.body.confirmPassword)
    {
        return next(new errorHandler("Password does not match",401));
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();
    sendToken(user,200,res);


});
exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
})
exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password");
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched)
    {
        return next(new errorHandler("Old Password is Incorrect",400));
    }
    if(req.body.newPassword!==req.body.confirmPassword)
{
    return next(new errorHandler("Password does not match",400));
}
user.password=req.body.newPassword;
await user.save();
sendToken(user,200,res);
})

exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    };
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
    });
    res.status(200).json({
        success:true,
        user
    })
    

sendToken(user,200,res);
});
exports.getAllUser=catchAsyncErrors(async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success:true,
        users
    })
})
exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new errorHandler(`User does not exist with id :${req.params.id}`,400));
    }
    res.status(200).json({
        success:true,
        user,
    })
})
//Update User Role
exports.updateUserRole=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    };
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
    });
    res.status(200).json({
        success:true,
        user
    })
    

sendToken(user,200,res);
});

//Delete User

exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id)

    if(!user){
        return next(new errorHandler(`User does not exist with id :${req.params.id}`,400));
    }
    res.status(200).json({
        success:true,
        user
    })
    await user.remove();
    

sendToken(user,200,res);
});

