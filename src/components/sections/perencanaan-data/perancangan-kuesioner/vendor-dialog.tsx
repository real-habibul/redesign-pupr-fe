// src/components/sections/perencanaan-data/perancangan-kuesioner/vendor-dialog.tsx
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
          <Button
            variant="solid_blue"
            onClick={() => {
              if (!selectedVendor) return onClose();
              onConfirm({
                id_vendor: selectedVendor,
                material: delMaterial,
                peralatan: delPeralatan,
                tenaga_kerja: delTenaga,
              });
            }}>
            Simpan & Lanjut
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
