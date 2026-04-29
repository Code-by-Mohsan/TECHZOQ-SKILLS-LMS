import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { generateInvoiceNumber, getStudentBalance } from "@/lib/finance";
import { invoiceCreateSchema } from "@/lib/validations/admin";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["finance.view"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
    const status = (searchParams.get("status") || "").trim();

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate({
          path: "student",
          select: "user",
          populate: { path: "user", select: "name email" },
        })
        .populate("course", "title")
        .populate("batch", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Invoice.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, data: { invoices, total, page, limit } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load invoices";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const permissionCheck = await requirePermissions(req, ["finance.view"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = invoiceCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const data = parsed.data;
    const subtotalAmount = data.subtotalAmount;
    const discountAmount = data.discountAmount || 0;
    const totalAmount = Math.max(0, subtotalAmount - discountAmount);

    const invoiceNumber = await generateInvoiceNumber();
    const invoice = await Invoice.create({
      invoiceNumber,
      student: data.studentId,
      enrollment: data.enrollmentId || null,
      course: data.courseId,
      batch: data.batchId || null,
      subtotalAmount,
      discountAmount,
      totalAmount,
      dueAmount: totalAmount,
      status: "issued",
      dueDate: data.dueDate || null,
      createdBy: permissionCheck.auth?.userId ?? null,
      updatedBy: permissionCheck.auth?.userId ?? null,
    });

    const previousBalance = await getStudentBalance(data.studentId);
    const newBalance = previousBalance + totalAmount;
    await LedgerEntry.create({
      student: data.studentId,
      invoice: invoice._id,
      entryType: "invoice_issue",
      debitAmount: totalAmount,
      creditAmount: 0,
      balanceAfter: newBalance,
      remarks: `Invoice issued: ${invoiceNumber}`,
      createdBy: permissionCheck.auth?.userId ?? null,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "finance.invoice.create",
      module: "finance",
      entityType: "Invoice",
      entityId: String(invoice._id),
      afterState: {
        invoiceNumber,
        totalAmount: invoice.totalAmount,
        dueAmount: invoice.dueAmount,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create invoice";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

