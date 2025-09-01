"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SurveiKuesionerForm from "@components/sections/pengumpulan-data/survei-kuesioner";

export default function Page() {
  const search = useSearchParams();
  const token = search.get("token") ?? "";
  return <SurveiKuesionerForm token={token} />;
}
