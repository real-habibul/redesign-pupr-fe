"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Stepper from "@components/ui/stepper";
import Tabs from "@components/ui/tabs";
import SipastiForm from "@components/sections/perencanaan-data/informasi-umum/sipasti-form";
import ManualForm from "@components/sections/perencanaan-data/informasi-umum/manual-form";
import useInformasiUmumStore from "@store/perencanaan-data/informasi-umum/store";
import { useInformasiUmum } from "@hooks/perencanaan-data/use-informasi-umum";

type TabItem = { label: string; content: React.ReactNode };

const NUMBER_OF_STEPS = 4 as const;
const STEP_LABELS = [
  "Informasi Umum",
  "Identifikasi Kebutuhan",
  "Penentuan Shortlist Vendor",
  "Perancangan Kuesioner",
] as const;

export default function InformasiUmum() {
  const [currentStep, setCurrentStep] = useState(0);
  const searchParams = useSearchParams();

  const { initialValueManual, balaiOptions } = useInformasiUmumStore();
  const { fetchInformasiUmum } = useInformasiUmum();

  useEffect(() => setCurrentStep(0), []);

  useEffect(() => {
    const fromIdent = searchParams.get("fromidentifikasi-kebutuhan") === "true";
    if (!fromIdent) return;
    const id = localStorage.getItem("informasi_umum_id");
    if (!id) return;
    void fetchInformasiUmum(id);
  }, [searchParams, fetchInformasiUmum]);

  const TAB_ITEMS: TabItem[] = [
    { label: "SIPASTI", content: <SipastiForm hide={false} /> },
    {
      label: "Manual",
      content: (
        <ManualForm
          hide={false}
          balaiOptions={balaiOptions}
          initialValues={initialValueManual}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3 pt-8">
        <h3 className="text-H3">Tahap Perencanaan Data</h3>

        <div className="bg-solid_basic_neutral_100 px-6 pb-8 pt-16 rounded-[16px]">
          <Stepper
            currentStep={currentStep}
            numberOfSteps={NUMBER_OF_STEPS}
            labels={[...STEP_LABELS]}
          />
        </div>

        <h4 className="text-H4">Informasi Umum</h4>

        <Tabs tabs={TAB_ITEMS} />
      </div>
    </div>
  );
}
