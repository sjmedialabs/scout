import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IPortfolioItem {
  title: string
  description: string
  image: string
  technologies: string[]
  category?:String
  completedDate: string
  clientName?: string
  projectUrl?: string
}

export interface ICaseStudy{
  clientCompanyName:string
  projectTitle:string
  projectDescription:string
  technologiesUsed:string[]
  budget:string
  timeline:string
  stats:[{title:string,value:string,description?:string}]
  projectSteps:[{title:string,description:string,timeline:string}]
  projectUrl?:string
}

export interface ITestimonial {
  clientName: string
  company: string
  rating: number
  text: string
  date: string
  avatar?: string
}

export interface IManualTopService {
  service?:string,
  percentage?:number
}

export interface IClients{
  client?:string,
  percentage?:number
}

export interface IProvider extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  name: string
  tagline?: string
  description: string
  logo?: string
  coverImage?: string
  location: string
  website?: string
  email: string
  salesEmail?: string
  phone?: string
  adminContactPhone?: string
  countryCode?:string
  country?:string
  services: string[]
  technologies: string[]
  industries: string[]
  clients:IClients[]
  scheduleRating?:number
  costRating?:number
  topServicesManual?:IManualTopService[]
  rating: number
  reviewCount: number
  communicationRating?:number
  ontimeDeliveryRating?:number
  qualityRating?:number
  strategicThinkingRating?:number
  ROIClarityRating?:number
  willingToReferRating?:number
  transparencyRating?:number
  flexibilityRating?:number
  valueForMoneyRating?:number
  postLaunchSupportRating?:number

  projectsCompleted: number
  hourlyRate?: string
  minProjectSize?: number
  teamSize?: string
  focusArea?:string
  foundedYear?: number
  portfolio: IPortfolioItem[]
  testimonials: ITestimonial[]
  certifications: string[]
  caseStudies: ICaseStudy[]
  // awards: string[]
  awards: {
  title: string
  imageUrl: string
}[]
  socialLinks?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  isFeatured: boolean
  isVerified: boolean
  isActive: boolean
  profileViews: number
  impressions: number
  websiteClicks: number
  createdAt: Date
  updatedAt: Date
  minAmount?:number
  minTimeLine?:String
  keyHighlights:String[]
  currentMonthProfileViews?: Number,
  lastMonthProfileViews?:Number,
  currentMonthWebsiteClicks?:Number,
  currentMonthKey?:String
}

const awardSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
})

const PortfolioItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  technologies: [{ type: String }],
  completedDate: { type: String },
  clientName: { type: String },
  category:{type:String},
  projectUrl: { type: String },
})

const CaseStudySchema = new Schema({
  clientCompanyName: { type: String, required: true },
  projectTitle: { type: String, required: true },
  projectDescription: { type: String, required: true },
  technologiesUsed: [{ type: String }],
  budget: { type: String ,required: true},
  timeline: { type: String, required: true },
  stats: [{
    title: { type: String, required: true },
    value: { type: String, required: true },
    description: { type: String }
  }],
  projectSteps: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    timeline: { type: String, required: true }
  }],
  projectUrl: { type: String }
})


const TestimonialSchema = new Schema({
  clientName: { type: String, required: true },
  company: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  date: { type: String },
  avatar: { type: String },
})

const ManualTopServiceSchema = new Schema({
  service: { type: String, },
  percentage: { type: Number, min: 0, max: 100 },
})

const ClientsSchema = new Schema({
  client: { type: String, },
  percentage: { type: Number, min: 0, max: 100 },
})

const ProviderSchema = new Schema<IProvider>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    description: { type: String, required: true },
    logo: { type: String },
    coverImage: { type: String },
    location: { type: String, required: true },
    website: { type: String },
    email: { type: String, required: true },
    focusArea:{type:String},
    salesEmail: { type: String },
    phone: { type: String },
    adminContactPhone: { type: String },
    country:{type:String},
    countryCode:{type:String},
    services: [{ type: String }],
    topServicesManual:[ManualTopServiceSchema],
    technologies: [{ type: String }],
    industries: [{ type: String }],
    clients:[ClientsSchema],
    scheduleRating: { type: Number, default: 0, min: 0, max: 5 },
    costRating: { type: Number, default: 0, min: 0, max: 5 },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    communicationRating: { type: Number, default: 0, min: 0, max: 5 },
    ontimeDeliveryRating: { type: Number, default: 0, min: 0, max: 5 },
    qualityRating: { type: Number, default: 0, min: 0, max: 5 },
    strategicThinkingRating: { type: Number, default: 0, min: 0, max: 5 },
    ROIClarityRating: { type: Number, default: 0, min: 0, max: 5 },
    willingToReferRating: { type: Number, default: 0, min: 0, max: 5 },
    transparencyRating: { type: Number, default: 0, min: 0, max: 5 },
    flexibilityRating: { type: Number, default: 0, min: 0, max: 5 },
    valueForMoneyRating: { type: Number, default: 0, min: 0, max: 5 },
    postLaunchSupportRating: { type: Number, default: 0, min: 0, max: 5 },
    

    reviewCount: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    hourlyRate: { type: String },
    minProjectSize: { type: Number,default:0 },

    teamSize: { type: String },
    foundedYear: { type: Number },
    portfolio: [PortfolioItemSchema],
    testimonials: [TestimonialSchema],
    caseStudies: [CaseStudySchema],
    certifications: [{ type: String }],
    awards: [awardSchema],
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
    },
    currentMonthProfileViews: { type: Number, default: 0 },
    lastMonthProfileViews: { type: Number, default: 0 },
    currentMonthWebsiteClicks: { type: Number, default: 0 },
    currentMonthKey: { type: String }, // "2026-01"

    isFeatured: { type: Boolean, default: true }, 
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    profileViews: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    websiteClicks: { type: Number, default: 0 },
    minAmount:{type:Number,default:0},
    minTimeLine:{type:String},
    keyHighlights:[{type:String}]
  },
  { timestamps: true },
)

ProviderSchema.index({ location: 1 })
ProviderSchema.index({ services: 1 })
ProviderSchema.index({ rating: -1 })
ProviderSchema.index({ isFeatured: 1 })
ProviderSchema.index({ userId: 1 })

const Provider: Model<IProvider> = mongoose.models.Provider || mongoose.model<IProvider>("Provider", ProviderSchema)
export default Provider
