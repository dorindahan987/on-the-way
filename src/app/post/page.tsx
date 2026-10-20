"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Camera, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Progress } from "@/components/ui/progress";
import { MatchPreview } from "@/components/MatchPreview";
import { CATEGORIES, type ItemCategory } from "@/lib/data";
import { cn } from "@/lib/utils";

const FLOORS = ["קרקע", "1", "2", "3", "4", "5+"];
const TIME_SLOTS = [
  "בוקר (08:00–12:00)",
  "צהריים (12:00–16:00)",
  "אחה\"צ (16:00–20:00)",
  "גמיש / לא משנה",
];

type FormData = {
  title: string;
  category: ItemCategory | "";
  image: string | null;
  from: string;
  to: string;
  fromFloor: string;
  toFloor: string;
  hasElevator: boolean;
  curbToCurb: boolean;
  helpNeeded: boolean;
  date: string;
  timeSlot: string;
};

const INITIAL: FormData = {
  title: "", category: "", image: null,
  from: "", to: "", fromFloor: "קרקע", toFloor: "קרקע",
  hasElevator: false, curbToCurb: false, helpNeeded: false,
  date: "", timeSlot: "",
};

const STEP_LABELS = ["מה מעבירים?", "מאיפה ולאן?", "מתי?"];

export default function PostPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [done, setDone] = useState(false);

  const set = (key: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canNext = () => {
    if (step === 1) return form.title.trim().length > 0 && form.category !== "";
    if (step === 2) return form.from.trim().length > 0 && form.to.trim().length > 0;
    if (step === 3) return form.date.trim().length > 0 && form.timeSlot !== "";
    return false;
  };

  const handleNext = async () => {
    if (step < 3) { setStep((s) => s + 1); return; }

    setDone(true);
    // Fire matching + webhooks
    try {
      await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `ship-${Date.now()}`,
          title: form.title,
          from: form.from,
          to: form.to,
        }),
      });
    } catch { /* non-blocking */ }
    setTimeout(() => router.push("/"), 2200);
  };

  if (done) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black">הפריט פורסם!</h2>
          <p className="text-muted-foreground text-[15px] max-w-xs leading-relaxed">
            נהגים שנוסעים ממילא יגישו הצעות מחיר. נעדכן אתכם ב-SMS ברגע שתגיע הצעה.
          </p>
          <p className="text-sm text-muted-foreground mt-2">חוזרים לעמוד הבית...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Progress */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-5 pb-2">
        <div className="flex items-center justify-between mb-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
              חזרה
            </button>
          )}
          <div className={cn("flex items-center gap-1.5 mr-auto", step === 1 && "ml-auto mr-0")}>
            {STEP_LABELS.map((label, i) => (
              <span
                key={i}
                className={cn(
                  "text-[12px] font-semibold px-2.5 py-1 rounded-lg transition-all",
                  i + 1 === step ? "bg-primary text-white" : i + 1 < step ? "text-primary" : "text-muted-foreground"
                )}
              >
                {i + 1 < step ? "✓" : `${i + 1}.`} {label}
              </span>
            ))}
          </div>
        </div>
        <Progress value={(step / 3) * 100} className="h-1.5 bg-secondary" />
      </div>

      {/* Form */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 pb-28">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black mb-1">מה מעבירים?</h2>
              <p className="text-sm text-muted-foreground">תמונה וכותרת קצרה מספיקות</p>
            </div>

            {/* Image upload */}
            <button className="w-full h-40 rounded-2xl border-2 border-dashed border-border bg-secondary/50 hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors">
                <Camera className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">הוסיפו תמונה (אופציונלי)</span>
            </button>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">תיאור הפריט *</label>
              <input
                type="text"
                placeholder="למשל: ספה תלת מושבית, מכשיר כביסה..."
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full h-12 bg-white border border-border rounded-2xl px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                dir="rtl"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2.5">קטגוריה *</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => set("category", cat)}
                    className={cn(
                      "text-sm font-medium px-3.5 py-2 rounded-xl border transition-all",
                      form.category === cat
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black mb-1">מאיפה ולאן?</h2>
              <p className="text-sm text-muted-foreground">כתובות ופרטי איסוף/מסירה</p>
            </div>

            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="כתובת איסוף *"
                  value={form.from}
                  onChange={(e) => set("from", e.target.value)}
                  className="flex-1 text-sm bg-transparent placeholder:text-muted-foreground focus:outline-none"
                  dir="rtl"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <MapPin className="w-4 h-4 text-green-500 shrink-0" />
                <input
                  type="text"
                  placeholder="כתובת מסירה *"
                  value={form.to}
                  onChange={(e) => set("to", e.target.value)}
                  className="flex-1 text-sm bg-transparent placeholder:text-muted-foreground focus:outline-none"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Floor selectors */}
            <div className="grid grid-cols-2 gap-3">
              {(["from", "to"] as const).map((dir) => (
                <div key={dir}>
                  <label className="block text-sm font-semibold mb-2">
                    קומה ב{dir === "from" ? "איסוף" : "מסירה"}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {FLOORS.map((f) => (
                      <button
                        key={f}
                        onClick={() => set(dir === "from" ? "fromFloor" : "toFloor", f)}
                        className={cn(
                          "text-sm font-medium px-3 py-1.5 rounded-xl border transition-all",
                          (dir === "from" ? form.fromFloor : form.toFloor) === f
                            ? "bg-primary text-white border-primary"
                            : "bg-white border-border text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Toggles */}
            <div className="space-y-2.5">
              {[
                { key: "hasElevator" as const, label: "יש מעלית", emoji: "🛗" },
                { key: "curbToCurb" as const, label: "מדרכה למדרכה בלבד", emoji: "🚗" },
                { key: "helpNeeded" as const, label: "דרושה עזרה בסחיבה", emoji: "💪" },
              ].map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => set(key, !form[key])}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border font-medium text-sm transition-all",
                    form[key]
                      ? "bg-primary/5 border-primary/30 text-foreground"
                      : "bg-white border-border text-muted-foreground hover:border-primary/20"
                  )}
                >
                  <span>{emoji} {label}</span>
                  <div className={cn(
                    "w-11 h-6 rounded-full transition-all relative",
                    form[key] ? "bg-primary" : "bg-border"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                      form[key] ? "right-1" : "left-1"
                    )} />
                  </div>
                </button>
              ))}
            </div>

            {/* Live driver matching preview */}
            <MatchPreview from={form.from} to={form.to} />
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black mb-1">מתי?</h2>
              <p className="text-sm text-muted-foreground">בחרו תאריך וחלון זמן גמיש</p>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold mb-2">תאריך *</label>
              <div className="relative">
                <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className="w-full h-12 bg-white border border-border rounded-2xl pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Time slot */}
            <div>
              <label className="block text-sm font-semibold mb-2.5">שעות מועדפות *</label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => set("timeSlot", slot)}
                    className={cn(
                      "text-sm font-medium px-3 py-3 rounded-2xl border text-center transition-all",
                      form.timeSlot === slot
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {form.title && (
              <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-wide">סיכום</p>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">פריט:</span> <span className="font-semibold">{form.title}</span></p>
                  {form.from && form.to && <p><span className="text-muted-foreground">מסלול:</span> <span className="font-semibold">{form.from} → {form.to}</span></p>}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-4 pb-6 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            disabled={!canNext()}
            className="w-full h-14 bg-primary text-white text-base font-bold rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all"
          >
            {step < 3 ? "המשך" : "פרסם עכשיו 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
