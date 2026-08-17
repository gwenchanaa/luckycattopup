export const TRANSACTION_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "EXPIRED",
] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export interface Transaction {
  id: string;
  gameCode: string;
  gameName: string;
  productCode: string;
  productName: string;
  price: number;
  accountUserId: string;
  accountServerId: string | null;
  status: TransactionStatus;
  paymentMethod: string | null;
  midtransOrderId: string | null;
  midtransTransactionId: string | null;
  providerOrderId: string | null;
  providerNote: string | null;
  createdAt: string;
  updatedAt: string;
  expiredAt: string | null;
}

export interface CreateOrderInput {
  gameCode: string;
  productCode: string;
  accountUserId: string;
  accountServerId?: string;
}
