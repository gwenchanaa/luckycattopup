import type { Game, Product, ValidateIdResult } from "@/types/product";

export interface CreateProviderOrderInput {
  gameCode: string;
  productCode: string;
  accountUserId: string;
  accountServerId?: string;
  referenceId: string;
}

export interface CreateProviderOrderResult {
  providerOrderId: string;
  status: "PROCESSING" | "SUCCESS" | "FAILED";
  note?: string;
}

export interface ProviderOrderStatus {
  status: "PROCESSING" | "SUCCESS" | "FAILED";
  note?: string;
}

export interface GameProvider {
  getGameList(): Promise<Game[]>;
  getPriceList(gameCode: string): Promise<Product[]>;
  checkNickname(
    gameCode: string,
    userId: string,
    serverId?: string
  ): Promise<ValidateIdResult>;
  createOrder(input: CreateProviderOrderInput): Promise<CreateProviderOrderResult>;
  checkOrderStatus(providerOrderId: string): Promise<ProviderOrderStatus>;
}
