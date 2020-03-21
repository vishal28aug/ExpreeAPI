const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/course');

// @desc Get all Course
// @route GET /api/v1/Courses
// @acess Public
exports.getCourses = asyncHandler(async (req, res, next) => {
 
    let query;
//Populate will populate another collection values
    if(req.params.bootcampId){
      const courses =  Course.find({bootcamp: req.params.bootcampId})

      return res.status(200).json({sucess:true , count: courses.length , data : courses});
    }else{
       res.status(200).json(res.advancedResults);
    }

});

// @desc Get single Course
// @route GET /api/v1/Courses/:id
// @acess Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));

  res.status(200).json({ sucess: true, data: course });
});

// @desc Create Course
// @route POST /api/v1/Courses
// @acess Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.create(req.body);
  res.status(201).json({ sucess: true, data: course });

});

// @desc Updae  Course
// @route PUT /api/v1/Courses/:id
// @acess Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!course) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));

  res.status(200).json({ sucess: true, data: course });
});

// @desc Delete Course
// @route DELETE /api/v1/Courses/:id
// @acess Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));

  res.status(200).json({ sucess: true, data: {} });
});

