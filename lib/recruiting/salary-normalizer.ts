/**
 * Salary normalization.
 *
 * Sources express pay every possible way: "$135K–$165K", "135000-165000",
 * "$65/hr", "£90,000 per year". This module coerces those into an annualized
 * numeric range so a range from Greenhouse and a range from LinkedIn are
 * comparable, and so "salary disclosed" is a signal we can score.
 */

export interface NormalizedSalary {
  min?: number;
  max?: number;
  currency: string;
  /** True when at least one bound was recovered. */
  disclosed: boolean;
}

const CURRENCY_BY_SYMBOL: Record<string, string> = {
  $: "USD",
  "£": "GBP",
  "€": "EUR"
};

/** Assumed full-time hours/year when annualizing an hourly rate. */
const HOURS_PER_YEAR = 2080;

function parseAmount(raw: string): number | undefined {
  // "135k" -> 135000, "135,000" -> 135000, "135" -> 135.
  const token = raw.trim().toLowerCase().replace(/,/g, "");
  const match = token.match(/^(\d+(?:\.\d+)?)(k|m)?$/);
  if (!match) return undefined;
  const base = Number(match[1]);
  if (Number.isNaN(base)) return undefined;
  if (match[2] === "k") return base * 1_000;
  if (match[2] === "m") return base * 1_000_000;
  return base;
}

/**
 * Parse a free-form salary string into an annualized range. Returns
 * `disclosed: false` (with no bounds) when nothing usable is found.
 */
export function parseSalary(input?: string): NormalizedSalary {
  if (!input) return { currency: "USD", disclosed: false };

  const text = input.trim();
  const symbol = Object.keys(CURRENCY_BY_SYMBOL).find((s) => text.includes(s));
  const currency = symbol ? CURRENCY_BY_SYMBOL[symbol] : "USD";
  const hourly = /\/\s*(hr|hour)|per hour/i.test(text);

  const numbers = (text.match(/\d[\d,.]*\s*[km]?/gi) ?? [])
    .map((n) => parseAmount(n))
    .filter((n): n is number => n !== undefined);

  if (numbers.length === 0) return { currency, disclosed: false };

  const annualize = (n: number) => (hourly ? Math.round(n * HOURS_PER_YEAR) : n);
  const sorted = [...numbers].sort((a, b) => a - b).map(annualize);

  return {
    min: sorted[0],
    max: sorted.length > 1 ? sorted[sorted.length - 1] : sorted[0],
    currency,
    disclosed: true
  };
}

/** Normalize an already-numeric range (the common ATS-API case). */
export function normalizeSalaryRange(
  min?: number,
  max?: number,
  currency = "USD"
): NormalizedSalary {
  const disclosed = typeof min === "number" || typeof max === "number";
  if (!disclosed) return { currency, disclosed: false };
  const lo = min ?? max;
  const hi = max ?? min;
  return { min: lo, max: hi, currency, disclosed: true };
}

/** Midpoint of a range, for opportunity sizing. */
export function salaryMidpoint(salary: NormalizedSalary): number | undefined {
  if (salary.min === undefined && salary.max === undefined) return undefined;
  const lo = salary.min ?? salary.max ?? 0;
  const hi = salary.max ?? salary.min ?? 0;
  return Math.round((lo + hi) / 2);
}
