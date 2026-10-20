import { NextRequest, NextResponse } from "next/server";
import { DRIVERS } from "@/lib/drivers";
import { matchDrivers, buildWebhookPayload, type WebhookPayload } from "@/lib/matching";

// ── POST /api/shipments ────────────────────────────────────────────────────────
// Body: { id, title, from, to, ...rest }
// 1. Runs matching function against all active drivers
// 2. Fires webhooks to matching drivers (fire-and-forget, non-blocking)
// 3. Returns the matches + webhook dispatch results

export interface DispatchResult {
  driver_id: string;
  driver_name: string;
  score: number;
  reason: string;
  webhook_url: string | undefined;
  webhook_status: "sent" | "failed" | "no_url";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, title, from, to } = body as {
    id: string;
    title: string;
    from: string;
    to: string;
  };

  if (!from || !to || !title) {
    return NextResponse.json({ error: "from, to and title are required" }, { status: 400 });
  }

  // ── 1. Run matching ────────────────────────────────────────────────────────
  const matches = matchDrivers(from, to, DRIVERS);

  // ── 2. Fire webhooks (parallel, non-blocking) ──────────────────────────────
  const dispatchResults: DispatchResult[] = await Promise.all(
    matches.map(async (match): Promise<DispatchResult> => {
      const base: Omit<DispatchResult, "webhook_status"> = {
        driver_id:   match.driver.id,
        driver_name: match.driver.name,
        score:       match.score,
        reason:      match.reason,
        webhook_url: match.driver.webhook_url,
      };

      if (!match.driver.webhook_url) {
        return { ...base, webhook_status: "no_url" };
      }

      const payload: WebhookPayload = buildWebhookPayload(
        id ?? `tmp-${Date.now()}`,
        title,
        from,
        to,
        match
      );

      try {
        const res = await fetch(match.driver.webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(5000), // 5s timeout per webhook
        });
        return { ...base, webhook_status: res.ok ? "sent" : "failed" };
      } catch {
        return { ...base, webhook_status: "failed" };
      }
    })
  );

  // ── 3. Return results ──────────────────────────────────────────────────────
  return NextResponse.json({
    shipment: { id, title, from, to },
    matched_count: matches.length,
    notified_count: dispatchResults.filter((r) => r.webhook_status === "sent").length,
    dispatch: dispatchResults,
  });
}

// ── GET /api/shipments/match?from=X&to=Y  (preview without firing webhooks) ──
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "";
  const to   = searchParams.get("to")   ?? "";

  if (!from || !to) {
    return NextResponse.json({ error: "from and to params required" }, { status: 400 });
  }

  const matches = matchDrivers(from, to, DRIVERS);

  return NextResponse.json({
    from,
    to,
    matched: matches.map((m) => ({
      driver_id:   m.driver.id,
      driver_name: m.driver.name,
      score:       m.score,
      reason:      m.reason,
      rating:      m.driver.rating,
    })),
  });
}
