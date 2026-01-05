import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ICMSContent extends Document {
  _id: mongoose.Types.ObjectId
  key: string
  type: "hero" | "category" | "feature" | "testimonial" | "faq" | "page" | "setting"
  title?: string
  subtitle?: string
  description?: string
  content?: any
  image?: string
  icon?: string
  link?: string
  order: number
  isActive: boolean
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const CMSContentSchema = new Schema<ICMSContent>(
  {
    key: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["hero", "category", "feature", "testimonial", "faq", "page", "setting"],
      required: true,
    },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    content: { type: Schema.Types.Mixed },
    image: { type: String },
    icon: { type: String },
    link: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
)

CMSContentSchema.index({ key: 1 })
CMSContentSchema.index({ type: 1 })
CMSContentSchema.index({ order: 1 })

const CMSContent: Model<ICMSContent> =
  mongoose.models.CMSContent || mongoose.model<ICMSContent>("CMSContent", CMSContentSchema)
export default CMSContent
