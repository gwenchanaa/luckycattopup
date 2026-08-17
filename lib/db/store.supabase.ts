import type { Transaction } from "@/types/transaction";
import { getSupabaseClient } from "./supabase";
import type { NewTransactionInput, TransactionStore, TransactionUpdate } from "./types";

interface TransactionRow {
  id: string;
  game_code: string;
  game_name: string;
  product_code: string;
  product_name: string;
  price: number;
  account_user_id: string;
  account_server_id: string | null;
  status: Transaction["status"];
  payment_method: string | null;
  midtrans_order_id: string | null;
  midtrans_transaction_id: string | null;
  provider_order_id: string | null;
  provider_note: string | null;
  created_at: string;
  updated_at: string;
  expired_at: string | null;
}

function toTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    gameCode: row.game_code,
    gameName: row.game_name,
    productCode: row.product_code,
    productName: row.product_name,
    price: row.price,
    accountUserId: row.account_user_id,
    accountServerId: row.account_server_id,
    status: row.status,
    paymentMethod: row.payment_method,
    midtransOrderId: row.midtrans_order_id,
    midtransTransactionId: row.midtrans_transaction_id,
    providerOrderId: row.provider_order_id,
    providerNote: row.provider_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiredAt: row.expired_at,
  };
}

export class SupabaseTransactionStore implements TransactionStore {
  async create(input: NewTransactionInput): Promise<Transaction> {
    const { data, error } = await getSupabaseClient()
      .from("transactions")
      .insert({
        id: input.id,
        game_code: input.gameCode,
        game_name: input.gameName,
        product_code: input.productCode,
        product_name: input.productName,
        price: input.price,
        account_user_id: input.accountUserId,
        account_server_id: input.accountServerId,
        status: "PENDING_PAYMENT",
        midtrans_order_id: input.midtransOrderId,
        expired_at: input.expiredAt,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return toTransaction(data as TransactionRow);
  }

  async getById(id: string): Promise<Transaction | null> {
    const { data, error } = await getSupabaseClient()
      .from("transactions")
      .select()
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? toTransaction(data as TransactionRow) : null;
  }

  async getByMidtransOrderId(orderId: string): Promise<Transaction | null> {
    const { data, error } = await getSupabaseClient()
      .from("transactions")
      .select()
      .eq("midtrans_order_id", orderId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? toTransaction(data as TransactionRow) : null;
  }

  async update(id: string, patch: TransactionUpdate): Promise<Transaction | null> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.status !== undefined) payload.status = patch.status;
    if (patch.paymentMethod !== undefined) payload.payment_method = patch.paymentMethod;
    if (patch.midtransTransactionId !== undefined)
      payload.midtrans_transaction_id = patch.midtransTransactionId;
    if (patch.providerOrderId !== undefined) payload.provider_order_id = patch.providerOrderId;
    if (patch.providerNote !== undefined) payload.provider_note = patch.providerNote;

    const { data, error } = await getSupabaseClient()
      .from("transactions")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? toTransaction(data as TransactionRow) : null;
  }
}
