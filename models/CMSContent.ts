import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICMSContent extends Document {
  homeBannerImg: string;
  homeBannerTitle: string;
  homeBannerSubtitle?: string;

  homeWorkSection: { title: string; description: string }[];

  homeServicesCategories: string[];

  getStartedTitle: string;
  getStartedSubtitle?: string;

  aboutBannerImage: string;
  aboutBannerTitle: string;
  aboutBannerSubtitle?: string;
  aboutDescription1?: string;
  aboutDescription2?: string;

  aboutPoints: string[];
  aboutVisionCard: { icon: string; title: string; description: string }[];
  aboutStats: { value: string; text: string }[];

  aboutTeamTitle: string;
  aboutTeamSubtitle?: string;
  aboutTeam: { image: string; name: string; role: string }[];

  aboutValuesTitle: string;
  aboutValues: { title: string; description: string }[];

  commonBgImage: string;

  contact: {
    email: string;
    phone: string;
    address: string;
    locationMapUrl?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    youtubeUrl?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const CMSSchema = new Schema<ICMSContent>(
  {
    homeBannerImg: String,
    homeBannerTitle: String,
    homeBannerSubtitle: String,

    homeWorkSection: [
      { title: String, description: String, image: String }
    ],

    homeServicesCategories: [String],

    getStartedTitle: String,
    getStartedSubtitle: String,

    aboutBannerImage: String,
    aboutBannerTitle: String,
    aboutBannerSubtitle: String,
    aboutDescription1: String,
    aboutDescription2: String,

    aboutPoints: [String],

    aboutVisionCard: [
      { icon: String, title: String, description: String }
    ],

    aboutStats: [
      { value: String, text: String }
    ],

    aboutTeamTitle: String,
    aboutTeamSubtitle: String,

    aboutTeam: [
      { image: String, name: String, role: String }
    ],

    aboutValuesTitle: String,
    aboutValues: [
      { title: String, description: String }
    ],

    commonBgImage: String,

    contact: {
      email: String,
      phone: String,
      address: String,
      locationMapUrl: String,
      facebookUrl: String,
      twitterUrl: String,
      linkedinUrl: String,
      youtubeUrl: String
    }
  },
  { timestamps: true }
);

export default mongoose.models.CMSContent ||
  mongoose.model<ICMSContent>("CMSContent", CMSSchema);
