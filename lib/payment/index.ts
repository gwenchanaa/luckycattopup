import { MockMidtransProvider } from "./midtrans.mock";
import { MidtransProvider } from "./midtrans";
import type { PaymentProvider } from "./types";

function shouldUseMock() {
  if (process.env.USE_MOCK_PROVIDERS === "false") return false;
  if (process.env.USE_MOCK_PROVIDERS === "true") return true;
  return !process.env.MIDTRANS_SERVER_KEY;
}

let instance: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!instance) {
    instance = shouldUseMock() ? new MockMidtransProvider() : new MidtransProvider();
  }
  return instance;
}

export { shouldUseMock as usingMockPayment };
