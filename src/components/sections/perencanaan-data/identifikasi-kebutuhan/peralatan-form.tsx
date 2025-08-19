"use client";
import * as React from "react";
import {
  useState,
  useMemo,
  useCallback,
  useDeferredValue,
  startTransition,
} from "react";
import { FieldArray, FastField, useField } from "formik";
import type {
  ProvinceOption,
  IdentifikasiKebutuhanFormValues,
} from "../../../../types/perencanaan-data/identifikasi_kebutuhan";
import { KELOMPOK_PERALATAN_OPTIONS } from "@constants/perencanaan-data/identifikasi-kebutuhan";
import Button from "@components/ui/button";
import Pagination from "@components/ui/pagination";
import TextInput from "@components/ui/text-input";
import MUISelect from "@components/ui/select";

type Props = {
  values: IdentifikasiKebutuhanFormValues;
  setFieldValue: (field: string, value: any) => void;
  provincesOptions?: ProvinceOption[];
  query: string;
  filterKeys: string[];
};

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

type RowProps = {
  index: number;
  values: IdentifikasiKebutuhanFormValues;
  remove: (i: number) => void;
  getCityOptions: (
    prov: string | number | ""
  ) => { value: string; label: string }[];
  provSelectOptions: { value: string; label: string }[];
  kelompokOptions: { value: string; label: string }[];
  onRemoved: () => void;
};

function isMatchPeralatan(
  item: any,
  q: string,
  keys: string[] | undefined,
  provMap: Record<string, string>,
  cityMap: Record<string, string>
) {
  const low = q.toLowerCase();
  const read = (k: string) => {
    if (k === "provincies_id")
      return provMap[String(item?.provincies_id ?? "")] ?? "";
    if (k === "cities_id") return cityMap[String(item?.cities_id ?? "")] ?? "";
    return String(item?.[k] ?? "");
  };
  if (!keys?.length) {
    const candidates = [
      "nama_peralatan",
      "satuan",
      "spesifikasi",
      "kapasitas",
      "kodefikasi",
      "kelompok_peralatan",
      "jumlah_kebutuhan",
      "merk",
      "provincies_id",
      "cities_id",
    ].map(read);
    return candidates.some((v) => v.toLowerCase().includes(low));
  }
  return keys.some((k) => read(k).toLowerCase().includes(low));
}

const PeralatanRow = React.memo(function PeralatanRow({
  index: actualIndex,
  values,
  remove,
  getCityOptions,
  provSelectOptions,
  kelompokOptions,
  onRemoved,
}: RowProps) {
  const [provField, , provHelpers] = useField<any>(
    `peralatans.${actualIndex}.provincies_id`
  );
  const [cityField, , cityHelpers] = useField<any>(
    `peralatans.${actualIndex}.cities_id`
  );
  const provinceValue = provField.value ?? "";
  const cityOptions = React.useMemo(
    () => getCityOptions(provinceValue),
    [getCityOptions, provinceValue]
  );

  return (
    <tr>
      <td className="px-3 py-6 text-center">{actualIndex + 1}</td>
      <td className="px-3 py-6">
        <FastField name={`peralatans.${actualIndex}.nama_peralatan`}>
          {({ field, form }: any) => (
            <TextInput
              label="Nama Peralatan"
              value={field.value ?? ""}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              placeholder="Masukkan Nama Peralatan"
              isRequired
            />
          )}
        </FastField>
      </td>
      <td className="px-3 py-6">
        <FastField name={`peralatans.${actualIndex}.satuan`}>
          {({ field, form }: any) => (
            <TextInput
              label="Satuan"
              value={field.value ?? ""}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              placeholder="Masukkan Satuan"
              isRequired
            />
          )}
        </FastField>
      </td>
      <td className="px-3 py-6">
        <FastField name={`peralatans.${actualIndex}.spesifikasi`}>
          {({ field, form }: any) => (
            <TextInput
              label="Spesifikasi"
              value={field.value ?? ""}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              placeholder="Masukkan Spesifikasi"
              isRequired
            />
          )}
        </FastField>
      </td>
      <td className="px-3 py-6">
        <FastField name={`peralatans.${actualIndex}.kapasitas`}>
          {({ field, form }: any) => (
            <TextInput
              label="Kapasitas"
              value={field.value ?? ""}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              placeholder="Masukkan Kapasitas"
              isRequired
            />
          )}
        </FastField>
      </td>
      <td className="px-3 py-6">
        <FastField name={`peralatans.${actualIndex}.kodefikasi`}>
          {({ field, form }: any) => (
            <TextInput
              label="Kodefikasi"
              value={field.value ?? ""}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              placeholder="Masukkan Kodefikasi"
              isRequired
            />
          )}
        </FastField>
      </td>
      <td className="px-3 py-6">
        <FastField name={`peralatans.${actualIndex}.kelompok_peralatan`}>
          {({ field, form }: any) => (
            <MUISelect
              label="Kelompok Peralatan"
              options={kelompokOptions}
              value={field.value ? String(field.value) : ""}
              onChange={(val: string) => form.setFieldValue(field.name, val)}
              required
              placeholder="Pilih Kelompok Peralatan"
            />
          )}
        </FastField>
      </td>
      <td className="px-3 py-6">
        <FastField name={`peralatans.${actualIndex}.jumlah_kebutuhan`}>
          {({ field, form }: any) => (
            <TextInput
              label="Jumlah Kebutuhan"
              value={field.value ?? ""}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              placeholder="Masukkan Jumlah Kebutuhan"
              isRequired
            />
          )}
        </FastField>
      </td>
      <td className="px-3 py-6">
        <FastField name={`peralatans.${actualIndex}.merk`}>
          {({ field, form }: any) => (
            <TextInput
              label="Merk"
              value={field.value ?? ""}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              placeholder="Masukkan Merk"
              isRequired
            />
          )}
        </FastField>
      </td>
      <td className="px-3 py-6">
        <MUISelect
          label="Provinsi"
          options={provSelectOptions}
          value={provField.value ? String(provField.value) : ""}
          onChange={(val: string) => {
            provHelpers.setValue(val);
            cityHelpers.setValue("");
          }}
          required
          placeholder="Pilih Provinsi"
        />
      </td>
      <td className="px-3 py-6">
        <MUISelect
          key={`city-${actualIndex}-${String(provinceValue)}`}
          label="Kota"
          options={cityOptions}
          value={cityField.value ? String(cityField.value) : ""}
          onChange={(val: string) => cityHelpers.setValue(val)}
          required
          placeholder="Pilih Kota"
        />
      </td>
      <td className="px-3 py-6 text-center">
        <Button
          type="button"
          variant="text_red"
          label="Hapus"
          onClick={() => {
            remove(actualIndex);
            onRemoved();
          }}
        />
      </td>
    </tr>
  );
});

