// models/certification.model.js
import mongoose from "mongoose";

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dateAwarded: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: false }, // Array of image URLs
  chef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef", required: true },
});

const Certification = mongoose.model("Certification", CertificationSchema);
export default Certification;

