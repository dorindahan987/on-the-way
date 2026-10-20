"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth, type AuthRole } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = (localStorage.getItem("otw_pending_role") ?? "sender") as AuthRole;
        localStorage.removeItem("otw_pending_role");
        const name  = session.user.user_metadata?.full_name
                   ?? session.user.user_metadata?.name
                   ?? session.user.email
                   ?? "משתמש";
        login(role, name, undefined);
        router.replace(role === "driver" ? "/driver" : "/sender");
      } else {
        router.replace("/login");
      }
    });
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
