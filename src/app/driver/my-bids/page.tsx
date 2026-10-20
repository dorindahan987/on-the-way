"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowLeft, Clock, CheckCircle2, Loader2, Briefcase } from "lucide-react";
import { getStoredBids, getStoredShipments } from "@/lib/storage";
import { MOCK_BIDS, MOCK_SHIPMENTS } from "@/lib/mock";
import { PLATFORM_FEE, type Bid, type Shipment } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const BID_STATUS: Record<string, { label: string; color: string; icon: typeof Loader2 }> = {
  active:   { label: "ממתין לתגובה",  color: "text-[#4a6ffe] bg-[#c9f45a]/15 border-[#c9f45a]/30", icon: Loader2 },
  selected: { label: "נבחרת!",        color: "text-green-700 bg-green-50 border-green-200",          icon: CheckCircle2 },
  rejected: { label: "לא נבחרת",      color: "text-zinc-400 bg-zinc-100 border-zinc-200",            icon: CheckCircle2 },
};

export default function MyBidsPage() {
  const { user } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    const storedBids = getStoredBids().filter(b => b.driver_id === user?.id);
    const mockBids   = MOCK_BIDS.filter(b => b.driver_id === user?.id);
    setBids([...storedBids, ...mockBids]);

    const allShipments = [...getStoredShipments(), ...MOCK_SHIPMENTS];
    setShipments(allShipments);
  }, [user?.id]);

  const getShipment = (id: string) => shipments.find(s => s.id === id);

  if (bids.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#c9f45a]/15 flex items-center justify-center mx-auto mb-5">
          <Briefcase className="w-9 h-9 text-[#4a6ffe]" />
        </div>
        <h1 className="text-2xl font-black mb-2 text-zinc-900">ההצעות שלי</h1>
        <p className="text-zinc-500 mb-8">עדיין לא הגשת הצעות — עיין בהובלות הפתוחות</p>
        <Link href="/driver"
          className="inline-flex items-center gap-2 bg-[#c9f45a] text-black font-bold px-6 py-3.5 rounded-2xl hover:bg-[#b5e048] active:scale-95 transition-all shadow-lg shadow-[#c9f45a]/25">
          צפה בהובלות פתוחות
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6" dir="rtl">
      <h1 className="text-2xl font-black text-zinc-900 mb-6">ההצעות שלי</h1>

      <div className="space-y-4">
        {bids.map(bid => {
          const s = getShipment(bid.shipment_id);
          const statusInfo = BID_STATUS[bid.status] ?? BID_STATUS.active;
          const StatusIcon = statusInfo.icon;

          return (
            <div key={bid.id}
              className="bg-white rounded-3xl border border-zinc-100 overflow-hidden">
              <div className="flex gap-4 p-5">
                {s?.image_url && (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                    <Image src={s.image_url} alt={s.title} fill className="object-cover" sizes="80px" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm text-zinc-900 line-clamp-1 mb-1">
                    {s?.title ?? bid.shipment_id}
                  </h3>

                  {s && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span className="font-bold text-zinc-700">{s.from_city}</span>
                      <ArrowLeft className="w-3 h-3 text-zinc-300" />
                      <span className="font-bold text-zinc-700">{s.to_city}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-xl border", statusInfo.color)}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {statusInfo.label}
                    </span>
                    <span className="text-sm font-black text-[#4a6ffe]">
                      ₪{bid.amount + PLATFORM_FEE}
                    </span>
                  </div>
                </div>
              </div>

              {bid.eta && (
                <div className="px-5 pb-4 flex items-center gap-1.5 text-xs text-zinc-400">
                  <Clock className="w-3 h-3" />
                  <span>{bid.eta}</span>
                  {bid.note && <span className="text-zinc-300">· {bid.note}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
