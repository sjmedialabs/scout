import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import Payment from "@/models/Payment";
import { connectToDatabase } from "@/lib/mongodb";
import path from "path";
import fs from "fs";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const payment = await Payment.findById(params.id)
      .populate("userId", "name email")
      .populate("planId", "title price");

    if (!payment) {
      return new NextResponse("Payment not found", { status: 404 });
    }

    // Create PDF
    const doc = new PDFDocument({
  font: path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf"),
});

// Load custom font
const fontPath = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");
// doc.font(fontPath);

    const chunks: any[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    // 🎨 Invoice Design
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice ID: ${payment._id}`);
    doc.text(`Payment ID: ${payment.razorpayPaymentId}`);
    doc.text(`Date: ${new Date(payment.createdAt).toDateString()}`);
    doc.moveDown();

    doc.text(`Customer: ${payment.userId?.name}`);
    doc.text(`Email: ${payment.userId?.email}`);
    doc.moveDown();

    doc.text(`Plan: ${payment.planId?.title}`);
    doc.text(`Amount: ₹${payment.amount}`);
    doc.text(`Status: ${payment.status}`);
    doc.moveDown();

    doc.text("Thank you for your purchase!", { align: "center" });

    doc.end();

    const pdfBuffer = await pdfPromise;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${payment._id}.pdf`,
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}