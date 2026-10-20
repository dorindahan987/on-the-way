"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight, Camera, CheckCircle2, Zap, MapPin,
  ChevronDown, ArrowLeft, Package, Sparkles,
  Armchair, Tv, Box, Bike, WashingMachine, Bed, HelpCircle,
  Car, Users, Calendar,
} from "lucide-react";
import { CATEGORIES, type Shipment, type HelpLevel, type Urgency } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { saveShipment } from "@/lib/storage";
import { cn } from "@/lib/utils";

/* ── Data ────────────────────────────────────────── */
import type { LucideIcon } from "lucide-react";
const CAT_META: Record<string, { icon: LucideIcon; desc: string }> = {
  "ריהוט":          { icon: Armchair,      desc: "ספה, שולחן, מיטה..." },
  "מוצרי חשמל":    { icon: Tv,            desc: "טלויזיה, מקרר, מייבש..." },
  "קופסאות":       { icon: Box,           desc: "קופסאות, ארגזים, שקים..." },
  "אופניים":       { icon: Bike,          desc: "אופניים, קורקינט..." },
  "מכשיר כביסה":  { icon: WashingMachine, desc: "מכונת כביסה, מייבש..." },
  "מזרן":          { icon: Bed,           desc: "מזרן, בסיס מיטה..." },
  "אחר":           { icon: HelpCircle,    desc: "משהו אחר..." },
};

const POPULAR_CITIES = [
  "תל אביב","ירושלים","חיפה","באר שבע","נתניה","פתח תקווה","אשדוד","ראשון לציון",
  "רמת גן","הרצליה","כפר סבא","רחובות","בני ברק","בת ים","חולון","אשקלון",
  "רמת השרון","הוד השרון","רעננה","כפר יונה","נס ציונה","לוד","רמלה","מודיעין",
  "אילת","טבריה","נצרת","נהריה","עכו","קריית שמונה","צפת","כרמיאל","מגדל העמק",
  "עפולה","בית שאן","חדרה","זכרון יעקב","טירת כרמל","קריית אתא","קריית ביאליק",
  "קריית מוצקין","קריית ים","קריית גת","יבנה","גדרה","ראש העין","אלעד","ביתר עילית",
  "בית שמש","מעלה אדומים","ערד","דימונה","נתיבות","שדרות","אופקים","רהט",
  "גבעתיים","בני עייש","גבעת שמואל","אור יהודה","קרית אונו","פתח תקוה","יהוד","טייבה",
  "אום אל פחם","שפרעם","סח׳נין","ירכא","מגאר","דאלית אל כרמל","עיסאוויה",
];
const FLOORS = ["קרקע","1","2","3","4","5+"];

