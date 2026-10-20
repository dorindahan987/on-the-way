import Link from "next/link";
import { Package } from "lucide-react";

export default function MyShipmentsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
        <Package className="w-9 h-9 text-primary" />
      </div>
      <h1 className="text-2xl font-black mb-2 text-zinc-900">ההובלות שלי</h1>
      <p className="text-zinc-500 mb-8">עדיין לא פרסמת הובלות — זה הזמן להתחיל</p>
      <Link href="/sender/post"
        className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/25">
        + פרסם פריט ראשון
      </Link>
    </div>
  );
}
