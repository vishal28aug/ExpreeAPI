const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteUser
} = require('../controllers/reviews');
const Review = require('../models/Review');

const router = express.Router({mergeParams:true});

const advancedResults = require('../middleware/advancedResult')
const {protect, authorize} = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));


router.route('/')
.get(advancedResults(Review, {
    path:'bootcamp',
    select:'name description'
}),getReviews)
.post(protect, authorize('user','admin'),addReview);

router.route('/:id')
.get(getReview)
.put(protect, authorize('user','admin'),updateReview) 
.delete(protect, authorize('user','admin'),deleteUser);


module.exports = router;