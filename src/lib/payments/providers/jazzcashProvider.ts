import {
  PaymentProvider,
  PaymentVerificationInput,
  PaymentVerificationResult,
} from "@/lib/payments/provider";

// Placeholder provider until JazzCash API credentials and endpoints are configured.
export class JazzCashProvider implements PaymentProvider {
  readonly type = "jazzcash" as const;

  async verify(input: PaymentVerificationInput): Promise<PaymentVerificationResult> {
    return {
      status: "pending",
      providerReference: input.reference,
      providerMeta: {
        integration: "placeholder",
        note: "JazzCash API not connected yet",
      },
      message: "JazzCash verification is pending integration",
    };
  }
}

