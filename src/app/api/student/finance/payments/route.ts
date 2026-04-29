import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import Student from "@/models/Student";
import Invoice from "@/models/Invoice";
import PaymentSubmission from "@/models/PaymentSubmission";
import FileAsset from "@/models/FileAsset";
import { studentPaymentSubmissionSchema } from "@/lib/validations/admin";
import { resolvePaymentProvider } from "@/lib/payments/registry";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

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

    const submissions = await PaymentSubmission.find({ student: student._id })
      .populate("invoice", "invoiceNumber totalAmount dueAmount status")
      .sort({ createdAt: -1 })
      .lean();

    const data = submissions.map((item: any) => ({
      ...item,
      screenshotAccessPath: item.screenshotFileAsset
        ? `/api/files/${String(item.screenshotFileAsset)}?redirect=true`
        : null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load payments";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = studentPaymentSubmissionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const student = (await Student.findOne({ user: auth.userId }).select("_id").lean()) as
      | { _id: string }
      | null;
    if (!student) {
      return NextResponse.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const invoice = await Invoice.findOne({ _id: parsed.data.invoiceId, student: student._id });
    if (!invoice) {
      return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
    }

    const provider = resolvePaymentProvider(parsed.data.providerType);
    const providerResult = await provider.verify({
      providerType: parsed.data.providerType,
      amount: parsed.data.amount,
      reference: parsed.data.transactionReference,
      payload: null,
    });

    let screenshotUrl = parsed.data.screenshotUrl || "";
    let screenshotFileAsset: string | null = null;
    if (parsed.data.screenshotFileAssetId) {
      const fileAsset = await FileAsset.findOne({
        _id: parsed.data.screenshotFileAssetId,
        uploadedBy: auth.userId,
        isActive: true,
      }).select("_id url category sourceModule");
      if (!fileAsset) {
        return NextResponse.json({ success: false, message: "Invalid uploaded screenshot asset" }, { status: 400 });
      }
      screenshotFileAsset = String(fileAsset._id);
      screenshotUrl = fileAsset.url;
    }

    const submission = await PaymentSubmission.create({
      student: student._id,
      invoice: invoice._id,
      enrollment: invoice.enrollment || null,
      amount: parsed.data.amount,
      paymentMethod: parsed.data.paymentMethod,
      transactionReference: parsed.data.transactionReference,
      screenshotUrl,
      screenshotFileAsset,
      providerType: parsed.data.providerType,
      providerReference: providerResult.providerReference || "",
      providerStatus: providerResult.status === "verified" ? "verified" : providerResult.status,
      providerMeta: providerResult.providerMeta || null,
      verificationStatus: "submitted",
      createdBy: auth.userId,
      updatedBy: auth.userId,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: auth.userId,
      actorRole: auth.role,
      action: "finance.payment.submit",
      module: "finance",
      entityType: "PaymentSubmission",
      entityId: String(submission._id),
      afterState: {
        invoiceId: String(invoice._id),
        amount: submission.amount,
        paymentMethod: submission.paymentMethod,
        providerType: submission.providerType,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit payment";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
