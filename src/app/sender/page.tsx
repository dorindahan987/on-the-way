"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Zap, Package, MapPin, ChevronLeft, Plus, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { MOCK_SHIPMENTS, MOCK_BIDS } from "@/lib/mock";
import { getStoredShipments, getStoredBids } from "@/lib/storage";
import { CATEGORY_EMOJI, PLATFORM_FEE, type Shipment, type Bid } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const STATUS_LABEL: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  open: { label: "פעיל — ממתין להצעות", color: "text-[#4a6ffe] bg-[#c9f45a]/15 border-[#c9f45a]/30", icon: Loader2 },
  locked: { label: "נעול — מוביל נבחר", color: "text-blue-600 bg-blue-50 border-blue-100", icon: CheckCircle2 },
  completed: { label: "הושלם", color: "text-zinc-500 bg-zinc-100 border-zinc-200", icon: CheckCircle2 },
};

export default function SenderDashboard() {
  const { user } = useAuth();
  const [myShipments, setMyShipments] = useState<Shipment[]>([]);
  const [allBids, setAllBids]         = useState<Bid[]>([]);

  useEffect(() => {
    const stored  = getStoredShipments().filter(s => s.owner_id === user?.id);
    const mock    = MOCK_SHIPMENTS.filter(s => s.owner_id === (user?.id ?? "u4"));
    setMyShipments([...stored, ...mock]);
    setAllBids([...getStoredBids(), ...MOCK_BIDS]);
  }, [user?.id]);

  const totalBids = myShipments.reduce((acc, s) => acc + s.bids_count, 0);
  const bestOffer = myShipments.reduce<number | null>((acc, s) => {
    if (!s.lowest_bid) return acc;
    const total = s.lowest_bid + PLATFORM_FEE;
    return acc === null || total < acc ? total : acc;
  }, null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      {/* Welcome + stats */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-zinc-900 mb-1">שלום, {user?.name?.split(" ")[0] ?? "שם"} 👋</h1>
        <p className="text-zinc-500 text-sm">כאן תמצא את כל ההובלות שפרסמת והצעות המחיר שהגיעו</p>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-2xl border border-zinc-100 p-4 text-center">
          <p className="text-2xl font-black text-zinc-900">{myShipments.length}</p>
          <p className="text-xs text-zinc-400 mt-0.5">הובלות שפרסמת</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 p-4 text-center">
          <p className="text-2xl font-black text-primary">{totalBids}</p>
          <p className="text-xs text-zinc-400 mt-0.5">הצעות שהגיעו</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 p-4 text-center">
          <p className="text-2xl font-black text-primary">{bestOffer ? `₪${bestOffer}` : "—"}</p>
          <p className="text-xs text-zinc-400 mt-0.5">הצעה הכי זולה</p>
        </div>
      </div>

      {/* Post new CTA */}
      <Link href="/sender/post"
        className="flex items-center gap-4 bg-gradient-to-l from-primary to-indigo-500 rounded-3xl p-5 mb-6 text-white group hover:opacity-95 active:scale-[0.99] transition-all shadow-xl shadow-primary/20">
        <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
          <Plus className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="font-black text-base">פרסם הובלה חדשה</p>
          <p className="text-white/65 text-xs mt-0.5">מלא פרטים וקבל הצעות תוך דקות</p>
        </div>
        <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
      </Link>

      {/* My shipments */}
      <h2 className="font-black text-base text-zinc-900 mb-3">ההובלות שלי</h2>

      {myShipments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-zinc-400" />
          </div>
          <p className="font-black text-zinc-900 mb-1">עדיין לא פרסמת הובלות</p>
          <p className="text-sm text-zinc-400 mb-6">פרסם את הפריט הראשון שלך וקבל הצעות</p>
          <Link href="/sender/post"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-2xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4" /> פרסם עכשיו
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myShipments.map(s => {
            const bids = allBids.filter(b => b.shipment_id === s.id).sort((a, b) => a.amount - b.amount);
            const statusInfo = STATUS_LABEL[s.status] ?? STATUS_LABEL.open;
            const StatusIcon = statusInfo.icon;

            return (
              <Link key={s.id} href={`/sender/shipment/${s.id}`}
                className="block bg-white rounded-3xl border border-zinc-100 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/70 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99]">
                <div className="flex gap-4 p-5">
                  {/* Thumbnail */}
                  {s.image_url && (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                      <Image src={s.image_url} alt={s.title} fill className="object-cover" sizes="96px" />
                      {s.urgency === "immediate" && (
                        <div className="absolute top-1.5 right-1.5 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5" fill="currentColor" />דחוף
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-black text-sm text-zinc-900 line-clamp-1">{s.title}</h3>
                      <span className="text-xs text-zinc-400 shrink-0">{CATEGORY_EMOJI[s.category]}</span>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span className="font-bold text-zinc-700">{s.from_city}</span>
                      <ArrowLeft className="w-3 h-3 text-zinc-300" />
                      <span className="font-bold text-zinc-700">{s.to_city}</span>
                    </div>

                    {/* Status + bids */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-xl border", statusInfo.color)}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {statusInfo.label}
                      </span>
                      {s.bids_count > 0 ? (
                        <span className="text-xs font-black text-primary">{s.bids_count} הצעות — מ-₪{(s.lowest_bid ?? 0) + PLATFORM_FEE}</span>
                      ) : (
                        <span className="text-xs text-zinc-400">ממתין להצעות...</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bids preview strip */}
                {bids.length > 0 && (
                  <div className="px-5 pb-4">
                    <div className="bg-zinc-50 rounded-2xl p-3 flex items-center gap-3">
                      <div className="flex -space-x-2 space-x-reverse">
                        {bids.slice(0, 3).map((b, i) => (
                          <div key={b.id}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-indigo-200 border-2 border-white flex items-center justify-center text-xs font-black text-primary"
                            style={{ zIndex: 10 - i }}>
                            {b.driver.full_name[0]}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-zinc-500 flex-1">
                        {bids.length === 1 ? `${bids[0].driver.full_name} הציע` : `${bids.length} מובילים הגישו הצעות`}
                      </p>
                      <span className="text-xs font-black text-primary flex items-center gap-0.5">
                        ראי הצעות <ChevronLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* How it works — first time guide */}
      <div className="mt-8 rounded-3xl p-6" style={{ background: "#4a6ffe" }}>
        <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">איך זה עובד?</p>
        <div className="space-y-4">
          {[
            { n: "1", title: "פרסם פריט", desc: "תמונה + מסלול + מועד — פחות מ-60 שניות", done: myShipments.length > 0 },
            { n: "2", title: "מובילים שולחים הצעות", desc: "כל מוביל מציע מחיר — אתם בוחרים את הטוב ביותר", done: totalBids > 0 },
            { n: "3", title: "נעל ושלם פיקדון ₪35", desc: "לאחר הנעילה פרטי הקשר נחשפים ואפשר לתאם", done: false },
          ].map(step => (
            <div key={step.n} className="flex items-start gap-3">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5",
                step.done ? "bg-[#c9f45a] text-black" : "bg-white/10 text-white/50"
              )}>
                {step.done ? "✓" : step.n}
              </div>
              <div>
                <p className={cn("font-bold text-sm", step.done ? "text-white" : "text-white/60")}>{step.title}</p>
                <p className="text-xs text-white/30 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
