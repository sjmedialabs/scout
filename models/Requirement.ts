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
  documentUrl:string
  proposals: number
  status: "Open" | "Closed" | "shortlisted" | "negotation"
  clientId: mongoose.Types.ObjectId // always client ID
  createdAt: Date
  updatedAt: Date
}

const RequirementSchema = new Schema<IRequirement>(
  {
    title: { type: String},
    image: { type: String },
    category: { type: String},
    budgetMin: { type: Number},
    budgetMax: { type: Number},
    timeline: { type: String},
    description: { type: String },

    postedDate: { type: Date, default: Date.now },
    proposals: { type: Number, default: 0 },

    documentUrl:{type:String},

    status: { type: String, enum: ["Open", "Closed","shortlisted","negotation"], default: "Open" },

    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    
  }, 
  { timestamps: true },
)
delete mongoose.models.Requirement;
export default mongoose.model<IRequirement>("Requirement", RequirementSchema)
