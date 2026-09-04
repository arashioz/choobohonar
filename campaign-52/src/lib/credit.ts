import { clubTiers, type TierId } from "@/data/campaign";

export const PURCHASE_UNIT = 200;

export type CreditResult = {
  tier: TierId;
  amount: number;
  units: number;
  remainder: number;
  creditPerUnit: number;
  credit: number;
  toNext: number;
  qualifies: boolean;
};

export function creditRate(tier: TierId) {
  return clubTiers.find((item) => item.id === tier)?.creditPerUnit ?? 10;
}

/** Purchase volume unlocks the displayed club level in the calculator. */
export function tierFromPurchase(purchaseMillion: number): TierId {
  const units = Math.floor(Math.max(0, Number(purchaseMillion) || 0) / PURCHASE_UNIT);
  if (units >= 4) return "vip";
  if (units >= 3) return "gold";
  if (units >= 2) return "silver";
  return "guest";
}

export function computeShare(purchaseMillion: number): CreditResult {
  return computeCredit(tierFromPurchase(purchaseMillion), purchaseMillion);
}

/** floor(purchase / 200) × rate. Remainders under a full 200M unit earn nothing. */
export function computeCredit(tier: TierId, purchaseMillion: number): CreditResult {
  const amount = Math.max(0, Math.floor(Number(purchaseMillion) || 0));
  const units = Math.floor(amount / PURCHASE_UNIT);
  const remainder = amount % PURCHASE_UNIT;
  const creditPerUnit = creditRate(tier);
  return {
    tier,
    amount,
    units,
    remainder,
    creditPerUnit,
    credit: units * creditPerUnit,
    toNext: remainder === 0 && units > 0 ? PURCHASE_UNIT : PURCHASE_UNIT - remainder,
    qualifies: units > 0,
  };
}
