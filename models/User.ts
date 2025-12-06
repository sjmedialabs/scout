import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  password: string
  name: string
  role: "client" | "agency" | "admin"
  company?: string
  phone?: string
  avatar?: string
  isVerified: boolean
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["client", "agency", "admin"], required: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true },
)

UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
export default User
