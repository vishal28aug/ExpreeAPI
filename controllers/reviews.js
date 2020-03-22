const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/bootcamp');


// @desc Get all reviews
// @route GET /api/v1/reviwes
// @route GET /api/v1/bootcamp/:bootcampId/reviwes
// @acess Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp: req.params.bootcampId});    
    res.status(200).json({
        sucess:true,
        count:reviews.length,
        data:reviews
    });
} else{
    res.status(200).json(res.advancedResults);
}
});


// @desc Get Single reviews
// @route GET /api/v1/reviews/:id
// @acess Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    });

    if(!review) return next(new ErrorResponse(`No review found with id of ${req.params.id}`,404));

    res.status(200).json({ sucess: true, data: review });
});


// @desc Add review
// @route POST /api/v1/bootcamps/"bootcampId/review"
// @acess Priavte
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp) return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`,404));

    const review = await Review.create(req.body);

    res.status(201).json({ sucess: true, data: review });
});


// @desc Update Review
// @route PUT /api/v1/review/:id
// @acess Priavte
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    if(!review) return next(new ErrorResponse(`No review with the id of ${req.params.id}`,404));

    //Make sure review belongs to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin')
        return next(new ErrorResponse('Not authroize to update the review',401));
    
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({ sucess: true, data: review });
});


// @desc Delete Review
// @route DELETE /api/v1/review/:id
// @acess Priavte
exports.deleteUser = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);

    if(!review) return next(new ErrorResponse(`No review with the id of ${req.params.id}`,404));

    //Make sure review belongs to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin')
        return next(new ErrorResponse('Not authroize to delete the review',401));

    await Review.findByIdAndDelete(req.params.id);

    res.status(201).json({ sucess: true, data: {} });
});
