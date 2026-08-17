import crypto from "crypto";
import type { Game, Product, ValidateIdResult } from "@/types/product";
import { findCatalogEntry, GAME_CATALOG } from "./game-catalog";
import type {
  CreateProviderOrderInput,
  CreateProviderOrderResult,
  GameProvider,
  ProviderOrderStatus,
} from "./types";

/**
 * Real VIP-Reseller "game-feature" API client.
 * Docs: https://vip-reseller.co.id/page/api/game-feature
 *
 * Auth: every request is form-encoded POST with `key` (API key) and
 * `sign` = md5(API_ID + API_KEY). There is no separate `id` field.
 */
const BASE_URL = "https://vip-reseller.co.id/api/game-feature";

function getCredentials() {
  const apiId = process.env.VIP_RESELLER_API_ID;
  const apiKey = process.env.VIP_RESELLER_API_KEY;
  if (!apiId || !apiKey) {
    throw new Error("VIP_RESELLER_API_ID / VIP_RESELLER_API_KEY is not configured");
  }
  return { apiId, apiKey };
}

function getSign() {
  const { apiId, apiKey } = getCredentials();
  return crypto.createHash("md5").update(apiId + apiKey).digest("hex");
}

async function call<T = unknown>(type: string, params: Record<string, string | undefined> = {}) {
  const { apiKey } = getCredentials();
  const body = new URLSearchParams({ key: apiKey, sign: getSign(), type });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) body.set(k, v);
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`VIP-Reseller request failed: HTTP ${res.status}`);
  }

  const json = (await res.json()) as { result: boolean; data: T; message?: string };
  if (!json.result) {
    throw new Error(json.message ?? "VIP-Reseller request returned result=false");
  }
  return json;
}

interface ServiceRow {
  code: string;
  game: string;
  name: string;
  price: { basic: number; premium?: number; special?: number };
  status: "available" | "empty";
}

interface OrderData {
  trxid: string;
  data: string;
  status: string;
  price: number;
}

interface StatusRow {
  trxid: string;
  status: string;
  note?: string;
  price: number;
}

function mapOrderStatus(raw: string): "PROCESSING" | "SUCCESS" | "FAILED" {
  const s = raw.toLowerCase();
  if (s === "success") return "SUCCESS";
  if (s === "error" || s === "failed" || s === "canceled") return "FAILED";
  return "PROCESSING"; // waiting / processing / pending
}

export class VipResellerProvider implements GameProvider {
  async getGameList(): Promise<Game[]> {
    // The site's featured game list & metadata (logo, description, ID field
    // shape) is curated locally — VIP-Reseller only supplies raw pricing.
    return GAME_CATALOG;
  }

  async getPriceList(gameCode: string): Promise<Product[]> {
    const entry = findCatalogEntry(gameCode);
    if (!entry) return [];

    const { data } = await call<ServiceRow[]>("services", {
      filter_game: entry.vipResellerBrand,
    });

    return data
      .filter((row) => row.status === "available")
      .map((row) => ({
        code: row.code,
        gameCode,
        name: row.name,
        price: row.price.basic,
        isAvailable: row.status === "available",
      }));
  }

  async checkNickname(
    gameCode: string,
    userId: string,
    serverId?: string
  ): Promise<ValidateIdResult> {
    const entry = findCatalogEntry(gameCode);
    if (!entry?.supportsValidation) {
      return { valid: true };
    }

    const products = await this.getPriceList(gameCode);
    const representativeCode = products[0]?.code;
    if (!representativeCode) {
      return { valid: true };
    }

    try {
      const { data, message } = await call<string>("get-nickname", {
        code: representativeCode,
        target: userId,
        additional_target: serverId,
      });
      return { valid: true, username: data, message };
    } catch (err) {
      return {
        valid: false,
        message: err instanceof Error ? err.message : "ID tidak ditemukan.",
      };
    }
  }

  async createOrder(input: CreateProviderOrderInput): Promise<CreateProviderOrderResult> {
    const { data, message } = await call<OrderData>("order", {
      service: input.productCode,
      data_no: input.accountUserId,
      data_zone: input.accountServerId,
    });

    return {
      providerOrderId: data.trxid,
      status: mapOrderStatus(data.status),
      note: message,
    };
  }

  async checkOrderStatus(providerOrderId: string): Promise<ProviderOrderStatus> {
    const { data } = await call<StatusRow[]>("status", { trxid: providerOrderId });
    const row = data[0];
    if (!row) {
      throw new Error("Transaksi tidak ditemukan di provider.");
    }
    return { status: mapOrderStatus(row.status), note: row.note };
  }
}
