const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// @desc Register user
// @route POST /api/v1/auth/register
// @acess Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  sendTokenResponse(user, 200, res);
});

// @desc Login user
// @route POST /api/v1/auth/login
// @acess Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email & password
  if (!email || !password) return next(new ErrorResponse('Please provide an Email and Password', 400));

  //Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new ErrorResponse('Invalid credentials', 400));

  //Check if password matches
  const isMatched = await user.matchPassword(password);

  if (!isMatched) return next(new ErrorResponse('Invalid credentials', 400));

  sendTokenResponse(user, 200, res);
});


// @desc Get current logged in user
// @route POST /api/v1/auth/me
// @acess Private
exports.getMe = asyncHandler(async (req, res, next) =>{
  const user = await User.findById(req.user.id);

  res.status(200).json({
    sucess: true,
    data: user
  });
});

// @desc Log user out / clear cookie
// @route POST /api/v1/auth/logout
// @acess Private
exports.logout = asyncHandler(async (req, res, next) =>{
  res.cookie('token','none',{
    expires: new Date(Date.now() +10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    sucess: true,
    data:{}
  });
});


// @desc Update user details
// @route POST /api/v1/auth/updatedetails
// @acess Private
exports.updateDetails = asyncHandler(async (req, res, next) =>{

  const fieldToUpdate = {
    name: req.body.name,
    email:req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate,{
    new:true,
    runValidators: true
  });

  res.status(200).json({
    sucess: true,
    data: user
  });
});

// @desc Update password
// @route POST /api/v1/auth/updatepassword
// @acess Private
exports.updatepassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  //Check current password
  if(!(await user.matchPassword(req.body.currentPassword)))
    return next(new ErrorResponse('password is incorrect', 401));

user.password = req.body.newPassword;
await user.save();

sendTokenResponse(user, 200, res);
});

// @desc Reset Password
// @route PUT /api/v1/auth/resetpassword/:resettoken
// @acess Private
exports.resetPassword = asyncHandler(async (req, res, next) =>{
//Get hashed token
const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{ $gt: Date.now()}
  });

  if(!user){
    return next(new ErrorResponse('Invalid Token', 400));
  }

  //set new password
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken= undefined;

  await user.save();

  sendTokenResponse(user, 200, res);

  res.status(200).json({
    sucess: true,
    data: user
  });
});


// @desc Forgot password
// @route POST /api/v1/auth/forgotpassword
// @acess Private
exports.forgotPassword = asyncHandler(async (req, res, next) =>{
  const user = await User.findOne({email:req.body.email});

  if(!user) return next(new ErrorResponse('There is no user with that email', 404));

  //Get reset token
  const resetToken = user.getResetPasswordToken();

 await user.save({validateBeforeSave:false});

 //Create reset url
 const restUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

 const message = `You are receving this email because you (or someone else) has requested the reset of a
  password. Please make a PUT request to:\n\n ${restUrl}`;

  try{
    await sendEmail({
      email:user.email,
      subject:'Password reset token',
      message
    })

    res.status(200).json({sucess: true, data:'Email sent'});
  }catch(err){
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave: false});

    return next(new ErrorResponse('Email could not be sent', 500));

  }
  res.status(200).json({
    sucess: true,
    data: user
  });
});



//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create toke
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if(process.env.NODE_ENV === 'production'){
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      sucess: true,
      token
    });
}