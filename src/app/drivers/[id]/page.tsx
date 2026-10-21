"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, BadgeCheck, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { MOCK_USERS, MOCK_DRIVER_REVIEWS, type DriverReview } from "@/lib/mock";
import { useAuth } from "@/lib/auth";

const REVIEWS_KEY = "otw_driver_reviews";

function getStoredReviews(driverId: string): DriverReview[] {
  try {
    const all = JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]") as DriverReview[];
    return all.filter(r => r.driver_id === driverId);
  } catch { return []; }
}

function saveReview(r: DriverReview) {
  try {
    const all = JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]") as DriverReview[];
    all.unshift(r);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
  } catch {}
}

export default function DriverPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();

  const driver = MOCK_USERS.find(u => u.id === id && u.role === "driver");
  const mockReviews = MOCK_DRIVER_REVIEWS.filter(r => r.driver_id === id);

  const [storedReviews, setStoredReviews] = useState<DriverReview[]>([]);
  const [form, setForm] = useState({ stars: 5, comment: "", item: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setStoredReviews(getStoredReviews(id));
  }, [id]);

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">המוביל לא נמצא</p>
          <Link href="/" className="text-sm font-bold text-[#4a6ffe]">חזרה לדף הבית</Link>
        </div>
      </div>
    );
  }

  const allReviews = [...storedReviews, ...mockReviews];
  const avgRating = allReviews.length
    ? (allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length).toFixed(1)
    : null;

  const handleSubmitReview = () => {
    if (!form.comment.trim() || form.comment.trim().length < 5) return;
    const r: DriverReview = {
      id: `dr_${Date.now()}`,
      driver_id: id,
      sender_name: user?.name ?? "אנונימי",
      rating: form.stars,
      comment: form.comment.trim(),
      item: form.item.trim() || "הובלה",
      route: "",
      date: "עכשיו",
    };
    saveReview(r);
    setStoredReviews(prev => [r, ...prev]);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50" dir="rtl">

      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-3">
          <Link href={user ? (user.role === "driver" ? "/driver" : "/sender") : "/"} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Image src="/logo.svg" alt="On The Way" width={72} height={35} unoptimized />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-8">

        {/* Driver card */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-2xl font-black shrink-0"
              style={{ background: "#c9f45a", color: "#000" }}>
              {driver.full_name[0]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-zinc-900">{driver.full_name}</h1>
                {driver.verified && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "#4a6ffe" }}>
                    <BadgeCheck className="w-3 h-3" /> מאומת
                  </span>
                )}
              </div>
              {avgRating ? (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-[#c9f45a] text-[#c9f45a]" />
                  <span className="font-black text-zinc-900">{avgRating}</span>
                  <span className="text-zinc-400 text-sm">({allReviews.length} ביקורות)</span>
                </div>
              ) : (
                <p className="text-zinc-400 text-sm mt-1">מוביל חדש — עדיין אין ביקורות</p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-zinc-100">
            <div className="text-center">
              <p className="text-2xl font-black text-zinc-900">{driver.completed_trips}</p>
              <p className="text-xs text-zinc-400 mt-0.5">הובלות</p>
            </div>
            <div className="text-center border-x border-zinc-100">
              <p className="text-2xl font-black text-zinc-900">{avgRating ?? "—"}</p>
              <p className="text-xs text-zinc-400 mt-0.5">ממוצע כוכבים</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-zinc-900">{allReviews.length}</p>
              <p className="text-xs text-zinc-400 mt-0.5">ביקורות</p>
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-black text-zinc-900">ביקורות לקוחות</h2>
        </div>

        {allReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-10 text-center mb-6">
            <Truck className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm">עדיין אין ביקורות</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {allReviews.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-zinc-100 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className="w-4 h-4"
                        fill={n <= r.rating ? "#c9f45a" : "none"}
                        style={{ color: n <= r.rating ? "#c9f45a" : "#e5e7eb" }} />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0">{r.date}</span>
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed mb-4">{r.comment}</p>
                <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                      style={{ background: "#c9f45a", color: "#000" }}>
                      {r.sender_name[0]}
                    </div>
                    <span className="font-semibold text-zinc-600">{r.sender_name}</span>
                  </div>
                  {r.route ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{r.route}
                    </span>
                  ) : (
                    <span>{r.item}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leave a review — for senders only */}
        {user?.role === "sender" && (
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 mb-6">
            <h3 className="font-black text-zinc-900 mb-4">השאר ביקורת</h3>
            {submitted ? (
              <div className="flex items-center gap-3 py-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "#4a6ffe" }} />
                <p className="font-bold text-zinc-900">תודה! הביקורת שלך נשמרה.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n}
                      className="w-8 h-8 cursor-pointer transition-transform hover:scale-110"
                      fill={n <= form.stars ? "#c9f45a" : "none"}
                      style={{ color: n <= form.stars ? "#c9f45a" : "#d1d5db" }}
                      onClick={() => setForm(f => ({ ...f, stars: n }))} />
                  ))}
                </div>
                {/* Item */}
                <input type="text" placeholder="מה הובל? (למשל: ספה, מקרר...)" value={form.item}
                  onChange={e => setForm(f => ({ ...f, item: e.target.value }))}
                  className="w-full h-10 border border-zinc-200 rounded-xl px-3 text-sm focus:outline-none focus:border-[#4a6ffe] transition-colors" dir="rtl" />
                {/* Comment */}
                <textarea placeholder="ספר על החוויה שלך..." value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  rows={3} dir="rtl"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4a6ffe] transition-colors resize-none" />
                <button onClick={handleSubmitReview}
                  disabled={form.comment.trim().length < 5}
                  className="w-full h-11 font-black rounded-xl text-sm text-black disabled:opacity-40 transition-all"
                  style={{ background: "#c9f45a" }}>
                  פרסם ביקורת
                </button>
              </div>
            )}
          </div>
        )}

        {/* CTA for non-logged-in */}
        {!user && (
          <div className="text-center">
            <Link href="/login?role=sender"
              className="inline-flex items-center gap-2 font-black px-6 py-3.5 rounded-xl text-black text-sm"
              style={{ background: "#c9f45a" }}>
              פרסם הובלה ותן ל{driver.full_name.split(" ")[0]} להציע
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
