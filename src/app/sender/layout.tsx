"use client";

import { Package, Search, User, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function SenderLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) router.replace("/login");
    else if (user.role !== "sender") router.replace("/driver");
  }, [user, router]);

  if (!user) return null;

  const NAV = [
    { href: "/sender", icon: Search, label: "בית" },
    { href: "/sender/my-shipments", icon: Package, label: "שלי" },
    { href: "/sender/post", icon: null, label: "פרסם", primary: true },
    { href: "/sender/profile", icon: User, label: "פרופיל" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col" dir="rtl">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/logo.svg" alt="On The Way" width={82} height={40} unoptimized />
          </Link>

          <nav className="hidden sm:flex items-center gap-0.5 text-sm font-semibold">
            <Link href="/sender" className={cn("px-3.5 py-2 rounded-xl transition-colors", pathname === "/sender" ? "bg-primary/8 text-primary" : "hover:bg-zinc-100 text-zinc-600")}>בית</Link>
            <Link href="/sender/my-shipments" className={cn("px-3.5 py-2 rounded-xl transition-colors", pathname === "/sender/my-shipments" ? "bg-primary/8 text-primary" : "hover:bg-zinc-100 text-zinc-600")}>ההובלות שלי</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/sender/post"
              className="hidden sm:flex items-center gap-1.5 bg-primary text-white text-sm font-black px-4 py-2.5 rounded-2xl hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/25">
              <Plus className="w-4 h-4" /> פרסם פריט
            </Link>
            <Link href="/sender/profile"
              className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-2xl px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black">
                {user.name[0]}
              </div>
              <span className="hidden sm:block text-xs font-bold text-zinc-700">{user.name.split(" ")[0]}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 sm:pb-8">{children}</main>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-zinc-100 flex pb-safe">
        {NAV.map(item => (
          <Link key={item.href} href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold transition-colors",
              item.primary ? "" : pathname === item.href ? "text-primary" : "text-zinc-400 hover:text-primary"
            )}>
            {item.primary ? (
              <div className="w-14 h-10 -mt-4 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/35 text-white font-black text-lg">+</div>
            ) : item.icon ? (
              <item.icon className="w-5 h-5" />
            ) : null}
            {!item.primary && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
