import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Proposal from "@/models/Proposal";
import Project from "@/models/Project";
import Provider from "@/models/Provider";
import Seeker from "@/models/Seeker";
import { getCurrentUser } from "@/lib/auth/jwt";
import mongoose from "mongoose";
// import Requirement from "@/models/Requirement";
import Notification from "@/models/Notification";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
   
    await connectToDatabase();

    const { id } = await params;

    //  Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const objectId = new mongoose.Types.ObjectId(id);
    console.log("Incoming ID:", id);
    console.log("Is valid ObjectId:", mongoose.Types.ObjectId.isValid(id));

    //  Fetch ALL matching proposals
    const proposals = await Proposal.find({
      $or: [
        { _id: objectId },
        { requirementId: objectId },
        { clientId: objectId },
        { agencyId: objectId },
      ],
    })
    //   .populate({
    //     path: "requirementId",
    //     select:
    //       "title category description budgetMin budgetMax timeline documentUrl status createdAt  attachmentUrls",
    //   })
    //   .lean();

    if (!proposals.length) {
      return NextResponse.json(
        { error: "No proposals found" },
        { status: 404 },
      );
    }

  
   //  Fetch clients
          const clientUserIds = [
            ...new Set(proposals.map((p) => p.clientId?.toString())),
          ];
      
          const clients = await Seeker.find({
            userId: { $in: clientUserIds },
          })
            .select("userId companyName phoneNumber countryCode country image industry")
            .lean();
      
          const clientMap = new Map(clients.map((c) => [c.userId.toString(), c]));
  

   

   

    //  Format response
    return NextResponse.json({
      count: proposals.length,
      proposals: proposals.map((p) => ({
        // Proposal details
        id: p._id.toString(),
        coverLetter: p.coverLetter,
        proposalDescription: p.proposalDescription,
        proposedBudget: p.proposedBudget,
        proposedTimeline: p.proposedTimeline,
        milestones: p.milestones,
        status: p.status,
        documentUrl:p.documentUrl,
        attachments:p.attachments,

        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
         client: clientMap.get(p.clientId?.toString()) || null,

      
       
      })),
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposals" },
      { status: 500 },
    );
  }
}