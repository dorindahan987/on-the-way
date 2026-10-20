"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, ChevronRight, Send, Zap, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { SHIPMENTS, OFFERS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ShipmentDetail({ id }: { id: string }) {
  const shipment = SHIPMENTS.find((s) => s.id === id);
  const offers = OFFERS.filter((o) => o.shipmentId === id);
  const [myOffer, setMyOffer] = useState("");
  const [myTime, setMyTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!shipment) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold mb-2">משלוח לא נמצא</p>
            <Link href="/" className="text-primary text-sm">חזרה לעמוד הבית</Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedOffers = [...offers].sort((a, b) => a.amount - b.amount);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-40">
        <Link href="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground py-4">
          <ChevronRight className="w-4 h-4" />
          חזרה לפיד
        </Link>

        <div className="relative h-52 rounded-2xl overflow-hidden bg-secondary mb-5">
          <Image src={shipment.image} alt={shipment.title} fill className="object-cover" sizes="640px" />
          {shipment.urgent && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg">
              <Zap className="w-3 h-3" fill="currentColor" />
              דחוף
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 mb-4">
          <h1 className="text-xl font-black mb-3">{shipment.title}</h1>

          <div className="flex items-center gap-3 mb-4 p-3 bg-secondary rounded-xl">
            <div className="text-center">
              <p className="text-[11px] text-muted-foreground mb-0.5">איסוף</p>
              <p className="font-bold text-sm">{shipment.from}</p>
            </div>
            <div className="flex-1 flex items-center gap-1">
              <div className="h-px flex-1 border-t border-dashed border-border" />
              <ArrowLeft className="w-4 h-4 text-primary shrink-0" />
              <div className="h-px flex-1 border-t border-dashed border-border" />
            </div>
            <div className="text-center">
              <p className="text-[11px] text-muted-foreground mb-0.5">מסירה</p>
              <p className="font-bold text-sm">{shipment.to}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {shipment.hasElevator && <span className="text-[11px] font-medium bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-md">יש מעלית</span>}
            {shipment.curbToCurb && <span className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md">מדרכה למדרכה</span>}
            {shipment.helpNeeded && <span className="text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md">דרושה עזרה בסחיבה</span>}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
            <span>📅 {shipment.date}</span>
            <span>פורסם {shipment.postedAt}</span>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-bold text-base mb-3">
            {sortedOffers.length > 0 ? `${sortedOffers.length} הצעות מחיר` : "אין הצעות עדיין — היה ראשון!"}
          </h2>

          <div className="space-y-3">
            {sortedOffers.map((offer, i) => (
              <div
                key={offer.id}
                className={cn(
                  "bg-white rounded-2xl border p-4",
                  i === 0 ? "border-primary/30 shadow-sm shadow-primary/10" : "border-border"
                )}
              >
                {i === 0 && <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wide mb-2"><Star className="w-3 h-3 fill-current" /> הזול ביותר</div>}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {offer.driverName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{offer.driverName}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-[11px] text-muted-foreground">{offer.driverRating} · {offer.driverTrips} נסיעות</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[12px] text-muted-foreground">📅 {offer.eta}</p>
                    {offer.note && <p className="text-[12px] text-foreground mt-1 leading-relaxed">&ldquo;{offer.note}&rdquo;</p>}
                  </div>
                  <div className="text-start shrink-0">
                    <p className="text-2xl font-black">₪{offer.amount}</p>
                    <button className="mt-2 text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-xl hover:bg-primary/90 active:scale-95 transition-all">
                      סגור הצעה
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-border pb-6 pt-4 px-4 shadow-xl">
        <div className="max-w-2xl mx-auto">
          {!submitted ? (
            <>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">הגש הצעת מחיר</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm pointer-events-none">₪</span>
                  <input
                    type="number"
                    placeholder="מחיר"
                    value={myOffer}
                    onChange={(e) => setMyOffer(e.target.value)}
                    className="w-full h-12 bg-secondary border border-border rounded-2xl pr-8 pl-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <input
                  type="text"
                  placeholder="מועד (למשל: מחר בבוקר)"
                  value={myTime}
                  onChange={(e) => setMyTime(e.target.value)}
                  className="flex-[2] h-12 bg-secondary border border-border rounded-2xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  dir="rtl"
                />
                <button
                  onClick={() => myOffer && myTime && setSubmitted(true)}
                  disabled={!myOffer || !myTime}
                  className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary/90 active:scale-95 disabled:opacity-40 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-1">
              <p className="font-bold text-green-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> ההצעה נשלחה! נעדכן אותך אם תיסגר.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
