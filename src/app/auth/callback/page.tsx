"use client";

import { useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth, type AuthRole } from "@/lib/auth";
import type { Session } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [debugInfo, setDebugInfo] = React.useState<string | null>(null);

  useEffect(() => {
    const finalize = (session: Session) => {
      const role = (localStorage.getItem("otw_pending_role") ?? "sender") as AuthRole;
      localStorage.removeItem("otw_pending_role");
      // keep otw_return_to — onboarding will read and clear it
      const m = (session.user.user_metadata ?? {}) as Record<string, string>;
      const name = m.full_name ?? m.name ?? session.user.email ?? "משתמש";
      const stableId = session.user.id ?? session.user.email ?? "";
      login(role, name, undefined, stableId);
      router.replace("/onboarding");
    };

    const handleCallback = async () => {
      const hash = window.location.hash;
      const search = window.location.search;
      const code = new URLSearchParams(search).get("code");
      const hasHash = hash.includes("access_token=");

      // 1. Implicit flow — access_token in URL hash → decode JWT directly
      if (hasHash) {
        const params = new URLSearchParams(hash.replace(/^#/, ""));
        const accessToken = params.get("access_token") ?? "";
        if (accessToken) {
          try {
            const parts = accessToken.split(".");
            if (parts.length === 3) {
              const payload = JSON.parse(
                atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
              ) as Record<string, unknown>;
              const meta = (payload.user_metadata ?? {}) as Record<string, string>;
              const name =
                meta.full_name ?? meta.name ?? String(payload.email ?? "") ?? "משתמש";
              const stableId = String(payload.sub ?? payload.email ?? "");
              const role = (localStorage.getItem("otw_pending_role") ?? "sender") as AuthRole;
              const returnTo =
                localStorage.getItem("otw_return_to") ??
                (role === "driver" ? "/driver" : "/sender");
              localStorage.removeItem("otw_pending_role");
              // keep otw_return_to — onboarding will read and clear it
              login(role, name, undefined, stableId);
              router.replace("/onboarding");
              return;
            }
          } catch {}
        }
      }

      // 2. PKCE flow — code in query string
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data.session) { finalize(data.session); return; }
        setDebugInfo(`code נמצא אבל exchange נכשל: ${error?.message ?? "שגיאה לא ידועה"} | code length: ${code.length}`);
        return;
      }

      // 3. Session already stored
      const { data } = await supabase.auth.getSession();
      if (data.session) { finalize(data.session); return; }

      // Debug: show what we got
      setDebugInfo(
        `hash: ${hash ? hash.substring(0, 60) : "ריק"} | search: ${search || "ריק"} | pending_role: ${localStorage.getItem("otw_pending_role") ?? "ריק"}`
      );
    };

    handleCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (debugInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-sm text-center">
          <p className="text-red-500 font-bold mb-2">שגיאת התחברות</p>
          <p className="text-xs text-zinc-500 break-all mb-4">{debugInfo}</p>
          <button onClick={() => router.replace("/login")}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm">
            חזרה לכניסה
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-zinc-200 border-t-[#4a6ffe] rounded-full animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">מתחבר...</p>
      </div>
    </div>
  );
}
