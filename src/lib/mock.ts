// ─────────────────────────────────────────────────────────────────────────────
// Mock data — mirrors Supabase schema exactly.
// Replace with real Supabase queries when you connect your project.
// ─────────────────────────────────────────────────────────────────────────────
import type { Shipment, Bid, User } from "./types";
import { PLATFORM_FEE } from "./types";

export const MOCK_USERS: User[] = [
  { id: "u1", full_name: "יוסי כהן",   email: "yossi@test.com", avatar_url: null, phone: "052-111-1111", role: "driver",  avg_rating: 4.9, completed_trips: 124, verified: true,  created_at: "" },
  { id: "u2", full_name: "מוחמד עלי",  email: "mo@test.com",    avatar_url: null, phone: "053-222-2222", role: "driver",  avg_rating: 4.7, completed_trips: 87,  verified: true,  created_at: "" },
  { id: "u3", full_name: "דני לוי",    email: "dani@test.com",  avatar_url: null, phone: "054-333-3333", role: "driver",  avg_rating: 5.0, completed_trips: 203, verified: true,  created_at: "" },
  { id: "u4", full_name: "שרה אברהם",  email: "sara@test.com",  avatar_url: null, phone: "055-444-4444", role: "sender",  avg_rating: 4.8, completed_trips: 6,   verified: false, created_at: "" },
  { id: "u5", full_name: "רחל כץ",     email: "rachel@test.com",avatar_url: null, phone: "056-555-5555", role: "sender",  avg_rating: 4.5, completed_trips: 2,   verified: false, created_at: "" },
];

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: "s1", owner_id: "u4",
    owner: { id: "u4", full_name: "שרה אברהם", avatar_url: null, avg_rating: 4.8 },
    title: "ספה תלת מושבית",
    category: "ריהוט",
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    description: "ספה כחצי שנה, מצב מצוין, אורך 2.1 מטר",
    from_city: "חיפה", from_floor: 3, from_elevator: true,
    to_city: "תל אביב", to_floor: 0, to_elevator: false,
    help_level: "help_needed", urgency: "flexible",
    pickup_window: "יום ג׳, 22 ביולי 10:00–14:00",
    status: "open", selected_bid_id: null,
    bids_count: 3, lowest_bid: 180, created_at: "",
  },
  {
    id: "s2", owner_id: "u4",
    owner: { id: "u4", full_name: "שרה אברהם", avatar_url: null, avg_rating: 4.8 },
    title: "מכשיר כביסה Samsung",
    category: "מכשיר כביסה",
    image_url: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400&q=80",
    description: null,
    from_city: "ירושלים", from_floor: 1, from_elevator: false,
    to_city: "באר שבע", to_floor: 2, to_elevator: true,
    help_level: "curb_to_curb", urgency: "immediate",
    pickup_window: "מיידי — 3 השעות הקרובות",
    status: "open", selected_bid_id: null,
    bids_count: 1, lowest_bid: 220, created_at: "",
  },
  {
    id: "s3", owner_id: "u5",
    owner: { id: "u5", full_name: "רחל כץ", avatar_url: null, avg_rating: 4.5 },
    title: "ארגזי ספרים (8 קופסאות)",
    category: "קופסאות",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    description: null,
    from_city: "תל אביב", from_floor: 0, from_elevator: false,
    to_city: "חיפה", to_floor: 4, to_elevator: true,
    help_level: "curb_to_curb", urgency: "flexible",
    pickup_window: "יום ה׳, 24 ביולי",
    status: "open", selected_bid_id: null,
    bids_count: 5, lowest_bid: 95, created_at: "",
  },
  {
    id: "s4", owner_id: "u5",
    owner: { id: "u5", full_name: "רחל כץ", avatar_url: null, avg_rating: 4.5 },
    title: "אופני הרים Trek",
    category: "אופניים",
    image_url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&q=80",
    description: null,
    from_city: "נתניה", from_floor: 0, from_elevator: false,
    to_city: "תל אביב", to_floor: 0, to_elevator: false,
    help_level: "curb_to_curb", urgency: "flexible",
    pickup_window: "יום ו׳, 25 ביולי",
    status: "open", selected_bid_id: null,
    bids_count: 2, lowest_bid: 120, created_at: "",
  },
  {
    id: "s5", owner_id: "u4",
    owner: { id: "u4", full_name: "שרה אברהם", avatar_url: null, avg_rating: 4.8 },
    title: "טלוויזיה 65 אינץ׳ Sony",
    category: "מוצרי חשמל",
    image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&q=80",
    description: null,
    from_city: "אשדוד", from_floor: 2, from_elevator: true,
    to_city: "ירושלים", to_floor: 3, to_elevator: true,
    help_level: "help_needed", urgency: "immediate",
    pickup_window: "מיידי — 3 השעות הקרובות",
    status: "open", selected_bid_id: null,
    bids_count: 0, lowest_bid: null, created_at: "",
  },
  {
    id: "s6", owner_id: "u5",
    owner: { id: "u5", full_name: "רחל כץ", avatar_url: null, avg_rating: 4.5 },
    title: "מזרן זוגי 180×200",
    category: "מזרן",
    image_url: "https://images.unsplash.com/photo-1631048501851-6c28cedd5832?w=400&q=80",
    description: null,
    from_city: "רמת גן", from_floor: 0, from_elevator: false,
    to_city: "פתח תקווה", to_floor: 1, to_elevator: false,
    help_level: "help_needed", urgency: "flexible",
    pickup_window: "גמיש — הזמנה פתוחה",
    status: "open", selected_bid_id: null,
    bids_count: 4, lowest_bid: 75, created_at: "",
  },
];

