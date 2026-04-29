import {
  PaymentProvider,
  PaymentVerificationInput,
  PaymentVerificationResult,
} from "@/lib/payments/provider";

export class ManualPaymentProvider implements PaymentProvider {
  readonly type = "manual" as const;

  async verify(input: PaymentVerificationInput): Promise<PaymentVerificationResult> {
    return {
      status: "pending",
      providerReference: input.reference,
      providerMeta: {
        mode: "manual_review_required",
      },
      message: "Manual verification required",
    };
  }
}

