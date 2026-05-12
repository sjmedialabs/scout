import mongoose, { Schema, models } from "mongoose"

const ApplicationSchema = new Schema(
  {
    jobTitle: String,
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    firstName: String,
    lastName: String,
    phone: String,
    altPhone: String,
    email: String,
    gender: String,
    qualification: String,
    passedOutYear: String,
    experience: String,
    resumeName: String,
    resumeUrl: String,
    coverLetterName: String,
    status: {
      type: String,
      enum: ["pending", "shortlisted", "selected", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
)

export default models.Application ||
  mongoose.model("Application", ApplicationSchema)
