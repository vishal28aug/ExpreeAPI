const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/bootcamp');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @acess Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  res.status(200).json(res.advancedResults);
});

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @acess Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

  res.status(200).json({ sucess: true, data: bootcamp });
});


// @desc Create bootcamp
// @route POST /api/v1/bootcamps
// @acess Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //Add user to req.body
  req.body.user = req.user.id;

  //Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  //If the user is not admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin')
    return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ sucess: true, data: bootcamp });

});


// @desc Updae  bootcamp
// @route PUT /api/v1/bootcamps/:id
// @acess Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));

  //Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ sucess: true, data: bootcamp });
});


// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @acess Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));

  //Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401));

  bootcamp.remove();

  res.status(200).json({ sucess: true, data: {} });
});


// @desc Upload photo
// @route PUT /api/v1/bootcamps/:id/photo
// @acess Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));

  //Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    return new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401);


  //make sure we a have file
  if (!req.files) return next(new ErrorResponse(`Please upload a file`, 400));

  const file = req.files.file;

  //Make sure the file is a photo
  if (!file.mimetype.startsWith('image')) return next(new ErrorResponse(`Please upload an image file`, 400));

  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));

  //Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) return next(new ErrorResponse(`Problem with file upload`, 500));

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
  })

  res.status(200).json({ sucess: true, data: file.name });
});

