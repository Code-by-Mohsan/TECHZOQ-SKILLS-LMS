import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import Student from "@/models/Student";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";

export async function GET(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const student = (await Student.findOne({ user: auth.userId }).select("_id").lean()) as
      | { _id: string }
      | null;
    if (!student) {
      return NextResponse.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const [invoices, ledger] = await Promise.all([
      Invoice.find({ student: student._id })
        .populate("course", "title")
        .populate("batch", "name")
        .sort({ createdAt: -1 })
        .lean(),
      LedgerEntry.find({ student: student._id })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        invoices,
        ledger,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load finance data";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

