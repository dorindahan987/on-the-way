"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Star, ChevronLeft, LogOut, Shield, Bell, HelpCircle, FileText, Camera } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { MOCK_SHIPMENTS, MOCK_BIDS } from "@/lib/mock";
import { getStoredShipments } from "@/lib/storage";

export default function SenderProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const stored = getStoredShipments().filter(s => s.owner_id === user.id);
  const mock = MOCK_SHIPMENTS.filter(s => s.owner_id === user.id);
  const myShipments = stored.length > 0 ? [...stored, ...mock] : mock;
  const totalBids = myShipments.reduce((a, s) => a + s.bids_count, 0);
  const completedShipments = myShipments.filter(s => s.status === "completed").length;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const MENU = [
    { icon: Package, label: "ההובלות שלי", sub: `${myShipments.length} הובלות פעילות`, href: "/sender/my-shipments" },
    { icon: Bell, label: "התראות", sub: "SMS וואטסאפ לכל הצעה חדשה", href: "#" },
    { icon: Shield, label: "אבטחה", sub: "סיסמה, טלפון, אימות", href: "#" },
    { icon: FileText, label: "תקנון ותנאי שימוש", sub: "קרא את התנאים", href: "/terms" },
    { icon: HelpCircle, label: "עזרה ותמיכה", sub: "support@ontheway.co.il", href: "mailto:support@ontheway.co.il" },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-6" dir="rtl">

      {/* Profile hero */}
      <div className="bg-gradient-to-l from-primary to-indigo-500 rounded-3xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer shrink-0 group">
            <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden flex items-center justify-center text-2xl font-black">
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
              <h1 className="font-black text-xl leading-tight">{user.name}</h1>
              <span className="text-[10px] font-black bg-[#c9f45a] text-black px-2 py-0.5 rounded-full">שולח</span>
            </div>
            <p className="text-white/60 text-sm">{user.phone}</p>
            {user.avg_rating > 0 && (
              <div className="flex items-center gap-1 mt-1.5">
                <Star className="w-3.5 h-3.5 fill-white/80 text-white/80" />
                <span className="text-white/80 text-xs font-bold">{user.avg_rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "הובלות", value: myShipments.length },
          { label: "הצעות שהגיעו", value: totalBids },
          { label: "הושלמו", value: completedShipments },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-zinc-100 p-4 text-center">
            <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden mb-4">
        {MENU.map((item, i) => (
          <Link key={item.label} href={item.href}
            className="flex items-center gap-3 px-5 py-4 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-zinc-500" />
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
            <Package className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex-1 text-right">
            <p className="font-bold text-zinc-900 text-sm">אני גם מוביל</p>
            <p className="text-xs text-zinc-400">עבור לממשק המוביל</p>
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
