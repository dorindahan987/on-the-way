export type Region = "הכל" | "צפון" | "מרכז" | "דרום" | "ירושלים";
export type ItemCategory = "ריהוט" | "מוצרי חשמל" | "קופסאות" | "אופניים" | "מכשיר כביסה" | "מזרן" | "אחר";

export interface Shipment {
  id: string;
  title: string;
  category: ItemCategory;
  image: string;
  from: string;
  to: string;
  region: Region;
  date: string; // display string
  hasElevator: boolean;
  curbToCurb: boolean;
  helpNeeded: boolean;
  offersCount: number;
  lowestOffer: number | null;
  postedAt: string; // relative time
  urgent: boolean;
}

export interface Offer {
  id: string;
  shipmentId: string;
  driverName: string;
  driverRating: number;
  driverTrips: number;
  amount: number;
  eta: string;
  note?: string;
}

export const SHIPMENTS: Shipment[] = [
  {
    id: "1",
    title: "ספה תלת מושבית",
    category: "ריהוט",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    from: "חיפה",
    to: "תל אביב",
    region: "מרכז",
    date: "יום ג׳, 22 ביולי",
    hasElevator: true,
    curbToCurb: false,
    helpNeeded: true,
    offersCount: 3,
    lowestOffer: 180,
    postedAt: "לפני 12 דקות",
    urgent: false,
  },
  {
    id: "2",
    title: "מכשיר כביסה Samsung",
    category: "מכשיר כביסה",
    image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400&q=80",
    from: "ירושלים",
    to: "באר שבע",
    region: "דרום",
    date: "מחר, 23 ביולי",
    hasElevator: false,
    curbToCurb: true,
    helpNeeded: false,
    offersCount: 1,
    lowestOffer: 220,
    postedAt: "לפני 28 דקות",
    urgent: true,
  },
  {
    id: "3",
    title: "ארגזי引 引 引 引 引 引引ספרים (8 קופסאות)",
    category: "קופסאות",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    from: "תל אביב",
    to: "חיפה",
    region: "צפון",
    date: "יום ה׳, 24 ביולי",
    hasElevator: true,
    curbToCurb: true,
    helpNeeded: false,
    offersCount: 5,
    lowestOffer: 95,
    postedAt: "לפני 45 דקות",
    urgent: false,
  },
  {
    id: "4",
    title: "אופני הרים Trek",
    category: "אופניים",
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&q=80",
    from: "נתניה",
    to: "תל אביב",
    region: "מרכז",
    date: "יום ו׳, 25 ביולי",
    hasElevator: false,
    curbToCurb: true,
    helpNeeded: false,
    offersCount: 2,
    lowestOffer: 120,
    postedAt: "לפני שעה",
    urgent: false,
  },
  {
    id: "5",
    title: "טלוויזיה 65 אינץ׳ Sony",
    category: "מוצרי חשמל",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&q=80",
    from: "אשדוד",
    to: "ירושלים",
    region: "ירושלים",
    date: "יום א׳, 27 ביולי",
    hasElevator: true,
    curbToCurb: false,
    helpNeeded: true,
    offersCount: 0,
    lowestOffer: null,
    postedAt: "לפני 3 דקות",
    urgent: false,
  },
  {
    id: "6",
    title: "מזרן זוגי 180×200",
    category: "מזרן",
    image: "https://images.unsplash.com/photo-1631048501851-6c28cedd5832?w=400&q=80",
    from: "רמת גן",
    to: "פתח תקווה",
    region: "מרכז",
    date: "היום, 22 ביולי",
    hasElevator: false,
    curbToCurb: false,
    helpNeeded: true,
    offersCount: 4,
    lowestOffer: 75,
    postedAt: "לפני 2 שעות",
    urgent: true,
  },
];

export const OFFERS: Offer[] = [
  {
    id: "o1",
    shipmentId: "1",
    driverName: "יוסי כהן",
    driverRating: 4.9,
    driverTrips: 124,
    amount: 180,
    eta: "22 ביולי, 14:00–16:00",
    note: "יש לי ואן גדול, יכול לעלות קומה אחת",
  },
  {
    id: "o2",
    shipmentId: "1",
    driverName: "מוחמד עלי",
    driverRating: 4.7,
    driverTrips: 87,
    amount: 210,
    eta: "22 ביולי, 10:00–12:00",
  },
  {
    id: "o3",
    shipmentId: "1",
    driverName: "דני לוי",
    driverRating: 5.0,
    driverTrips: 203,
    amount: 250,
    eta: "23 ביולי, 08:00–10:00",
    note: "שירות מעל ומעבר, עזרה בסידור כלולה",
  },
];

export const REGIONS: Region[] = ["הכל", "מרכז", "צפון", "דרום", "ירושלים"];

export const CATEGORIES: ItemCategory[] = [
  "ריהוט",
  "מוצרי חשמל",
  "קופסאות",
  "אופניים",
  "מכשיר כביסה",
  "מזרן",
  "אחר",
];
