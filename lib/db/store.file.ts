import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Transaction } from "@/types/transaction";
import type { NewTransactionInput, TransactionStore, TransactionUpdate } from "./types";

/**
 * Local JSON-file-backed store used when Supabase isn't configured yet, so
 * the full order -> pay -> status flow can be exercised end-to-end in dev
 * without any external dependency. Not for production use.
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "transactions.json");

async function readAll(): Promise<Record<string, Transaction>> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Record<string, Transaction>;
  } catch {
    return {};
  }
}

async function writeAll(data: Record<string, Transaction>): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export class FileTransactionStore implements TransactionStore {
  async create(input: NewTransactionInput): Promise<Transaction> {
    const all = await readAll();
    const now = new Date().toISOString();
    const tx: Transaction = {
      id: input.id,
      gameCode: input.gameCode,
      gameName: input.gameName,
      productCode: input.productCode,
      productName: input.productName,
      price: input.price,
      accountUserId: input.accountUserId,
      accountServerId: input.accountServerId,
      status: "PENDING_PAYMENT",
      paymentMethod: null,
      midtransOrderId: input.midtransOrderId,
      midtransTransactionId: null,
      providerOrderId: null,
      providerNote: null,
      createdAt: now,
      updatedAt: now,
      expiredAt: input.expiredAt,
    };
    all[tx.id] = tx;
    await writeAll(all);
    return tx;
  }

  async getById(id: string): Promise<Transaction | null> {
    const all = await readAll();
    return all[id] ?? null;
  }

  async getByMidtransOrderId(orderId: string): Promise<Transaction | null> {
    const all = await readAll();
    return Object.values(all).find((t) => t.midtransOrderId === orderId) ?? null;
  }

  async update(id: string, patch: TransactionUpdate): Promise<Transaction | null> {
    const all = await readAll();
    const existing = all[id];
    if (!existing) return null;
    const updated: Transaction = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    all[id] = updated;
    await writeAll(all);
    return updated;
  }
}
