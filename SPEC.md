# On The Way — מפרט פרויקט

## מה זה
פלטפורמת מכרזי הובלה — שולח מפרסם פריט, מובילים מציעים מחיר, שולח בוחר. ללא עמלות למוביל.

---

## 3 סוגי משתמשים

| תפקיד | מסלול | תיאור |
|--------|--------|--------|
| **שולח** (Sender) | `/sender/*` | מפרסם פריטים, מקבל הצעות, נועל ומשלם פיקדון |
| **מוביל** (Driver) | `/driver/*` | עיין בהובלות פתוחות, מגיש הצעות מחיר |
| **אדמין** | `/admin` | ניהול ומעקב כולל |

---

## ניווט ועמודים

### Landing (`/`)
- כותרת + 2 כפתורי כניסה (שולח / מוביל)
- "איך זה עובד" — 3 שלבים לכל צד
- קרוסלה ביקורות (auto-scroll)
- טופס כתיבת ביקורת (שמירה ב-localStorage)
- Footer

### התחברות (`/login`)
- Split layout: פאנל מותג שמאל + טופס ימין
- בחירת תפקיד → מספר טלפון → OTP
- אפשרות Google
- ניתן לעקוף ישירות: `/login?role=sender` או `/login?role=driver`

### שולח — Dashboard (`/sender`)
- ברכה + שם משתמש
- סטטיסטיקות (הובלות, הצעות, הצעה הכי זולה)
- רשימת ההובלות שלי
- באנר "צעדים הבאים"

### שולח — פרסום פריט (`/sender/post`)
- Wizard 3 שלבים: פרטי פריט → מסלול → דחיפות
- עמוד success עם סטטיסטיקות

### שולח — עמוד הובלה + הצעות (`/sender/shipment/[id]`)
- פרטי הפריט + מסלול
- רשימת הצעות מדורגות (זול → יקר)
- כפתור "נעל" → פיקדון → קשר עם מוביל (טלפון + וואטסאפ)
- קישור לפרופיל ציבורי של כל מוביל

### מוביל — פיד הובלות (`/driver`)
- באנר פוטנציאל השתכרות (כחול)
- פילטר אזורים
- כרטיסי עבודה + טופס הגשת מחיר

### מוביל — ההצעות שלי (`/driver/my-bids`)
- רשימת הצעות שהוגשו

### מוביל — פרופיל (`/driver/profile`)
- פרטים אישיים + סטטיסטיקות
- תפריט ניהול

### פרופיל ציבורי מוביל (`/drivers/[id]`) ← חדש
- שם, תג מאומת, דירוג
- סטטיסטיקות: הובלות, ממוצע, ביקורות
- רשימת ביקורות עם: כוכבים, טקסט, פריט, מסלול, שם שולח, תאריך

### אדמין (`/admin`)
- טבלת שולחים, מובילים, הובלות

---

## מיתוג

| פריט | ערך |
|------|-----|
| צבע ראשי — ליים | `#ccf02a` |
| צבע משני — כחול | `#1d44f9` |
| לוגו | `/public/logo.svg` (SVG שקוף) |
| כיוון | RTL עברית |
| פונט | Heebo |
| אין רקעים שחורים | ✓ |

---

## Stack טכני

| שכבה | טכנולוגיה |
|------|-----------|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Auth | Mock (localStorage) → יש להחליף ב-Supabase |
| Data | Mock (`src/lib/mock.ts`) → יש להחליף ב-Supabase |
| Deploy | — |

---

## מבנה Auth

```
AuthProvider (src/lib/auth.tsx)
  ↓
useAuth() → { user, login, logout, ready }
  ↓
user.role === "sender" → /sender/*
user.role === "driver" → /driver/*
```

- `if (!ready) return <loading />` — מניעת מסך לבן
- Layout-level redirect לפי תפקיד

---

## מבנה Data (Mock → Supabase)

```
MOCK_USERS        → users table
MOCK_SHIPMENTS    → shipments table
MOCK_BIDS         → bids table
MOCK_DRIVER_REVIEWS → driver_reviews table
```

---

## עדיפויות לשלב הבא

- [ ] חיבור Supabase (auth + database)
- [ ] העלאת תמונות (Supabase Storage)
- [ ] Push notifications (Expo / OneSignal)
- [ ] מערכת תשלומים (Stripe / Tranzila)
- [ ] אימות נהגים (תעודת רכב, רישיון)
- [ ] דירוג הדדי אחרי הובלה
