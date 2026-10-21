"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck, Star, ChevronLeft, LogOut, BadgeCheck, Shield, Bell, HelpCircle, FileText, TrendingUp, MapPin, Camera } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { MOCK_BIDS } from "@/lib/mock";

export default function DriverProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const myBids = MOCK_BIDS.filter(b => b.driver_id === user.id);
  const earned = myBids.reduce((a, b) => a + b.amount, 0);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const MENU = [
    { icon: TrendingUp, label: "ההצעות שלי", sub: `${myBids.length} הצעות הוגשו`, href: "/driver/my-bids", color: "bg-[#c9f45a]/15 text-[#4a6ffe]" },
    { icon: MapPin, label: "מסלולים מועדפים", sub: "הגדר אילו מסלולים מעניינים אותך", href: "#", color: "bg-blue-50 text-blue-600" },
    { icon: Bell, label: "התראות", sub: "SMS וואטסאפ לכל הובלה חדשה", href: "#", color: "bg-violet-50 text-violet-600" },
    { icon: Shield, label: "אבטחה", sub: "סיסמה, טלפון, אימות", href: "#", color: "bg-zinc-100 text-zinc-500" },
    { icon: FileText, label: "תקנון ותנאי שימוש", sub: "קרא את התנאים", href: "/terms", color: "bg-zinc-100 text-zinc-500" },
    { icon: HelpCircle, label: "עזרה ותמיכה", sub: "support@ontheway.co.il", href: "mailto:support@ontheway.co.il", color: "bg-zinc-100 text-zinc-500" },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-6" dir="rtl">

      {/* Profile hero */}
      <div className="rounded-3xl p-6 mb-6" style={{ background: "#4a6ffe" }}>
        <div className="flex items-center gap-4 mb-5">
          <label className="relative cursor-pointer shrink-0 group">
            <div className="w-16 h-16 rounded-full bg-[#c9f45a] overflow-hidden flex items-center justify-center text-2xl font-black text-black">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : user.name[0]}
            </div>
            <div className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow group-hover:bg-zinc-100 transition-colors">
              <Camera className="w-3 h-3 text-zinc-600" />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => updateUser({ avatar: reader.result as string });
              reader.readAsDataURL(file);
            }} />
          </label>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="font-black text-xl text-white leading-tight">{user.name}</h1>
              {user.verified && <BadgeCheck className="w-5 h-5 text-blue-400 shrink-0" />}
            </div>
            <p className="text-white/50 text-sm">{user.phone}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              {user.completed_trips > 0 ? (
                <>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-white/70 text-xs font-bold">{user.avg_rating} · {user.completed_trips} הובלות</span>
                </>
              ) : (
                <span className="text-white/40 text-xs">מוביל חדש</span>
              )}
              {user.verified && <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg">מאומת ✓</span>}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "הובלות", value: user.completed_trips },
            { label: "הצעות הוגשו", value: myBids.length },
            { label: "דירוג", value: user.completed_trips > 0 ? `${user.avg_rating}★` : "—" },
          ].map(s => (
            <div key={s.label} className="bg-white/6 rounded-2xl p-3 text-center">
              <p className="text-white font-black text-lg leading-none">{s.value}</p>
              <p className="text-white/40 text-[10px] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Verification CTA if not verified */}
        {!user.verified && (
          <button className="mt-4 w-full flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 rounded-2xl px-4 py-3 hover:bg-blue-500/20 transition-colors">
            <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="text-right flex-1">
              <p className="text-white font-bold text-sm">קבל תג "נהג מאומת"</p>
              <p className="text-white/40 text-xs">העלה ת.ז + רישיון נהיגה</p>
            </div>
            <ChevronLeft className="w-4 h-4 text-white/30" />
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden mb-4">
        {MENU.map((item) => (
          <Link key={item.label} href={item.href}
            className="flex items-center gap-3 px-5 py-4 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-zinc-900 text-sm">{item.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{item.sub}</p>
            </div>
            <ChevronLeft className="w-4 h-4 text-zinc-300" />
          </Link>
        ))}
      </div>

      {/* Switch role */}
      <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden mb-4">
        <button
          onClick={() => { logout(); router.replace("/login"); }}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-zinc-50 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex-1 text-right">
            <p className="font-bold text-zinc-900 text-sm">אני גם שולח פריטים</p>
            <p className="text-xs text-zinc-400">עבור לממשק השולח</p>
          </div>
          <ChevronLeft className="w-4 h-4 text-zinc-300" />
        </button>
      </div>

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 text-red-500 font-bold text-sm py-4 hover:bg-red-50 rounded-2xl transition-colors border border-red-100">
        <LogOut className="w-4 h-4" />
        התנתקות
      </button>

      <p className="text-center text-zinc-300 text-xs mt-6">על הדרך · גרסה 1.0 · מתווך טכנולוגי בלבד</p>
    </div>
  );
}
