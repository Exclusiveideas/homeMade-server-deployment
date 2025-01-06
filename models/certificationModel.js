const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateAwarded: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of URLs
    default: [],
  },
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the userModel
    required: true,
  }
},
{ timestamps: true }
);


const CertificationModel = mongoose.model('Certification', CertificationSchema);

module.exports = CertificationModel;
