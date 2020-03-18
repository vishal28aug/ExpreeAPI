// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @acess Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ sucess: true, message: 'Show all bootcamps' });
}

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @acess Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ sucess: true, message: 'Show bootcamp' });
}

// @desc Create bootcamp
// @route POST /api/v1/bootcamps
// @acess Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ sucess: true, message: 'Post  bootcamps' });
}

// @desc Updae  bootcamp
// @route PUT /api/v1/bootcamps/:id
// @acess Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ sucess: true, message: 'Update bootcamps' });
}

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @acess Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ sucess: true, message: 'Delete bootcamps' });
}

