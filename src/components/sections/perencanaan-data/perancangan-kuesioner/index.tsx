"use client";
import * as React from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";

import Stepper from "@components/ui/stepper";
import Button from "@components/ui/button";
import SearchBox from "@components/ui/searchbox";
import type { FilterOption as SearchBoxFilter } from "@components/ui/searchbox";
import IdentifikasiTabs from "@components/sections/perencanaan-data/perancangan-kuesioner/identifikasi-tabs";
import InfoUmumCard from "@components/sections/perencanaan-data/perancangan-kuesioner/info-umum-card";
import VendorTable from "@components/sections/perencanaan-data/perancangan-kuesioner/vendor-table";
import VendorDialog from "@components/sections/perencanaan-data/perancangan-kuesioner/vendor-dialog";

import {
  fetchPerencanaanData,
  adjustIdentifikasiKebutuhan,
  savePerencanaanData,
} from "@lib/api/perencanaan-data/perancangan-kuesioner";
import type {
  CommonInformation,
  MaterialItem,
  PeralatanItem,
  TenagaKerjaItem,
  VendorItem,
} from "../../../../types/perencanaan-data/perancangan-kuesioner";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTahap4FiltersStore } from "../../../../store/perencanaan-data/perancangan-kuesioner/store";

type PdfEditResult = {
  url_kuisioner?: string;
  file?: File | Blob;
  meta?: Record<string, unknown>;
};

const NUMBER_OF_STEPS = 4;
const STEP_LABELS = [
  "Informasi Umum",
  "Identifikasi Kebutuhan",
  "Penentuan Shortlist Vendor",
  "Perancangan Kuesioner",
];

type PerencanaanDataResponse = {
  informasi_umum?: CommonInformation;
  material?: MaterialItem[];
  peralatan?: PeralatanItem[];
  tenagaKerja?: TenagaKerjaItem[];
  tenaga_kerja?: TenagaKerjaItem[];
  shortlist_vendor?: VendorItem[];
};

type VendorMaybeUrl = VendorItem & {
  url_kuisioner?: string | null;
  id?: number | string;
};

function hasUrlKuisioner(
  obj: unknown
): obj is { url_kuisioner?: string | null } {
  return typeof obj === "object" && obj !== null && "url_kuisioner" in obj;
}

function getNumericId(v: { id?: number | string } | undefined): number | null {
  if (!v || v.id == null) return null;
  const n = typeof v.id === "string" ? Number(v.id) : v.id;
  return Number.isFinite(n) ? n : null;
}

