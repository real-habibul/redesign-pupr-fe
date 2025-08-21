"use client";

import * as React from "react";
import Stepper from "@components/ui/stepper";
import Tabs from "@components/ui/tabs";
import Pagination from "@components/ui/pagination";
import Button from "@components/ui/button";
import SearchBox from "@components/ui/searchbox";
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

type SBFilter = { label: string; value: keyof VendorItem; checked?: boolean };

export default function ShortlistSection() {
  const router = useRouter();
  const { show } = useAlert();

  const [currentStep] = React.useState<number>(2);
  const [activeTab, setActiveTab] = React.useState<0 | 1 | 2>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const itemsPerPage = 10;

  const [initialValues, setInitialValues] = React.useState<{
    material: VendorItem[];
    peralatan: VendorItem[];
    tenaga_kerja: VendorItem[];
  }>({ material: [], peralatan: [], tenaga_kerja: [] });

  const [qMat, setQMat] = React.useState("");
  const [qPer, setQPer] = React.useState("");
  const [qTen, setQTen] = React.useState("");

  const dqMat = React.useDeferredValue(qMat);
  const dqPer = React.useDeferredValue(qPer);
  const dqTen = React.useDeferredValue(qTen);

  const [fMat, setFMat] = React.useState<Array<keyof VendorItem>>([]);
  const [fPer, setFPer] = React.useState<Array<keyof VendorItem>>([]);
  const [fTen, setFTen] = React.useState<Array<keyof VendorItem>>([]);

  React.useEffect(() => {
    if (activeTab === 0) setCurrentPage(1);
  }, [dqMat, fMat, activeTab]);
  React.useEffect(() => {
    if (activeTab === 1) setCurrentPage(1);
  }, [dqPer, fPer, activeTab]);
  React.useEffect(() => {
    if (activeTab === 2) setCurrentPage(1);
  }, [dqTen, fTen, activeTab]);

  const filterOptionsBase: SBFilter[] = React.useMemo(
    () => [
      { label: "Responden/Vendor", value: "nama_vendor" },
      { label: "Sumber Daya", value: "sumber_daya" },
      { label: "Pemilik Vendor", value: "pemilik_vendor" },
      { label: "Alamat", value: "alamat" },
      { label: "Kontak", value: "kontak" },
    ],
    []
  );

  const filterOptionsByTab: SBFilter[] = React.useMemo(() => {
    const set =
      activeTab === 0
        ? new Set(fMat)
        : activeTab === 1
        ? new Set(fPer)
        : new Set(fTen);
    return filterOptionsBase.map((o) => ({ ...o, checked: set.has(o.value) }));
  }, [activeTab, fMat, fPer, fTen, filterOptionsBase]);

  const onSearch = React.useCallback(
    (q: string) => {
      React.startTransition(() => {
        if (activeTab === 0) setQMat(q);
        else if (activeTab === 1) setQPer(q);
        else setQTen(q);
      });
    },
    [activeTab]
  );

  const onFilterClick = React.useCallback(
    (filters: SBFilter[]) => {
      const keys = (filters ?? [])
        .filter((f) => !!f.checked)
        .map((f) => f.value) as Array<keyof VendorItem>;
      React.startTransition(() => {
        if (activeTab === 0) setFMat(keys);
        else if (activeTab === 1) setFPer(keys);
        else setFTen(keys);
      });
    },
    [activeTab]
  );

  const currentQuery =
    activeTab === 0 ? dqMat : activeTab === 1 ? dqPer : dqTen;
  const currentFilterKeys =
    activeTab === 0 ? fMat : activeTab === 1 ? fPer : fTen;

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
    setActiveTab(idx as 0 | 1 | 2);
    setCurrentPage(1);
    setQMat("");
    setQPer("");
    setQTen("");
    setFMat([]);
    setFPer([]);
    setFTen([]);
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
            query={dqMat}
            filterKeys={fMat}
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
            query={dqPer}
            filterKeys={fPer}
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
            query={dqTen}
            filterKeys={fTen}
          />
        ),
      },
    ],
    [
      initialValues,
      currentPage,
      itemsPerPage,
      dqMat,
      dqPer,
      dqTen,
      fMat,
      fPer,
      fTen,
    ]
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

        <div className="relative">
          <div className="mt-[6px] md:absolute md:right-0 md:top-0 md:z-10 md:flex md:items-center md:gap-3">
            <SearchBox
              placeholder={
                activeTab === 0
                  ? "Cari Material..."
                  : activeTab === 1
                  ? "Cari Peralatan..."
                  : "Cari Tenaga Kerja..."
              }
              onSearch={onSearch}
              withFilter
              filterOptions={filterOptionsByTab as any}
              onFilterClick={onFilterClick as any}
              className="h-12 w-full md:w-[320px]"
            />
          </div>

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
    </div>
  );
}
