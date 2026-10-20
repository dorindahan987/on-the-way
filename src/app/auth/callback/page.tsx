"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth, type AuthRole } from "@/lib/auth";
import type { Session } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const finalize = (session: Session) => {
      const role = (localStorage.getItem("otw_pending_role") ?? "sender") as AuthRole;
      const returnTo =
        localStorage.getItem("otw_return_to") ??
        (role === "driver" ? "/driver" : "/sender");
      localStorage.removeItem("otw_pending_role");
      localStorage.removeItem("otw_return_to");
      const m = (session.user.user_metadata ?? {}) as Record<string, string>;
      const name = m.full_name ?? m.name ?? session.user.email ?? "משתמש";
      login(role, name, undefined);
      router.replace(returnTo);
    };

    const handleCallback = async () => {
      // 1. Implicit flow — access_token in URL hash
      const hash = window.location.hash;
      if (hash.includes("access_token=")) {
        const params = new URLSearchParams(hash.replace(/^#/, ""));
        const accessToken = params.get("access_token") ?? "";
        const refreshToken = params.get("refresh_token") ?? "";
        if (accessToken) {
          const { data } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (data.session) {
            finalize(data.session);
            return;
          }
        }
      }

      // 2. PKCE flow — code in query string
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data.session) {
          finalize(data.session);
          return;
        }
      }

      // 3. Session already stored (detectSessionInUrl auto-set it)
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        finalize(data.session);
        return;
      }

      // Nothing worked
      router.replace("/login");
    };

    handleCallback();
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
