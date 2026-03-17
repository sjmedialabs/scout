import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Requirement from "@/models/Requirement";
import { getCurrentUser } from "@/lib/auth/jwt"; 
import Seeker from "@/models/Seeker";
import Proposal from "@/models/Proposal";
import { error } from "console";
import mongoose from "mongoose";
import Notification from "@/models/Notification";
import Provider from "@/models/Provider";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    //  Get logged-in user
    const user = await getCurrentUser();

    if (!user || !user.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const agencyId = user.userId;

    const search = req.nextUrl.searchParams.get("search") || "";
    const category = req.nextUrl.searchParams.get("category") || "";
    const minBudget = Number(req.nextUrl.searchParams.get("minBudget") || 0);
    const maxBudget = Number(
      req.nextUrl.searchParams.get("maxBudget") || 9999999
    );

    const query: any = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    query.budgetMin = { $lte: maxBudget };
    query.budgetMax = { $gte: minBudget };

    const requirements = await Requirement.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // -----------------------------
    //  Proposal mapping
    // -----------------------------
    const requirementIds = requirements.map((r: any) => r._id);

    const proposals = await Proposal.find({
      agencyId,
      requirementId: { $in: requirementIds },
    }).select("requirementId");

    const submittedRequirementIds = new Set(
      proposals.map((p: any) => p.requirementId.toString())
    );

    // -----------------------------
    // Final response (non-breaking)
    // -----------------------------
    const formattedRequirements = requirements.map((r: any) => ({
      ...r,
      hasSubmittedProposal: submittedRequirementIds.has(r._id.toString()),
    }));

    return NextResponse.json({
      success: true,
      requirements: formattedRequirements,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch requirements" },
      { status: 500 }
    );
  }
}