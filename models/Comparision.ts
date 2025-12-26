import mongoose, { Schema, Document, Model } from "mongoose"
export interface IComparision extends Document {
    clientId: mongoose.Types.ObjectId
    agencyId: mongoose.Types.ObjectId
    projectId: mongoose.Types.ObjectId
    proposalId: mongoose.Types.ObjectId
}
const ComparisionSchema = new Schema<IComparision>({
    clientId: { type: Schema.Types.ObjectId, ref: "Seeker", required: true },
    agencyId: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Requirement", required: true },
    proposalId: { type: Schema.Types.ObjectId, ref: "Proposal", required: true },

}, { timestamps: true })

export default mongoose.models.Comparision || mongoose.model<IComparision>("Comparision", ComparisionSchema)

