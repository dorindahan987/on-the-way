// Shared localStorage layer — replaces Supabase until backend is connected.
// All writes go through these helpers so the schema stays consistent.

import type { Shipment, Bid } from "./types";

const S_KEY = "otw_shipments";
const B_KEY = "otw_bids";

/* ── Shipments ─────────────────────────────────────────────── */

export function getStoredShipments(): Shipment[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(S_KEY) || "[]"); }
  catch { return []; }
}

export function saveShipment(s: Shipment): void {
  try {
    // strip large image if storage quota would be exceeded
    const toSave = { ...s };
    const list = getStoredShipments();
    const i = list.findIndex(x => x.id === toSave.id);
    if (i >= 0) list[i] = toSave; else list.unshift(toSave);
    try {
      localStorage.setItem(S_KEY, JSON.stringify(list));
    } catch {
      // quota exceeded — retry without image_url
      toSave.image_url = null;
      if (i >= 0) list[i] = toSave; else list[0] = toSave;
      localStorage.setItem(S_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error("saveShipment failed:", e);
  }
}

/* ── Bids ──────────────────────────────────────────────────── */

export function getStoredBids(shipmentId?: string): Bid[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(B_KEY) || "[]") as Bid[];
    return shipmentId ? all.filter(b => b.shipment_id === shipmentId) : all;
  } catch { return []; }
}

export function saveBid(b: Bid): void {
  const bids = getStoredBids();
  // prevent duplicate bids from same driver on same shipment
  const exists = bids.some(x => x.shipment_id === b.shipment_id && x.driver_id === b.driver_id);
  if (exists) return;
  bids.unshift(b);
  localStorage.setItem(B_KEY, JSON.stringify(bids));

  // Update shipment's bids_count + lowest_bid
  const ships = getStoredShipments();
  const si = ships.findIndex(s => s.id === b.shipment_id);
  if (si >= 0) {
    const forShip = bids.filter(x => x.shipment_id === b.shipment_id);
    ships[si] = {
      ...ships[si],
      bids_count: forShip.length,
      lowest_bid: Math.min(...forShip.map(x => x.amount)),
    };
    localStorage.setItem(S_KEY, JSON.stringify(ships));
  }
}
