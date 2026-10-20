"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Truck, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isPost = pathname === "/post";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-[15px] tracking-tight">על הדרך</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground">
            <User className="w-5 h-5" />
          </button>
          {!isPost && (
            <Link
              href="/post"
              className="flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-3.5 py-2 rounded-xl hover:bg-primary/90 active:scale-95"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              פרסם פריט
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
