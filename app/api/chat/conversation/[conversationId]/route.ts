import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";
import { Conversation } from "@/models/Message";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const { conversationId } = params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // ✅ delete ONLY for this user
    await Conversation.findByIdAndUpdate(conversationId, {
    //   $addToSet: { deletedFor: user.userId },
    $addToSet: {
  deletedFor: new mongoose.Types.ObjectId(user.userId),
}
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}