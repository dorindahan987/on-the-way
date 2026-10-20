"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft, Zap, Send, MapPin, Clock,
  BadgeCheck, ChevronLeft, CheckCircle2, X, Upload,
} from "lucide-react";
import { MOCK_SHIPMENTS } from "@/lib/mock";
import { CATEGORY_EMOJI, type Region, REGIONS } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function DriverFeedPage() {
  const { user, updateUser }      = useAuth();
  const [region, setRegion]       = useState<Region>("הכל");
  const [openBid, setOpenBid]     = useState<string | null>(null);
  const [bids, setBids]           = useState<Record<string, { amount: string; note: string }>>({});
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [showVerify, setShowVerify] = useState(false);
  const [verifySent, setVerifySent] = useState(false);

  const feed = MOCK_SHIPMENTS.filter(s =>
    s.status === "open" &&
    (region === "הכל" || s.from_city.includes(region) || s.to_city.includes(region))
  );

  const avgBid = feed.length
    ? Math.round(feed.reduce((a, s) => a + (s.lowest_bid ?? 180), 0) / feed.length)
    : 0;

  const handleBidChange = (id: string, field: string, value: string) =>
    setBids(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const submitBid = (id: string) => {
    setSubmitted(prev => new Set([...prev, id]));
    setOpenBid(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6" dir="rtl">

      {/* ── Verification modal ─────────────────── */}
      {showVerify && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowVerify(false); }}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-zinc-900 text-lg">אימות זהות מוביל</h3>
              <button onClick={() => setShowVerify(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>

            {verifySent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#ccf02a" }}>
                  <CheckCircle2 className="w-8 h-8 text-black" />
                </div>
                <p className="font-black text-zinc-900 text-lg mb-2">הבקשה נשלחה!</p>
                <p className="text-zinc-500 text-sm">נבדוק את המסמכים ונחזור תוך 24 שעות.</p>
                <button onClick={() => { setShowVerify(false); setVerifySent(false); }}
                  className="mt-6 w-full h-12 font-black rounded-2xl text-black text-sm"
                  style={{ background: "#ccf02a" }}>
                  סגור
                </button>
              </div>
            ) : (
              <>
                <p className="text-zinc-500 text-sm mb-5 leading-relaxed">
                  אימות מגדיל את הסיכוי לקבל הובלות. נדרשים 2 מסמכים:
                </p>
                <div className="space-y-3 mb-6">
                  {[
                    { label: "תעודת זהות", sub: "צילום קדמי ואחורי" },
                    { label: "רישיון נהיגה", sub: "בתוקף" },
                  ].map(doc => (
                    <label key={doc.label}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-[#1d44f9]/40 cursor-pointer transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                        <Upload className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-zinc-800">{doc.label}</p>
                        <p className="text-xs text-zinc-400">{doc.sub}</p>
                      </div>
                      <input type="file" accept="image/*,.pdf" className="hidden" />
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setVerifySent(true);
                    updateUser({ verified: false }); // stays false until admin approves
                  }}
                  className="w-full h-13 font-black rounded-2xl text-black text-sm py-3"
                  style={{ background: "#ccf02a" }}>
                  שלח לאימות
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Top header ────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-zinc-900 mb-0.5">הובלות פתוחות</h1>
        <p className="text-zinc-400 text-sm">{feed.length} הובלות ממתינות להצעה שלך</p>
      </div>

      {/* ── Earnings banner ───────────────────── */}
      <div className="rounded-3xl p-5 mb-4 overflow-hidden relative" style={{ background: "#1d44f9" }}>
        <div className="absolute top-0 left-0 w-48 h-48 bg-[#ccf02a]/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-xs font-semibold mb-1 uppercase tracking-wide">ממוצע לכל הובלה</p>
            <p className="text-white font-black text-3xl leading-none">₪{avgBid}</p>
            <p className="text-white/60 text-xs mt-1.5">{feed.length} הובלות פתוחות · שלח הצעה ותרוויח</p>
          </div>
          <div className="shrink-0 text-center bg-[#ccf02a]/15 border border-[#ccf02a]/20 rounded-2xl px-4 py-3">
            <p className="text-[#ccf02a] font-black text-2xl leading-none">{feed.length}</p>
            <p className="text-white/50 text-[10px] mt-1">הובלות</p>
          </div>
        </div>
      </div>

      {/* ── Verification CTA ──────────────────── */}
      {!user?.verified && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6">
          <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-blue-800 font-bold text-sm">קבל תג &ldquo;נהג מאומת&rdquo;</p>
            <p className="text-blue-400 text-xs mt-0.5">מובילים מאומתים מקבלים 3× יותר הובלות</p>
          </div>
          <button
            onClick={() => setShowVerify(true)}
            className="text-xs font-bold text-blue-600 bg-white border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors shrink-0">
            אמת →
          </button>
        </div>
      )}

      {/* ── Region filters ────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 [scrollbar-width:none]">
        {REGIONS.map(r => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={cn(
              "shrink-0 text-sm font-bold px-4 py-2 rounded-2xl transition-all border",
              region === r
                ? "bg-[#ccf02a] text-black border-[#ccf02a] shadow-md shadow-[#ccf02a]/20"
                : "bg-white border-zinc-200 text-zinc-500 hover:border-[#ccf02a]/50 hover:text-[#1d44f9]"
            )}>
            {r}
          </button>
        ))}
      </div>

      {/* ── Job cards ─────────────────────────── */}
      {feed.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-100 p-16 text-center">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="font-black text-zinc-900 mb-1">אין הובלות באזור זה</p>
          <p className="text-sm text-zinc-400">נסה אזור אחר או בדוק שוב מחר</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feed.map(s => {
            const isOpen      = openBid === s.id;
            const isSubmitted = submitted.has(s.id);
            const bid         = bids[s.id] ?? { amount: "", note: "" };
            const budget      = s.lowest_bid ?? 180;

            return (
              <div
                key={s.id}
                className={cn(
                  "bg-white rounded-3xl border overflow-hidden transition-all duration-200",
                  isOpen
                    ? "border-[#ccf02a]/40 shadow-xl shadow-[#ccf02a]/5"
                    : isSubmitted
                    ? "border-[#ccf02a]/30 bg-[#ccf02a]/5"
                    : "border-zinc-100 hover:border-zinc-200 hover:shadow-lg"
                )}>

                {/* ── Card body ─────────────── */}
                <div className="flex gap-4 p-4 sm:p-5">
                  {/* Thumbnail */}
                  {s.image_url && (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                      <Image src={s.image_url} alt={s.title} fill className="object-cover" sizes="80px" />
                      {s.urgency === "immediate" && (
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/70 via-transparent to-transparent flex items-end justify-center pb-1.5">
                          <span className="text-[9px] font-black text-white flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" fill="currentColor" />דחוף
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-black text-[15px] line-clamp-1 text-zinc-900 leading-tight">{s.title}</h3>
                      <span className="text-base shrink-0">{CATEGORY_EMOJI[s.category]}</span>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-1.5 mb-3 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                      <span className="font-bold text-zinc-800">{s.from_city}</span>
                      <ArrowLeft className="w-3 h-3 text-zinc-300 shrink-0" />
                      <span className="font-bold text-zinc-800">{s.to_city}</span>
                    </div>

                    {/* Tags + CTA */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-1.5 flex-wrap">
                        {s.urgency === "immediate" && (
                          <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2 py-1 rounded-lg font-bold flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" fill="currentColor" />דחוף
                          </span>
                        )}
                        {s.from_elevator && (
                          <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-1 rounded-lg font-medium">🛗 מעלית</span>
                        )}
                        {s.help_level === "help_needed" && (
                          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-lg font-medium">💪 עזרה</span>
                        )}
                        {s.bids_count > 0 && (
                          <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-1 rounded-lg font-medium">{s.bids_count} הצעות</span>
                        )}
                      </div>

                      {isSubmitted ? (
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#1d44f9] bg-[#ccf02a]/15 border border-[#ccf02a]/30 px-3 py-1.5 rounded-xl shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          נשלחה
                        </div>
                      ) : (
                        <button
                          onClick={() => setOpenBid(isOpen ? null : s.id)}
                          className={cn(
                            "flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-2xl transition-all shrink-0",
                            isOpen
                              ? "bg-[#ccf02a] text-black shadow-md shadow-[#ccf02a]/20"
                              : "bg-[#ccf02a]/15 text-[#1d44f9] hover:bg-[#ccf02a]/25 border border-[#ccf02a]/30"
                          )}>
                          <Send className="w-3.5 h-3.5" />
                          הצע מחיר
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Time + budget strip ───── */}
                {!isOpen && (
                  <div className="px-5 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Clock className="w-3 h-3" />
                      <span>{s.pickup_window}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-zinc-400">הצעות</span>
                      <span className="font-black text-[#1d44f9]">₪{Math.round(budget * 0.85)}–{budget}</span>
                    </div>
                  </div>
                )}

                {/* ── Bid form ──────────────── */}
                {isOpen && (
                  <div className="border-t border-zinc-100 p-5 bg-gradient-to-b from-zinc-50/60 to-white">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-black text-zinc-900">הגשת הצעת מחיר</p>
                      <p className="text-xs text-zinc-400">הצעות קיימות: ₪{Math.round(budget * 0.85)}–{budget}</p>
                    </div>

                    {/* Price input — hero */}
                    <div className="relative mb-3">
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-black text-zinc-300 pointer-events-none">₪</div>
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="כמה תיקח?"
                        value={bid.amount}
                        onChange={e => handleBidChange(s.id, "amount", e.target.value)}
                        className="w-full h-16 bg-white border-2 border-zinc-200 rounded-2xl pr-10 pl-4 text-2xl font-black focus:outline-none focus:border-[#1d44f9] focus:ring-4 focus:ring-[#1d44f9]/10 transition-all placeholder:font-normal placeholder:text-lg placeholder:text-zinc-200"
                        autoFocus
                      />
                      {bid.amount && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                          {Number(bid.amount) < budget
                            ? <span className="text-[#1d44f9] font-bold">מתחת לממוצע — תחרותי!</span>
                            : <span>מעל הממוצע</span>}
                        </div>
                      )}
                    </div>

                    {/* Note */}
                    <input
                      type="text"
                      placeholder="הערה קצרה (אופציונלי) — למשל: 'יש לי 2 עוזרים'"
                      value={bid.note}
                      onChange={e => handleBidChange(s.id, "note", e.target.value)}
                      dir="rtl"
                      className="w-full h-12 bg-white border-2 border-zinc-200 rounded-2xl px-4 text-sm mb-4 focus:outline-none focus:border-[#1d44f9] focus:ring-4 focus:ring-[#1d44f9]/10 transition-all placeholder:text-zinc-300"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => setOpenBid(null)}
                        className="h-12 px-5 rounded-2xl border-2 border-zinc-200 text-zinc-500 font-bold text-sm hover:bg-zinc-50 transition-colors">
                        ביטול
                      </button>
                      <button
                        onClick={() => submitBid(s.id)}
                        disabled={!bid.amount}
                        className="flex-1 h-12 bg-[#ccf02a] text-black font-black rounded-2xl text-sm hover:bg-[#b8d920] active:scale-[0.98] disabled:opacity-30 transition-all shadow-lg shadow-[#ccf02a]/25">
                        {bid.amount ? `שלח הצעה — ₪${bid.amount}` : "שלח הצעת מחיר"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Post-submit state ─────── */}
                {isSubmitted && (
                  <div className="border-t border-[#ccf02a]/30 px-5 py-3 bg-[#ccf02a]/8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#1d44f9]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>הצעתך <strong>₪{bids[s.id]?.amount}</strong> נשלחה · ממתין לתגובת הלקוח</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-[#ccf02a]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