function makeBid(id: string, shipmentId: string, driverId: string, amount: number, eta: string, note?: string): Bid {
  const driver = MOCK_USERS.find(u => u.id === driverId)!;
  return {
    id, shipment_id: shipmentId, driver_id: driverId,
    driver: { id: driver.id, full_name: driver.full_name, avatar_url: driver.avatar_url, avg_rating: driver.avg_rating, completed_trips: driver.completed_trips, verified: driver.verified },
    amount, platform_fee: PLATFORM_FEE, total: amount + PLATFORM_FEE,
    eta, note: note ?? null,
    status: "active", created_at: "",
  };
}

export interface DriverReview {
  id: string;
  driver_id: string;
  sender_name: string;
  rating: number;
  comment: string;
  item: string;
  route: string;
  date: string;
}

export const MOCK_DRIVER_REVIEWS: DriverReview[] = [
  // יוסי כהן u1
  { id:"r1",  driver_id:"u1", sender_name:"שרה א׳",  rating:5, item:"ספה תלת מושבית",   route:"חיפה → ת״א",      date:"לפני שבוע",       comment:"הגיע בזמן, היה זהיר עם הרהיטים. ממליצה בחום!" },
  { id:"r2",  driver_id:"u1", sender_name:"רחל כ׳",  rating:5, item:"מקרר",              route:"ת״א → ירושלים",   date:"לפני שבועיים",    comment:"מקצועי, ידידותי, לא גרם לשריטה. תענוג לעבוד איתו." },
  { id:"r3",  driver_id:"u1", sender_name:"מיכאל ל׳", rating:4, item:"ארגזי引 (12 יח׳)",  route:"ירושלים → רמת גן",date:"לפני 3 שבועות",  comment:"טוב, רק קצת איחר ב-20 דקות." },
  { id:"r4",  driver_id:"u1", sender_name:"דנה ב׳",  rating:5, item:"כיסאות משרד",       route:"נתניה → חיפה",    date:"לפני חודש",       comment:"עזר לפרק ולהרכיב. שירות מעל ומעבר." },
  { id:"r5",  driver_id:"u1", sender_name:"אורן מ׳", rating:5, item:"מכשיר כביסה",       route:"אשדוד → ת״א",     date:"לפני חודש",       comment:"הגיע עם גלגלית ועזר לצאת מהקומה. מצוין." },
  // מוחמד עלי u2
  { id:"r6",  driver_id:"u2", sender_name:"יעל ש׳",  rating:5, item:"מזרן זוגי",          route:"ת״א → רמת גן",    date:"לפני 4 ימים",     comment:"מהיר, נקי, שקט. בדיוק מה שצריך." },
  { id:"r7",  driver_id:"u2", sender_name:"ניר ג׳",  rating:4, item:"אופני הרים",         route:"נתניה → ת״א",     date:"לפני שבועיים",    comment:"הגיע מהר, הכל תקין. יש קצת בעיה עם תיאום שעות." },
  { id:"r8",  driver_id:"u2", sender_name:"תמר ה׳",  rating:5, item:"טלוויזיה 65 אינץ׳", route:"ת״א → ירושלים",   date:"לפני 3 שבועות",  comment:"אריזה מושלמת, הגיע שלם. תודה רבה!" },
  { id:"r9",  driver_id:"u2", sender_name:"גל ר׳",   rating:5, item:"שולחן עבודה",        route:"חיפה → ת״א",      date:"לפני חודש",       comment:"ידידותי ועזרה מלאה. ממליץ." },
  // דני לוי u3
  { id:"r10", driver_id:"u3", sender_name:"לי ק׳",   rating:5, item:"פסנתר עמוד",        route:"ת״א → רחובות",    date:"לפני 5 ימים",     comment:"הכי קשה שיש — פסנתר לקומה 3. עשה את זה בלי בעיה." },
  { id:"r11", driver_id:"u3", sender_name:"אבי נ׳",  rating:5, item:"ריהוט לסלון",       route:"ירושלים → ת״א",   date:"לפני שבוע",       comment:"צוות של שניים, מהירים ומסודרים. ממליץ בחום." },
  { id:"r12", driver_id:"u3", sender_name:"חן ד׳",   rating:5, item:"מכשירי חשמל (6 יח׳)",route:"באר שבע → ת״א",   date:"לפני שבועיים",    comment:"203 הובלות ורואים את הניסיון. כל כבוד." },
  { id:"r13", driver_id:"u3", sender_name:"אמיר ז׳", rating:5, item:"ספריה גדולה",       route:"חיפה → נתניה",    date:"לפני 3 שבועות",  comment:"הגיע עם שני עוזרים, הכל ירד חלק." },
];

export const MOCK_BIDS: Bid[] = [
  makeBid("b1", "s1", "u1", 180, "יום ג׳ 14:00–16:00", "יש לי ואן גדול, יכול לעלות קומה אחת"),
  makeBid("b2", "s1", "u2", 210, "יום ג׳ 10:00–12:00"),
  makeBid("b3", "s1", "u3", 250, "יום ד׳ 08:00–10:00", "שירות מעל ומעבר, עזרה בסידור כלולה"),
  makeBid("b4", "s2", "u1", 220, "היום עד 18:00"),
  makeBid("b5", "s6", "u2",  75, "מחר בבוקר 09:00–11:00"),
  makeBid("b6", "s6", "u3",  90, "היום 16:00–18:00"),
  makeBid("b7", "s6", "u1",  80, "מחר אחה\"צ"),
  makeBid("b8", "s6", "u2",  85, "גמיש לגמרי"),
];
