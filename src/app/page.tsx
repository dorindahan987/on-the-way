"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, BarChart3, Star, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

type Review = { name: string; role: "sender" | "driver"; stars: number; text: string; date: string };

const MOCK_REVIEWS: Review[] = [
  { name:"רחל כהן",    role:"sender", stars:5, date:"לפני 3 ימים",
    text:"קיבלתי 4 הצעות תוך שעה. חסכתי כמעט ₪300 לעומת מה שציפיתי. ממליצה בחום!" },
  { name:"אחמד חלבי",  role:"driver", stars:5, date:"לפני שבוע",
    text:"כל שבוע 3-4 הובלות, בלי עמלות. החודש הרווחתי מעל ₪5,000." },
  { name:"מיכאל לוי",  role:"sender", stars:5, date:"לפני שבועיים",
    text:"הובלת פסנתר. כולם אמרו ₪800, קיבלתי הצעה ב-₪520. הנהג היה מדויק." },
  { name:"שירה אברהם", role:"sender", stars:4, date:"לפני 5 ימים",
    text:"לקח כשעתיים עד שהגיעו הצעות, אבל המחיר שיצא שווה את ההמתנה." },
  { name:"דוד נחמיאס", role:"driver", stars:5, date:"לפני 4 ימים",
    text:"אני קובע את המחיר שלי ובוחר אילו הובלות לקחת. הכי טוב שיש למובילים." },
  { name:"יוסי מזרחי", role:"sender", stars:5, date:"אתמול",
    text:"מקרר + מכונת כביסה מבאר שבע לתל אביב. 3 הצעות, הכל חלק." },
  { name:"נועה שפירא",  role:"sender", stars:5, date:"לפני שבוע",
    text:"ספה + שולחן + 12 קופסאות. המוביל הגיע בזמן, עבד מהר, מחיר הוגן." },
  { name:"קרים עוואד",  role:"driver", stars:5, date:"לפני 3 ימים",
    text:"פלטפורמה מעולה. אני בוחר את הנסיעות שמתאימות לי ומרוויח טוב." },
  { name:"תמר גולן",    role:"sender", stars:4, date:"לפני 6 ימים",
    text:"ניסיתי בהתחלה מתוך סקרנות — ועכשיו אני לא יכולה להעביר בלעדיהם." },
  { name:"עמי ברק",     role:"driver", stars:5, date:"לפני יומיים",
    text:"הלקוחות כבר מחכים למי שיציע מחיר — לא צריך לשכנע כלום. אוהב את זה." },
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [form, setForm] = useState({ name: "", role: "sender" as "sender"|"driver", stars: 5, text: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(user.role === "driver" ? "/driver" : "/sender");
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem("otw_reviews") || "[]") as Review[];
      if (saved.length) setReviews([...saved, ...MOCK_REVIEWS]);
    } catch {}
  }, [user, router]);

  const submitReview = () => {
    if (!form.name.trim() || form.text.trim().length < 10) return;
    const r: Review = { ...form, date: "זה עתה" };
    try {
      const saved = JSON.parse(localStorage.getItem("otw_reviews") || "[]") as Review[];
      saved.unshift(r);
      localStorage.setItem("otw_reviews", JSON.stringify(saved));
      setReviews([r, ...reviews]);
    } catch {}
    setSubmitted(true);
  };

  if (user) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="On The Way" width={80} height={39} unoptimized />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login?role=driver"
              className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors">
              אני מוביל
            </Link>
            <Link href="/login?role=sender&returnTo=/sender/post"
              className="text-sm font-black px-4 py-2 rounded-lg text-black transition-all hover:brightness-105 active:scale-95"
              style={{ background: "#c9f45a" }}>
              פרסם הובלה
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-5 py-14 sm:py-20">
        <h1 className="animate-fade-up text-4xl sm:text-5xl font-black text-zinc-900 leading-tight mb-4"
          style={{ animationDelay: "0.05s" }}>
          מכרזי הובלה.<br />
          <span style={{ color: "#4a6ffe" }}>אתם בוחרים את המחיר.</span>
        </h1>
        <p className="animate-fade-up text-lg text-zinc-500 mb-8 max-w-xl"
          style={{ animationDelay: "0.15s" }}>
          פרסמו פריט בחינם, קבלו הצעות ממובילים, בחרו את הטוב ביותר.
          ללא עמלות. ללא מתווכים.
        </p>
        <div className="animate-fade-up flex flex-wrap gap-3" style={{ animationDelay: "0.25s" }}>
          <Link href="/login?role=sender&returnTo=/sender/post"
            className="inline-flex items-center gap-2 font-black px-6 py-3.5 rounded-xl text-black text-sm transition-all active:scale-95 hover:brightness-105"
            style={{ background: "#c9f45a" }}>
            <Package className="w-4 h-4" />
            יש לי פריט להעביר
          </Link>
          <Link href="/login?role=driver"
            className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm border-2 transition-all active:scale-95 hover:bg-[#4a6ffe]/5"
            style={{ borderColor: "#4a6ffe", color: "#4a6ffe" }}>
            <Truck className="w-4 h-4" />
            יש לי רכב ורוצה לעבוד
          </Link>
        </div>

        {/* Quick stats */}
        <div className="animate-fade-up flex flex-wrap gap-6 mt-10 text-sm text-zinc-400"
          style={{ animationDelay: "0.35s" }}>
          <span><strong className="text-zinc-700">1,240+</strong> הובלות הושלמו</span>
          <span><strong className="text-zinc-700">180+</strong> מובילים פעילים</span>
          <span><strong className="text-zinc-700">40+</strong> ערים</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-zinc-100 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-5 py-12">
          <h2 className="animate-fade-up font-black text-xl text-zinc-900 mb-8">איך זה עובד?</h2>
          <div className="grid sm:grid-cols-2 gap-6">

            {/* Sender */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#c9f45a" }}>
                  <Package className="w-4 h-4 text-black" />
                </div>
                <p className="font-black text-zinc-900">אם יש לך פריט להעביר</p>
              </div>
              <ol className="space-y-3">
                {[
                  "פרסם את הפריט — שם, תמונה, מאיפה לאן",
                  "מובילים שולחים הצעות מחיר",
                  "בחרת? שלם פיקדון קטן וקבל פרטי קשר ישירים",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm text-zinc-600">
                    <span className="font-black text-zinc-300 w-4 shrink-0">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ol>
              <Link href="/login?role=sender&returnTo=/sender/post"
                className="inline-block mt-5 text-sm font-black px-5 py-2.5 rounded-xl text-black"
                style={{ background: "#c9f45a" }}>
                פרסם עכשיו — חינם
              </Link>
            </div>

            {/* Driver */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#4a6ffe" }}>
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <p className="font-black text-zinc-900">אם יש לך רכב</p>
              </div>
              <ol className="space-y-3">
                {[
                  "עיין בהובלות פתוחות לפי אזור",
                  "שלח הצעת מחיר — אתה קובע כמה",
                  "נבחרת? תאמו ישירות בוואטסאפ",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm text-zinc-600">
                    <span className="font-black text-zinc-300 w-4 shrink-0">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ol>
              <Link href="/login?role=driver"
                className="inline-block mt-5 text-sm font-bold px-5 py-2.5 rounded-xl text-white"
                style={{ background: "#4a6ffe" }}>
                ראה הובלות פתוחות
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-black text-xl text-zinc-900">ביקורות משתמשים</h2>
          <div className="flex items-center gap-1.5 text-sm text-zinc-500">
            <Star className="w-4 h-4 fill-[#c9f45a] text-[#c9f45a]" />
            <strong className="text-zinc-900">4.9</strong>
            <span>({reviews.length})</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="marquee-wrap relative overflow-hidden -mx-5 mb-10" dir="ltr">
          {/* fade edges */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
            style={{ background: "linear-gradient(to left, white, transparent)" }} />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
            style={{ background: "linear-gradient(to right, white, transparent)" }} />
          <div className="animate-marquee flex gap-4" dir="ltr" style={{ width: "max-content" }}>
            {[...reviews, ...reviews, ...reviews].map((r, i) => (
              <div key={i} className="w-80 shrink-0 border border-zinc-100 rounded-2xl p-5 bg-white flex flex-col" style={{ minHeight: 180 }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className="w-4 h-4"
                        fill={n <= r.stars ? "#c9f45a" : "none"}
                        style={{ color: n <= r.stars ? "#c9f45a" : "#e5e7eb" }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                    style={r.role === "sender" ? { background:"#c9f45a", color:"#000" } : { background:"#4a6ffe", color:"#fff" }}>
                    {r.role === "sender" ? "שולח" : "מוביל"}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed flex-1 line-clamp-4 mb-4" dir="rtl">{r.text}</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                    style={{ background:"#c9f45a", color:"#000" }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-800">{r.name}</p>
                    <p className="text-[10px] text-zinc-400">{r.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Write review form */}
        <div className="border border-zinc-200 rounded-2xl p-6 max-w-lg mx-auto">
          {submitted ? (
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color:"#4a6ffe" }} />
              <p className="font-bold text-zinc-900">תודה! הביקורת שלך התפרסמה.</p>
            </div>
          ) : (
            <>
              <p className="font-black text-zinc-900 mb-4">כתוב ביקורת</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="שם" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#4a6ffe] transition-colors" dir="rtl" />
                  <div className="flex gap-2">
                    {(["sender","driver"] as const).map(role => (
                      <button key={role} onClick={() => setForm(f => ({ ...f, role }))}
                        className="flex-1 h-10 rounded-lg text-xs font-black border transition-all"
                        style={form.role === role
                          ? role === "sender" ? { background:"#c9f45a", borderColor:"#c9f45a", color:"#000" }
                          : { background:"#4a6ffe", borderColor:"#4a6ffe", color:"#fff" }
                          : { background:"white", borderColor:"#e5e7eb", color:"#9ca3af" }}>
                        {role === "sender" ? "שולח" : "מוביל"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className="w-7 h-7 cursor-pointer transition-transform hover:scale-110"
                      fill={n <= form.stars ? "#c9f45a" : "none"}
                      style={{ color: n <= form.stars ? "#c9f45a" : "#d1d5db" }}
                      onClick={() => setForm(f => ({ ...f, stars: n }))} />
                  ))}
                </div>

                <textarea placeholder="ספר על החוויה שלך..." value={form.text}
                  onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                  rows={3} dir="rtl"
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#4a6ffe] transition-colors resize-none" />

                <button onClick={submitReview}
                  disabled={!form.name.trim() || form.text.trim().length < 10}
                  className="w-full h-10 font-black rounded-lg text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  style={{ background: "#4a6ffe" }}>
                  פרסם ביקורת
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo.svg" alt="On The Way" width={70} height={34} unoptimized />
          <div className="flex items-center gap-5 text-sm text-zinc-400">
            <Link href="/terms" className="hover:text-zinc-700 transition-colors">תקנון</Link>
            <Link href="/terms" className="hover:text-zinc-700 transition-colors">פרטיות</Link>
            <Link href="/admin" className="flex items-center gap-1 hover:text-zinc-700 transition-colors">
              <BarChart3 className="w-3.5 h-3.5" /> ניהול
            </Link>
          </div>
          <p className="text-xs text-zinc-300">© 2025 On The Way</p>
        </div>
      </footer>
    </div>
  );
}