export default function Perancangan_Kuesioner_Section() {
  const [currentStep] = useState(3);
  const [info, setInfo] = useState<CommonInformation>({} as CommonInformation);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [tools, setTools] = useState<PeralatanItem[]>([]);
  const [workers, setWorkers] = useState<TenagaKerjaItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const resolverRef = useRef<((res?: PdfEditResult) => void) | null>(null);

  const { vendorFilters, setVendorFilters } = useTahap4FiltersStore();
  const [query, setQuery] = useState("");

  const informasiUmumId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("informasi_umum_id")
      : null;

  const hydrate = useCallback(async () => {
    if (!informasiUmumId) return;
    const result = (await fetchPerencanaanData(
      informasiUmumId
    )) as PerencanaanDataResponse;

    const material = Array.isArray(result.material) ? result.material : [];
    const peralatan = Array.isArray(result.peralatan) ? result.peralatan : [];
    const tenagaKerja = Array.isArray(result.tenagaKerja)
      ? result.tenagaKerja
      : Array.isArray(result.tenaga_kerja)
      ? result.tenaga_kerja
      : [];
    const shortlist = Array.isArray(result.shortlist_vendor)
      ? result.shortlist_vendor
      : [];
    const info = (result.informasi_umum ?? {}) as CommonInformation;

    setInfo(info);
    setMaterials(material);
    setTools(peralatan);
    setWorkers(tenagaKerja);
    setVendors(shortlist);
  }, [informasiUmumId]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const openVendorModalAsync = useCallback(
    async (id: number): Promise<PdfEditResult | undefined> => {
      setSelectedVendorId(id);
      setVendorModalOpen(true);
      return new Promise<PdfEditResult | undefined>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    []
  );

  const handleVendorModalConfirm = useCallback(
    async (payload: {
      id_vendor: number;
      material: number[];
      peralatan: number[];
      tenaga_kerja: number[];
    }) => {
      const shortlistVendorId = informasiUmumId
        ? parseInt(informasiUmumId, 10)
        : null;

      await adjustIdentifikasiKebutuhan({
        id_vendor: Number(payload.id_vendor),
        shortlist_vendor_id: shortlistVendorId,
        material: payload.material.map((id) => ({ id })),
        peralatan: payload.peralatan.map((id) => ({ id })),
        tenaga_kerja: payload.tenaga_kerja.map((id) => ({ id })),
      });

      const refreshed = (await fetchPerencanaanData(
        informasiUmumId as string
      )) as PerencanaanDataResponse;

      const shortlist = Array.isArray(refreshed.shortlist_vendor)
        ? (refreshed.shortlist_vendor as VendorItem[])
        : [];

      setVendors(shortlist);

      const found = shortlist.find(
        (v) => getNumericId(v as VendorMaybeUrl) === payload.id_vendor
      ) as VendorMaybeUrl | undefined;

      const url =
        hasUrlKuisioner(found) && found?.url_kuisioner
          ? String(found.url_kuisioner)
          : undefined;

      resolverRef.current?.({ url_kuisioner: url });
      resolverRef.current = null;

      setVendorModalOpen(false);
      setSelectedVendorId(null);
    },
    [informasiUmumId]
  );

  const handleVendorModalClose = useCallback(() => {
    setVendorModalOpen(false);
    setSelectedVendorId(null);
    resolverRef.current?.(undefined);
    resolverRef.current = null;
  }, []);

  const handleFinalConfirm = async () => {
    if (!informasiUmumId) return;
    await savePerencanaanData(informasiUmumId);
    window.location.href = "/perencanaan-data/perencanaan-list";
  };

  const baseOptions = useMemo<SearchBoxFilter[]>(
    () => [
      { label: "Responden/Vendor", value: "nama_vendor", checked: false },
      { label: "Pemilik Vendor", value: "pemilik_vendor", checked: false },
      { label: "Alamat", value: "alamat", checked: false },
      { label: "Kontak", value: "kontak", checked: false },
    ],
    []
  );

  const [sbOptions, setSbOptions] = useState<SearchBoxFilter[]>(baseOptions);

  useEffect(() => {
    setSbOptions((prev) =>
      prev.map((o) => ({
        ...o,
        checked: vendorFilters.includes(String(o.value)),
      }))
    );
  }, [vendorFilters]);

  useEffect(() => {
    setSbOptions(
      baseOptions.map((o) => ({
        ...o,
        checked: vendorFilters.includes(String(o.value)),
      }))
    );
  }, [baseOptions, vendorFilters]);

  const applyFiltersToStore = useCallback(
    (opts: SearchBoxFilter[]) => {
      setSbOptions(opts);
      const active = opts
        .filter((f) => f.checked)
        .map((f) => String(f.value ?? ""));
      setVendorFilters(active);
    },
    [setVendorFilters]
  );

  return (
    <div className="p-8">
      <div className="space-y-8">
        <div className="space-y-3 pt-8">
          <h3 className="text-H3">Tahap Perencanaan Data</h3>
          <div className="mt-3 bg-neutral-100 px-6 pb-8 pt-16 rounded-[16px]">
            <Stepper
              currentStep={currentStep}
              numberOfSteps={NUMBER_OF_STEPS}
              labels={STEP_LABELS}
            />
            <br />
          </div>

          <div className="space-y-3">
            <h4 className="text-H4">Perancangan Kuesioner</h4>

            <div className="space-y-2">
              <h5 className="text-H5">1. Informasi Umum</h5>
              <InfoUmumCard info={info} />
            </div>

            <h5 className="text-H5">2. Identifikasi Kebutuhan</h5>
            <IdentifikasiTabs
              materials={materials}
              tools={tools}
              workers={workers}
            />

            <h5 className="text-H5 flex items-center justify-between">
              <span>3. Vendor</span>
              <div className="w-[400px]">
                <SearchBox
                  placeholder="Cari Vendor..."
                  onSearch={(q) => startTransition(() => setQuery(q))}
                  withFilter
                  filterOptions={sbOptions}
                  onFilterClick={applyFiltersToStore}
                  onApplyFilters={applyFiltersToStore}
                />
              </div>
            </h5>

            <VendorTable
              vendors={vendors}
              onOpenModal={openVendorModalAsync}
              query={query}
              filterKeys={vendorFilters}
            />

            <div className="flex justify-end gap-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px] mb-4">
              <Button
                variant="outlined_yellow"
                label="Kembali"
                onClick={() =>
                  (window.location.href =
                    "/perencanaan_data/tahap3?fromTahap4=true")
                }
              />
              <Button
                variant="solid_blue"
                label="Simpan & Lanjut"
                onClick={() => setConfirmOpen(true)}
              />
            </div>

            <Dialog
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              fullWidth
              maxWidth="xs"
              PaperProps={{
                sx: { borderRadius: "16px" },
              }}>
              <DialogTitle className="text-H5">Peringatan</DialogTitle>
              <DialogContent>
                <p>Anda yakin ingin menyimpan?</p>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button
                  variant="outlined_yellow"
                  label="Batal"
                  onClick={() => setConfirmOpen(false)}
                />
                <Button
                  variant="solid_blue"
                  label="Ya"
                  onClick={handleFinalConfirm}
                />
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>

      <VendorDialog
        open={vendorModalOpen}
        onClose={handleVendorModalClose}
        vendorId={selectedVendorId}
        informasiUmumId={informasiUmumId}
        onConfirm={handleVendorModalConfirm}
      />
    </div>
  );
}
