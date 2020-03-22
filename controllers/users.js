const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');


// @desc Get all users
// @route GET /api/v1/auth/users
// @acess Priavte/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


// @desc Get Single users
// @route GET /api/v1/auth/users/:id
// @acess Priavte/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({ sucess: true, data: user });
});


// @desc Create User
// @route POST /api/v1/auth/users/
// @acess Priavte/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({ sucess: true, data: user });
});


// @desc Update User
// @route PUT /api/v1/auth/users/:id
// @acess Priavte/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({ sucess: true, data: user });
});


// @desc Delete User
// @route DELETE /api/v1/auth/users/:id
// @acess Priavte/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)

    res.status(201).json({ sucess: true, data: {} });
});