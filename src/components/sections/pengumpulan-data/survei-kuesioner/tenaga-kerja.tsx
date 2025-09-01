"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Field, type FieldProps } from "formik";
import SearchBox from "@components/ui/searchbox";
import TextInput from "@components/ui/text-input";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import type {
  FormValues,
  TenagaKerjaRowRO,
} from "../../../../types/pengumpulan-data/survei-kuesioner";

export default function TenagaKerjaTable({
  rows,
  values,
  setFieldValue,
}: {
  rows: TenagaKerjaRowRO[];
  values: FormValues;
  setFieldValue: (f: string, v: unknown) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if ((values.tenaga_kerja?.length ?? 0) < rows.length) {
      const next = Array.from({ length: rows.length }, (_, i) => ({
        ...(values.tenaga_kerja?.[i] ?? {}),
        id: values.tenaga_kerja?.[i]?.id ?? rows[i]?.id,
      }));
      setFieldValue("tenaga_kerja", next);
    }
  }, [rows, setFieldValue, values.tenaga_kerja]);

  const cols: ColumnDef<TenagaKerjaRowRO>[] = [
    {
      key: "jenis_tenaga_kerja",
      header: "Jenis Tenaga Kerja",
      className: "w-[260px]",
    },
    { key: "satuan", header: "Satuan", className: "w-[160px]" },
    {
      key: "jumlah_kebutuhan",
      header: "Jumlah Kebutuhan",
      className: "w-[200px]",
    },
    { key: "kodefikasi", header: "Kodefikasi", className: "w-[160px]" },
    { key: "provincies_id", header: "Provinsi", className: "w-[200px]" },
    { key: "cities_id", header: "Kabupaten/Kota", className: "w-[200px]" },

    {
      key: "harga_per_satuan_setempat",
      header: "Harga per Satuan Setempat *",
      className: "w-[260px]",
      cell: (_row, rowIndex) => (
        <Field name={`tenaga_kerja.${rowIndex}.harga_per_satuan_setempat`}>
          {({ field, form }: FieldProps<FormValues>) => (
            <TextInput
              label="Harga per Satuan Setempat"
              value={String(field.value ?? "")}
              placeholder="Harga per Satuan Setempat"
              onChange={(e) => {
                form.setFieldValue(
                  `tenaga_kerja.${rowIndex}.harga_per_satuan_setempat`,
                  e.currentTarget.value
                );
                form.setFieldValue(
                  `tenaga_kerja.${rowIndex}.id`,
                  rows[rowIndex]?.id
                );
              }}
            />
          )}
        </Field>
      ),
    },
    {
      key: "harga_konversi_perjam",
      header: "Harga Konversi per Jam *",
      className: "w-[240px]",
      cell: (_row, rowIndex) => (
        <Field name={`tenaga_kerja.${rowIndex}.harga_konversi_perjam`}>
          {({ field, form }: FieldProps<FormValues>) => (
            <TextInput
              label="Harga Konversi per Jam"
              value={String(field.value ?? "")}
              placeholder="Harga Konversi per Jam"
              onChange={(e) =>
                form.setFieldValue(
                  `tenaga_kerja.${rowIndex}.harga_konversi_perjam`,
                  e.currentTarget.value
                )
              }
            />
          )}
        </Field>
      ),
    },
    {
      key: "keterangan",
      header: "Keterangan *",
      className: "w-[220px]",
      cell: (_row, rowIndex) => (
        <Field name={`tenaga_kerja.${rowIndex}.keterangan`}>
          {({ field, form }: FieldProps<FormValues>) => (
            <TextInput
              label="Keterangan"
              value={String(field.value ?? "")}
              placeholder="Keterangan"
              onChange={(e) =>
                form.setFieldValue(
                  `tenaga_kerja.${rowIndex}.keterangan`,
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
          placeholder="Cari Tenaga Kerja..."
          onSearch={() => {}}
          withFilter
        />
      </div>

      <DataTableMui<TenagaKerjaRowRO>
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
