"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth, type AuthRole } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // With implicit flow, Supabase detects the session from the URL hash automatically.
    // We listen for SIGNED_IN and then finalize our own auth state.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        subscription.unsubscribe();
        const role = (localStorage.getItem("otw_pending_role") ?? "sender") as AuthRole;
        const returnTo = localStorage.getItem("otw_return_to") ?? (role === "driver" ? "/driver" : "/sender");
        localStorage.removeItem("otw_pending_role");
        localStorage.removeItem("otw_return_to");
        const m = session.user.user_metadata as Record<string, string> | undefined ?? {};
        const name = m.full_name ?? m.name ?? session.user.email ?? "משתמש";
        login(role, name, undefined);
        router.replace(returnTo);
      }
    });

    // Fallback: if no event after 6s redirect to login
    const timeout = setTimeout(() => router.replace("/login"), 6000);
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
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

