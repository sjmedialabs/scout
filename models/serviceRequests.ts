import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IServiceRequest extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  mainCategory: string
  subCategory: string
  childCategory: string
  description: string
  status: "pending" | "rejected" | "accepted"
  reason?: string
  createdAt: Date
  updatedAt: Date
}

const ServiceRequestSchema = new Schema<IServiceRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mainCategory: { type: String, required: true },
    subCategory: { type: String, required: true },
    childCategory: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
    reason: { type: String },
  },
  { timestamps: true }
)

//  Safe model creation (Fixes OverwriteModelError)

const ServiceRequest: Model<IServiceRequest> =
  mongoose.models.ServiceRequest ||
  mongoose.model<IServiceRequest>(
    "ServiceRequest",
    ServiceRequestSchema
  )

export default ServiceRequest