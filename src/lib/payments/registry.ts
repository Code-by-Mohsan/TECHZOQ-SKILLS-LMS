import { PaymentProvider, PaymentProviderType } from "@/lib/payments/provider";
import { JazzCashProvider } from "@/lib/payments/providers/jazzcashProvider";
import { ManualPaymentProvider } from "@/lib/payments/providers/manualProvider";

const manualProvider = new ManualPaymentProvider();
const jazzCashProvider = new JazzCashProvider();

const providers: Record<PaymentProviderType, PaymentProvider> = {
  manual: manualProvider,
  jazzcash: jazzCashProvider,
  easypaisa: manualProvider,
  stripe: manualProvider,
  other: manualProvider,
};

export function resolvePaymentProvider(type: PaymentProviderType): PaymentProvider {
  return providers[type] || manualProvider;
}

