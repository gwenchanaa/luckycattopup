import type { Game, Product, ValidateIdResult } from "@/types/product";
import type {
  CreateProviderOrderInput,
  CreateProviderOrderResult,
  GameProvider,
  ProviderOrderStatus,
} from "./types";

const MOCK_GAMES: Game[] = [
  {
    code: "mobile-legends",
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

const MOCK_PRODUCTS: Record<string, Product[]> = {
  "mobile-legends": [
    { code: "ml-86", gameCode: "mobile-legends", name: "86 Diamond", price: 22000, isAvailable: true },
    { code: "ml-172", gameCode: "mobile-legends", name: "172 Diamond", price: 44000, isAvailable: true },
    { code: "ml-257", gameCode: "mobile-legends", name: "257 Diamond", price: 66000, isAvailable: true },
    { code: "ml-344", gameCode: "mobile-legends", name: "344 Diamond", price: 88000, isAvailable: true },
    { code: "ml-429", gameCode: "mobile-legends", name: "429 Diamond", price: 110000, isAvailable: true },
    { code: "ml-wdp", gameCode: "mobile-legends", name: "Weekly Diamond Pass", price: 28000, isAvailable: true },
  ],
  "free-fire": [
    { code: "ff-70", gameCode: "free-fire", name: "70 Diamond", price: 10000, isAvailable: true },
    { code: "ff-140", gameCode: "free-fire", name: "140 Diamond", price: 20000, isAvailable: true },
    { code: "ff-355", gameCode: "free-fire", name: "355 Diamond", price: 50000, isAvailable: true },
    { code: "ff-720", gameCode: "free-fire", name: "720 Diamond", price: 100000, isAvailable: true },
    { code: "ff-membership", gameCode: "free-fire", name: "Member Mingguan", price: 30000, isAvailable: true },
  ],
  "pubg-mobile": [
    { code: "pubg-60", gameCode: "pubg-mobile", name: "60 UC", price: 15000, isAvailable: true },
    { code: "pubg-325", gameCode: "pubg-mobile", name: "325 UC", price: 75000, isAvailable: true },
    { code: "pubg-660", gameCode: "pubg-mobile", name: "660 UC", price: 150000, isAvailable: true },
    { code: "pubg-1800", gameCode: "pubg-mobile", name: "1800 UC", price: 400000, isAvailable: true },
  ],
  valorant: [
    { code: "vp-420", gameCode: "valorant", name: "420 VP", price: 60000, isAvailable: true },
    { code: "vp-700", gameCode: "valorant", name: "700 VP", price: 95000, isAvailable: true },
    { code: "vp-1375", gameCode: "valorant", name: "1375 VP", price: 180000, isAvailable: true },
    { code: "vp-2400", gameCode: "valorant", name: "2400 VP", price: 300000, isAvailable: true },
  ],
  "genshin-impact": [
    { code: "gi-60", gameCode: "genshin-impact", name: "60 Genesis Crystal", price: 16000, isAvailable: true },
    { code: "gi-300", gameCode: "genshin-impact", name: "300 + 30 Genesis Crystal", price: 79000, isAvailable: true },
    { code: "gi-980", gameCode: "genshin-impact", name: "980 + 110 Genesis Crystal", price: 249000, isAvailable: true },
    { code: "gi-welkin", gameCode: "genshin-impact", name: "Welkin Moon (30 hari)", price: 30000, isAvailable: true },
  ],
  "honkai-star-rail": [
    { code: "hsr-60", gameCode: "honkai-star-rail", name: "60 Oneiric Shard", price: 16000, isAvailable: true },
    { code: "hsr-300", gameCode: "honkai-star-rail", name: "300 + 30 Oneiric Shard", price: 79000, isAvailable: true },
    { code: "hsr-980", gameCode: "honkai-star-rail", name: "980 + 110 Oneiric Shard", price: 249000, isAvailable: true },
    { code: "hsr-pass", gameCode: "honkai-star-rail", name: "Express Supply Pass (30 hari)", price: 30000, isAvailable: true },
  ],
};

const MOCK_NICKNAMES = ["ShadowHunter", "NightRaven", "CrimsonBlade", "LuckyCat99", "MysticFlame"];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockVipResellerProvider implements GameProvider {
  async getGameList(): Promise<Game[]> {
    await delay(400);
    return MOCK_GAMES;
  }

  async getPriceList(gameCode: string): Promise<Product[]> {
    await delay(350);
    return MOCK_PRODUCTS[gameCode] ?? [];
  }

  async checkNickname(
    gameCode: string,
    userId: string,
    serverId?: string
  ): Promise<ValidateIdResult> {
    await delay(500);
    const game = MOCK_GAMES.find((g) => g.code === gameCode);
    if (!game?.supportsValidation) {
      return { valid: true };
    }
    if (!userId || userId.length < 4) {
      return { valid: false, message: "User ID tidak ditemukan. Periksa kembali ID kamu." };
    }
    const seed = (userId + (serverId ?? "")).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const username = MOCK_NICKNAMES[seed % MOCK_NICKNAMES.length];
    return { valid: true, username };
  }

  async createOrder(input: CreateProviderOrderInput): Promise<CreateProviderOrderResult> {
    await delay(600);
    return {
      providerOrderId: `MOCK-${input.referenceId}`,
      status: "PROCESSING",
    };
  }

  async checkOrderStatus(providerOrderId: string): Promise<ProviderOrderStatus> {
    await delay(300);
    // Deterministic mock: order "completes" ~20s after creation based on the
    // timestamp embedded by the caller via referenceId ordering isn't available here,
    // so we simulate progress by hashing the id — good enough for demoing the UI.
    const hash = providerOrderId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return hash % 10 === 0
      ? { status: "FAILED", note: "Stok produk provider sedang kosong (simulasi)." }
      : { status: "SUCCESS" };
  }
}
