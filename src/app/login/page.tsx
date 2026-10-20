"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Truck, BadgeCheck, Check } from "lucide-react";
import { useAuth, type AuthRole } from "@/lib/auth";
import { supabase, supabaseReady } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const ROLE_THEME = {
  sender: {
    icon: Package,
    isLight: true,
    panelStyle: { background: "#c9f45a" },
    glowStyle: { background: "rgba(0,0,0,0.08)" },
    badgeStyle: { background: "rgba(0,0,0,0.12)", color: "#000", border: "1px solid rgba(0,0,0,0.1)" },
    badgeText: "שולח · אזור אישי",
    title: "פרסם הובלה וקבל הצעות",
    sub: "מובילים מתחרים על העבודה שלך",
    checkBg: "bg-black/20",
    btnClass: "bg-black text-white hover:bg-black/85",
  },
  driver: {
    icon: Truck,
    isLight: false,
    panelStyle: { background: "#0a0a0a" },
    glowStyle: { background: "rgba(212,245,0,0.15)" },
    badgeStyle: { background: "rgba(212,245,0,0.15)", color: "#c9f45a", border: "1px solid rgba(212,245,0,0.2)" },
    badgeText: "מוביל · אזור אישי",
    title: "הרוויח עם הרכב שלך",
    sub: "עיין בהובלות פתוחות ושלח הצעות",
    checkBg: "bg-[#c9f45a]",
    btnClass: "bg-[#c9f45a] hover:bg-[#b5e048] text-black",
  },
};

