import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function MyBidsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="w-20 h-20 rounded-3xl bg-[#c9f45a]/15 flex items-center justify-center mx-auto mb-5">
        <Briefcase className="w-9 h-9 text-[#4a6ffe]" />
      </div>
      <h1 className="text-2xl font-black mb-2 text-zinc-900">ההצעות שלי</h1>
      <p className="text-zinc-500 mb-8">עדיין לא הגשת הצעות — עיין בהובלות הפתוחות</p>
      <Link href="/driver"
        className="inline-flex items-center gap-2 bg-[#c9f45a] text-black font-bold px-6 py-3.5 rounded-2xl hover:bg-[#b5e048] active:scale-95 transition-all shadow-lg shadow-[#c9f45a]/25">
        צפה בהובלות פתוחות
      </Link>
    </div>
  );
}
