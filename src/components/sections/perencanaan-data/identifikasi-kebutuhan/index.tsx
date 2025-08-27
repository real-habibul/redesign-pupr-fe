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
import SearchBox, { type FilterOption } from "@components/ui/searchbox";
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
import type {
  ProvinceOption,
  City,
  Material,
  Peralatan,
  TenagaKerja,
  IdentifikasiKebutuhanFormValues,
  ProvincesApiResponse,
  IdentifikasiKebutuhanApi,
  StoreIdentifikasiResponse,
} from "../../../../types/perencanaan-data/identifikasi-kebutuhan";
import Stepper from "@components/ui/stepper";
import Button from "@components/ui/button";
import { useAlert } from "@components/ui/alert";
import MaterialForm from "./material-form";
import PeralatanForm from "./peralatan-form";
import TenagaKerjaForm from "./tenaga-kerja-form";
import AddRowModal from "@components/sections/perencanaan-data/identifikasi-kebutuhan/add-row-modal";

function s(v: unknown): string {
  if (typeof v === "string") return v;
  if (v == null) return "";
  return String(v);
}
function idVal(v: unknown): number | string | "" {
  if (typeof v === "number" || typeof v === "string") return v;
  if (v == null) return "";
  const num = Number(v);
  return Number.isFinite(num) ? num : String(v);
}

function sanitizeMaterial(
  input: Partial<Material> | Record<string, unknown>
): Material {
  const r = input as Record<string, unknown>;
  return {
    nama_material: s(r.nama_material),
    satuan: s(r.satuan),
    spesifikasi: s(r.spesifikasi),
    ukuran: s(r.ukuran),
    kodefikasi: s(r.kodefikasi),
    kelompok_material: s(r.kelompok_material),
    jumlah_kebutuhan: s(r.jumlah_kebutuhan),
    merk: s(r.merk),
    provincies_id: idVal(r.provincies_id),
    cities_id: idVal(r.cities_id),
  };
}
function sanitizePeralatan(
  input: Partial<Peralatan> | Record<string, unknown>
): Peralatan {
  const r = input as Record<string, unknown>;
  return {
    nama_peralatan: s(r.nama_peralatan),
    satuan: s(r.satuan),
    spesifikasi: s(r.spesifikasi),
    kapasitas: s(r.kapasitas),
    kodefikasi: s(r.kodefikasi),
    kelompok_peralatan: s(r.kelompok_peralatan),
    jumlah_kebutuhan: s(r.jumlah_kebutuhan),
    merk: s(r.merk),
    provincies_id: idVal(r.provincies_id),
    cities_id: idVal(r.cities_id),
  };
}
function sanitizeTenaga(
  input: Partial<TenagaKerja> | Record<string, unknown>
): TenagaKerja {
  const r = input as Record<string, unknown>;
  return {
    jenis_tenaga_kerja: s(r.jenis_tenaga_kerja),
    satuan: s(r.satuan),
    jumlah_kebutuhan: s(r.jumlah_kebutuhan),
    kodefikasi: s(r.kodefikasi),
    provincies_id: idVal(r.provincies_id),
    cities_id: idVal(r.cities_id),
  };
}

const buildEmptyMaterial = (): Material =>
  sanitizeMaterial(EMPTY_MATERIAL as Partial<Material>);
const buildEmptyPeralatan = (): Peralatan =>
  sanitizePeralatan(EMPTY_PERALATAN as Partial<Peralatan>);
