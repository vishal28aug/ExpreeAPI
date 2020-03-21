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

//Include other resource routes
const courseRouter = require('./course');

//Reroute into other resource routes
router.use('/:bootcampId/course',courseRouter);

router.route('/:id/photo').put(bootcampPhotoUpload);

router.route('/')
  .get(advancedResults(Bootcamp,'courses'),getBootcamps)
  .post(createBootcamp);

router.route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;