"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight, Star, Shield, Zap, CheckCircle2,
  ArrowLeft, BadgeCheck, Phone, MessageCircle,
  Clock, MapPin, Trophy,
} from "lucide-react";
import { MOCK_SHIPMENTS, MOCK_BIDS } from "@/lib/mock";
import { getStoredShipments, getStoredBids } from "@/lib/storage";
import { calcTotal } from "@/lib/contact-mask";
import { PLATFORM_FEE } from "@/lib/types";
import { cn } from "@/lib/utils";

const RANK_STYLES = [
  { bg: "bg-amber-400",  text: "text-amber-700",  ring: "ring-amber-200",  label: "הזול ביותר" },
  { bg: "bg-zinc-300",   text: "text-zinc-600",   ring: "ring-zinc-100",   label: "2" },
  { bg: "bg-orange-300", text: "text-orange-700", ring: "ring-orange-100", label: "3" },
];

export default function SenderShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }   = use(params);
  const shipment = MOCK_SHIPMENTS.find(s => s.id === id) ?? getStoredShipments().find(s => s.id === id);
  const bids     = [
    ...MOCK_BIDS.filter(b => b.shipment_id === id),
    ...getStoredBids(id),
  ].sort((a, b) => a.amount - b.amount);
  const [selected, setSelected] = useState<string | null>(null);
  const [locked,   setLocked]   = useState(false);

  if (!shipment) return (
    <div className="p-8 text-center text-zinc-500">הובלה לא נמצאה</div>
  );

  /* ── POST-LOCK SUCCESS SCREEN ──────────────────── */
  if (locked) {
    const bid = bids.find(b => b.id === selected)!;
    const firstName = bid.driver.full_name.split(" ")[0];
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white" dir="rtl">
        <div className="max-w-lg mx-auto px-4 pt-12 pb-16">

          {/* Check + congrats */}
          <div className="text-center mb-10">
            <div className="animate-pop-in w-28 h-28 rounded-full bg-[#ccf02a] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#ccf02a]/30">
              <CheckCircle2 className="w-14 h-14 text-black" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black mb-2 text-zinc-900 animate-fade-up">ההובלה ננעלה!</h2>
            <p className="text-zinc-500 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {firstName} מחכה לתיאום איתך
            </p>
          </div>

          {/* Driver contact card */}
          <div className="animate-fade-up bg-white rounded-3xl border border-zinc-100 shadow-xl overflow-hidden mb-4" style={{ animationDelay: "0.2s" }}>
            {/* Header */}
            <div className="px-5 py-5 flex items-center gap-4 border-b border-zinc-50">
              <div className="w-16 h-16 rounded-full bg-[#ccf02a] flex items-center justify-center text-black font-black text-xl shrink-0 shadow-lg shadow-[#ccf02a]/25">
                {bid.driver.full_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-black text-zinc-900 text-lg leading-none">{bid.driver.full_name}</p>
                  {bid.driver.verified && <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  <span>{bid.driver.avg_rating}</span>
                  <span className="text-zinc-300">·</span>
                  <span>{bid.driver.completed_trips} הובלות</span>
                  {bid.driver.verified && (
                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">מאומת ✓</span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:052-111-1111"
                  className="flex items-center justify-center gap-2 text-white font-bold text-sm h-12 rounded-2xl transition-colors active:scale-[0.98]" style={{ background: "#1d44f9" }}>
                  <Phone className="w-4 h-4" />
                  חייג עכשיו
                </a>
                <a
                  href={`https://wa.me/972521111111?text=${encodeURIComponent(`שלום ${firstName}, אני ${shipment.owner.full_name}. קיבלתי את הצעתך להובלה דרך על הדרך — ${shipment.title} מ${shipment.from_city} ל${shipment.to_city}. נוכל לתאם?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25d366] text-white font-bold text-sm h-12 rounded-2xl hover:bg-[#22be5c] transition-colors active:scale-[0.98]">
                  <MessageCircle className="w-4 h-4" />
                  וואטסאפ
                </a>
              </div>

              {/* ETA */}
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-sm font-semibold text-amber-800">{bid.eta}</p>
              </div>

              {/* Payment breakdown */}
              <div className="bg-zinc-50 rounded-2xl p-4 space-y-2.5">
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">פירוט תשלום</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    דמי שריון (שולמו)
                  </div>
                  <span className="font-black text-zinc-900">₪{PLATFORM_FEE}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    יתרה למוביל במסירה
                  </div>
                  <span className="font-black text-zinc-900">₪{bid.amount}</span>
                </div>
                <div className="border-t border-zinc-200 pt-2.5 flex items-center justify-between">
                  <span className="text-sm font-black text-zinc-700">סה״כ</span>
                  <span className="text-primary font-black text-lg">₪{bid.amount + PLATFORM_FEE}</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/sender"
            className="flex items-center justify-center gap-2 text-zinc-400 font-semibold text-sm hover:text-zinc-700 transition-colors py-2">
            <ChevronRight className="w-4 h-4" />
            חזרה לכל ההובלות שלי
          </Link>
        </div>
      </div>
    );
  }

  /* ── MAIN SHIPMENT VIEW ────────────────────────── */
  return (
    <div className="max-w-5xl mx-auto px-4 py-6" dir="rtl">
      <Link
        href="/sender"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-900 mb-6 transition-colors group font-medium">
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        חזרה
      </Link>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* ── LEFT: Shipment details ─────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Item card */}
          <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm">
            {shipment.image_url && (
              <div className="relative h-52">
                <Image src={shipment.image_url} alt={shipment.title} fill className="object-cover" sizes="500px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4">
                  <h1 className="text-white font-black text-xl leading-tight drop-shadow-lg">{shipment.title}</h1>
                </div>
                {shipment.urgency === "immediate" && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg shadow-orange-500/30">
                    <Zap className="w-3 h-3" fill="currentColor" /> דחוף
                  </div>
                )}
              </div>
            )}
            <div className="p-5">
              {!shipment.image_url && (
                <h1 className="text-xl font-black mb-4 text-zinc-900">{shipment.title}</h1>
              )}

              {/* Route */}
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <div className="w-0.5 flex-1 bg-primary/20 min-h-[20px]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ccf02a]" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">איסוף</p>
                      <p className="font-black text-sm text-zinc-900">{shipment.from_city}</p>
                      <p className="text-[11px] text-zinc-400">קומה {shipment.from_floor} {shipment.from_elevator ? "· 🛗 מעלית" : ""}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">מסירה</p>
                      <p className="font-black text-sm text-zinc-900">{shipment.to_city}</p>
                      <p className="text-[11px] text-zinc-400">קומה {shipment.to_floor} {shipment.to_elevator ? "· 🛗 מעלית" : ""}</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-zinc-300 mt-4" />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {shipment.help_level === "help_needed" && (
                  <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-xl font-bold">💪 נדרשת עזרה</span>
                )}
                {shipment.help_level === "curb_to_curb" && (
                  <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-xl font-bold">🚗 מדרכה למדרכה</span>
                )}
                {shipment.pickup_window && (
                  <span className="text-[11px] bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-xl font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />{shipment.pickup_window}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Payment model */}
          <div className="rounded-3xl p-5" style={{ background: "#1d44f9" }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-black text-white">מה משלמים ומתי?</p>
            </div>
            <div className="space-y-2.5">
              {[
                { icon: "🔒", color: "bg-primary/15", title: `₪${PLATFORM_FEE} — עכשיו באתר`, sub: "דמי שריון · מגן עליכם עד המסירה" },
                { icon: "💵", color: "bg-amber-500/15", title: "₪[מחיר הנהג] — בעת האיסוף", sub: "ישירות למוביל · מזומן / העברה" },
              ].map(row => (
                <div key={row.title} className="flex items-center gap-3 bg-white/6 rounded-2xl p-3.5">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0", row.color)}>{row.icon}</div>
                  <div>
                    <p className="text-white font-black text-sm">{row.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{row.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-white/20 text-[10px] mt-3 pt-3 border-t border-white/5">
              פרטי קשר נחשפים רק אחרי נעילה ותשלום השריון
            </p>
          </div>
        </div>

        {/* ── RIGHT: Bids ───────────────────── */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-xl text-zinc-900">
              {bids.length > 0 ? `${bids.length} הצעות מחיר` : "ממתין להצעות"}
            </h2>
            {bids.length > 0 && (
              <span className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> ממוין מהזול לגבוה
              </span>
            )}
          </div>

          {bids.length === 0 ? (
            <div className="bg-white rounded-3xl border border-zinc-100 p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-zinc-300" />
              </div>
              <p className="font-black text-zinc-900 mb-1">ממתינים להצעות</p>
              <p className="text-sm text-zinc-400">מובילים ייצרו קשר בקרוב</p>
              <p className="text-xs text-zinc-300 mt-4">ממוצע: 3 הצעות תוך שעתיים</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bids.map((bid, i) => {
                const { total, deposit, onDelivery } = calcTotal(bid.amount);
                const isSelected = selected === bid.id;
                const isBest     = i === 0;
                const rank       = RANK_STYLES[i] ?? { bg: "bg-zinc-200", text: "text-zinc-500", ring: "ring-zinc-100", label: `${i + 1}` };

                return (
                  <div
                    key={bid.id}
                    onClick={() => setSelected(isSelected ? null : bid.id)}
                    className={cn(
                      "bg-white rounded-3xl border p-5 transition-all cursor-pointer",
                      isSelected
                        ? "border-primary ring-4 ring-primary/10 shadow-xl shadow-primary/5"
                        : isBest
                        ? "border-amber-200 shadow-lg shadow-amber-50 hover:border-amber-300"
                        : "border-zinc-100 hover:border-zinc-200 hover:shadow-md"
                    )}>

                    {/* Rank badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ring-2 shrink-0",
                        rank.bg, rank.ring
                      )}>
                        {isBest ? <Trophy className="w-4 h-4 text-white" /> : rank.label}
                      </div>
                      {isBest && (
                        <span className="text-xs font-black text-amber-600 uppercase tracking-wider">{rank.label}</span>
                      )}
                    </div>

                    {/* Driver + price */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={cn(
                          "w-11 h-11 rounded-full flex items-center justify-center font-black text-base shrink-0",
                          isBest ? "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700" : "bg-zinc-100 text-zinc-500"
                        )}>
                          {bid.driver.full_name[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <a href={`/drivers/${bid.driver.id}`} target="_blank"
                              className="font-black text-sm text-zinc-900 hover:text-[#1d44f9] transition-colors underline-offset-2 hover:underline">
                              {bid.driver.full_name}
                            </a>
                            {bid.driver.verified && <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-zinc-400">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{bid.driver.avg_rating}</span>
                            <span className="text-zinc-200">·</span>
                            <span>{bid.driver.completed_trips} הובלות</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{bid.eta}</span>
                          </div>
                          {bid.note && (
                            <p className="text-xs text-zinc-500 mt-2 bg-zinc-50 rounded-xl px-2.5 py-1.5 italic line-clamp-2">
                              &ldquo;{bid.note}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-left shrink-0">
                        <p className={cn(
                          "text-2xl font-black leading-none",
                          isBest ? "text-amber-600" : "text-zinc-900"
                        )}>₪{total}</p>
                        <div className="text-[10px] text-zinc-400 mt-1.5 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            ₪{deposit} עכשיו
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            ₪{onDelivery} במסירה
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lock CTA */}
                    {isSelected && (
                      <button
                        onClick={e => { e.stopPropagation(); setLocked(true); }}
                        className="mt-5 w-full h-14 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 text-sm flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4" />
                        נעל עם {bid.driver.full_name.split(" ")[0]} · שלם ₪{deposit} פיקדון
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
