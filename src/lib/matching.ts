import type { Driver, PreferredRoute } from "./drivers";

// ── Match scores ───────────────────────────────────────────────────────────────
// 0 = no match (not notified)
// 1 = partial match (from OR to matches)
// 2 = full match  (both from AND to match)

export type MatchScore = 0 | 1 | 2;

export interface DriverMatch {
  driver: Driver;
  score: MatchScore;
  matchedRoute: PreferredRoute | null; // which route triggered the match
  reason: string;                       // human-readable explanation
}

// ── Normalise city name for comparison ────────────────────────────────────────
// Strips trailing vowel markers, trims whitespace, lower-cases Latin etc.
function normalize(city: string): string {
  return city.trim().replace(/[\u05B0-\u05C7]/g, ""); // strip Hebrew niqqud
}

function citiesMatch(a: string, b: string): boolean {
  if (a === "*" || b === "*") return true;
  return normalize(a) === normalize(b);
}

// ── Score a single preferred route against a shipment ─────────────────────────
function scoreRoute(
  route: PreferredRoute,
  shipmentFrom: string,
  shipmentTo: string
): { score: MatchScore; reason: string } {
  const fwd_from = citiesMatch(route.from, shipmentFrom);
  const fwd_to   = citiesMatch(route.to,   shipmentTo);
  const rev_from = route.bidirectional ? citiesMatch(route.from, shipmentTo)   : false;
  const rev_to   = route.bidirectional ? citiesMatch(route.to,   shipmentFrom) : false;

  // Full forward match
  if (fwd_from && fwd_to) {
    const isWildcard = route.from === "*" && route.to === "*";
    return { score: 2, reason: isWildcard ? "נהג גמיש לכל מסלול" : `מסלול מדויק: ${route.from} ← → ${route.to}` };
  }
  // Full reverse match
  if (rev_from && rev_to) {
    return { score: 2, reason: `מסלול מדויק (הפוך): ${route.to} ← → ${route.from}` };
  }
  // Partial forward match
  if (fwd_from) return { score: 1, reason: `עיר מוצא תואמת: ${route.from}` };
  if (fwd_to)   return { score: 1, reason: `עיר יעד תואמת: ${route.to}` };
  // Partial reverse
  if (rev_from) return { score: 1, reason: `עיר מוצא תואמת (הפוך): ${route.to}` };
  if (rev_to)   return { score: 1, reason: `עיר יעד תואמת (הפוך): ${route.from}` };

  return { score: 0, reason: "" };
}

// ── Main matching function ─────────────────────────────────────────────────────
// Returns only drivers with score > 0, sorted best-first.
export function matchDrivers(
  shipmentFrom: string,
  shipmentTo: string,
  drivers: Driver[]
): DriverMatch[] {
  const results: DriverMatch[] = [];

  for (const driver of drivers) {
    if (!driver.active) continue; // skip inactive drivers

    let bestScore: MatchScore = 0;
    let bestRoute: PreferredRoute | null = null;
    let bestReason = "";

    for (const route of driver.preferred_routes) {
      const { score, reason } = scoreRoute(route, shipmentFrom, shipmentTo);
      if (score > bestScore) {
        bestScore = score;
        bestRoute = route;
        bestReason = reason;
      }
      if (bestScore === 2) break; // can't do better
    }

    if (bestScore > 0) {
      results.push({ driver, score: bestScore, matchedRoute: bestRoute, reason: bestReason });
    }
  }

  // Sort: full matches first, then partial; within same score sort by rating desc
  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.driver.rating - a.driver.rating;
  });
}

// ── Build webhook payload ──────────────────────────────────────────────────────
export interface WebhookPayload {
  event: "new_shipment";
  shipment_id: string;
  from: string;
  to: string;
  title: string;
  match_score: MatchScore;
  match_reason: string;
  url: string;
}

export function buildWebhookPayload(
  shipmentId: string,
  title: string,
  from: string,
  to: string,
  match: DriverMatch
): WebhookPayload {
  return {
    event: "new_shipment",
    shipment_id: shipmentId,
    from,
    to,
    title,
    match_score: match.score,
    match_reason: match.reason,
    url: `https://on-the-way.app/shipment/${shipmentId}`,
  };
}