export default function PeralatanForm({
  values,
  setFieldValue,
  provincesOptions,
  query,
  filterKeys,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const handlePageChange = useCallback(
    (p: number) => startTransition(() => setCurrentPage(p)),
    []
  );
  const debouncedQuery = useDebounced(query, 250);
  const deferredQuery = useDeferredValue(debouncedQuery);

  const kelompokOptions = useMemo(
    () =>
      KELOMPOK_PERALATAN_OPTIONS.map((o) => ({
        label: o.label,
        value: String(o.value),
      })),
    []
  );

  const provOptions = useMemo(
    () =>
      (provincesOptions ?? []).map((p) => ({
        value: String(p.value),
        label: p.label,
        cities: p.cities ?? [],
      })),
    [provincesOptions]
  );

  const getCityOptions = useCallback(
    (provValue: string | number | "") => {
      const sp = provOptions.find((p) => p.value === String(provValue));
      const cities = sp?.cities ?? [];
      return cities.map((c) => ({
        value: String(c.cities_id),
        label: c.cities_name,
      }));
    },
    [provOptions]
  );

  const provIdToName = React.useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of provOptions) m[p.value] = p.label;
    return m;
  }, [provOptions]);

  const cityIdToName = React.useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of provOptions) {
      for (const c of p.cities ?? []) m[String(c.cities_id)] = c.cities_name;
    }
    return m;
  }, [provOptions]);

  const filteredIndices: number[] = useMemo(() => {
    const q = (deferredQuery ?? "").trim();
    const keys = filterKeys ?? [];
    if (!q && !keys.length) return (values.peralatans ?? []).map((_, i) => i);
    const list: number[] = [];
    for (let i = 0; i < (values.peralatans ?? []).length; i++) {
      const it = values.peralatans[i];
      if (isMatchPeralatan(it, q, keys, provIdToName, cityIdToName))
        list.push(i);
    }
    return list;
  }, [
    values.peralatans,
    deferredQuery,
    filterKeys,
    provIdToName,
    cityIdToName,
  ]);

  const totalFiltered = filteredIndices.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleIndices = filteredIndices.slice(start, end);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [totalPages, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [deferredQuery, filterKeys]);

  return (
    <div className="rounded-[16px] overflow-visible">
      <FieldArray name="peralatans">
        {({ remove }) => (
          <div>
            <div className="rounded-[16px] border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-auto w-full min-w-max">
                  <thead>
                    <tr className="bg-solid_basic_blue_100 text-left text-emphasis_light_on_surface_high uppercase tracking-wider">
                      <th className="px-3 py-6 text-base font-normal">No</th>
                      {[
                        "Nama Peralatan",
                        "Satuan",
                        "Spesifikasi",
                        "Kapasitas",
                        "Kodefikasi",
                        "Kelompok Peralatan",
                        "Jumlah Kebutuhan",
                        "Merk",
                        "Provinsi",
                        "Kota",
                        "Aksi",
                      ].map((h) => (
                        <th key={h} className="px-3 py-6 text-base font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-surface_light_background">
                    {visibleIndices.map((actualIndex) => (
                      <PeralatanRow
                        key={actualIndex}
                        index={actualIndex}
                        values={values}
                        remove={remove}
                        getCityOptions={getCityOptions}
                        provSelectOptions={provOptions.map((p) => ({
                          value: p.value,
                          label: p.label,
                        }))}
                        kelompokOptions={kelompokOptions}
                        onRemoved={() => {
                          const nextTotal = Math.max(0, totalFiltered - 1);
                          const nextTotalPages = Math.max(
                            1,
                            Math.ceil(nextTotal / itemsPerPage)
                          );
                          if (currentPage > nextTotalPages)
                            setCurrentPage(nextTotalPages);
                        }}
                      />
                    ))}
                    {visibleIndices.length === 0 && (
                      <tr>
                        <td
                          className="px-3 py-6 text-center text-emphasis_light_on_surface_medium"
                          colSpan={12}>
                          Data tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalData={totalFiltered}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </FieldArray>
    </div>
  );
}
