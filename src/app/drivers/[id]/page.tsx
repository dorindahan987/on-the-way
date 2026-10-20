"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, BadgeCheck, Truck, MapPin } from "lucide-react";
import { MOCK_USERS, MOCK_DRIVER_REVIEWS } from "@/lib/mock";

export default function DriverPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const driver = MOCK_USERS.find(u => u.id === id && u.role === "driver");
  const reviews = MOCK_DRIVER_REVIEWS.filter(r => r.driver_id === id);

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

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : driver.avg_rating.toFixed(1);

  return (
    <div className="min-h-screen bg-zinc-50" dir="rtl">

      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-3">
          <Link href="/" className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Image src="/logo.svg" alt="On The Way" width={72} height={35} unoptimized />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-8">

        {/* Driver card */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-6">
          <div className="flex items-start gap-4">

            {/* Avatar */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black shrink-0"
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
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-[#c9f45a] text-[#c9f45a]" />
                <span className="font-black text-zinc-900">{avgRating}</span>
                <span className="text-zinc-400 text-sm">({reviews.length} ביקורות)</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-zinc-100">
            <div className="text-center">
              <p className="text-2xl font-black text-zinc-900">{driver.completed_trips}</p>
              <p className="text-xs text-zinc-400 mt-0.5">הובלות דרכנו</p>
            </div>
            <div className="text-center border-x border-zinc-100">
              <p className="text-2xl font-black text-zinc-900">{avgRating}</p>
              <p className="text-xs text-zinc-400 mt-0.5">ממוצע כוכבים</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-zinc-900">{reviews.length}</p>
              <p className="text-xs text-zinc-400 mt-0.5">ביקורות</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-black text-zinc-900">ביקורות לקוחות</h2>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(n => (
              <Star key={n} className="w-3.5 h-3.5 fill-[#c9f45a] text-[#c9f45a]" />
            ))}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-10 text-center">
            <Truck className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm">עדיין אין ביקורות</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
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
                  <div className="flex items-center gap-3">
                    <span>{r.item}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{r.route}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link href="/login?role=sender"
            className="inline-flex items-center gap-2 font-black px-6 py-3.5 rounded-xl text-black text-sm"
            style={{ background: "#c9f45a" }}>
            פרסם הובלה ותן ל{driver.full_name.split(" ")[0]} להציע
          </Link>
        </div>
      </div>
    </div>
  );
}
