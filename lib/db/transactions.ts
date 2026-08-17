import { hasSupabaseConfig } from "./supabase";
import { SupabaseTransactionStore } from "./store.supabase";
import { FileTransactionStore } from "./store.file";
import type { TransactionStore } from "./types";

export type {
  NewTransactionInput,
  TransactionUpdate,
} from "./types";

let store: TransactionStore | null = null;

export function getTransactionStore(): TransactionStore {
  if (!store) {
    store = hasSupabaseConfig() ? new SupabaseTransactionStore() : new FileTransactionStore();
  }
  return store;
}
