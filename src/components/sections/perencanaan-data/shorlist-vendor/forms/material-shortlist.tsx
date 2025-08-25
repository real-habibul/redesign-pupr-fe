"use client";

import * as React from "react";
import { useMemo } from "react";
import { useFormikContext } from "formik";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import type {
  FormValues,
  VendorItem,
  VendorId,
} from "../../../../../types/perencanaan-data/shortlist-vendor";

type Props = {
  rows: VendorItem[];
  hide?: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (p: number) => void;
  query?: string;
  filterKeys?: Array<keyof VendorItem>;
};

const DEFAULT_VENDOR_COLS: Array<keyof VendorItem> = [
  "nama_vendor",
  "sumber_daya",
  "pemilik_vendor",
  "alamat",
  "kontak",
];

export default function MaterialShortlist({
  rows,
  hide,
  currentPage,
  itemsPerPage,
  onPageChange,
  query = "",
  filterKeys = [],
}: Props) {
  const { values, setFieldValue } = useFormikContext<FormValues>();
  const key: keyof FormValues = "material";

  const q = (query ?? "").trim().toLowerCase();

  // ✅ Stabilkan colsToScan supaya dependency useMemo di bawah tidak berubah-ubah
  const colsToScan = useMemo<Array<keyof VendorItem>>(
    () => (filterKeys && filterKeys.length ? filterKeys : DEFAULT_VENDOR_COLS),
    [filterKeys]
  );

  const filtered = useMemo(
    () =>
      q
        ? rows.filter((r) =>
            colsToScan.some((k) =>
              String(r?.[k] ?? "")
                .toLowerCase()
                .includes(q)
            )
          )
        : rows,
    [rows, q, colsToScan]
  );

  const isChecked = React.useCallback(
    (id: VendorId) => values[key].some((i) => i.value === id && i.checked),
    [values, key]
  );

  const setChecked = React.useCallback(
    (id: VendorId, next: boolean) => {
      const arr = values[key];
      const idx = arr.findIndex((i) => i.value === id);
      const ret = [...arr];
      if (idx >= 0) {
        const curr = ret[idx];
        const updated = { ...curr, checked: next };
        if (!updated.checked) ret.splice(idx, 1);
        else ret[idx] = updated;
      } else if (next) {
        ret.push({ value: id, checked: true });
      }
      setFieldValue(key, ret);
    },
    [values, key, setFieldValue]
  );

  const setAllVisible = React.useCallback(
    (rowsToToggle: VendorItem[], next: boolean) => {
      const ids = new Set(rowsToToggle.map((r) => String(r.id)));
      const base = values[key].filter((i) => !ids.has(String(i.value)));
      const additions = next
        ? rowsToToggle.map((r) => ({ value: r.id, checked: true as const }))
        : [];
      setFieldValue(key, [...base, ...additions]);
    },
    [values, key, setFieldValue]
  );

  const columns: ColumnDef<VendorItem>[] = useMemo(
    () => [
      {
        key: "nama_vendor",
        header: "Responden/Vendor",
        cell: (row) => row.nama_vendor,
      },
      {
        key: "sumber_daya",
        header: "Sumber Daya",
        cell: (row) => row.sumber_daya ?? "-",
      },
      {
        key: "pemilik_vendor",
        header: "Pemilik Vendor",
        cell: (row) => row.pemilik_vendor ?? "-",
      },
      { key: "alamat", header: "Alamat", cell: (row) => row.alamat ?? "-" },
      { key: "kontak", header: "Kontak", cell: (row) => row.kontak ?? "-" },
    ],
    []
  );

  if (hide) return null;

  return (
    <DataTableMui<VendorItem>
      columns={columns}
      data={filtered}
      striped
      stickyHeader
      pagination={{
        currentPage,
        itemsPerPage,
        total: filtered.length,
        onPageChange,
      }}
      selection={{
        selectable: true,
        useMuiCheckbox: false,
        isSelected: (row) => isChecked(row.id),
        onToggleRow: (row, next) => setChecked(row.id, next),
        onToggleAllVisible: (visibleRows, next) =>
          setAllVisible(visibleRows, next),
        selectHeader: "Pilih",
      }}
    />
  );
}
