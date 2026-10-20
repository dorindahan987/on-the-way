// ─────────────────────────────────────────────────────────────────────────────
// Contact Masking — Anti-Disintermediation Guard
// ─────────────────────────────────────────────────────────────────────────────

// Israeli phone patterns: 05X-XXXXXXX / 05XXXXXXXX / +972-5X-XXXXXXX
const PHONE_PATTERN =
  /(\+?972[-\s]?)?0?5[0-9][-\s]?\d{3}[-\s]?\d{4}/g;

// Email pattern
const EMAIL_PATTERN =
  /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// Street address pattern (Hebrew context): "רחוב X" / "ברח׳ X" / "X 12" etc.
const ADDRESS_PATTERN =
  /\b(רחוב|רח'|רח׳|שד'|שדרות|סמטת?|כיכר)\s+[^\s,]+(\s+\d+)?/gi;

const REPLACEMENT_PHONE   = "[📵 טלפון נחשף לאחר נעילת ההזמנה]";
const REPLACEMENT_EMAIL   = "[📧 אימייל נחשף לאחר נעילת ההזמנה]";
const REPLACEMENT_ADDRESS = "[📍 כתובת מלאה נחשפת לאחר נעילת ההזמנה]";

export function maskContactInfo(text: string): { masked: string; wasBlocked: boolean } {
  let masked = text;
  let wasBlocked = false;

  if (PHONE_PATTERN.test(text)) {
    masked = masked.replace(PHONE_PATTERN, REPLACEMENT_PHONE);
    wasBlocked = true;
  }
  PHONE_PATTERN.lastIndex = 0;

  if (EMAIL_PATTERN.test(text)) {
    masked = masked.replace(EMAIL_PATTERN, REPLACEMENT_EMAIL);
    wasBlocked = true;
  }
  EMAIL_PATTERN.lastIndex = 0;

  if (ADDRESS_PATTERN.test(text)) {
    masked = masked.replace(ADDRESS_PATTERN, REPLACEMENT_ADDRESS);
    wasBlocked = true;
  }
  ADDRESS_PATTERN.lastIndex = 0;

  return { masked, wasBlocked };
}

export function containsContactInfo(text: string): boolean {
  PHONE_PATTERN.lastIndex = 0;
  EMAIL_PATTERN.lastIndex = 0;
  ADDRESS_PATTERN.lastIndex = 0;
  const found =
    PHONE_PATTERN.test(text) ||
    EMAIL_PATTERN.test(text) ||
    ADDRESS_PATTERN.test(text);
  PHONE_PATTERN.lastIndex = 0;
  EMAIL_PATTERN.lastIndex = 0;
  ADDRESS_PATTERN.lastIndex = 0;
  return found;
}

// Escrow / fee calculation
export function calcTotal(driverAmount: number, platformFee = 35) {
  return {
    driver: driverAmount,
    fee: platformFee,
    total: driverAmount + platformFee,
    deposit: platformFee, // paid online upfront
    onDelivery: driverAmount, // paid cash on delivery
  };
}
