import type {
  CreateSnapTransactionInput,
  CreateSnapTransactionResult,
  PaymentProvider,
  RawWebhookPayload,
  WebhookNotification,
} from "./types";

/**
 * Mock payment provider. There's no real Snap popup in mock mode — the
 * checkout page instead shows a "Simulasikan Pembayaran" button that posts a
 * self-signed notification straight to /api/payment/webhook, exercising the
 * same webhook code path the real Midtrans callback would hit.
 */
export class MockMidtransProvider implements PaymentProvider {
  async createSnapTransaction(
    input: CreateSnapTransactionInput
  ): Promise<CreateSnapTransactionResult> {
    return {
      token: `mock-token-${input.orderId}`,
      redirectUrl: `/checkout/${input.orderId}?mock=1`,
    };
  }

  verifyWebhookSignature(): boolean {
    // Mock notifications only ever originate from our own checkout page.
    return true;
  }

  parseNotification(payload: RawWebhookPayload): WebhookNotification {
    return {
      orderId: payload.order_id,
      transactionStatus: payload.transaction_status,
      fraudStatus: payload.fraud_status,
      paymentType: payload.payment_type ?? "mock",
      grossAmount: payload.gross_amount,
    };
  }
}
