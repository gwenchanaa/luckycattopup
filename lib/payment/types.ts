export interface CreateSnapTransactionInput {
  orderId: string;
  grossAmount: number;
  itemName: string;
}

export interface CreateSnapTransactionResult {
  token: string;
  redirectUrl: string;
}

export interface WebhookNotification {
  orderId: string;
  transactionStatus: string;
  fraudStatus?: string;
  paymentType?: string;
  grossAmount: string;
}

export interface PaymentProvider {
  createSnapTransaction(input: CreateSnapTransactionInput): Promise<CreateSnapTransactionResult>;
  verifyWebhookSignature(payload: RawWebhookPayload): boolean;
  parseNotification(payload: RawWebhookPayload): WebhookNotification;
}

export interface RawWebhookPayload {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
}
