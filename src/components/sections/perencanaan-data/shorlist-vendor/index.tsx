"use client";

import * as React from "react";
import Stepper from "@components/ui/stepper";
import Tabs from "@components/ui/tabs";
import Pagination from "@components/ui/pagination";
import Button from "@components/ui/button";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { useAlert } from "@components/ui/alert";
import { getVendorDataByIdentifikasiId } from "@lib/api/perencanaan-data/shortlist-vendor";
import {
  NUMBER_OF_STEPS,
  STEP_LABELS,
} from "@constants/perencanaan-data/steps";
import MaterialShortlist from "./forms/material-shortlist";
import PeralatanShortlist from "./forms/peralatan-shortlist";
import TenagaKerjaShortlist from "./forms/tenaga-kerja";
import { useShortlistSubmit } from "@hooks/perencanaan-data/use-shortlist-vendor";
import type {
  VendorItem,
  FormValues,
} from "../../../../types/perencanaan-data/shortlist-vendor";

export default function ShortlistSection() {
  const router = useRouter();
  const { show } = useAlert();
  const [currentStep] = React.useState<number>(2);
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const itemsPerPage = 10;

  const [initialValues, setInitialValues] = React.useState<{
    material: VendorItem[];
    peralatan: VendorItem[];
    tenaga_kerja: VendorItem[];
  }>({ material: [], peralatan: [], tenaga_kerja: [] });

  React.useEffect(() => {
    (async () => {
      try {
        const storedId =
          typeof window !== "undefined"
            ? localStorage.getItem("identifikasi_kebutuhan_id")
            : null;

        if (!storedId) {
          show("identifikasi_kebutuhan_id tidak ditemukan.", "error");
          return;
        }

        const data = await getVendorDataByIdentifikasiId(storedId);
        setInitialValues({
          material: data.material ?? [],
          peralatan: data.peralatan ?? [],
          tenaga_kerja: data.tenaga_kerja ?? [],
        });
      } catch (e: any) {
        show(e?.friendlyMessage ?? "Gagal memuat data vendor.", "error");
      }
    })();
  }, [show]);

  const { onSubmit } = useShortlistSubmit(initialValues);

  const dataByTab = React.useMemo(
    () =>
      [
        initialValues.material,
        initialValues.peralatan,
        initialValues.tenaga_kerja,
      ] as const,
    [initialValues]
  );

  const totalData = dataByTab[activeTab]?.length || 0;

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setCurrentPage(1);
  };

  const navigateToTahap2 = () => {
    router.push("/perencanaan_data/tahap2?fromTahap3=true");
  };

  const TabsContent = React.useMemo(
    () => [
      {
        label: "Material",
        content: (
          <MaterialShortlist
            rows={initialValues.material}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        ),
      },
      {
        label: "Peralatan",
        content: (
          <PeralatanShortlist
            rows={initialValues.peralatan}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        ),
      },
      {
        label: "Tenaga Kerja",
        content: (
          <TenagaKerjaShortlist
            rows={initialValues.tenaga_kerja}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        ),
      },
    ],
    [initialValues, currentPage, itemsPerPage]
  );

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-3 pt-8">
        <h3 className="text-H3">Tahap Perencanaan Data</h3>

        <div className="bg-solid_basic_neutral_100 px-6 pb-8 pt-16 rounded-[16px]">
          <Stepper
            currentStep={currentStep}
            numberOfSteps={NUMBER_OF_STEPS}
            labels={[...STEP_LABELS]}
          />
        </div>

        <h4 className="text-H4">Penentuan Shortlist Vendor</h4>

        <Formik<FormValues>
          initialValues={{ material: [], peralatan: [], tenaga_kerja: [] }}
          onSubmit={onSubmit}
          enableReinitialize>
          <Form className="space-y-6">
            <Tabs
              tabs={TabsContent.map((t) => ({
                label: t.label,
                content: t.content,
              }))}
              value={activeTab}
              onChange={handleTabChange}
            />

            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalData={totalData}
              onPageChange={setCurrentPage}
            />

            <div className="flex flex-row justify-end items-center gap-4 bg-neutral-100 px-6 py-8 rounded-[16px]">
              <Button variant="outlined_yellow" onClick={navigateToTahap2}>
                Kembali
              </Button>
              <Button type="submit" variant="solid_blue">
                Simpan & Lanjut
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
