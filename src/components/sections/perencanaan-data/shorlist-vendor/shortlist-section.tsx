"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Stepper from "@components/ui/stepper";
import Tabs from "@components/ui/tabs";
import useStore from "@store/perencanaan-data/shortlist-vendor/store";
import Pagination from "@components/ui/pagination";
import Button from "@components/ui/button";
import MaterialShortlist from "./forms/material-shortlist";
import PeralatanShortlist from "./forms/peralatan-shortlist";
import TenagaKerjaShortlist from "./forms/tenaga-kerja";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAlert } from "@components/ui/alert";
import type {
  FormValues,
  InitialValuesState,
} from "../../../../types/perencanaan-data/shortlist-vendor";

type TabItem = { label: string; content: React.ReactNode };

const NUMBER_OF_STEPS = 4;
const STEP_LABELS = [
  "Informasi Umum",
  "Identifikasi Kebutuhan",
  "Penentuan Shortlist Vendor",
  "Perancangan Kuesioner",
] as const;

export default function Shortlist_Section() {
  const router = useRouter();
  const { show } = useAlert();

  const [currentStep] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [initialValues, setInitialValues] = useState<InitialValuesState>({
    material: [],
    peralatan: [],
    tenaga_kerja: [],
  });

  const fetchStatusProgres = useStore((s) => s.fetchStatusProgres);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInitialValues(useStore.getState().initialValues);
    }
  }, []);

  useEffect(() => {
    fetchStatusProgres?.();
  }, [fetchStatusProgres]);

  const dataByTab = useMemo(
    () =>
      [
        initialValues.material,
        initialValues.peralatan,
        initialValues.tenaga_kerja,
      ] as const,
    [
      initialValues.material,
      initialValues.peralatan,
      initialValues.tenaga_kerja,
    ]
  );

  const totalData = dataByTab[activeTab]?.length || 0;

  const handleTabChange = useCallback((idx: number) => {
    setActiveTab(idx);
    setCurrentPage(1);
  }, []);

  const navigateToTahap2 = () => {
    router.push("/perencanaan_data/tahap2?fromTahap3=true");
  };

  const TabsContent: TabItem[] = useMemo(
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
          onSubmit={async (values) => {
            const selected = [
              ...values.material.filter((i) => i.checked),
              ...values.peralatan.filter((i) => i.checked),
              ...values.tenaga_kerja.filter((i) => i.checked),
            ];

            const mappedSelectedItems = selected
              .map((item) => {
                const found =
                  initialValues.material.find((v) => v.id === item.value) ||
                  initialValues.peralatan.find((v) => v.id === item.value) ||
                  initialValues.tenaga_kerja.find((v) => v.id === item.value);

                return found
                  ? {
                      data_vendor_id: found.id,
                      nama_vendor: found.nama_vendor,
                      pemilik_vendor: found.pemilik_vendor,
                      sumber_daya: found.sumber_daya,
                      alamat: found.alamat,
                      kontak: found.kontak,
                    }
                  : null;
              })
              .filter(Boolean);

            try {
              const response = await axios.post(
                "https://api-ecatalogue-staging.online/api/perencanaan-data/store-shortlist-vendor",
                {
                  identifikasi_kebutuhan_id:
                    localStorage.getItem("identifikasi_kebutuhan_id") || "",
                  shortlist_vendor: mappedSelectedItems,
                }
              );

              if (response.data?.status === "success") {
                show("Data berhasil disimpan.", "success");
                router.replace("/perencanaan_data/tahap4");
                return;
              }

              show("Gagal menyimpan data.", "error");
            } catch (e: any) {
              const msg =
                e?.response?.data?.message ||
                "Terjadi kesalahan saat menyimpan data.";
              show(msg, "error");
            }
          }}
          enableReinitialize>
          {({ values }) => (
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
          )}
        </Formik>
      </div>
    </div>
  );
}
