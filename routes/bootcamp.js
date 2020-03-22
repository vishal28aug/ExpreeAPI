const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');
const advancedResults = require('../middleware/advancedResult')
const Bootcamp = require('../models/bootcamp');
const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

//Include other resource routes
const courseRouter = require('./course');
const reviewRouter = require('./review');

//Reroute into other resource routes
router.use('/:bootcampId/course',courseRouter);
router.use('/:bootcampId/reviews',reviewRouter);


router.route('/:id/photo').put(protect,authorize('publisher','admin'), bootcampPhotoUpload);

router.route('/')
  .get(advancedResults(Bootcamp,'courses'),getBootcamps)
  .post(protect,authorize('publisher','admin'), createBootcamp);

router.route('/:id')
  .get(getBootcamp)
  .put(protect,authorize('publisher','admin'),updateBootcamp)
  .delete(protect, authorize('publisher','admin'),deleteBootcamp);

module.exports = router;