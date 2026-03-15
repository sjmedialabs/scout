import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IContact extends Document {
    name: string
    email: string
    company: string
    website: string
    country: string
    phone: string
    message?: string
    status: "new" | "contacted"
    createdAt: Date
    updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        company: { type: String, required: true, trim: true },
        website: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        message: { type: String, trim: true },
        status: { type: String, enum: ["new", "contacted"], default: "new" },
    },
    { timestamps: true }
)

const Contact: Model<IContact> =
mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema)

export default Contact