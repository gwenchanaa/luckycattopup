import crypto from "crypto";
import { Snap } from "midtrans-client";
import type {
  CreateSnapTransactionInput,
  CreateSnapTransactionResult,
  PaymentProvider,
  RawWebhookPayload,
  WebhookNotification,
} from "./types";

function getServerKey() {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) throw new Error("MIDTRANS_SERVER_KEY is not configured");
  return key;
}

export class MidtransProvider implements PaymentProvider {
  private snap: Snap;

  constructor() {
    this.snap = new Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: getServerKey(),
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });
  }

  async createSnapTransaction(
    input: CreateSnapTransactionInput
  ): Promise<CreateSnapTransactionResult> {
    const res = await this.snap.createTransaction({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.grossAmount,
      },
      item_details: [
        {
          id: input.orderId,
          price: input.grossAmount,
          quantity: 1,
          name: input.itemName.slice(0, 50),
        },
      ],
    });
    return { token: res.token, redirectUrl: res.redirect_url };
  }

  verifyWebhookSignature(payload: RawWebhookPayload): boolean {
    const expected = crypto
      .createHash("sha512")
      .update(payload.order_id + payload.status_code + payload.gross_amount + getServerKey())
      .digest("hex");
    return expected === payload.signature_key;
  }

  parseNotification(payload: RawWebhookPayload): WebhookNotification {
    return {
      orderId: payload.order_id,
      transactionStatus: payload.transaction_status,
      fraudStatus: payload.fraud_status,
      paymentType: payload.payment_type,
      grossAmount: payload.gross_amount,
    };
  }
}
