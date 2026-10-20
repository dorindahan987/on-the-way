import { Users, Package, TrendingUp, CheckCircle, Clock, Truck, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MOCK_SHIPMENTS, MOCK_BIDS, MOCK_USERS } from "@/lib/mock";
import { PLATFORM_FEE } from "@/lib/types";

export default function AdminPage() {
  const drivers = MOCK_USERS.filter(u => u.role === "driver");
  const senders = MOCK_USERS.filter(u => u.role === "sender");
  const openShipments = MOCK_SHIPMENTS.filter(s => s.status === "open");
  const totalBids = MOCK_BIDS.length;
  const estimatedRevenue = totalBids * PLATFORM_FEE;

  const STAT_CARDS = [
    { label: "סה״כ משתמשים",    value: MOCK_USERS.length,       icon: Users,       color: "bg-blue-50 text-blue-600",    delta: "+12 החודש" },
    { label: "שולחים",          value: senders.length,           icon: Package,     color: "bg-violet-50 text-violet-600", delta: "+5 השבוע" },
    { label: "מובילים פעילים",  value: drivers.length,           icon: Truck,       color: "bg-emerald-50 text-emerald-600", delta: "+2 היום" },
    { label: "הובלות פתוחות",   value: openShipments.length,     icon: Clock,       color: "bg-orange-50 text-orange-500", delta: "כרגע" },
    { label: "סה״כ הצעות",      value: totalBids,                icon: TrendingUp,  color: "bg-primary/10 text-primary",   delta: "סה״כ" },
    { label: "הכנסה משוערת",    value: `₪${estimatedRevenue}`,  icon: CheckCircle, color: "bg-green-50 text-green-600",   delta: "עמלות" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-zinc-400 hover:text-zinc-700 transition-colors">
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
            <div className="h-5 w-px bg-zinc-200" />
            <span className="font-black text-[15px]">לוח ניהול <span className="text-zinc-400 font-normal text-xs">· On The Way</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-zinc-500 font-medium">מערכת פעילה</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-zinc-900 mb-1">שלום, מנהל ⚡</h1>
          <p className="text-zinc-500 text-sm">כאן מה שקורה ב-On The Way כרגע</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, delta }) => (
            <div key={label} className="bg-white rounded-2xl border border-zinc-100 p-4">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-2xl font-black text-zinc-900 leading-none mb-1">{value}</p>
              <p className="text-xs text-zinc-500 leading-tight">{label}</p>
              <p className="text-[10px] text-zinc-400 mt-1">{delta}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active shipments table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="font-bold text-sm">הובלות פעילות</h2>
              <span className="text-xs text-zinc-400">{openShipments.length} פתוחות</span>
            </div>
            <div className="divide-y divide-zinc-50">
              {MOCK_SHIPMENTS.map(s => (
                <div key={s.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{s.title}</p>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                      <span>{s.from_city}</span>
                      <ArrowLeft className="w-3 h-3" />
                      <span>{s.to_city}</span>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="text-sm font-bold text-zinc-800">{s.bids_count}</p>
                    <p className="text-[10px] text-zinc-400">הצעות</p>
                  </div>
                  <div className="text-start shrink-0">
                    {s.lowest_bid ? (
                      <p className="text-sm font-bold text-primary">₪{s.lowest_bid + PLATFORM_FEE}</p>
                    ) : (
                      <p className="text-xs text-zinc-400">אין עדיין</p>
                    )}
                    <p className="text-[10px] text-zinc-400">מחיר נמוך</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${
                    s.urgency === "immediate" ? "bg-orange-100 text-orange-600" : "bg-zinc-100 text-zinc-500"
                  }`}>
                    {s.urgency === "immediate" ? "⚡ דחוף" : "גמיש"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Drivers list */}
          <div className="bg-white rounded-2xl border border-zinc-100">
            <div className="px-5 py-4 border-b border-zinc-100">
              <h2 className="font-bold text-sm">מובילים רשומים</h2>
            </div>
            <div className="divide-y divide-zinc-50">
              {drivers.map(d => (
                <div key={d.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700 shrink-0">
                    {d.full_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{d.full_name}</p>
                    <p className="text-xs text-zinc-400">{d.completed_trips} הובלות</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-zinc-700">{d.avg_rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
