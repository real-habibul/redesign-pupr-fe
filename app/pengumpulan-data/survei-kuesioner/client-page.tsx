"use client";

import { useSearchParams } from "next/navigation";
import SurveiKuesionerForm from "@components/sections/pengumpulan-data/survei-kuesioner";

export default function ClientPage() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  return <SurveiKuesionerForm token={token} />;
}
