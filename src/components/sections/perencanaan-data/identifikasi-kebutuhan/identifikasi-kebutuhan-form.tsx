"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useDeferredValue,
  startTransition,
} from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import Tabs from "@components/ui/tabs";
import SearchBox from "@components/ui/searchbox";
import useIdentifikasiKebutuhanStore from "@store/perencanaan-data/identifikasi-kebutuhan/store";
import {
  getProvincesAndCities,
  getIdentifikasiKebutuhan,
  storeIdentifikasiKebutuhan,
} from "@lib/api/perencanaan-data/identifikasi-kebutuhan";
import {
  NUMBER_OF_STEPS,
  STEP_LABELS,
  EMPTY_MATERIAL,
  EMPTY_PERALATAN,
  EMPTY_TENAGA_KERJA,
} from "@constants/perencanaan-data/identifikasi-kebutuhan";
import type { ProvinceOption } from "../../../../types/perencanaan-data/identifikasi_kebutuhan";
import Stepper from "@components/ui/stepper";
import Button from "@components/ui/button";
import { useAlert } from "@components/ui/alert";
import MaterialForm from "./material-form";
import PeralatanForm from "./peralatan-form";
import TenagaKerjaForm from "./tenaga-kerja-form";
import AddRowModal from "@components/sections/perencanaan-data/identifikasi-kebutuhan/add-row-modal";

type Identifikasi_kebutuhan_Form_Values = {
  materials: any[];
  peralatans: any[];
  tenagaKerjas: any[];
};

type FilterOption = {
  label?: string;
  value: string | number | undefined;
  checked?: boolean;
};

