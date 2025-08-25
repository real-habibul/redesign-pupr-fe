"use client";
import * as React from "react";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import TextInput from "@components/ui/text-input";
import type { FilterOption } from "@components/ui/searchbox";

type Row = { id: number; sumber: string; spesifikasi: string };

type Props = {
  initialCSV?: string;
  initialItems?: Array<{ sumber: string; spesifikasi?: string }>;
  onRowsChange?: (rows: Array<{ sumber: string; spesifikasi: string }>) => void;
  onCSVChange?: (csv: string) => void;
  externalQuery?: string;
  externalFilters?: FilterOption[];
};

export type SumberDayaTableHandle = { addRow: () => void };

function parseCSV(csv?: string): string[] {
  return (csv ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toCSV(rows: Row[]) {
  return rows
    .map((r) => r.sumber.trim())
    .filter(Boolean)
    .join(",");
}

const SumberDayaTable = React.forwardRef<SumberDayaTableHandle, Props>(
  function SumberDayaTable(
    {
      initialCSV,
      initialItems,
      onRowsChange,
      onCSVChange,
      externalQuery,
      externalFilters,
    }: Props,
    ref
  ) {
    const [rows, setRows] = React.useState<Row[]>([]);

    // emit dibuat stable
    const emit = React.useCallback(
      (next: Row[]) => {
        const nonEmpty = next.filter((r) => r.sumber.trim().length > 0);
        onRowsChange?.(
          nonEmpty.map(({ sumber, spesifikasi }) => ({ sumber, spesifikasi }))
        );
        onCSVChange?.(toCSV(nonEmpty));
      },
      [onRowsChange, onCSVChange]
    );

    React.useEffect(() => {
      const base: Row[] =
        initialItems && initialItems.length > 0
          ? initialItems.map((it, idx) => ({
              id: idx + 1,
              sumber: it.sumber ?? "",
              spesifikasi: it.spesifikasi ?? "",
            }))
          : parseCSV(initialCSV).map((s, idx) => ({
              id: idx + 1,
              sumber: s,
              spesifikasi: "",
            }));
      setRows(
        base.length ? base : [{ id: Date.now(), sumber: "", spesifikasi: "" }]
      );
    }, [initialCSV, initialItems]);

    const addRow = React.useCallback(() => {
      setRows((prev) => {
        const next = [...prev, { id: Date.now(), sumber: "", spesifikasi: "" }];
        emit(next);
        return next;
      });
    }, [emit]);

    const removeRow = React.useCallback(
      (id: number) => {
        setRows((prev) => {
          const next = prev.filter((r) => r.id !== id);
          emit(next);
          return next;
        });
      },
      [emit]
    );

    const updateRow = React.useCallback(
      (id: number, patch: Partial<Row>) => {
        setRows((prev) => {
          const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
          emit(next);
          return next;
        });
      },
      [emit]
    );

    React.useImperativeHandle(ref, () => ({ addRow }), [addRow]);

    const columns = React.useMemo<ColumnDef<Row>[]>(() => {
      return [
        {
          key: "sumber",
          header: "Sumber Daya",
          className: "align-middle",
          cell: (row) => (
            <div className="max-w-[520px]">
              <TextInput
                label=""
                placeholder="cth: Excavator / Dump Truck / Besi Beton / Mandor…"
                value={row.sumber}
                onChange={(e) => updateRow(row.id, { sumber: e.target.value })}
              />
            </div>
          ),
        },
        {
          key: "spesifikasi",
          header: "Spesifikasi",
          className: "align-middle",
          cell: (row) => (
            <div className="max-w-[520px]">
              <TextInput
                label=""
                placeholder="cth: 20 ton, seri PC200; Ø12mm; pengalaman 5 th"
                value={row.spesifikasi}
                onChange={(e) =>
                  updateRow(row.id, { spesifikasi: e.target.value })
                }
              />
            </div>
          ),
        },
        {
          key: "aksi",
          header: "Aksi",
          className: "w-[140px]",
          cell: (row) => (
            <div className="flex justify-start">
              <button
                className="px-3 py-1.5 rounded-md border-2 border-solid_basic_yellow_400 text-solid_basic_yellow_700 text-sm"
                onClick={() => removeRow(row.id)}>
                Hapus
              </button>
            </div>
          ),
        },
      ];
    }, [updateRow, removeRow]);

    const filtered = React.useMemo(() => {
      const q = (externalQuery ?? "").trim().toLowerCase();
      const fHasSpec =
        externalFilters?.find((f) => f.value === "hasSpec")?.checked ?? true;
      const fNoSpec =
        externalFilters?.find((f) => f.value === "noSpec")?.checked ?? true;

      let data = rows;
      if (q) {
        data = data.filter(
          (r) =>
            r.sumber.toLowerCase().includes(q) ||
            (r.spesifikasi ?? "").toLowerCase().includes(q)
        );
      }
      data = data.filter((r) => {
        const hasSpec = (r.spesifikasi ?? "").trim().length > 0;
        if (hasSpec && !fHasSpec) return false;
        if (!hasSpec && !fNoSpec) return false;
        return true;
      });
      return data;
    }, [rows, externalQuery, externalFilters]);

    return (
      <DataTableMui<Row>
        columns={columns}
        data={filtered}
        striped
        stickyHeader
        selection={undefined}
        emptyMessage="Belum ada baris. Gunakan tombol Tambah Baris."
      />
    );
  }
);

export default SumberDayaTable;
