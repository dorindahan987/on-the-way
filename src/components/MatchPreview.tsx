"use client";

import { useEffect, useState } from "react";
import { Star, Zap, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchedDriver {
  driver_id: string;
  driver_name: string;
  score: number;
  reason: string;
  rating: number;
}

interface MatchPreviewProps {
  from: string;
  to: string;
}

export function MatchPreview({ from, to }: MatchPreviewProps) {
  const [matches, setMatches] = useState<MatchedDriver[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const trimmedFrom = from.trim();
    const trimmedTo   = to.trim();

    if (trimmedFrom.length < 2 || trimmedTo.length < 2) {
      setVisible(false);
      return;
    }

    // Debounce: wait 400ms after user stops typing
    const timer = setTimeout(async () => {
      setLoading(true);
      setVisible(true);
      try {
        const res = await fetch(
          `/api/shipments?from=${encodeURIComponent(trimmedFrom)}&to=${encodeURIComponent(trimmedTo)}`
        );
        const data = await res.json();
        setMatches(data.matched ?? []);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [from, to]);

  if (!visible) return null;

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" fill="currentColor" />
          <span className="text-sm font-bold">נהגים שיקבלו התראה</span>
        </div>
        {loading ? (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3 animate-spin" /> מחפש...
          </span>
        ) : (
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            matches.length > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}>
            {matches.length > 0 ? `${matches.length} נהגים` : "אין התאמות"}
          </span>
        )}
      </div>

      {/* Drivers list */}
      {!loading && (
        <div>
          {matches.length === 0 ? (
            <div className="px-4 py-5 text-center text-sm text-muted-foreground">
              <p>לא נמצאו נהגים עם מסלול תואם.</p>
              <p className="text-xs mt-1">ההובלה תפורסם — נהגים יוכלו להגיש הצעות</p>
            </div>
          ) : (
            <ul>
              {matches.map((m, i) => (
                <li
                  key={m.driver_id}
                  className={cn("flex items-center gap-3 px-4 py-3", i < matches.length - 1 && "border-b border-border")}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    m.score === 2 ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  )}>
                    {m.driver_name[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{m.driver_name}</span>
                      {m.score === 2 && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{m.reason}</p>
                  </div>

                  {/* Rating + score badge */}
                  <div className="text-end shrink-0">
                    <div className="flex items-center gap-0.5 justify-end mb-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold">{m.rating}</span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                      m.score === 2 ? "bg-primary/10 text-primary" : "bg-amber-50 text-amber-600"
                    )}>
                      {m.score === 2 ? "התאמה מלאה" : "התאמה חלקית"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