export default function Identifikasi_Kebutuhan_Form() {
  const router = useRouter();
  const { show } = useAlert();
  const {
    selectedValue,
    provincesOptions,
    initialValues,
    setSelectedValue,
    setProvincesOptions,
    setInitialValues,
  } = useIdentifikasiKebutuhanStore();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [materialQuery, setMaterialQuery] = useState("");
  const [peralatanQuery, setPeralatanQuery] = useState("");
  const [tenagaQuery, setTenagaQuery] = useState("");
  const [materialFilters, setMaterialFilters] = useState<string[]>([]);
  const [peralatanFilters, setPeralatanFilters] = useState<string[]>([]);
  const [tenagaFilters, setTenagaFilters] = useState<string[]>([]);

  const debouncedMatQ = useDeferredValue(materialQuery);
  const debouncedPerQ = useDeferredValue(peralatanQuery);
  const debouncedTenQ = useDeferredValue(tenagaQuery);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProvincesAndCities();
        const transformed: ProvinceOption[] = (data?.data ?? []).map(
          (d: any) => ({
            value: d.id_province,
            label: d.province_name,
            cities: d.cities ?? [],
          })
        );
        setProvincesOptions(transformed);
        const params = new URLSearchParams(window.location.search);
        if (params.get("fromTahap3") === "true") {
          const id = localStorage.getItem("identifikasi_kebutuhan_id");
          if (id) {
            const res = await getIdentifikasiKebutuhan(id);
            setInitialValues({
              materials: res?.data?.material ?? [],
              peralatans: res?.data?.peralatan ?? [],
              tenagaKerjas: res?.data?.tenaga_kerja ?? [],
            });
          }
        }
      } catch {
        show("Gagal memuat data provinsi/kota.", "error");
      }
    })();
  }, [setProvincesOptions, setInitialValues, show]);

  const navigateToTahap1 = () => {
    router.push(
      "/perencanaan_data/informasi-umum?fromidentifikasi-kebutuhan=true"
    );
  };

  const handleSubmit = useCallback(
    async (values: Identifikasi_kebutuhan_Form_Values) => {
      const informasiUmumId = localStorage.getItem("informasi_umum_id");
      const { materials, peralatans, tenagaKerjas } = values;
      if (!materials.length && !peralatans.length && !tenagaKerjas.length) {
        show("Minimal harus ada satu data yang diisi.", "error");
        return;
      }
      try {
        const res = await storeIdentifikasiKebutuhan({
          material: materials,
          peralatan: peralatans,
          tenaga_kerja: tenagaKerjas,
          informasi_umum_id: informasiUmumId,
        });
        if (res?.status === "success") {
          const identId =
            res?.data?.material?.[0]?.identifikasi_kebutuhan_id ?? 0;
          if (identId)
            localStorage.setItem("identifikasi_kebutuhan_id", String(identId));
          show("Data berhasil disimpan.", "success");
          router.replace("/perencanaan_data/tahap3");
          return;
        }
        show(res?.message ?? "Gagal menyimpan data.", "error");
      } catch {
        show("Gagal menyimpan data.", "error");
      }
    },
    [show, router]
  );

  const onFilterClick = useCallback(
    (filters: FilterOption[]) => {
      const keys = (filters ?? [])
        .filter((f) => !!f.checked)
        .map((f) => String(f.value ?? ""));
      startTransition(() => {
        if (selectedValue === 0) setMaterialFilters(keys);
        else if (selectedValue === 1) setPeralatanFilters(keys);
        else setTenagaFilters(keys);
      });
    },
    [selectedValue]
  );

  const onSearch = useCallback(
    (q: string) => {
      startTransition(() => {
        if (selectedValue === 0) setMaterialQuery(q);
        else if (selectedValue === 1) setPeralatanQuery(q);
        else setTenagaQuery(q);
      });
    },
    [selectedValue]
  );

  const filterOptionsByTab = useMemo(() => {
    if (selectedValue === 0)
      return [
        { label: "Nama Material", value: "nama_material", checked: false },
        { label: "Satuan", value: "satuan", checked: false },
        { label: "Spesifikasi", value: "spesifikasi", checked: false },
        { label: "Ukuran", value: "ukuran", checked: false },
        { label: "Kodefikasi", value: "kodefikasi", checked: false },
        {
          label: "Kelompok Material",
          value: "kelompok_material",
          checked: false,
        },
        {
          label: "Jumlah Kebutuhan",
          value: "jumlah_kebutuhan",
          checked: false,
        },
        { label: "Merk", value: "merk", checked: false },
        { label: "Provinsi", value: "provincies_id", checked: false },
        { label: "Kota", value: "cities_id", checked: false },
      ];
    if (selectedValue === 1)
      return [
        { label: "Nama Peralatan", value: "nama_peralatan", checked: false },
        { label: "Satuan", value: "satuan", checked: false },
        { label: "Spesifikasi", value: "spesifikasi", checked: false },
        { label: "Kapasitas", value: "kapasitas", checked: false },
        { label: "Kodefikasi", value: "kodefikasi", checked: false },
        {
          label: "Kelompok Peralatan",
          value: "kelompok_peralatan",
          checked: false,
        },
        {
          label: "Jumlah Kebutuhan",
          value: "jumlah_kebutuhan",
          checked: false,
        },
        { label: "Merk", value: "merk", checked: false },
        { label: "Provinsi", value: "provincies_id", checked: false },
        { label: "Kota", value: "cities_id", checked: false },
      ];
    return [
      {
        label: "Jenis Tenaga Kerja",
        value: "jenis_tenaga_kerja",
        checked: false,
      },
      { label: "Satuan", value: "satuan", checked: false },
      { label: "Jumlah Kebutuhan", value: "jumlah_kebutuhan", checked: false },
      { label: "Kodefikasi", value: "kodefikasi", checked: false },
      { label: "Provinsi", value: "provincies_id", checked: false },
      { label: "Kota", value: "cities_id", checked: false },
    ];
  }, [selectedValue]);

  const currentQuery =
    selectedValue === 0
      ? debouncedMatQ
      : selectedValue === 1
      ? debouncedPerQ
      : debouncedTenQ;

  const currentFilterKeys =
    selectedValue === 0
      ? materialFilters
      : selectedValue === 1
      ? peralatanFilters
      : tenagaFilters;

  return (
    <div className="p-8">
      <div className="space-y-3 pt-8">
        <h3 className="text-H3 text-emphasis-on_surface-high">
          Tahap Perencanaan Data
        </h3>
        <div className="justify-center items-center space-x-4 mt-3 bg-neutral-100 px-6 pb-8 pt-16 rounded-[16px]">
          <Stepper
            currentStep={1}
            numberOfSteps={NUMBER_OF_STEPS}
            labels={STEP_LABELS}
          />
        </div>
        <h4 className="text-H4 text-emphasis-on_surface-high">
          Identifikasi Kebutuhan
        </h4>
      </div>

      <div className="space-y-4">
        <Formik<Identifikasi_kebutuhan_Form_Values>
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize>
          {({ values, setFieldValue }) => (
            <Form>
              <div className="relative mt-3 mb-4 ">
                <div className="mt-[6px] flex items-center gap-4 md:absolute md:right-0 md:top-0 md:z-10 md:[&>*]:h-12 md:[&>*]:flex md:[&>*]:items-center">
                  <SearchBox
                    placeholder={
                      selectedValue === 0
                        ? "Cari Material..."
                        : selectedValue === 1
                        ? "Cari Peralatan..."
                        : "Cari Tenaga Kerja..."
                    }
                    onSearch={onSearch}
                    withFilter
                    filterOptions={filterOptionsByTab as any}
                    onFilterClick={onFilterClick as any}
                    className="h-12"
                  />
                  <Button
                    variant="solid_blue"
                    fullWidth={false}
                    label="Tambah Data"
                    onClick={() => setIsAddOpen(true)}
                    sx={{ height: 48 }}
                  />
                </div>

                <Tabs
                  value={selectedValue}
                  onChange={(idx) => {
                    setSelectedValue(idx as 0 | 1 | 2);
                    setMaterialQuery("");
                    setPeralatanQuery("");
                    setTenagaQuery("");
                    setMaterialFilters([]);
                    setPeralatanFilters([]);
                    setTenagaFilters([]);
                  }}
                  className="my-0"
                  tabs={[
                    {
                      label: "Material",
                      content: (
                        <MaterialForm
                          values={{
                            materials: values.materials ?? [],
                            peralatans: values.peralatans ?? [],
                            tenagaKerjas: values.tenagaKerjas ?? [],
                          }}
                          setFieldValue={setFieldValue}
                          provincesOptions={
                            (provincesOptions ?? []) as ProvinceOption[]
                          }
                          query={currentQuery}
                          filterKeys={currentFilterKeys}
                        />
                      ),
                    },
                    {
                      label: "Peralatan",
                      content: (
                        <PeralatanForm
                          values={{
                            materials: values.materials ?? [],
                            peralatans: values.peralatans ?? [],
                            tenagaKerjas: values.tenagaKerjas ?? [],
                          }}
                          setFieldValue={setFieldValue}
                          provincesOptions={
                            (provincesOptions ?? []) as ProvinceOption[]
                          }
                          query={currentQuery}
                          filterKeys={currentFilterKeys}
                        />
                      ),
                    },
                    {
                      label: "Tenaga Kerja",
                      content: (
                        <TenagaKerjaForm
                          values={{
                            materials: values.materials ?? [],
                            peralatans: values.peralatans ?? [],
                            tenagaKerjas: values.tenagaKerjas ?? [],
                          }}
                          setFieldValue={setFieldValue}
                          provincesOptions={
                            (provincesOptions ?? []) as ProvinceOption[]
                          }
                          query={currentQuery}
                          filterKeys={currentFilterKeys}
                        />
                      ),
                    },
                  ]}
                />
              </div>

              {isAddOpen && (
                <AddRowModal
                  handleClose={() => setIsAddOpen(false)}
                  currentIndex={selectedValue}
                  handleAddRow={(rowsToAdd: number) => {
                    if (rowsToAdd <= 0) return;
                    if (selectedValue === 0) {
                      const next = Array.from({ length: rowsToAdd }, () => ({
                        ...EMPTY_MATERIAL,
                      }));
                      setFieldValue("materials", [
                        ...(values.materials ?? []),
                        ...next,
                      ]);
                    } else if (selectedValue === 1) {
                      const next = Array.from({ length: rowsToAdd }, () => ({
                        ...EMPTY_PERALATAN,
                      }));
                      setFieldValue("peralatans", [
                        ...(values.peralatans ?? []),
                        ...next,
                      ]);
                    } else {
                      const next = Array.from({ length: rowsToAdd }, () => ({
                        ...EMPTY_TENAGA_KERJA,
                      }));
                      setFieldValue("tenagaKerjas", [
                        ...(values.tenagaKerjas ?? []),
                        ...next,
                      ]);
                    }
                    setIsAddOpen(false);
                  }}
                />
              )}

              <div className="flex flex-row justify-end items-center gap-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
                <Button
                  type="button"
                  variant="outlined_yellow"
                  fullWidth={false}
                  label="Kembali"
                  onClick={navigateToTahap1}
                />
                <Button
                  type="submit"
                  variant="solid_blue"
                  fullWidth={false}
                  label="Simpan & Lanjut"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
