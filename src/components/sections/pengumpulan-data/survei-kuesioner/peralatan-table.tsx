"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Field, type FieldProps } from "formik";
import SearchBox from "@components/ui/searchbox";
import TextInput from "@components/ui/text-input";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import type {
  FormValues,
  PeralatanRowRO,
} from "../../../../types/pengumpulan-data/survei-kuesioner";

export default function PeralatanTable({
  rows,
  values,
  setFieldValue,
}: {
  rows: PeralatanRowRO[];
  values: FormValues;
  setFieldValue: (f: string, v: unknown) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if ((values.peralatan?.length ?? 0) < rows.length) {
      const next = Array.from({ length: rows.length }, (_, i) => ({
        ...(values.peralatan?.[i] ?? {}),
        id: values.peralatan?.[i]?.id ?? rows[i]?.id,
      }));
      setFieldValue("peralatan", next);
    }
  }, [rows, setFieldValue, values.peralatan]);

  const cols: ColumnDef<PeralatanRowRO>[] = [
    { key: "nama_peralatan", header: "Nama Peralatan", className: "w-[280px]" },
    { key: "satuan", header: "Satuan", className: "w-[180px]" },
    // kolom readonly lain...
    {
      key: "satuan_setempat",
      header: "Satuan Setempat *",
      className: "w-[220px]",
      cell: (_row, rowIndex) => (
        <Field name={`peralatan.${rowIndex}.satuan_setempat`}>
          {({ field, form }: FieldProps<FormValues>) => (
            <TextInput
              label="Satuan Setempat"
              value={String(field.value ?? "")}
              placeholder="Satuan Setempat"
              onChange={(e) => {
                form.setFieldValue(
                  `peralatan.${rowIndex}.satuan_setempat`,
                  e.currentTarget.value
                );
                form.setFieldValue(
                  `peralatan.${rowIndex}.id`,
                  rows[rowIndex]?.id
                );
              }}
            />
          )}
        </Field>
      ),
    },
    // tambahkan kolom editable lainnya dgn pola sama:
    // - wajib ada label
    // - value dibungkus String(...) atau ?? ""
  ];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <SearchBox
          placeholder="Cari Peralatan..."
          onSearch={() => {}}
          withFilter
        />
      </div>
      <DataTableMui<PeralatanRowRO>
        columns={cols}
        data={rows}
        striped
        stickyHeader
        pagination={{
          currentPage,
          itemsPerPage,
          total: rows.length,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
