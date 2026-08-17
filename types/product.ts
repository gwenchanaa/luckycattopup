export type IdFieldType = "none" | "user-id-only" | "user-id-server-id";

export interface Game {
  code: string;
  name: string;
  category: string;
  logoUrl: string;
  description: string;
  idFieldType: IdFieldType;
  userIdLabel: string;
  serverIdLabel?: string;
  supportsValidation: boolean;
}

export interface Product {
  code: string;
  gameCode: string;
  name: string;
  price: number;
  originalPrice?: number;
  note?: string;
  isAvailable: boolean;
}

export interface ValidateIdResult {
  valid: boolean;
  username?: string;
  message?: string;
}