const buildEmptyTenaga = (): TenagaKerja =>
  sanitizeTenaga(EMPTY_TENAGA_KERJA as Partial<TenagaKerja>);

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

  const [materialQuery, setMaterialQuery] = useState<string>("");
  const [peralatanQuery, setPeralatanQuery] = useState<string>("");
  const [tenagaQuery, setTenagaQuery] = useState<string>("");
  const [materialFilters, setMaterialFilters] = useState<string[]>([]);
  const [peralatanFilters, setPeralatanFilters] = useState<string[]>([]);
  const [tenagaFilters, setTenagaFilters] = useState<string[]>([]);

  const debouncedMatQ = useDeferredValue(materialQuery);
  const debouncedPerQ = useDeferredValue(peralatanQuery);
  const debouncedTenQ = useDeferredValue(tenagaQuery);

  useEffect(() => {
    (async () => {
      try {
        const data = (await getProvincesAndCities()) as ProvincesApiResponse;
        const arr = Array.isArray(data?.data) ? data.data : [];
        const transformed: ProvinceOption[] = arr.map((d) => {
          const rawCities = Array.isArray(d.cities) ? d.cities : [];
          const cities: City[] = rawCities.map((c: Partial<City>) => ({
            cities_id: idVal(c?.cities_id),
            cities_name: s(c?.cities_name),
          }));
          return {
            value: idVal(d.id_province),
            label: s(d.province_name),
            cities,
          };
        });
        setProvincesOptions(transformed);
      } catch (e) {
        console.error("Provinces error:", e);
        show("Gagal memuat data provinsi/kota.", "error");
        return;
      }

      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get("fromTahap3") === "true") {
          const id = localStorage.getItem("identifikasi_kebutuhan_id");
          if (id) {
            const res = (await getIdentifikasiKebutuhan(
              id
            )) as IdentifikasiKebutuhanApi;
            const mRaw = Array.isArray(res?.data?.material)
              ? res.data.material
              : [];
            const pRaw = Array.isArray(res?.data?.peralatan)
              ? res.data.peralatan
              : [];
            const tRaw = Array.isArray(res?.data?.tenaga_kerja)
              ? res.data.tenaga_kerja
              : [];

            const materials: Material[] = mRaw.map((m) => sanitizeMaterial(m));
            const peralatans: Peralatan[] = pRaw.map((p) =>
              sanitizePeralatan(p)
            );
            const tenagaKerjas: TenagaKerja[] = tRaw.map((t) =>
              sanitizeTenaga(t)
            );

            setInitialValues({ materials, peralatans, tenagaKerjas });
          }
        }
      } catch (e) {
        console.error("Identifikasi error:", e);
        show("Gagal memuat data identifikasi kebutuhan.", "error");
      }
    })();
  }, [setProvincesOptions, setInitialValues, show]);

  const navigateToInformasiUmum = () => {
    router.push(
      "/perencanaan-data/informasi-umum?fromidentifikasi-kebutuhan=true"
    );
  };

  const handleSubmit = useCallback(
    async (values: IdentifikasiKebutuhanFormValues) => {
      const informasiUmumId = localStorage.getItem("informasi_umum_id");
      const { materials, peralatans, tenagaKerjas } = values;
      if (!materials.length && !peralatans.length && !tenagaKerjas.length) {
        show("Minimal harus ada satu data yang diisi.", "error");
        return;
      }
      try {
        const res = (await storeIdentifikasiKebutuhan({
          material: materials,
          peralatan: peralatans,
          tenaga_kerja: tenagaKerjas,
          informasi_umum_id: informasiUmumId,
        })) as StoreIdentifikasiResponse;

        if (res?.status === "success") {
          const identId =
            res?.data?.material?.[0]?.identifikasi_kebutuhan_id ?? 0;
          if (identId)
            localStorage.setItem("identifikasi_kebutuhan_id", String(identId));
          show("Data berhasil disimpan.", "success");
          router.replace("/perencanaan-data/shortlist-vendor");
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

  const filterOptionsByTab: FilterOption[] = useMemo(() => {
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

  const currentQuery: string =
    selectedValue === 0
      ? debouncedMatQ
      : selectedValue === 1
      ? debouncedPerQ
      : debouncedTenQ;

  const currentFilterKeys: string[] =
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
        <Formik<IdentifikasiKebutuhanFormValues>
          initialValues={initialValues as IdentifikasiKebutuhanFormValues}
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
                    filterOptions={filterOptionsByTab}
                    onFilterClick={onFilterClick}
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
                      const next: Material[] = Array.from(
                        { length: rowsToAdd },
                        buildEmptyMaterial
                      );
                      setFieldValue("materials", [
                        ...(values.materials ?? []),
                        ...next,
                      ]);
                    } else if (selectedValue === 1) {
                      const next: Peralatan[] = Array.from(
                        { length: rowsToAdd },
                        buildEmptyPeralatan
                      );
                      setFieldValue("peralatans", [
                        ...(values.peralatans ?? []),
                        ...next,
                      ]);
                    } else {
                      const next: TenagaKerja[] = Array.from(
                        { length: rowsToAdd },
                        buildEmptyTenaga
                      );
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
                  onClick={navigateToInformasiUmum}
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
