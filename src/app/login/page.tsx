"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Truck, ChevronRight, BadgeCheck, ArrowLeft, Check } from "lucide-react";
import { useAuth, type AuthRole } from "@/lib/auth";
import { supabase, supabaseReady } from "@/lib/supabase";
import { cn } from "@/lib/utils";

/* ── Per-role theme ── */
const ROLE_THEME = {
  sender: {
    icon: Package,
    isLight: true,                          // lime panel — light text
    panelStyle: { background: "#ccf02a" },
    glowStyle: { background: "rgba(0,0,0,0.08)" },
    badgeStyle: { background: "rgba(0,0,0,0.12)", color: "#000", border: "1px solid rgba(0,0,0,0.1)" },
    badgeText: "שולח · אזור אישי",
    title: "פרסם הובלה וקבל הצעות",
    sub: "מובילים מתחרים על העבודה שלך",
    checkBg: "bg-black/20",
    btnClass: "bg-black text-white hover:bg-black/85",
    otpActive: "border-primary bg-primary/5 text-primary",
    otpFocus: "focus:border-primary",
  },
  driver: {
    icon: Truck,
    isLight: false,                         // dark panel
    panelStyle: { background: "#0d0d0d" },
    glowStyle: { background: "rgba(212,245,0,0.15)" },
    badgeStyle: { background: "rgba(212,245,0,0.15)", color: "#ccf02a", border: "1px solid rgba(212,245,0,0.2)" },
    badgeText: "מוביל · אזור אישי",
    title: "הרוויח עם הרכב שלך",
    sub: "עיין בהובלות פתוחות ושלח הצעות",
    checkBg: "bg-[#ccf02a]",
    btnClass: "bg-[#ccf02a] hover:bg-[#b8d920] text-black",
    otpActive: "border-[#1d44f9] bg-[#1d44f9]/5 text-[#1d44f9]",
    otpFocus: "focus:border-[#1d44f9]",
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
    color: "border-[#1d44f9] bg-[#1d44f9]/5 text-[#1d44f9]",
    iconBg: "bg-[#1d44f9]",
  },
];

