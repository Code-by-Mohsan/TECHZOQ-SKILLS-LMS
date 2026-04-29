import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PaymentProviderEvent from "@/models/PaymentProviderEvent";
import PaymentSubmission from "@/models/PaymentSubmission";

const SUPPORTED_PROVIDERS = new Set(["jazzcash", "easypaisa", "stripe", "other"]);

export async function POST(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  try {
    const { provider: providerParam } = await params;
    const provider = String(providerParam || "").toLowerCase();
    if (!SUPPORTED_PROVIDERS.has(provider)) {
      return NextResponse.json({ success: false, message: "Unsupported payment provider" }, { status: 400 });
    }

    const payload = await req.json();
    await dbConnect();

    const providerReference = String(payload.providerReference || payload.txnRefNo || payload.txnRef || "");
    const transactionReference = String(payload.transactionReference || payload.reference || "");
    const providerStatus = String(payload.status || payload.pp_ResponseCode || "pending").toLowerCase();

    let linkedPayment: any = null;
    const orFilters: Record<string, string>[] = [];
    if (providerReference) orFilters.push({ providerReference });
    if (transactionReference) orFilters.push({ transactionReference });
    if (orFilters.length > 0) {
      linkedPayment = await PaymentSubmission.findOne({ $or: orFilters }).sort({ createdAt: -1 });
    }

    const event = await PaymentProviderEvent.create({
      providerType: provider,
      eventType: "webhook",
      providerReference,
      transactionReference,
      status: "received",
      payload,
      paymentSubmission: linkedPayment?._id || null,
    });

    if (linkedPayment) {
      const mappedStatus =
        providerStatus.includes("success") || providerStatus === "verified"
          ? "verified"
          : providerStatus.includes("fail")
            ? "failed"
            : "pending";

      linkedPayment.providerType = provider as any;
      linkedPayment.providerReference = providerReference || linkedPayment.providerReference || "";
      linkedPayment.providerStatus = mappedStatus as any;
      linkedPayment.providerMeta = payload;
      linkedPayment.updatedBy = null;
      await linkedPayment.save();

      event.status = mappedStatus === "verified" ? "verified" : mappedStatus === "failed" ? "failed" : "received";
      event.verificationResponse = {
        mappedStatus,
        linkedPaymentId: String(linkedPayment._id),
      };
      await event.save();
    }

    return NextResponse.json({ success: true, data: { eventId: String(event._id) } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process payment webhook";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
