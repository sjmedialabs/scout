import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CMSContent from "@/models/CMSContent";
import { getCurrentUser } from "@/lib/auth/jwt";

// ------------------------------
// GET – Fetch ALL or Single Content
// ------------------------------
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const key = searchParams.get("key");
    const type = searchParams.get("type");

    let query: any = {};

    if (key) query.key = key;
    if (type) query.type = type;

    const data = await CMSContent.find(query).sort({ order: 1 }).lean();

    return NextResponse.json({
      success: true,
      count: data.length,
      items: data,
    });
  } catch (error) {
    console.error("CMS GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch content" }, { status: 500 });
  }
}

// ------------------------------
// POST – Create New CMS Content
// ------------------------------
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectToDatabase();

    const body = await req.json();

    const exists = await CMSContent.findOne({ key: body.key });
    if (exists) {
      return NextResponse.json(
        { success: false, error: "Content with this key already exists" },
        { status: 400 }
      );
    }

    const newContent = await CMSContent.create({
      key: body.key,
      type: body.type,
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      image: body.image,
      icon: body.icon,
      link: body.link,
      content: body.content || {},
      metadata: body.metadata || {},
      order: body.order || (await CMSContent.countDocuments({ type: body.type })) + 1,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json({ success: true, item: newContent });
  } catch (error) {
    console.error("CMS POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create content" }, { status: 500 });
  }
}

// ------------------------------
// PUT – Update Content By Key
// ------------------------------
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();

    if (!body.key) {
      return NextResponse.json({ success: false, error: "Key is required" }, { status: 400 });
    }

    const updated = await CMSContent.findOneAndUpdate(
      { key: body.key },
      {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        image: body.image,
        icon: body.icon,
        link: body.link,
        content: body.content || {},
        metadata: body.metadata || {},
        order: body.order,
        isActive: body.isActive,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("CMS PUT Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update content" }, { status: 500 });
  }
}

// ------------------------------
// DELETE – Remove content by key
// ------------------------------
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Key is required for deletion" },
        { status: 400 }
      );
    }

    const deleted = await CMSContent.findOneAndDelete({ key });

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("CMS DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete content" }, { status: 500 });
  }
}
