"use client";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";

import Stepper from "@components/ui/stepper";
import Button from "@components/ui/button";
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
  FilterOption,
} from "../../../../types/perencanaan-data/perancangan-kuesioner";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const NUMBER_OF_STEPS = 4;
const STEP_LABELS = [
  "Informasi Umum",
  "Identifikasi Kebutuhan",
  "Penentuan Shortlist Vendor",
  "Perancangan Kuesioner",
];

export default function Tahap4Section() {
  const [currentStep] = useState(3);
  const [info, setInfo] = useState<CommonInformation>({} as CommonInformation);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [tools, setTools] = useState<PeralatanItem[]>([]);
  const [workers, setWorkers] = useState<TenagaKerjaItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const informasiUmumId =
    typeof window !== "undefined"
      ? localStorage.getItem("informasi_umum_id")
      : null;

  const filterOptionsMaterial: FilterOption[] = [
    { label: "Nama Material", accessor: "nama_material", checked: false },
    { label: "Satuan", accessor: "satuan", checked: false },
    { label: "Spesifikasi", accessor: "spesifikasi", checked: false },
    { label: "Ukuran", accessor: "ukuran", checked: false },
    { label: "Kodefikasi", accessor: "kodefikasi", checked: false },
    {
      label: "Kelompok Material",
      accessor: "kelompok_material",
      checked: false,
    },
    { label: "Jumlah Kebutuhan", accessor: "jumlah_kebutuhan", checked: false },
    { label: "Merk", accessor: "merk", checked: false },
    { label: "Provinsi", accessor: "provinsi", checked: false },
    { label: "Kabupaten/Kota", accessor: "kota", checked: false },
  ];

  const filterOptionsPeralatan: FilterOption[] = [
    { label: "Nama Peralatan", accessor: "nama_peralatan", checked: false },
    { label: "Satuan", accessor: "satuan", checked: false },
    { label: "Spesifikasi", accessor: "spesifikasi", checked: false },
    { label: "Kapasitas", accessor: "kapasitas", checked: false },
    { label: "Kodefikasi", accessor: "kodefikasi", checked: false },
    {
      label: "Kelompok Peralatan",
      accessor: "kelompok_peralatan",
      checked: false,
    },
    { label: "Jumlah Kebutuhan", accessor: "jumlah_kebutuhan", checked: false },
    { label: "Merk", accessor: "merk", checked: false },
    { label: "Provinsi", accessor: "provinsi", checked: false },
    { label: "Kabupaten/Kota", accessor: "kota", checked: false },
  ];

  const filterOptionsTenagaKerja: FilterOption[] = [
    { label: "Nama Pekerja", accessor: "jenis_tenaga_kerja", checked: false },
    { label: "Satuan", accessor: "satuan", checked: false },
    { label: "Jumlah Kebutuhan", accessor: "jumlah_kebutuhan", checked: false },
    { label: "Kodefikasi", accessor: "kodefikasi", checked: false },
    { label: "Provinsi", accessor: "provinsi", checked: false },
    { label: "Kabupaten/Kota", accessor: "kota", checked: false },
  ];

  const hydrate = useCallback(async () => {
    if (!informasiUmumId) return;
    const result = await fetchPerencanaanData(informasiUmumId);
    setInfo(result.informasi_umum);
    setMaterials(result.material);
    setTools(result.peralatan);
    setWorkers(result.tenaga_kerja);
    setVendors(result.shortlist_vendor);
  }, [informasiUmumId]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const openVendorModal = (id: number) => {
    setSelectedVendorId(id);
    setVendorModalOpen(true);
  };

  const handleVendorModalConfirm = async (payload: {
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
    setVendorModalOpen(false);
    setSelectedVendorId(null);
    await hydrate();
  };

  const handleFinalConfirm = async () => {
    if (!informasiUmumId) return;
    await savePerencanaanData(informasiUmumId);
    window.location.href = "/perencanaan_data/perencanaan_data_list";
  };

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
              filterOptionsMaterial={filterOptionsMaterial}
              filterOptionsPeralatan={filterOptionsPeralatan}
              filterOptionsTenagaKerja={filterOptionsTenagaKerja}
            />

            <h5 className="text-H5">3. Vendor</h5>
            <VendorTable vendors={vendors} onOpenModal={openVendorModal} />

            <div className="flex justify-end gap-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
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
              maxWidth="xs">
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
        onClose={() => setVendorModalOpen(false)}
        vendorId={selectedVendorId}
        informasiUmumId={informasiUmumId}
        onConfirm={handleVendorModalConfirm}
      />
    </div>
  );
}
