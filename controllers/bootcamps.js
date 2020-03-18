const Bootcamp = require('../models/bootcamp');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @acess Public
exports.getBootcamps = async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({ sucess: true, count: bootcamps.length, data: bootcamps });
}

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @acess Public
exports.getBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) return res.status(404).json({ sucess: false });

  res.status(200).json({ sucess: true, data: bootcamp });
}

// @desc Create bootcamp
// @route POST /api/v1/bootcamps
// @acess Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ sucess: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ sucess: false });
  }

}

// @desc Updae  bootcamp
// @route PUT /api/v1/bootcamps/:id
// @acess Private
exports.updateBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) return res.status(400).json({ sucess: false });

  res.status(200).json({ sucess: true, data: bootcamp });
}

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @acess Private
exports.deleteBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  res.status(200).json({ sucess: true, data: {} });
}

