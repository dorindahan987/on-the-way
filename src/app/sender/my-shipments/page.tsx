"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, MapPin, ArrowLeft, Zap, Plus, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { getStoredShipments } from "@/lib/storage";
import { CATEGORY_EMOJI, PLATFORM_FEE, type Shipment } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  open:      { label: "פעיל — ממתין להצעות", color: "text-[#1d44f9] bg-[#ccf02a]/15 border-[#ccf02a]/30", icon: Loader2 },
  locked:    { label: "נעול — מוביל נבחר",   color: "text-blue-600 bg-blue-50 border-blue-100",            icon: CheckCircle2 },
  completed: { label: "הושלם",               color: "text-zinc-500 bg-zinc-100 border-zinc-200",            icon: CheckCircle2 },
};

export default function MyShipmentsPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    const all = getStoredShipments().filter(s => s.owner_id === user?.id);
    setShipments(all);
  }, [user?.id]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-zinc-900">ההובלות שלי</h1>
        <Link href="/sender/post"
          className="flex items-center gap-1.5 bg-primary text-white text-sm font-black px-4 py-2.5 rounded-2xl hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/25">
          <Plus className="w-4 h-4" /> חדשה
        </Link>
      </div>

      {shipments.length === 0 ? (
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
          {shipments.map(s => {
            const statusInfo = STATUS_LABEL[s.status] ?? STATUS_LABEL.open;
            const StatusIcon = statusInfo.icon;
            return (
              <Link key={s.id} href={`/sender/shipment/${s.id}`}
                className="block bg-white rounded-3xl border border-zinc-100 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/70 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99]">
                <div className="flex gap-4 p-5">
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
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span className="font-bold text-zinc-700">{s.from_city}</span>
                      <ArrowLeft className="w-3 h-3 text-zinc-300" />
                      <span className="font-bold text-zinc-700">{s.to_city}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-xl border", statusInfo.color)}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {statusInfo.label}
                      </span>
                      {s.bids_count > 0
                        ? <span className="text-xs font-black text-primary">{s.bids_count} הצעות — מ-₪{(s.lowest_bid ?? 0) + PLATFORM_FEE}</span>
                        : <span className="text-xs text-zinc-400">ממתין להצעות...</span>
                      }
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
