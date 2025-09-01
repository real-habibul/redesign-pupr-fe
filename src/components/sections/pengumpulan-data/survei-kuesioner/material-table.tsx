"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Field, type FieldProps } from "formik";
import SearchBox, { type FilterOption } from "@components/ui/searchbox";
import TextInput from "@components/ui/text-input";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import type {
  FormValues,
  MaterialRowRO,
} from "../../../../types/pengumpulan-data/survei-kuesioner";

type Props = {
  rows: MaterialRowRO[];
  values: FormValues;
  setFieldValue: (field: string, value: unknown) => void;
};

export default function MaterialTable({ rows, values, setFieldValue }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterOption[]>([
    { label: "Hanya yang punya merk", checked: false, value: "has_merk" },
  ]);

  const filteredRows = useMemo(() => {
    let data = rows;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      data = data.filter((r) =>
        [
          r.nama_material,
          r.spesifikasi,
          r.merk,
          r.kelompok_material,
          String(r.provincies_id ?? ""),
          String(r.cities_id ?? ""),
        ]
          .join(" | ")
          .toLowerCase()
          .includes(q)
      );
    }
    const onlyMerk = filters.find((f) => f.value === "has_merk")?.checked;
    if (onlyMerk) {
      data = data.filter((r) => (r.merk ?? "").toString().trim().length > 0);
    }
    return data;
  }, [rows, query, filters]);

  useEffect(() => {
    if ((values.material?.length ?? 0) < rows.length) {
      const next = Array.from({ length: rows.length }, (_, i) => ({
        ...(values.material?.[i] ?? {}),
        id: values.material?.[i]?.id ?? rows[i]?.id,
      }));
      setFieldValue("material", next);
    }
  }, [rows, setFieldValue, values.material]);

  const cols: ColumnDef<MaterialRowRO>[] = [
    { key: "nama_material", header: "Nama Material", className: "w-[280px]" },
    { key: "satuan", header: "Satuan", className: "w-[160px]" },
    { key: "spesifikasi", header: "Spesifikasi", className: "w-[220px]" },
    { key: "ukuran", header: "Ukuran", className: "w-[140px]" },
    { key: "kodefikasi", header: "Kodefikasi", className: "w-[140px]" },
    {
      key: "kelompok_material",
      header: "Kelompok Material",
      className: "w-[220px]",
    },
    {
      key: "jumlah_kebutuhan",
      header: "Jumlah Kebutuhan",
      className: "w-[180px]",
    },
    { key: "merk", header: "Merk", className: "w-[160px]" },
    { key: "provincies_id", header: "Provinsi", className: "w-[160px]" },
    { key: "cities_id", header: "Kota", className: "w-[160px]" },
    {
      key: "satuan_setempat",
      header: (
        <>
          Satuan Setempat <span className="text-custom-red-500">*</span>
        </>
      ),
      className: "w-[220px]",
      cell: (_row, rowIndex) => (
        <Field name={`material.${rowIndex}.satuan_setempat`}>
          {({ field, form }: FieldProps<FormValues>) => (
            <TextInput
              label="Satuan Setempat"
              value={String(field.value ?? "")}
              onChange={(e) =>
                form.setFieldValue(
                  `material.${rowIndex}.satuan_setempat`,
                  e.currentTarget.value
                )
              }
            />
          )}
        </Field>
      ),
    },
    {
      key: "harga_satuan_setempat",
      header: (
        <>
          Harga per Satuan Setempat (Rp){" "}
          <span className="text-custom-red-500">*</span>
        </>
      ),
      className: "w-[260px]",
      cell: (_row, rowIndex) => (
        <Field name={`material.${rowIndex}.harga_satuan_setempat`}>
          {({ field, form }: FieldProps<FormValues>) => (
            <TextInput
              label="Harga Satuan Setempat"
              value={String(field.value ?? "")}
              placeholder="Harga Satuan Setempat"
              onChange={(e) =>
                form.setFieldValue(
                  `material.${rowIndex}.harga_satuan_setempat`,
                  e.currentTarget.value
                )
              }
            />
          )}
        </Field>
      ),
    },
  ];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <SearchBox
          placeholder="Cari Material..."
          onSearch={setQuery}
          withFilter
          filterOptions={filters}
          onApplyFilters={setFilters}
          debounceDelay={200}
          width={360}
        />
      </div>
      <DataTableMui<MaterialRowRO>
        columns={cols}
        data={filteredRows}
        striped
        stickyHeader
        pagination={{
          currentPage,
          itemsPerPage,
          total: filteredRows.length,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
