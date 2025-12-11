import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ServiceCategory from "@/models/ServiceCategory";

export async function PUT(request: Request, { params }: any) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id } = params;

    const updated = await ServiceCategory.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}
