import type { Game } from "@/types/product";

/**
 * VIP-Reseller's `services` endpoint returns raw price-list rows grouped by a
 * free-text `game` brand string — it has no concept of logo/description/ID
 * field shape. This catalog is the source of truth for what games the site
 * features and how to render/validate them; `vipResellerBrand` is the exact
 * `filter_game` value to send to VIP-Reseller when fetching that game's prices.
 */
export interface GameCatalogEntry extends Game {
  vipResellerBrand: string;
}

export const GAME_CATALOG: GameCatalogEntry[] = [
  {
    code: "mobile-legends",
    vipResellerBrand: "Mobile Legends",
    name: "Mobile Legends",
    category: "MOBA",
    logoUrl: "/games/mobile-legends.svg",
    description: "Top up Diamond Mobile Legends: Bang Bang, proses cepat & aman.",
    idFieldType: "user-id-server-id",
    userIdLabel: "User ID",
    serverIdLabel: "Zone ID",
    supportsValidation: true,
  },
  {
    code: "free-fire",
    vipResellerBrand: "Free Fire",
    name: "Free Fire",
    category: "Battle Royale",
    logoUrl: "/games/free-fire.svg",
    description: "Top up Diamond Free Fire langsung masuk akun kamu.",
    idFieldType: "user-id-only",
    userIdLabel: "Player ID",
    supportsValidation: true,
  },
  {
    code: "pubg-mobile",
    vipResellerBrand: "PUBG Mobile",
    name: "PUBG Mobile",
    category: "Battle Royale",
    logoUrl: "/games/pubg-mobile.svg",
    description: "Top up UC PUBG Mobile resmi & terpercaya.",
    idFieldType: "user-id-only",
    userIdLabel: "Player ID",
    supportsValidation: false,
  },
  {
    code: "valorant",
    vipResellerBrand: "Valorant",
    name: "Valorant",
    category: "FPS",
    logoUrl: "/games/valorant.svg",
    description: "Top up VP (Valorant Points) untuk skin & battle pass.",
    idFieldType: "user-id-only",
    userIdLabel: "Riot ID (nama#tag)",
    supportsValidation: false,
  },
  {
    code: "genshin-impact",
    vipResellerBrand: "Genshin Impact",
    name: "Genshin Impact",
    category: "RPG",
    logoUrl: "/games/genshin-impact.svg",
    description: "Top up Genesis Crystal untuk semua server Genshin Impact.",
    idFieldType: "user-id-server-id",
    userIdLabel: "UID",
    serverIdLabel: "Server",
    supportsValidation: false,
  },
  {
    code: "honkai-star-rail",
    vipResellerBrand: "Honkai Star Rail",
    name: "Honkai: Star Rail",
    category: "RPG",
    logoUrl: "/games/honkai-star-rail.svg",
    description: "Top up Oneiric Shard Honkai: Star Rail.",
    idFieldType: "user-id-server-id",
    userIdLabel: "UID",
    serverIdLabel: "Server",
    supportsValidation: false,
  },
];

export function findCatalogEntry(gameCode: string): GameCatalogEntry | undefined {
  return GAME_CATALOG.find((g) => g.code === gameCode);
}
