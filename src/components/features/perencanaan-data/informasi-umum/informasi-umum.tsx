"use client";

import React, { useState, useEffect } from "react";
import Stepper from "@components/ui/stepper";
import Tabs from "@components/ui/tabs";
import SipastiForm from "@components/features/perencanaan-data/informasi-umum/sipasti-form";
import ManualForm from "@components/features/perencanaan-data/informasi-umum/manual-form";
import manualstore from "@store/perencanaan-data/informasi-umum/store";
import { useInformasiUmum } from "@hooks/perencanaan-data/use-informasi-umum";
import { useAlert } from "@components/ui/alert";
// import { SubmitType } from "@types/perencanaan-data/informasi-umum"; // pakai kalau perlu submit

type TabItem = { label: string; content: React.ReactNode };

const NUMBER_OF_STEPS = 4;
const STEP_LABELS = [
  "Informasi Umum",
  "Identifikasi Kebutuhan",
  "Penentuan Shortlist Vendor",
  "Perancangan Kuesioner",
] as const;

export default function InformasiUmum() {
  const [currentStep, setCurrentStep] = useState(0);

  const { selectedTab, initialValueManual } = manualstore();
  const { balaiOptions } = useInformasiUmum();
  const { show } = useAlert();

  useEffect(() => setCurrentStep(0), []);

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
