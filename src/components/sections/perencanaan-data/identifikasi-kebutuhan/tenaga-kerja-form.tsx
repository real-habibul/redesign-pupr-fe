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
  onRemoved: () => void;
};

function isMatchTenagaKerja(
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
      "jenis_tenaga_kerja",
      "satuan",
      "jumlah_kebutuhan",
      "kodefikasi",
      "provincies_id",
      "cities_id",
    ].map(read);
    return candidates.some((v) => v.toLowerCase().includes(low));
  }
  return keys.some((k) => read(k).toLowerCase().includes(low));
}

const TenagaKerjaRow = React.memo(function TenagaKerjaRow({
  index: actualIndex,
  values,
  remove,
  getCityOptions,
  provSelectOptions,
  onRemoved,
}: RowProps) {
  const [provField, , provHelpers] = useField<any>(
    `tenagaKerjas.${actualIndex}.provincies_id`
  );
  const [cityField, , cityHelpers] = useField<any>(
    `tenagaKerjas.${actualIndex}.cities_id`
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
        <FastField name={`tenagaKerjas.${actualIndex}.jenis_tenaga_kerja`}>
          {({ field, form }: any) => (
            <TextInput
              label="Jenis Tenaga Kerja"
              value={field.value ?? ""}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              placeholder="Masukkan Jenis Tenaga Kerja"
              isRequired
            />
          )}
        </FastField>
      </td>
      <td className="px-3 py-6">
        <FastField name={`tenagaKerjas.${actualIndex}.satuan`}>
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
        <FastField name={`tenagaKerjas.${actualIndex}.jumlah_kebutuhan`}>
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
        <FastField name={`tenagaKerjas.${actualIndex}.kodefikasi`}>
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

export default function TenagaKerjaForm({
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

  const provIdToName = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of provOptions) m[p.value] = p.label;
    return m;
  }, [provOptions]);

  const cityIdToName = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of provOptions) {
      for (const c of p.cities ?? []) m[String(c.cities_id)] = c.cities_name;
    }
    return m;
  }, [provOptions]);

  const filteredIndices: number[] = useMemo(() => {
    const q = (deferredQuery ?? "").trim();
    const keys = filterKeys ?? [];
    if (!q && !keys.length) return (values.tenagaKerjas ?? []).map((_, i) => i);
    const list: number[] = [];
    for (let i = 0; i < (values.tenagaKerjas ?? []).length; i++) {
      const it = values.tenagaKerjas[i];
      if (isMatchTenagaKerja(it, q, keys, provIdToName, cityIdToName))
        list.push(i);
    }
    return list;
  }, [
    values.tenagaKerjas,
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
      <FieldArray name="tenagaKerjas">
        {({ remove }) => (
          <div>
            <div className="rounded-[16px] border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-auto w-full min-w-max">
                  <thead>
                    <tr className="bg-solid_basic_blue_100 text-left text-emphasis_light_on_surface_high uppercase tracking-wider">
                      <th className="px-3 py-6 text-base font-normal">No</th>
                      {[
                        "Jenis Tenaga Kerja",
                        "Satuan",
                        "Jumlah Kebutuhan",
                        "Kodefikasi",
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
                      <TenagaKerjaRow
                        key={actualIndex}
                        index={actualIndex}
                        values={values}
                        remove={remove}
                        getCityOptions={getCityOptions}
                        provSelectOptions={provOptions.map((p) => ({
                          value: p.value,
                          label: p.label,
                        }))}
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
                          colSpan={8}>
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
