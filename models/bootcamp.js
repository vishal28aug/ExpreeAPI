const mongoose = require('mongoose');

//Model
const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 char']
  },
  slug: String,
  description: {
    type: String,
    required: true
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web development',
      'Mobile development',
      'UI/UX',
      'DS'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be atleast 1'],
    max: [10, 'cannot be more than 10']
  },
  photo: {
    type: String,
    default: 'no-photo.jpg'
  }
})

module.exports = mongoose.model('Bootcamp', BootcampSchema);