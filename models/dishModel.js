const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  name: {
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


const DishModel = mongoose.model('Dish', DishSchema);

module.exports = DishModel;
