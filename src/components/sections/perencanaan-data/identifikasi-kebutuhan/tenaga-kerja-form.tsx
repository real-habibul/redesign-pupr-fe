"use client";
import React, { useState } from "react";
import { Field, FieldArray } from "formik";
import Tabs from "@components/ui/tabs";
import useTahap2Store from "@store/perencanaan-data/identifikasi-kebutuhan/store";
import type {
  ProvinceOption,
  IdentifikasiKebutuhanFormValues,
} from "../../../../types/perencanaan-data/identifikasi_kebutuhan";
import { EMPTY_TENAGA_KERJA } from "@constants/perencanaan-data/identifikasi-kebutuhan";

import Button from "@components/ui/button";
import Pagination from "@components/ui/pagination";
import TextInput from "@components/ui/text-input";
import MUISelect from "@components/ui/select";
import SearchBox from "@components/ui/searchbox";
// import AddRowModal from "@components/ui/add-row-modal";

type Props = {
  values: IdentifikasiKebutuhanFormValues;
  setFieldValue: (field: string, value: any) => void;
  hide?: boolean;
  provincesOptions: ProvinceOption[];
};

const FILTER_OPTIONS = [
  { label: "Jenis Tenaga Kerja", value: "jenis_tenaga_kerja", checked: false },
  { label: "Satuan", value: "satuan", checked: false },
  { label: "Jumlah Kebutuhan", value: "jumlah_kebutuhan", checked: false },
  { label: "Kodefikasi", value: "kodefikasi", checked: false },
  { label: "Provinsi", value: "provincies_id", checked: false },
  { label: "Kota", value: "cities_id", checked: false },
];

