import { MockVipResellerProvider } from "./vip-reseller.mock";
import { VipResellerProvider } from "./vip-reseller";
import type { GameProvider } from "./types";

function shouldUseMock() {
  if (process.env.USE_MOCK_PROVIDERS === "false") return false;
  if (process.env.USE_MOCK_PROVIDERS === "true") return true;
  // Default: fall back to mock whenever real credentials aren't configured,
  // so the app runs end-to-end out of the box.
  return !process.env.VIP_RESELLER_API_ID || !process.env.VIP_RESELLER_API_KEY;
}

let instance: GameProvider | null = null;

export function getGameProvider(): GameProvider {
  if (!instance) {
    instance = shouldUseMock() ? new MockVipResellerProvider() : new VipResellerProvider();
  }
  return instance;
}

export { shouldUseMock as usingMockProviders };
