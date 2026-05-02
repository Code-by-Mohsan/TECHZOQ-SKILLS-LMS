export type PaymentProviderType =
  | "manual"
  | "jazzcash"
  | "easypaisa"
  | "stripe"
  | "other";

export interface PaymentVerificationInput {
  providerType: PaymentProviderType;
  amount: number;
  reference: string;
  payload?: Record<string, unknown> | null;
}

export interface PaymentVerificationResult {
  status: "pending" | "verified" | "failed";
  providerReference?: string;
  providerMeta?: Record<string, unknown> | null;
  message?: string;
}

export interface PaymentProvider {
  readonly type: PaymentProviderType;
  verify(input: PaymentVerificationInput): Promise<PaymentVerificationResult>;
}

