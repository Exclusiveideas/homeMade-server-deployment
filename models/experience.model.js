// models/experience.model.js
import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  positionHeld: { type: String, required: true },
  companyName: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  jobDesc: { type: String, required: true },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef", required: true },
});

const Experience = mongoose.model("Experience", ExperienceSchema);
export default Experience;