/* ── CityPicker ──────────────────────────────────── */
function CityPicker({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen]   = useState(false);
  const inputVal = value || query;
  const filtered = (value ? value : query)
    ? POPULAR_CITIES.filter(c => c.includes(value || query)).slice(0, 8)
    : POPULAR_CITIES.slice(0, 8);

  return (
    <div>
      <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="relative">
        <div className={cn(
          "flex items-center gap-2.5 border-2 rounded-2xl px-4 h-14 bg-white transition-colors shadow-sm",
          value ? "border-primary" : "border-zinc-200 focus-within:border-primary"
        )}>
          <MapPin className="w-4 h-4 text-zinc-300 shrink-0" />
          <input
            type="text"
            placeholder={placeholder ?? "הקלד עיר..."}
            value={inputVal}
            onChange={e => { setQuery(e.target.value); onChange(""); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => {
              // accept free-form input on blur
              if (query.trim().length > 1) onChange(query.trim());
              setOpen(false);
            }, 150)}
            className="flex-1 text-base font-semibold bg-transparent focus:outline-none placeholder:text-zinc-300 placeholder:font-normal"
          />
          {value && <button onMouseDown={() => { onChange(""); setQuery(""); }} className="text-zinc-300 hover:text-zinc-500">×</button>}
          <ChevronDown className={cn("w-4 h-4 text-zinc-300 transition-transform shrink-0", open && "rotate-180")} />
        </div>
        {open && filtered.length > 0 && (
          <div className="absolute top-full right-0 left-0 mt-1.5 bg-white border border-zinc-100 rounded-2xl shadow-2xl shadow-black/8 z-20 overflow-hidden max-h-56 overflow-y-auto">
            {filtered.map(city => (
              <button
                key={city}
                onMouseDown={() => { onChange(city); setQuery(""); setOpen(false); }}
                className="w-full text-right px-4 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {["תל אביב","ירושלים","חיפה","באר שבע","נתניה"].map(city => (
          <button
            key={city}
            onClick={() => { onChange(city); setQuery(""); }}
            className={cn(
              "text-xs font-bold px-3 py-1.5 rounded-xl border transition-all",
              value === city
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                : "bg-white text-zinc-500 border-zinc-200 hover:border-primary/40 hover:text-primary"
            )}>
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── StepDots progress indicator ─────────────────── */
function StepDots({ current }: { current: number }) {
  const steps = [
    { n: 1, label: "מה?" },
    { n: 2, label: "מסלול" },
    { n: 3, label: "מתי?" },
  ];
  return (
    <div className="flex items-center gap-0" dir="rtl">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300",
              current > s.n
                ? "bg-[#ccf02a] text-black shadow-md shadow-[#ccf02a]/30"
                : current === s.n
                ? "bg-[#1d44f9] text-white shadow-md shadow-[#1d44f9]/30 scale-110"
                : "bg-zinc-100 text-zinc-400"
            )}>
              {current > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
            </div>
            <span className={cn(
              "text-[10px] font-bold",
              current === s.n ? "text-zinc-900" : current > s.n ? "text-[#1d44f9]" : "text-zinc-400"
            )}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              "h-0.5 w-10 sm:w-16 mx-2 mb-5 rounded-full transition-colors duration-500",
              current > s.n + 1 ? "bg-[#ccf02a]" : current > s.n ? "bg-[#1d44f9]" : "bg-zinc-200"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Main ────────────────────────────────────────── */
const FLOORS_NUM = ["קרקע","1","2","3","4","5+"];
function floorNum(f: string) { return f === "קרקע" ? 0 : f === "5+" ? 5 : parseInt(f); }

export default function PostShipmentPage() {
  const { user }            = useAuth();
  const router              = useRouter();
  const [step, setStep]     = useState(1);

  useEffect(() => {
    if (!user) {
      router.replace("/login?role=sender&returnTo=/sender/post");
    }
  }, [user, router]);
  const [done, setDone]     = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64]   = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm]     = useState({
    category: "", title: "", hasImage: false,
    from_city: "", to_city: "",
    from_floor: "קרקע", to_floor: "קרקע",
    from_elevator: false, to_elevator: false,
    help_level: "" as "" | "curb_to_curb" | "help_needed",
    urgency: "" as "" | "flexible" | "immediate",
    notes: "",
  });
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 1) return !!form.category && form.title.trim().length > 1;
    if (step === 2) return !!form.from_city && !!form.to_city && !!form.help_level;
    if (step === 3) return !!form.urgency;
    return false;
  };

  /* ── SUCCESS SCREEN ──────────────────────────── */
  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-4" dir="rtl">
      <div className="max-w-sm w-full text-center">
        <div className="animate-pop-in w-28 h-28 rounded-full bg-[#ccf02a] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#ccf02a]/30">
          <CheckCircle2 className="w-14 h-14 text-black" strokeWidth={1.5} />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-3xl font-black mb-2 text-zinc-900">הפריט פורסם!</h2>
          <p className="text-zinc-500 mb-8 text-base">מובילים יתחילו לשלוח הצעות בקרוב</p>
        </div>

        {/* Stats */}
        <div className="animate-fade-up grid grid-cols-3 gap-3 mb-8" style={{ animationDelay: "0.35s" }}>
          {[
            { value: "3.2", label: "הצעות בממוצע" },
            { value: "2h", label: "עד הצעה ראשונה" },
            { value: "94%", label: "הובלות מושלמות" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-zinc-100 rounded-2xl p-3 shadow-sm">
              <p className="text-xl font-black text-zinc-900">{s.value}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="animate-fade-up space-y-3" style={{ animationDelay: "0.5s" }}>
          <Link href="/sender"
            className="flex items-center justify-center gap-2 bg-primary text-white font-black px-6 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 text-sm">
            <Sparkles className="w-4 h-4" />
            ראה הצעות שיגיעו
          </Link>
          <button onClick={() => { setDone(false); setStep(1); setForm({ category:"",title:"",hasImage:false,from_city:"",to_city:"",from_floor:"קרקע",to_floor:"קרקע",from_elevator:false,to_elevator:false,help_level:"",urgency:"",notes:"" }); }}
            className="w-full text-sm font-semibold text-zinc-400 hover:text-zinc-700 transition-colors py-2">
            פרסם הובלה נוספת
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white" dir="rtl">

      {/* ── HEADER ─────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-zinc-100">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center gap-4">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="w-9 h-9 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <Link href="/sender"
              className="w-9 h-9 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
          <div className="flex-1 flex justify-center">
            <StepDots current={step} />
          </div>
          <div className="w-9 shrink-0" />
        </div>
      </div>

      {/* ── CONTENT ────────────────────────────── */}
      <div key={step} className="animate-step-in flex-1 max-w-xl mx-auto w-full px-4 pt-8 pb-36">

        {/* ═══════════ STEP 1 ═══════════ */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">שלב 1 מתוך 3</p>
              <h1 className="text-3xl font-black text-zinc-900 leading-tight">מה אתה<br />מעביר?</h1>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map(cat => {
                const meta = CAT_META[cat];
                const selected = form.category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => set("category", cat)}
                    className={cn(
                      "relative flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-right transition-all duration-200",
                      selected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
                        : "border-zinc-100 bg-zinc-50 hover:border-zinc-200 hover:bg-white hover:shadow-md"
                    )}>
                    {selected && (
                      <div className="absolute top-2.5 left-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    {(() => { const Icon = meta.icon; return <Icon className={cn("w-6 h-6 shrink-0", selected ? "text-primary" : "text-zinc-400")} />; })()}
                    <div>
                      <p className={cn("font-black text-sm leading-tight", selected ? "text-primary" : "text-zinc-900")}>{cat}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{meta.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Title */}
            {form.category && (
              <div className="animate-fade-up space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest block">שם הפריט</label>
                <input
                  type="text"
                  placeholder="למשל: ספה כחולה 3 מושבים..."
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                  autoFocus
                  className="w-full h-14 border-2 border-zinc-200 rounded-2xl px-4 text-base font-semibold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/8 transition-all placeholder:text-zinc-300 placeholder:font-normal"
                />
              </div>
            )}

            {/* Photo */}
            {form.title.length > 1 && (
              <div className="animate-fade-up">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImagePreview(URL.createObjectURL(file));
                    set("hasImage", true);
                    const reader = new FileReader();
                    reader.onload = ev => setImageBase64(ev.target?.result as string ?? null);
                    reader.readAsDataURL(file);
                  }}
                />
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="תמונת פריט" className="w-full h-48 object-cover" />
                    <button
                      onClick={() => { setImagePreview(null); set("hasImage", false); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-lg font-bold hover:bg-black/80 transition-colors">
                      ×
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                      <p className="text-white text-xs font-bold">תמונה צורפה ✓</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:border-primary hover:bg-primary/5 p-5 transition-all">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white border border-zinc-200">
                      <Camera className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-zinc-800">הוסף תמונה</p>
                      <p className="text-xs text-zinc-400 mt-0.5">פריטים עם תמונה מקבלים 40% יותר הצעות</p>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ STEP 2 ═══════════ */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">שלב 2 מתוך 3</p>
              <h1 className="text-3xl font-black text-zinc-900 leading-tight">מסלול<br />ההובלה</h1>
            </div>

            {/* Route builder */}
            <div className="bg-zinc-50 rounded-3xl p-5 space-y-4 border border-zinc-100">
              <CityPicker label="נקודת איסוף" value={form.from_city} onChange={v => set("from_city", v)} placeholder="מאיפה?" />

              {/* Visual connector */}
              <div className="flex items-center gap-3 py-1 px-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-0.5 h-6 bg-primary/30" />
                  <div className="w-2 h-2 rounded-full bg-[#ccf02a]" />
                </div>
                <div className="flex-1 text-center">
                  {form.from_city && form.to_city
                    ? <p className="text-xs font-bold text-zinc-400">מסלול: {form.from_city} → {form.to_city}</p>
                    : <p className="text-xs text-zinc-300">בחר ערי מוצא ויעד</p>
                  }
                </div>
                <ArrowLeft className="w-4 h-4 text-zinc-300" />
              </div>

              <CityPicker label="נקודת מסירה" value={form.to_city} onChange={v => set("to_city", v)} placeholder="לאן?" />
            </div>

            {/* Floor info */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "קומה באיסוף", floorKey: "from_floor" as const, elevKey: "from_elevator" as const },
                { title: "קומה במסירה", floorKey: "to_floor" as const,   elevKey: "to_elevator" as const },
              ].map(side => (
                <div key={side.title}>
                  <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">{side.title}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {FLOORS.map(f => (
                      <button key={f} onClick={() => set(side.floorKey, f)}
                        className={cn(
                          "min-w-[40px] h-9 px-2.5 rounded-xl border-2 text-xs font-bold transition-all",
                          form[side.floorKey] === f
                            ? "border-primary bg-primary text-white"
                            : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                        )}>{f}</button>
                    ))}
                    <button
                      onClick={() => set(side.elevKey, !form[side.elevKey])}
                      className={cn(
                        "flex items-center gap-1 h-9 px-2.5 rounded-xl border-2 text-xs font-bold transition-all",
                        form[side.elevKey]
                          ? "border-blue-400 bg-blue-50 text-blue-600"
                          : "border-zinc-200 text-zinc-400 hover:border-zinc-300"
                      )}>
                      🛗
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Help level */}
            <div>
              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">כמה עזרה נדרשת?</p>
              <div className="space-y-3">
                {[
                  { v: "curb_to_curb" as const, Icon: Car,   title: "מדרכה למדרכה", sub: "המוביל מגיע לרכב ומוריד לרכב" },
                  { v: "help_needed" as const,  Icon: Users, title: "עזרה בהרמה",    sub: "המוביל עוזר לשאת עד לרכב ומהרכב" },
                ].map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => set("help_level", opt.v)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-right",
                      form.help_level === opt.v
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/8"
                        : "border-zinc-100 bg-zinc-50 hover:border-zinc-200 hover:bg-white"
                    )}>
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                      form.help_level === opt.v ? "bg-primary/10" : "bg-white border border-zinc-200"
                    )}>
                      <opt.Icon className={cn("w-5 h-5", form.help_level === opt.v ? "text-primary" : "text-zinc-400")} />
                    </div>
                    <div className="flex-1">
                      <p className={cn("font-black text-sm", form.help_level === opt.v ? "text-primary" : "text-zinc-900")}>{opt.title}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{opt.sub}</p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all",
                      form.help_level === opt.v ? "border-primary bg-primary" : "border-zinc-300"
                    )}>
                      {form.help_level === opt.v && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ STEP 3 ═══════════ */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">שלב 3 מתוך 3</p>
              <h1 className="text-3xl font-black text-zinc-900 leading-tight">מתי<br />צריך?</h1>
            </div>

            {/* Urgency */}
            <div className="space-y-3">
              {[
                {
                  v: "flexible" as const,
                  Icon: Calendar,
                  title: "גמיש — בשבועיים הקרובים",
                  sub: "יש זמן לקבל הצעות טובות ולבחור בנחת",
                  badge: "מומלץ",
                  badgeColor: "bg-primary/10 text-primary",
                  selectedBorder: "border-primary bg-primary/5",
                },
                {
                  v: "immediate" as const,
                  Icon: Zap,
                  title: "דחוף — ב-3 השעות הקרובות",
                  sub: "מובילים זמינים עכשיו יוצגו ראשונים",
                  badge: "דחוף",
                  badgeColor: "bg-orange-100 text-orange-700",
                  selectedBorder: "border-orange-400 bg-orange-50",
                },
              ].map(opt => (
                <button
                  key={opt.v}
                  onClick={() => set("urgency", opt.v)}
                  className={cn(
                    "w-full flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-right",
                    form.urgency === opt.v ? opt.selectedBorder : "border-zinc-100 bg-zinc-50 hover:border-zinc-200 hover:bg-white"
                  )}>
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors mt-0.5",
                    form.urgency === opt.v ? "bg-white shadow-md" : "bg-white border border-zinc-200"
                  )}>
                    <opt.Icon className={cn("w-6 h-6", form.urgency === opt.v && opt.v === "immediate" ? "text-orange-500" : form.urgency === opt.v ? "text-primary" : "text-zinc-400")} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={cn("font-black text-sm leading-tight", form.urgency === opt.v && opt.v === "immediate" ? "text-orange-700" : form.urgency === opt.v ? "text-primary" : "text-zinc-900")}>
                        {opt.title}
                      </p>
                      <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full shrink-0", opt.badgeColor)}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{opt.sub}</p>
                  </div>
                  {form.urgency === opt.v && (
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1", opt.v === "immediate" ? "bg-orange-500" : "bg-primary")}>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest block mb-2">הערות למוביל (אופציונלי)</label>
              <textarea
                placeholder={`"זמין רק בבוקר"\n"הכניסה מאחורי הבניין"\n"צריך 2 אנשים להרמה"...`}
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
                rows={3}
                className="w-full border-2 border-zinc-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/8 transition-all placeholder:text-zinc-300 leading-relaxed"
              />
            </div>

            {/* Live preview card */}
            <div className="rounded-3xl p-5" style={{ background: "#1d44f9" }}>
              <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-4">תצוגה מקדימה · כך ייראה מוביל</p>
              <div className="bg-white/8 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  {(() => { const M = CAT_META[form.category]; return M ? <M.icon className="w-6 h-6 text-white/70" /> : null; })()}
                  <div>
                    <p className="text-white font-black text-sm">{form.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{form.from_city} → {form.to_city}</p>
                  </div>
                  {form.urgency === "immediate" && (
                    <div className="mr-auto flex items-center gap-1 text-[10px] font-black text-orange-400 bg-orange-400/15 px-2 py-1 rounded-lg">
                      <Zap className="w-3 h-3" fill="currentColor" /> דחוף
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[10px] bg-white/8 text-white/50 px-2 py-1 rounded-lg">קומה {form.from_floor}</span>
                  {form.from_elevator && <span className="text-[10px] bg-white/8 text-white/50 px-2 py-1 rounded-lg">🛗 מעלית</span>}
                  <span className="text-[10px] bg-white/8 text-white/50 px-2 py-1 rounded-lg">{form.help_level === "curb_to_curb" ? "🚗 מדרכה" : "💪 עזרה"}</span>
                </div>
              </div>
              <p className="text-white/20 text-[10px] text-center mt-3">ממוצע 3.2 הצעות תוך שעתיים</p>
            </div>
          </div>
        )}
      </div>

      {/* ── STICKY BOTTOM CTA ──────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white/96 backdrop-blur-md border-t border-zinc-100 px-4 py-4 pb-safe">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => {
              if (step < 3) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: "instant" }); return; }
              // Save shipment to shared localStorage
              const s: Shipment = {
                id: `ship_${Date.now()}`,
                owner_id: user?.id ?? "guest",
                owner: { id: user?.id ?? "guest", full_name: user?.name ?? "אורח", avatar_url: null, avg_rating: 0 },
                title: form.title,
                category: form.category as Shipment["category"],
                image_url: imageBase64 ?? null,
                description: null,
                from_city: form.from_city,
                from_floor: floorNum(form.from_floor),
                from_elevator: form.from_elevator,
                to_city: form.to_city,
                to_floor: floorNum(form.to_floor),
                to_elevator: form.to_elevator,
                help_level: form.help_level as HelpLevel,
                urgency: form.urgency as Urgency,
                pickup_window: form.urgency === "immediate" ? "מיידי — 3 השעות הקרובות" : "גמיש — בשבועיים הקרובים",
                status: "open",
                selected_bid_id: null,
                bids_count: 0,
                lowest_bid: null,
                created_at: new Date().toISOString(),
              };
              saveShipment(s);
              setDone(true);
            }}
            disabled={!canNext()}
            className={cn(
              "w-full h-14 font-black rounded-2xl text-base transition-all active:scale-[0.98]",
              !canNext() && "bg-zinc-100 text-zinc-300 cursor-not-allowed"
            )}
            style={canNext() ? { background: "#ccf02a", color: "#000", boxShadow: "0 4px 20px rgba(204,240,42,0.4)" } : {}}>
            {!canNext()
              ? step === 1 ? "בחר קטגוריה ושם לפריט" : step === 2 ? "מלא מסלול ורמת עזרה" : "בחר זמן"
              : step < 3
              ? `המשך לשלב ${step + 1} →`
              : "פרסם עכשיו"}
          </button>
        </div>
      </div>
    </div>
  );
}
