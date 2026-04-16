// models/FreeTrialConfig.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFreeTrialConfig extends Document {
  proposalLimit: number;
  caseStudiesCount: number;
  price:number;
  description?:string;
  features?:string[];
  isActive?:boolean;
}

const FreeTrialConfigSchema = new Schema<IFreeTrialConfig>(
  {
    proposalLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    caseStudiesCount: {
      type: Number,
      required: true,
      min: 0,
    },
    price:{
      type:Number,
      default:0,
    },
    description:{
      type:String,
      default:""
    },
    features:{
      type:[String],
      default:[],
    }
    ,
    isActive: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

export default mongoose.models.FreeTrialConfig ||
  mongoose.model<IFreeTrialConfig>("FreeTrialConfig", FreeTrialConfigSchema);
