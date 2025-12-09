import mongoose, { Schema, Document, Model } from "mongoose"

export interface IRequirement extends Document {
  title: string
  category: string
  budgetMin: number
  budgetMax: number
  timeline: string
  description: string
  postedDate: Date
  proposals: number
  status: "Open" | "Closed"
  createdBy: mongoose.Types.ObjectId // always client ID
}

const RequirementSchema = new Schema<IRequirement>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    timeline: { type: String, required: true },
    description: { type: String, required: true },

    postedDate: { type: Date, default: Date.now },
    proposals: { type: Number, default: 0 },

    status: { type: String, enum: ["Open", "Closed"], default: "Open" },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Requirement ||
  mongoose.model<IRequirement>("Requirement", RequirementSchema)
