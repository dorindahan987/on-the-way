"use client";

import { Truck, Briefcase, User, BadgeCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) router.replace("/login");
    else if (user.role !== "driver") router.replace("/sender");
  }, [user, router]);

  if (!user) return null;

  const NAV = [
    { href: "/driver", icon: Truck, label: "הובלות" },
    { href: "/driver/my-bids", icon: Briefcase, label: "הצעות" },
    { href: "/driver/profile", icon: User, label: "פרופיל" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col" dir="rtl">
      <header className="sticky top-0 z-50" style={{ background: "#4a6ffe" }}>
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/driver" className="flex items-center shrink-0">
            <Image src="/logo.svg" alt="On The Way" width={82} height={40} unoptimized className="brightness-0 invert" />
          </Link>

          <nav className="hidden sm:flex items-center gap-0.5 text-sm font-semibold">
            <Link href="/driver" className={cn("px-3.5 py-2 rounded-xl transition-colors", pathname === "/driver" ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/8")}>הובלות פתוחות</Link>
            <Link href="/driver/my-bids" className={cn("px-3.5 py-2 rounded-xl transition-colors", pathname === "/driver/my-bids" ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/8")}>ההצעות שלי</Link>
          </nav>

          <Link href="/driver/profile"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors rounded-2xl px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-[#c9f45a] flex items-center justify-center text-black text-xs font-black">
              {user.name[0]}
            </div>
            <span className="hidden sm:block text-xs font-bold text-white/80">{user.name.split(" ")[0]}</span>
            {user.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />}
          </Link>
        </div>
      </header>

      <main className="flex-1 pb-24 sm:pb-8">{children}</main>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-zinc-100 flex pb-safe">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={cn("flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold transition-colors",
              pathname === href ? "text-[#4a6ffe]" : "text-zinc-400 hover:text-[#4a6ffe]")}>
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
