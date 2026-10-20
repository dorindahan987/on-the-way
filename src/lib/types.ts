// ─────────────────────────────────────────────────────────────────────────────
// Core domain types — mirrors the Supabase schema
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "sender" | "driver";
export type HelpLevel = "curb_to_curb" | "help_needed";
export type Urgency = "flexible" | "immediate";
export type ShipmentStatus = "open" | "locked" | "in_progress" | "completed" | "cancelled";
export type BidStatus = "active" | "selected" | "rejected";

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;          // masked until deal locked
  role: UserRole;
  avg_rating: number;
  completed_trips: number;
  verified: boolean;
  created_at: string;
}

export interface Shipment {
  id: string;
  owner_id: string;
  owner: Pick<User, "id" | "full_name" | "avatar_url" | "avg_rating">;

  title: string;
  category: "ריהוט" | "מוצרי חשמל" | "קופסאות" | "אופניים" | "מכשיר כביסה" | "מזרן" | "אחר";
  image_url: string | null;
  description: string | null;

  from_city: string;
  from_floor: number;
  from_elevator: boolean;

  to_city: string;
  to_floor: number;
  to_elevator: boolean;

  help_level: HelpLevel;
  urgency: Urgency;
  pickup_window: string | null;   // e.g. "יום ג׳, 22 ביולי 10:00–13:00"

  status: ShipmentStatus;
  selected_bid_id: string | null;

  bids_count: number;
  lowest_bid: number | null;

  created_at: string;
}

export interface Bid {
  id: string;
  shipment_id: string;
  driver_id: string;
  driver: Pick<User, "id" | "full_name" | "avatar_url" | "avg_rating" | "completed_trips" | "verified">;

  amount: number;           // net amount to driver (ILS)
  platform_fee: number;     // platform commission (ILS)
  total: number;            // amount + platform_fee — shown to sender

  eta: string;              // e.g. "יום ג׳ בין 10:00–12:00"
  note: string | null;

  status: BidStatus;
  created_at: string;
}

export interface Review {
  id: string;
  shipment_id: string;
  driver_id: string;
  sender_id: string;
  rating: number;           // 1–5
  comment: string | null;
  created_at: string;
}

// ── UI helpers ──────────────────────────────────────────────────────────────

export const PLATFORM_FEE = 35; // ILS — keep in sync with env

export const CATEGORIES: Shipment["category"][] = [
  "ריהוט",
  "מוצרי חשמל",
  "קופסאות",
  "אופניים",
  "מכשיר כביסה",
  "מזרן",
  "אחר",
];

export const CATEGORY_EMOJI: Record<Shipment["category"], string> = {
  ריהוט: "🛋️",
  "מוצרי חשמל": "📺",
  קופסאות: "📦",
  אופניים: "🚲",
  "מכשיר כביסה": "🫧",
  מזרן: "🛏️",
  אחר: "📦",
};

export const REGIONS = ["הכל", "מרכז", "שרון", "צפון", "דרום", "ירושלים"] as const;
export type Region = (typeof REGIONS)[number];

export const CITY_TO_REGION: Record<string, Region> = {
  "תל אביב": "מרכז", "רמת גן": "מרכז", "גבעתיים": "מרכז", "בני ברק": "מרכז",
  "פתח תקווה": "מרכז", "ראשון לציון": "מרכז", "חולון": "מרכז", "בת ים": "מרכז",
  "אשדוד": "דרום", "אשקלון": "דרום", "באר שבע": "דרום", "אילת": "דרום",
  "חיפה": "צפון", "נצרת": "צפון", "עכו": "צפון", "טבריה": "צפון",
  "ירושלים": "ירושלים", "מודיעין": "ירושלים",
  "נתניה": "שרון", "הרצליה": "שרון", "כפר סבא": "שרון", "רעננה": "שרון",
};
