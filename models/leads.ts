

import mongoose, { Schema, Document } from "mongoose"

export interface ILead extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  email: string
  contactNumber: string
  countryCode: string
  country: string
  message: string
  status: "pending" | "contacted" | "won" |"dropped"
  projectTitle?: string
  category?: string
  description?: string
  minbudget?: string
  maxbudget?: string
  timeline?: string
  attachmentUrls?: string[]
}

const LeadSchema = new Schema<ILead>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    countryCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending" , "contacted" , "won" ,"dropped"],
      default: "pending",
    },

    // 🔹 Newly Added Fields
    projectTitle: {
      type: String,
    
      trim: true,
    },
    category: {
      type: String,
      
      trim: true,
    },
    description: {
      type: String,
      
      trim: true,
    },
    minbudget: {
      type: String,
      
      trim: true,
    },
    maxbudget: {
      type: String,
      
      trim: true,
    },
    timeline: {
      type: String,
    
      trim: true,
    },
    attachmentUrls: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

export default mongoose.models.Lead ||
  mongoose.model<ILead>("Lead", LeadSchema)