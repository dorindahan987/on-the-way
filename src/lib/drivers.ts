// ── Driver model ──────────────────────────────────────────────────────────────

export interface PreferredRoute {
  from: string;   // city name, or "*" for "any"
  to: string;     // city name, or "*" for "any"
  bidirectional?: boolean; // also match reversed direction
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  trips: number;
  preferred_routes: PreferredRoute[];
  webhook_url?: string; // HTTPS endpoint to POST notifications to
  active: boolean;      // is the driver available right now
}

// ── Mock driver data ───────────────────────────────────────────────────────────

export const DRIVERS: Driver[] = [
  {
    id: "d1",
    name: "יוסי כהן",
    phone: "052-111-1111",
    rating: 4.9,
    trips: 124,
    active: true,
    webhook_url: "https://webhook.site/mock-yossi",
    preferred_routes: [
      { from: "חיפה", to: "תל אביב", bidirectional: true },
      { from: "חיפה", to: "נתניה", bidirectional: true },
    ],
  },
  {
    id: "d2",
    name: "מוחמד עלי",
    phone: "053-222-2222",
    rating: 4.7,
    trips: 87,
    active: true,
    webhook_url: "https://webhook.site/mock-mohammed",
    preferred_routes: [
      { from: "ירושלים", to: "*", bidirectional: false },
      { from: "באר שבע", to: "תל אביב", bidirectional: true },
    ],
  },
  {
    id: "d3",
    name: "דני לוי",
    phone: "054-333-3333",
    rating: 5.0,
    trips: 203,
    active: true,
    webhook_url: "https://webhook.site/mock-danny",
    preferred_routes: [
      { from: "*", to: "*" }, // flexible — any route
    ],
  },
  {
    id: "d4",
    name: "רחל אברהם",
    phone: "055-444-4444",
    rating: 4.6,
    trips: 45,
    active: true,
    webhook_url: "https://webhook.site/mock-rachel",
    preferred_routes: [
      { from: "תל אביב", to: "רמת גן", bidirectional: true },
      { from: "תל אביב", to: "פתח תקווה", bidirectional: true },
      { from: "רמת גן", to: "פתח תקווה", bidirectional: true },
    ],
  },
  {
    id: "d5",
    name: "אמיר חסן",
    phone: "056-555-5555",
    rating: 4.8,
    trips: 67,
    active: false, // not active — will not be notified
    preferred_routes: [
      { from: "אשדוד", to: "תל אביב", bidirectional: true },
    ],
  },
];