type Step = "role" | "phone" | "otp";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const urlRole = searchParams.get("role") as AuthRole | null;
  const [role, setRole] = useState<AuthRole | null>(urlRole);
  // If role came from URL, skip role-selection step
  const [step, setStep] = useState<Step>(urlRole ? "phone" : "role");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const theme = role ? ROLE_THEME[role] : ROLE_THEME.driver;
  const RoleIcon = role ? theme.icon : Truck;

  const handleGoogle = async () => {
    if (!role) return;
    if (supabaseReady) {
      // Real Google OAuth via Supabase
      localStorage.setItem("otw_pending_role", role);
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } else {
      // Fallback mock (until Supabase is configured)
      setLoading(true);
      setTimeout(() => {
        login(role, name || undefined, phone || undefined);
        router.replace(role === "sender" ? "/sender" : "/driver");
      }, 900);
    }
  };

  const handlePhone = () => {
    if (phone.length < 9) return;
    setStep("otp");
  };

  const handleOtp = () => {
    if (!role) return;
    setLoading(true);
    setTimeout(() => {
      login(role, name || undefined, phone || undefined);
      router.replace(role === "sender" ? "/sender" : "/driver");
    }, 700);
  };

  const handleOtpInput = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 3) document.getElementById(`otp-${i + 1}`)?.focus();
    if (next.every(d => d !== "")) setTimeout(handleOtp, 200);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" dir="rtl">

      {/* ══════════════════════════════════════
          LEFT PANEL — Brand / marketing
          (right side in RTL = primary reading side)
      ══════════════════════════════════════ */}
      <div
        className="relative overflow-hidden flex flex-col md:w-[52%] md:min-h-screen px-8 pt-10 pb-12 md:px-14 md:pt-14 md:pb-0 transition-colors duration-500"
        style={role ? theme.panelStyle : { background: "#1d44f9" }}>

        {/* Glow blob */}
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full blur-[130px] opacity-30 pointer-events-none"
          style={role ? theme.glowStyle : { background: "#ccf02a" }} />

        {/* Logo */}
        <Link href="/" className="relative mb-12 w-fit">
          <Image src="/logo.svg" alt="On The Way" width={115} height={56} unoptimized
            className={theme.isLight ? "" : "brightness-0 invert"} />
        </Link>

        {/* Main content */}
        <div className="relative flex-1 flex flex-col justify-center max-w-sm">
          {role && (
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-6"
              style={theme.badgeStyle}>
              <RoleIcon className="w-3.5 h-3.5" />
              {theme.badgeText}
            </div>
          )}

          <h1 className={cn("text-3xl md:text-4xl font-black leading-tight mb-4", theme.isLight ? "text-black" : "text-white")}>
            {role ? theme.title : <span>ברוכים הבאים<br /><span style={{ color: "#ccf02a" }}>לעל הדרך</span></span>}
          </h1>
          <p className={cn("text-base leading-relaxed mb-10", theme.isLight ? "text-black/55" : "text-white/50")}>
            {role ? theme.sub : "כניסה או הרשמה — פחות מ-30 שניות"}
          </p>

          {/* Value props */}
          <div className="space-y-3">
            {(role === "driver"
              ? ["עיין בהובלות פתוחות באזורך", "שלח הצעת מחיר — בלי עמלות", "קבל תשלום במזומן ישירות"]
              : ["פרסם חינם — 60 שניות", "קבל הצעות ממובילים מאומתים", "שלם ₪35 פיקדון בלבד כדי לנעול"]
            ).map(t => (
              <div key={t} className="flex items-center gap-3">
                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", theme.checkBg)}>
                  <Check className={cn("w-3 h-3", theme.isLight ? "text-black" : "text-black")} strokeWidth={3} />
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

      {/* ══════════════════════════════════════
          RIGHT PANEL — Login form
      ══════════════════════════════════════ */}
      <div className="flex-1 bg-white flex flex-col justify-center px-6 sm:px-10 md:px-16 py-10 md:py-0">
        <div className="w-full max-w-sm mx-auto md:mx-0">

        {/* ── STEP: ROLE ── */}
        {step === "role" && (
          <div className="space-y-4">
            <div className="mb-2">
              <h2 className="text-lg font-black text-zinc-900 mb-1">מי אתה?</h2>
              <p className="text-zinc-400 text-sm">בחר את התפקיד שלך כדי להיכנס לאזור הנכון</p>
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

            {role && (
              <div className="space-y-3 pt-1">
                <button onClick={handleGoogle} disabled={loading}
                  className="w-full h-13 flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 rounded-2xl font-bold text-zinc-800 text-sm hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] transition-all disabled:opacity-60">
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

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-100" />
                  <span className="text-xs text-zinc-300 font-medium">או</span>
                  <div className="flex-1 h-px bg-zinc-100" />
                </div>

                <button onClick={() => setStep("phone")}
                  className={cn("w-full h-13 flex items-center justify-center gap-2 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg", theme.btnClass)}>
                  המשך עם מספר טלפון
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP: PHONE ── */}
        {step === "phone" && (
          <div className="space-y-5">
            <button
              onClick={() => urlRole ? router.back() : setStep("role")}
              className="flex items-center gap-1 text-zinc-400 text-sm hover:text-zinc-700 transition-colors">
              <ChevronRight className="w-4 h-4" />
              חזרה
            </button>
            <div>
              <h2 className="text-xl font-black text-zinc-900 mb-1">מה מספר הטלפון שלך?</h2>
              <p className="text-zinc-400 text-sm">נשלח קוד אימות ב-SMS — 30 שניות</p>
            </div>

            <input
              type="text"
              placeholder="שם מלא"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-14 border-2 border-zinc-200 rounded-2xl px-4 text-base font-semibold focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-300 placeholder:font-normal"
              autoFocus
            />

            <div className="flex items-center gap-3 border-2 border-zinc-200 rounded-2xl px-4 h-14 focus-within:border-zinc-400 transition-colors">
              <span className="text-sm font-bold text-zinc-600 shrink-0">🇮🇱 +972</span>
              <div className="w-px h-5 bg-zinc-200 shrink-0" />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="05X-XXX-XXXX"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 text-lg font-bold bg-transparent focus:outline-none placeholder:text-zinc-300 placeholder:font-normal placeholder:text-base"
                dir="ltr"
              />
            </div>

            <button onClick={handleGoogle} disabled={loading}
              className="w-full h-12 flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 rounded-2xl font-semibold text-zinc-700 text-sm hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] transition-all">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              המשך עם גוגל במקום
            </button>

            <button
              onClick={handlePhone}
              disabled={phone.length < 9}
              className={cn("w-full h-14 font-black rounded-2xl active:scale-[0.98] disabled:opacity-30 transition-all shadow-lg text-sm", theme.btnClass)}>
              שלח קוד אימות →
            </button>
          </div>
        )}

        {/* ── STEP: OTP ── */}
        {step === "otp" && (
          <div className="space-y-6">
            <button onClick={() => setStep("phone")} className="flex items-center gap-1 text-zinc-400 text-sm hover:text-zinc-700 transition-colors">
              <ChevronRight className="w-4 h-4" />
              חזרה
            </button>
            <div>
              <h2 className="text-xl font-black text-zinc-900 mb-1">הכנס קוד אימות</h2>
              <p className="text-zinc-400 text-sm">שלחנו SMS ל-<strong className="text-zinc-700 font-black">{phone}</strong></p>
            </div>

            <div className="flex gap-3 justify-center" dir="ltr">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpInput(i, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Backspace" && !digit && i > 0)
                      document.getElementById(`otp-${i - 1}`)?.focus();
                  }}
                  className={cn(
                    "w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-black border-2 rounded-2xl focus:outline-none transition-all",
                    digit ? theme.otpActive : `border-zinc-200 ${theme.otpFocus}`
                  )}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
                <div className={cn("w-4 h-4 border-2 border-zinc-200 rounded-full animate-spin", "border-t-primary")} />
                מאמת...
              </div>
            )}

            <button onClick={() => setStep("phone")} className="w-full text-center text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
              לא קיבלת? שלח שוב
            </button>
          </div>
        )}

        {/* Trust note */}
        <div className="mt-8 flex items-start gap-2 bg-zinc-50 rounded-xl p-3.5">
          <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            בהתחברות אתה מאשר את{" "}
            <Link href="/terms" className="text-primary underline underline-offset-2">תקנון השימוש</Link>.
            הפלטפורמה מאמתת תעודת זהות ורישיון נהיגה לכל מוביל.
          </p>
        </div>

        </div>{/* /max-w-sm */}
      </div>{/* /right panel */}
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
