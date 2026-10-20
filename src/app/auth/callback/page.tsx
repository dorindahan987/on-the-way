"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth, type AuthRole } from "@/lib/auth";

function AuthCallbackInner() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    const finalize = (userName: string, email: string) => {
      const role = (localStorage.getItem("otw_pending_role") ?? "sender") as AuthRole;
      const returnTo = localStorage.getItem("otw_return_to") ?? (role === "driver" ? "/driver" : "/sender");
      localStorage.removeItem("otw_pending_role");
      localStorage.removeItem("otw_return_to");
      login(role, userName || email || "משתמש", undefined);
      router.replace(returnTo);
    };

    const trySession = async () => {
      // prefer code from searchParams, fallback to window.location for reliability
      const resolvedCode = code ?? new URLSearchParams(window.location.search).get("code");

      if (resolvedCode) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(resolvedCode);
        if (!error && data.session?.user) {
          const m = data.session.user.user_metadata ?? {};
          finalize(String(m.full_name ?? m.name ?? ""), data.session.user.email ?? "");
          return;
        }
      }
      // fallback – check if session already exists
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const m = data.session.user.user_metadata ?? {};
        finalize(String(m.full_name ?? m.name ?? ""), data.session.user.email ?? "");
      } else {
        router.replace("/login");
      }
    };

    trySession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-zinc-200 border-t-[#1d44f9] rounded-full animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">מתחבר...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackInner />
    </Suspense>
  );
}
