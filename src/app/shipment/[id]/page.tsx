import { SHIPMENTS } from "@/lib/data";
import { ShipmentDetail } from "./ShipmentDetail";

export function generateStaticParams() {
  return SHIPMENTS.map((s) => ({ id: s.id }));
}

export default async function ShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShipmentDetail id={id} />;
}
