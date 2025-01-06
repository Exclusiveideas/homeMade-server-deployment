import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    service: { type: String, required: true },
    specialRequests: { type: String, default: "" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
