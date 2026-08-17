import type { Transaction, TransactionStatus } from "@/types/transaction";

export interface NewTransactionInput {
  id: string;
  gameCode: string;
  gameName: string;
  productCode: string;
  productName: string;
  price: number;
  accountUserId: string;
  accountServerId: string | null;
  midtransOrderId: string;
  expiredAt: string;
}

export interface TransactionUpdate {
  status?: TransactionStatus;
  paymentMethod?: string | null;
  midtransTransactionId?: string | null;
  providerOrderId?: string | null;
  providerNote?: string | null;
}

export interface TransactionStore {
  create(input: NewTransactionInput): Promise<Transaction>;
  getById(id: string): Promise<Transaction | null>;
  getByMidtransOrderId(orderId: string): Promise<Transaction | null>;
  update(id: string, patch: TransactionUpdate): Promise<Transaction | null>;
}