const ROLES = [
  {
    id: "sender" as AuthRole,
    icon: Package,
    title: "יש לי פריט להעביר",
    sub: "פרסם חינם וקבל הצעות מחיר ממובילים",
    color: "border-primary bg-primary/5 text-primary",
    iconBg: "bg-primary",
  },
  {
    id: "driver" as AuthRole,
    icon: Truck,
    title: "יש לי רכב ורוצה להרוויח",
    sub: "עיין בהובלות פתוחות ושלח הצעות",
    color: "border-[#4a6ffe] bg-[#4a6ffe]/5 text-[#4a6ffe]",
    iconBg: "bg-[#4a6ffe]",
  },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const urlRole = searchParams.get("role") as AuthRole | null;
  const [role, setRole] = useState<AuthRole | null>(urlRole);
  const [loading, setLoading] = useState(false);

  const theme = role ? ROLE_THEME[role] : ROLE_THEME.driver;
  const RoleIcon = role ? theme.icon : Truck;

  const handleGoogle = async () => {
    if (!role) return;
    if (supabaseReady) {
      localStorage.setItem("otw_pending_role", role);
      const returnTo = searchParams.get("returnTo");
      if (returnTo) localStorage.setItem("otw_return_to", returnTo);
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    } else {
      setLoading(true);
      setTimeout(() => {
        login(role, undefined, undefined);
        router.replace(role === "sender" ? "/sender" : "/driver");
      }, 900);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" dir="rtl">

      {/* LEFT PANEL */}
      <div
        className="relative overflow-hidden flex flex-col md:w-[52%] md:min-h-screen px-8 pt-10 pb-12 md:px-14 md:pt-14 md:pb-0 transition-colors duration-500"
        style={role ? theme.panelStyle : { background: "#4a6ffe" }}>

        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full blur-[130px] opacity-30 pointer-events-none"
          style={role ? theme.glowStyle : { background: "#c9f45a" }} />

        <Link href="/" className="relative mb-12 w-fit">
          <Image src="/logo.svg" alt="On The Way" width={115} height={56} unoptimized
            className={theme.isLight ? "" : "brightness-0 invert"} />
        </Link>

        <div className="relative flex-1 flex flex-col justify-center max-w-sm">
          {role && (
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-6"
              style={theme.badgeStyle}>
              <RoleIcon className="w-3.5 h-3.5" />
              {theme.badgeText}
            </div>
          )}

          <h1 className={cn("text-3xl md:text-4xl font-black leading-tight mb-4", theme.isLight ? "text-black" : "text-white")}>
            {role ? theme.title : <span>ברוכים הבאים<br /><span style={{ color: "#c9f45a" }}>לעל הדרך</span></span>}
          </h1>
          <p className={cn("text-base leading-relaxed mb-10", theme.isLight ? "text-black/55" : "text-white/50")}>
            {role ? theme.sub : "כניסה או הרשמה — פחות מ-30 שניות"}
          </p>

          <div className="space-y-3">
            {(role === "driver"
              ? ["עיין בהובלות פתוחות באזורך", "שלח הצעת מחיר — בלי עמלות", "קבל תשלום במזומן ישירות"]
              : ["פרסם חינם — 60 שניות", "קבל הצעות ממובילים מאומתים", "שלם ₪35 פיקדון בלבד כדי לנעול"]
            ).map(t => (
              <div key={t} className="flex items-center gap-3">
                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", theme.checkBg)}>
                  <Check className="w-3 h-3 text-black" strokeWidth={3} />
                </div>
                <span className={cn("text-sm", theme.isLight ? "text-black/70" : "text-white/70")}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <p className={cn("hidden md:block relative text-xs pb-8 mt-auto pt-10", theme.isLight ? "text-black/25" : "text-white/20")}>
          © 2025 On The Way · מתווך טכנולוגי בלבד
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 bg-white flex flex-col justify-center px-6 sm:px-10 md:px-16 py-10 md:py-0">
        <div className="w-full max-w-sm mx-auto md:mx-0">

          {/* Role selection — only when no urlRole */}
          {!urlRole && (
            <div className="space-y-4 mb-6">
              <div className="mb-2">
                <h2 className="text-lg font-black text-zinc-900 mb-1">מי אתה?</h2>
                <p className="text-zinc-400 text-sm">בחר את התפקיד שלך</p>
              </div>
              {ROLES.map(r => {
                const Icon = r.icon;
                const selected = role === r.id;
                return (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-right",
                      selected ? r.color : "border-zinc-100 bg-zinc-50 hover:border-zinc-200 hover:bg-white"
                    )}>
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all", selected ? r.iconBg : "bg-white border border-zinc-200")}>
                      <Icon className={cn("w-5 h-5", selected ? "text-white" : "text-zinc-400")} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 text-right">
                      <p className={cn("font-black text-sm", selected ? "" : "text-zinc-800")}>{r.title}</p>
                      <p className={cn("text-xs mt-0.5", selected ? "opacity-65" : "text-zinc-400")}>{r.sub}</p>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all",
                      selected ? "border-current bg-current" : "border-zinc-300")}>
                      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Title when role comes from URL */}
          {urlRole && (
            <div className="mb-8">
              <h2 className="text-2xl font-black text-zinc-900 mb-1">
                {urlRole === "sender" ? "כניסה כשולח" : "כניסה כמוביל"}
              </h2>
              <p className="text-zinc-400 text-sm">התחבר עם גוגל כדי להמשיך</p>
            </div>
          )}

          {/* Google button */}
          {role && (
            <button onClick={handleGoogle} disabled={loading}
              className="w-full h-14 flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 rounded-2xl font-bold text-zinc-800 text-sm hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] transition-all disabled:opacity-60 shadow-sm">
              {loading
                ? <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                : <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
              }
              {loading ? "מתחבר..." : "המשך עם גוגל"}
            </button>
          )}

          {/* Trust note */}
          <div className="mt-6 flex items-start gap-2 bg-zinc-50 rounded-xl p-3.5">
            <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              בהתחברות אתה מאשר את{" "}
              <Link href="/terms" className="text-primary underline underline-offset-2">תקנון השימוש</Link>.
              הפלטפורמה מאמתת תעודת זהות ורישיון נהיגה לכל מוביל.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
