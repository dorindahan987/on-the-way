import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Shipment } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ShipmentCard({ s }: { s: Shipment }) {
  return (
    <Link
      href={`/shipment/${s.id}`}
      className="group block bg-white rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 active:scale-[0.99]"
    >
      {/* Image */}
      <div className="relative h-40 bg-secondary overflow-hidden">
        <Image
          src={s.image}
          alt={s.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, 640px"
        />
        {/* Urgent badge */}
        {s.urgent && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-orange-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg">
            <Zap className="w-3 h-3" fill="currentColor" />
            דחוף
          </div>
        )}
        {/* Offers badge */}
        <div className={cn(
          "absolute bottom-2.5 left-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg",
          s.offersCount > 0
            ? "bg-white text-primary shadow-sm"
            : "bg-black/40 text-white backdrop-blur-sm"
        )}>
          {s.offersCount > 0 ? `${s.offersCount} נהגים הציעו` : "אין הצעות עדיין"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Route */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[13px] font-semibold text-foreground">{s.from}</span>
          <div className="flex items-center gap-1 text-muted-foreground flex-1">
            <div className="h-px flex-1 bg-border" />
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <div className="h-px flex-1 bg-border" />
          </div>
          <span className="text-[13px] font-semibold text-foreground">{s.to}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[15px] leading-snug mb-3 line-clamp-1">{s.title}</h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {s.hasElevator && (
            <span className="text-[11px] font-medium bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-md">
              יש מעלית
            </span>
          )}
          {s.curbToCurb && (
            <span className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md">
              מדרכה למדרכה
            </span>
          )}
          {s.helpNeeded && (
            <span className="text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md">
              דרושה עזרה בסחיבה
            </span>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border">
          <span className="text-[12px] text-muted-foreground">{s.date}</span>
          {s.lowestOffer !== null ? (
            <div className="text-start">
              <span className="text-[11px] text-muted-foreground block leading-none mb-0.5">מחיר נמוך</span>
              <span className="text-base font-bold text-primary">₪{s.lowestOffer}</span>
            </div>
          ) : (
            <span className="text-[12px] font-medium text-primary">הגש הצעה ראשון ←</span>
          )}
        </div>
      </div>
    </Link>
  );
}
