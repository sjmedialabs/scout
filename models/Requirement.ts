import mongoose, { Schema, Document, Model } from "mongoose"

export interface IRequirement extends Document {
  title: string
  image: string
  category: string
  budgetMin: number
  budgetMax: number
  timeline: string
  description: string
  postedDate: Date
  proposals: number
  status: "Open" | "Closed"
  createdBy: mongoose.Types.ObjectId // always client ID
  createdAt: Date
  updatedAt: Date
}

const RequirementSchema = new Schema<IRequirement>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
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
delete mongoose.models.Requirement;
export default mongoose.model<IRequirement>("Requirement", RequirementSchema)
