const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  positionHeld: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  jobDesc: {
    type: String,
    required: true,
  },
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the userModel
    required: true,
  }
},
{ timestamps: true }
);


const ExperienceModel = mongoose.model('Experience', ExperienceSchema);

module.exports = ExperienceModel;
