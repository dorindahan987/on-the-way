"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, Truck, Package, ChevronLeft, Camera } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const VEHICLE_TYPES = ["רכב פרטי קטן", "רכב פרטי גדול", "ואן / מסחרי", "משאית קטנה", "משאית גדולה"];

export default function OnboardingPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { router.replace("/"); return; }
    // If phone already filled — skip onboarding, respect returnTo
    if (user.phone && user.phone.length > 5) {
      const returnTo = localStorage.getItem("otw_return_to");
      localStorage.removeItem("otw_return_to");
      router.replace(returnTo ?? (user.role === "driver" ? "/driver" : "/sender"));
    }
  }, [user, router]);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!phone.trim() || phone.replace(/\D/g, "").length < 9) {
      setError("נא להזין מספר טלפון תקין");
      return;
    }
    if (user?.role === "driver" && !vehicleType) {
      setError("נא לבחור סוג רכב");
      return;
    }
    setLoading(true);
    updateUser({
      phone: phone.trim(),
      ...(vehicleType ? { vehicle_type: vehicleType } : {}),
      ...(avatar ? { avatar } : {}),
    });
    const returnTo = localStorage.getItem("otw_return_to");
    localStorage.removeItem("otw_return_to");
    router.replace(returnTo ?? (user?.role === "driver" ? "/driver" : "/sender"));
  };

  if (!user) return null;

  const isDriver = user.role === "driver";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10" dir="rtl">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/logo.svg" alt="On The Way" width={100} height={49} unoptimized />
        </div>

        {/* Role badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-sm font-black px-4 py-2 rounded-full"
            style={isDriver
              ? { background: "#4a6ffe", color: "#fff" }
              : { background: "#c9f45a", color: "#000" }}>
            {isDriver ? <Truck className="w-4 h-4" /> : <Package className="w-4 h-4" />}
            {isDriver ? "מוביל" : "שולח"}
          </span>
        </div>

        <h1 className="text-2xl font-black text-zinc-900 text-center mb-1">שלום, {user.name.split(" ")[0]}!</h1>
        <p className="text-zinc-400 text-sm text-center mb-8">כמה פרטים אחרונים לפני שמתחילים</p>

        {/* Avatar upload */}
        <div className="flex justify-center mb-6">
          <label className="relative cursor-pointer group">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-3xl font-black border-4 border-white shadow-lg"
              style={isDriver ? { background: "#4a6ffe", color: "#fff" } : { background: "#c9f45a", color: "#000" }}>
              {avatar
                ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                : user.name[0]}
            </div>
            <div className="absolute bottom-0 left-0 w-7 h-7 rounded-full bg-white border-2 border-zinc-200 flex items-center justify-center shadow group-hover:bg-zinc-100 transition-colors">
              <Camera className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </label>
        </div>

        <div className="space-y-4">

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">מספר טלפון <span className="text-red-400">*</span></label>
            <div className="relative">
              <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="050-000-0000"
                value={phone}
                onChange={e => { setPhone(e.target.value); setError(""); }}
                className="w-full h-12 border-2 border-zinc-200 rounded-2xl pr-10 pl-4 text-sm focus:outline-none focus:border-[#4a6ffe] transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          {/* Vehicle type — drivers only */}
          {isDriver && (
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">סוג הרכב <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-1 gap-2">
                {VEHICLE_TYPES.map(v => (
                  <button key={v} onClick={() => { setVehicleType(v); setError(""); }}
                    className={cn(
                      "w-full h-11 rounded-2xl border-2 text-sm font-bold transition-all text-right px-4",
                      vehicleType === v
                        ? "border-[#4a6ffe] bg-[#4a6ffe]/5 text-[#4a6ffe]"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                    )}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-14 font-black rounded-2xl text-sm transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            style={isDriver
              ? { background: "#4a6ffe", color: "#fff" }
              : { background: "#c9f45a", color: "#000" }}>
            {loading ? "שומר..." : "כניסה לאזור האישי"}
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-zinc-300 text-xs mt-6">הפרטים שלך מאובטחים ולא יועברו לצד שלישי</p>
      </div>
    </div>
  );
}
