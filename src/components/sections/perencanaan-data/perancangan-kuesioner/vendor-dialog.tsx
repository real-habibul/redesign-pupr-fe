"use client";
import * as React from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { CloseCircle } from "iconsax-react";
import Tabs from "@components/ui/tabs";
import SearchBox from "@components/ui/searchbox";
import type { FilterOption } from "@components/ui/searchbox";
import Button from "@components/ui/button";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import type {
  VendorDetail,
  MaterialItem,
  PeralatanItem,
  TenagaKerjaItem,
} from "../../../../types/perencanaan-data/perancangan-kuesioner";
import { fetchVendorDetail } from "@lib/api/perencanaan-data/perancangan-kuesioner";

const ITEMS = 10;

type Props = {
  open: boolean;
  onClose: () => void;
  vendorId: number | null;
  informasiUmumId: string | null;
  onConfirm: (selectedIds: {
    material: number[];
    peralatan: number[];
    tenaga_kerja: number[];
    id_vendor: number;
  }) => void;
};

export default function VendorDialog({
  open,
  onClose,
  vendorId,
  informasiUmumId,
  onConfirm,
}: Props) {
  const [detail, setDetail] = useState<VendorDetail | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);

  const [delMaterial, setDelMaterial] = useState<number[]>([]);
  const [delPeralatan, setDelPeralatan] = useState<number[]>([]);
  const [delTenaga, setDelTenaga] = useState<number[]>([]);

  const [pageM, setPageM] = useState(1);
  const [pageP, setPageP] = useState(1);
  const [pageT, setPageT] = useState(1);

  const [qM, setQM] = useState("");
  const [qP, setQP] = useState("");
  const [qT, setQT] = useState("");

  // === Dialog konfirmasi ===
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selectedCount = useMemo(
    () => ({
      material: delMaterial.length,
      peralatan: delPeralatan.length,
      tenaga: delTenaga.length,
      total: delMaterial.length + delPeralatan.length + delTenaga.length,
    }),
    [delMaterial, delPeralatan, delTenaga]
  );

  const handleClickSave = () => {
    // selalu munculin konfirmasi
    setConfirmOpen(true);
  };

  const handleConfirmYes = () => {
    if (!selectedVendor) return onClose();
    onConfirm({
      id_vendor: selectedVendor!,
      material: delMaterial,
      peralatan: delPeralatan,
      tenaga_kerja: delTenaga,
    });
    setConfirmOpen(false);
  };

  const handleConfirmNo = () => setConfirmOpen(false);

  // ==== STABILKAN FILTER OPTIONS (fix loop) ====
  const materialFilterOptions = useMemo<FilterOption[]>(
    () => [
      { label: "Nama Material", value: "nama_material", checked: false },
      { label: "Satuan", value: "satuan", checked: false },
      { label: "Spesifikasi", value: "spesifikasi", checked: false },
      { label: "Merk", value: "merk", checked: false },
    ],
    []
  );

  const peralatanFilterOptions = useMemo<FilterOption[]>(
    () => [
      { label: "Nama Peralatan", value: "nama_peralatan", checked: false },
      { label: "Satuan", value: "satuan", checked: false },
      { label: "Spesifikasi", value: "spesifikasi", checked: false },
      { label: "Merk", value: "merk", checked: false },
    ],
    []
  );

  const tenagaFilterOptions = useMemo<FilterOption[]>(
    () => [
      {
        label: "Jenis Tenaga Kerja",
        value: "jenis_tenaga_kerja",
        checked: false,
      },
      { label: "Satuan", value: "satuan", checked: false },
    ],
    []
  );

  useEffect(() => {
    async function run() {
      if (!open || !vendorId || !informasiUmumId) return;
      const d = await fetchVendorDetail(vendorId, informasiUmumId);
      setDetail(d);
      setSelectedVendor(Number(d?.id_vendor ?? vendorId));
      setDelMaterial([]);
      setDelPeralatan([]);
      setDelTenaga([]);
      setPageM(1);
      setPageP(1);
      setPageT(1);
      setQM("");
      setQP("");
      setQT("");
    }
    run();
  }, [open, vendorId, informasiUmumId]);

  useEffect(() => setPageM(1), [qM]);
  useEffect(() => setPageP(1), [qP]);
  useEffect(() => setPageT(1), [qT]);

  const filter = useCallback(<T extends object>(rows: T[] = [], q: string) => {
    const lower = (q ?? "").trim().toLowerCase();
    if (!lower) return rows;
    return rows.filter((r) =>
      Object.values(r).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      )
    );
  }, []);

  const mats = useMemo(
    () =>
      filter<MaterialItem>(detail?.identifikasi_kebutuhan?.material ?? [], qM),
    [detail, qM, filter]
  );
  const pers = useMemo(
    () =>
      filter<PeralatanItem>(
        detail?.identifikasi_kebutuhan?.peralatan ?? [],
        qP
      ),
    [detail, qP, filter]
  );
  const tens = useMemo(
    () =>
      filter<TenagaKerjaItem>(
        detail?.identifikasi_kebutuhan?.tenaga_kerja ?? [],
        qT
      ),
    [detail, qT, filter]
  );

  const isChecked = (arr: number[], id: number) => arr.includes(id);
  const toggle = (
    arr: number[],
    setArr: (v: number[]) => void,
    id: number,
    next: boolean
  ) => {
    if (next) setArr([...arr, id]);
    else setArr(arr.filter((x) => x !== id));
  };

  const materialCols: ColumnDef<MaterialItem>[] = [
    { key: "nama_material", header: "Nama Material" },
    { key: "satuan", header: "Satuan" },
    { key: "spesifikasi", header: "Spesifikasi" },
    { key: "merk", header: "Merk" },
  ];

  const peralatanCols: ColumnDef<PeralatanItem>[] = [
    { key: "nama_peralatan", header: "Nama Peralatan" },
    { key: "satuan", header: "Satuan" },
    { key: "spesifikasi", header: "Spesifikasi" },
    { key: "merk", header: "Merk" },
  ];

  const tenagaCols: ColumnDef<TenagaKerjaItem>[] = [
    { key: "jenis_tenaga_kerja", header: "Nama Pekerja" },
    { key: "satuan", header: "Satuan" },
  ];

  const materialSelection = {
    selectable: true,
    useMuiCheckbox: true,
    selectHeader: "Pilih",
    isSelected: (row: MaterialItem) => isChecked(delMaterial, Number(row.id)),
    onToggleRow: (row: MaterialItem, next: boolean) =>
      toggle(delMaterial, setDelMaterial, Number(row.id), next),
    onToggleAllVisible: (rows: MaterialItem[], next: boolean) => {
      const ids = rows.map((r) => Number(r.id));
      if (next)
        setDelMaterial((prev) => Array.from(new Set([...prev, ...ids])));
      else setDelMaterial((prev) => prev.filter((id) => !ids.includes(id)));
    },
  };

  const peralatanSelection = {
    selectable: true,
    useMuiCheckbox: true,
    selectHeader: "Pilih",
    isSelected: (row: PeralatanItem) => isChecked(delPeralatan, Number(row.id)),
    onToggleRow: (row: PeralatanItem, next: boolean) =>
      toggle(delPeralatan, setDelPeralatan, Number(row.id), next),
    onToggleAllVisible: (rows: PeralatanItem[], next: boolean) => {
      const ids = rows.map((r) => Number(r.id));
      if (next)
        setDelPeralatan((prev) => Array.from(new Set([...prev, ...ids])));
      else setDelPeralatan((prev) => prev.filter((id) => !ids.includes(id)));
    },
  };

  const tenagaSelection = {
    selectable: true,
    useMuiCheckbox: true,
    selectHeader: "Pilih",
    isSelected: (row: TenagaKerjaItem) => isChecked(delTenaga, Number(row.id)),
    onToggleRow: (row: TenagaKerjaItem, next: boolean) =>
      toggle(delTenaga, setDelTenaga, Number(row.id), next),
    onToggleAllVisible: (rows: TenagaKerjaItem[], next: boolean) => {
      const ids = rows.map((r) => Number(r.id));
      if (next) setDelTenaga((prev) => Array.from(new Set([...prev, ...ids])));
      else setDelTenaga((prev) => prev.filter((id) => !ids.includes(id)));
    },
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}>
          <span className="text-H5">Shortlist MPK yang akan disurvei</span>
          <IconButton onClick={onClose} aria-label="close">
            <CloseCircle size="24" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          <Tabs
            tabs={[
              {
                label: "Material",
                content: (
                  <div className="mt-3 space-y-4">
                    <SearchBox
                      placeholder="Cari Material..."
                      onSearch={setQM}
                      withFilter
                      filterOptions={materialFilterOptions}
                    />
                    <DataTableMui<MaterialItem>
                      columns={materialCols}
                      data={mats}
                      striped
                      pagination={{
                        currentPage: pageM,
                        itemsPerPage: ITEMS,
                        total: mats.length,
                        onPageChange: setPageM,
                      }}
                      selection={materialSelection}
                    />
                  </div>
                ),
              },
              {
                label: "Peralatan",
                content: (
                  <div className="mt-3 space-y-4">
                    <SearchBox
                      placeholder="Cari Peralatan..."
                      onSearch={setQP}
                      withFilter
                      filterOptions={peralatanFilterOptions}
                    />
                    <DataTableMui<PeralatanItem>
                      columns={peralatanCols}
                      data={pers}
                      striped
                      pagination={{
                        currentPage: pageP,
                        itemsPerPage: ITEMS,
                        total: pers.length,
                        onPageChange: setPageP,
                      }}
                      selection={peralatanSelection}
                    />
                  </div>
                ),
              },
              {
                label: "Tenaga Kerja",
                content: (
                  <div className="mt-3 space-y-4">
                    <SearchBox
                      placeholder="Cari Tenaga Kerja..."
                      onSearch={setQT}
                      withFilter
                      filterOptions={tenagaFilterOptions}
                    />
                    <DataTableMui<TenagaKerjaItem>
                      columns={tenagaCols}
                      data={tens}
                      striped
                      pagination={{
                        currentPage: pageT,
                        itemsPerPage: ITEMS,
                        total: tens.length,
                        onPageChange: setPageT,
                      }}
                      selection={tenagaSelection}
                    />
                  </div>
                ),
              },
            ]}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <div className="flex flex-row justify-end gap-4 w-full">
            <Button variant="outlined_yellow" onClick={onClose}>
              Kembali
            </Button>
            <Button variant="solid_blue" onClick={handleClickSave}>
              Simpan & Lanjut
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Dialog Konfirmasi */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmNo}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ pr: 1 }}>Konfirmasi Penyimpanan</DialogTitle>
        <DialogContent dividers>
          <div className="space-y-2">
            <p className="text-body">
              Anda akan menyimpan pilihan berikut untuk vendor ini:
            </p>
            <ul className="list-disc pl-5">
              <li>
                Material dipilih: <b>{selectedCount.material}</b>
              </li>
              <li>
                Peralatan dipilih: <b>{selectedCount.peralatan}</b>
              </li>
              <li>
                Tenaga Kerja dipilih: <b>{selectedCount.tenaga}</b>
              </li>
            </ul>
            {selectedCount.total === 0 && (
              <p className="mt-2 italic opacity-80">
                Catatan: Belum ada item yang dipilih.
              </p>
            )}
            <p className="mt-2">Lanjutkan menyimpan?</p>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined_yellow" onClick={handleConfirmNo}>
            Batal
          </Button>
          <Button variant="solid_blue" onClick={handleConfirmYes}>
            Ya, Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