export default function TenagaKerjaForm({
  values,
  setFieldValue,
  hide,
  provincesOptions,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenagaKerjaQuerySearch, setTenagaKerjaQuerySearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(2); // 0: Material, 1: Peralatan, 2: Tenaga Kerja
  const itemsPerPage = 10;

  const { setSelectedValue, tenagaKerjaFilters, setTenagaKerjaFilters } =
    useTahap2Store();

  const handlePageChange = (p: number) => setCurrentPage(p);

  // match filter + query
  const isMatch = (item: any, q: string, keys: string[]) => {
    const low = q.toLowerCase();
    if (!keys.length) {
      return Object.values(item ?? {}).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(low)
      );
    }
    return keys.some((k) =>
      String(item?.[k] ?? "")
        .toLowerCase()
        .includes(low)
    );
  };

  // index yang lolos filter
  const filteredIndices: number[] = React.useMemo(() => {
    const q = tenagaKerjaQuerySearch.trim();
    if (!q && !tenagaKerjaFilters.length) {
      return values.tenagaKerjas.map((_, i) => i);
    }
    const list: number[] = [];
    values.tenagaKerjas.forEach((it, i) => {
      if (isMatch(it, q, tenagaKerjaFilters as string[])) list.push(i);
    });
    return list;
  }, [values.tenagaKerjas, tenagaKerjaQuerySearch, tenagaKerjaFilters]);

  // paginate
  const totalFiltered = filteredIndices.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleIndices = filteredIndices.slice(start, end);

  // clamp halaman saat total berubah
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // reset page saat query/filter berubah
  React.useEffect(() => {
    setCurrentPage(1);
  }, [tenagaKerjaQuerySearch, tenagaKerjaFilters]);

  // ganti tab -> sync store + reset
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setSelectedValue(index as 0 | 1 | 2);
    setTenagaKerjaQuerySearch("");
    setTenagaKerjaFilters([]);
    setCurrentPage(1);
  };

  return (
    <div className={`${hide ? "hidden" : ""} rounded-[16px] overflow-visible`}>
      <FieldArray name="tenagaKerjas">
        {({ push, remove }) => (
          <div>
            <Tabs
              tabs={[
                { label: "Material", content: <div /> },
                { label: "Peralatan", content: <div /> },
                {
                  label: "Tenaga Kerja",
                  content: (
                    <div className="rounded-[16px] overflow-visible">
                      {/* Toolbar: Search + Filter */}
                      <div className="flex items-center justify-end mb-4">
                        <SearchBox
                          placeholder="Cari Tenaga Kerja..."
                          onSearch={setTenagaKerjaQuerySearch}
                          withFilter
                          filterOptions={FILTER_OPTIONS}
                          onFilterClick={(filters) => {
                            const keys = (filters ?? [])
                              .filter((f: any) => f.checked ?? true)
                              .map((f: any) => String(f.value));
                            setTenagaKerjaFilters(keys);
                          }}
                        />
                      </div>

                      <div className="rounded-[16px] border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full min-w-max">
                            <thead>
                              <tr className="bg-solid_basic_blue_100 text-left text-emphasis_light_on_surface_high uppercase tracking-wider">
                                {[
                                  "Jenis Tenaga Kerja",
                                  "Satuan",
                                  "Jumlah Kebutuhan",
                                  "Kodefikasi",
                                  "Provinsi",
                                  "Kota",
                                  "Aksi",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="px-3 py-6 text-base font-normal">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody className="bg-surface_light_background">
                              {visibleIndices.map((actualIndex) => {
                                const selectedProvince = provincesOptions.find(
                                  (p) =>
                                    p.value ===
                                    values.tenagaKerjas[actualIndex]
                                      ?.provincies_id
                                );
                                const cities = selectedProvince
                                  ? selectedProvince.cities
                                  : [];
                                const transformedCities = cities.map((c) => ({
                                  value: String(c.cities_id),
                                  label: c.cities_name,
                                }));

                                return (
                                  <tr key={actualIndex}>
                                    <td className="px-3 py-6">
                                      <Field
                                        name={`tenagaKerjas.${actualIndex}.jenis_tenaga_kerja`}>
                                        {({ field, form }: any) => (
                                          <TextInput
                                            label="Jenis Tenaga Kerja"
                                            value={field.value ?? ""}
                                            onChange={(e) =>
                                              form.setFieldValue(
                                                field.name,
                                                e.target.value
                                              )
                                            }
                                            placeholder="Jenis Tenaga Kerja"
                                            isRequired
                                          />
                                        )}
                                      </Field>
                                    </td>

                                    <td className="px-3 py-6">
                                      <Field
                                        name={`tenagaKerjas.${actualIndex}.satuan`}>
                                        {({ field, form }: any) => (
                                          <TextInput
                                            label="Satuan"
                                            value={field.value ?? ""}
                                            onChange={(e) =>
                                              form.setFieldValue(
                                                field.name,
                                                e.target.value
                                              )
                                            }
                                            placeholder="Satuan"
                                            isRequired
                                          />
                                        )}
                                      </Field>
                                    </td>

                                    <td className="px-3 py-6">
                                      <Field
                                        name={`tenagaKerjas.${actualIndex}.jumlah_kebutuhan`}>
                                        {({ field, form }: any) => (
                                          <TextInput
                                            label="Jumlah Kebutuhan"
                                            value={field.value ?? ""}
                                            onChange={(e) =>
                                              form.setFieldValue(
                                                field.name,
                                                e.target.value
                                              )
                                            }
                                            placeholder="Jumlah Kebutuhan"
                                            isRequired
                                          />
                                        )}
                                      </Field>
                                    </td>

                                    <td className="px-3 py-6">
                                      <Field
                                        name={`tenagaKerjas.${actualIndex}.kodefikasi`}>
                                        {({ field, form }: any) => (
                                          <TextInput
                                            label="Kodefikasi"
                                            value={field.value ?? ""}
                                            onChange={(e) =>
                                              form.setFieldValue(
                                                field.name,
                                                e.target.value
                                              )
                                            }
                                            placeholder="Kodefikasi"
                                            isRequired
                                          />
                                        )}
                                      </Field>
                                    </td>

                                    <td className="px-3 py-6">
                                      <Field
                                        name={`tenagaKerjas.${actualIndex}.provincies_id`}>
                                        {({ field, form }: any) => (
                                          <MUISelect
                                            label="Provinsi"
                                            value={
                                              field.value
                                                ? String(field.value)
                                                : ""
                                            }
                                            onChange={(val) => {
                                              form.setFieldValue(
                                                field.name,
                                                val
                                              );
                                              form.setFieldValue(
                                                `tenagaKerjas.${actualIndex}.cities_id`,
                                                ""
                                              );
                                            }}
                                            options={provincesOptions.map(
                                              (p) => ({
                                                value: String(p.value),
                                                label: p.label,
                                              })
                                            )}
                                            required
                                            placeholder="Pilih Provinsi"
                                          />
                                        )}
                                      </Field>
                                    </td>

                                    <td className="px-3 py-6">
                                      <Field
                                        name={`tenagaKerjas.${actualIndex}.cities_id`}>
                                        {({ field, form }: any) => {
                                          const selectedProvince =
                                            provincesOptions.find(
                                              (p) =>
                                                p.value ===
                                                values.tenagaKerjas[actualIndex]
                                                  ?.provincies_id
                                            );
                                          const cities = selectedProvince
                                            ? selectedProvince.cities
                                            : [];
                                          const transformedCities = cities.map(
                                            (c) => ({
                                              value: String(c.cities_id),
                                              label: c.cities_name,
                                            })
                                          );

                                          return (
                                            <MUISelect
                                              label="Kota"
                                              value={
                                                field.value
                                                  ? String(field.value)
                                                  : ""
                                              }
                                              onChange={(val) => {
                                                form.setFieldValue(
                                                  field.name,
                                                  val
                                                );
                                              }}
                                              options={transformedCities}
                                              required
                                              placeholder="Pilih Kota"
                                            />
                                          );
                                        }}
                                      </Field>
                                    </td>

                                    <td className="px-3 py-6 text-center">
                                      <Button
                                        type="button"
                                        variant="text_red"
                                        label="Hapus"
                                        onClick={() => {
                                          remove(actualIndex);
                                          const nextTotal = totalFiltered - 1;
                                          const nextTotalPages = Math.max(
                                            1,
                                            Math.ceil(nextTotal / itemsPerPage)
                                          );
                                          if (currentPage > nextTotalPages) {
                                            setCurrentPage(nextTotalPages);
                                          }
                                        }}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}

                              {visibleIndices.length === 0 && (
                                <tr>
                                  <td
                                    className="px-3 py-6 text-center text-emphasis_light_on_surface_medium"
                                    colSpan={7}>
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
                  ),
                },
              ]}
              value={activeTab}
              onChange={handleTabChange}
              actionButton={{
                label: "Tambah Data",
                variant: "contained",
                onClick: () => setIsModalOpen(true),
              }}
              className="my-6"
            />

            {/* {isModalOpen && (
              <AddRowModal
                handleClose={() => setIsModalOpen(false)}
                handleAddRow={(rowsToAdd: number) => {
                  for (let i = 0; i < rowsToAdd; i++)
                    push({ ...EMPTY_TENAGA_KERJA });
                }}
                currentIndex={2}
              />
            )} */}
          </div>
        )}
      </FieldArray>
    </div>
  );
}
