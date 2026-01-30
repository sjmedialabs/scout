import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ICMSContent extends Document {
  _id: mongoose.Types.ObjectId
  key?: string
  type?: "hero" | "category" | "feature" | "testimonial" | "faq" | "page" | "setting"
  title?: string
  subtitle?: string
  description?: string
  content?: any
  image?: string
  icon?: string
  link?: string
  order?: number
  isActive?: boolean
  metadata?: Record<string, any>
  // Fields for main CMS content management
  homeBannerImg?: string
  homeBannerTitle?: string
  homeBannerSubtitle?: string
  homeWorkSection?: Array<{ title: string; description: string; image: string }>
  homeServicesCategories?: string[]
  getStartedTitle?: string
  getStartedSubtitle?: string
  aboutBannerImage?: string
  aboutBannerTitle?: string
  aboutBannerSubtitle?: string
  aboutDescription1?: string
  aboutDescription2?: string
  aboutPoints?: string[]
  aboutSideImage?: string
  aboutVisionCard?: Array<{ icon: string; title: string; description: string }>
  aboutStats?: Array<{ value: string; text: string; imageUrl?: string }>
  aboutValuesTitle?: string
  aboutValues?: Array<{ title: string; description: string; imageUrl?: string }>
  aboutTeamTitle?: string
  aboutTeamSubtitle?: string
  aboutTeam?: Array<{ image: string; name: string; role: string }>
  contact?: {
    email?: string
    phone?: string
    address?: string
    locationMapUrl?: string
    facebookUrl?: string
    linkedinUrl?: string
    twitterUrl?: string
    youtubeUrl?: string
  }
  createdAt: Date
  updatedAt: Date
}

const CMSContentSchema = new Schema<ICMSContent>(
  {
    key: { type: String },
    type: {
      type: String,
      enum: ["hero", "category", "feature", "testimonial", "faq", "page", "setting"],
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
    // Fields for main CMS content management
    homeBannerImg: { type: String },
    homeBannerTitle: { type: String },
    homeBannerSubtitle: { type: String },
    homeWorkSection: { type: [{ title: String, description: String, image: String }], default: [] },
    homeServicesCategories: { type: [String], default: [] },
    getStartedTitle: { type: String },
    getStartedSubtitle: { type: String },
    aboutBannerImage: { type: String },
    aboutBannerTitle: { type: String },
    aboutBannerSubtitle: { type: String },
    aboutDescription1: { type: String },
    aboutDescription2: { type: String },
    aboutPoints: { type: [String], default: [] },
    aboutSideImage: { type: String },
    aboutVisionCard: { type: [{ icon: String, title: String, description: String }], default: [] },
    aboutStats: { type: [{ value: String, text: String, imageUrl: String }], default: [] },
    aboutValuesTitle: { type: String },
    aboutValues: { type: [{ title: String, description: String, imageUrl: String }], default: [] },
    aboutTeamTitle: { type: String },
    aboutTeamSubtitle: { type: String },
    aboutTeam: { type: [{ image: String, name: String, role: String }], default: [] },
    contact: {
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      locationMapUrl: { type: String },
      facebookUrl: { type: String },
      linkedinUrl: { type: String },
      twitterUrl: { type: String },
      youtubeUrl: { type: String }
    },
  },
  { timestamps: true },
)

CMSContentSchema.index({ key: 1 }, { partialFilterExpression: { key: { $exists: true } } })
CMSContentSchema.index({ type: 1 }, { partialFilterExpression: { type: { $exists: true } } })
CMSContentSchema.index({ order: 1 })

const CMSContent: Model<ICMSContent> =
  mongoose.models.CMSContent || mongoose.model<ICMSContent>("CMSContent", CMSContentSchema)
export default CMSContent
