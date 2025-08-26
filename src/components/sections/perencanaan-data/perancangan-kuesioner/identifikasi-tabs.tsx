"use client";
import * as React from "react";
import Tabs from "@components/ui/tabs";
import SearchBox from "@components/ui/searchbox";
import type { FilterOption as SearchBoxFilter } from "@components/ui/searchbox";
import DataTableMui from "@components/ui/table";
import Pagination from "@components/ui/pagination";
import {
  useState,
  useMemo,
  useDeferredValue,
  useEffect,
  useCallback,
  startTransition,
} from "react";
import { useTahap4FiltersStore } from "@store/perencanaan-data/perancangan-kuesioner/store";
import type {
  MaterialItem,
  PeralatanItem,
  TenagaKerjaItem,
} from "../../../../types/perencanaan-data/perancangan-kuesioner";

const ITEMS_PER_PAGE = 10;

type Props = {
  materials: MaterialItem[];
  tools: PeralatanItem[];
  workers: TenagaKerjaItem[];
};

function useSearchFilter<T extends Record<string, unknown>>(
  all: T[] | undefined,
  filters: string[],
  q: string
) {
  const lower = (q ?? "").trim().toLowerCase();
  return useMemo(() => {
    const base = Array.isArray(all) ? all : [];
    if (!lower) return base;
    return base.filter((row) => {
      if (!filters.length) {
        return Object.values(row).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(lower)
        );
      }
      return filters.some((key) => {
        const v = (row as Record<string, unknown>)[key];
        return String(v ?? "")
          .toLowerCase()
          .includes(lower);
      });
    });
  }, [all, lower, filters]);
}

export default function IdentifikasiTabs({
  materials = [],
  tools = [],
  workers = [],
}: Props) {
  const {
    materialFilters,
    peralatanFilters,
    tenagaKerjaFilters,
    setMaterialFilters,
    setPeralatanFilters,
    setTenagaKerjaFilters,
  } = useTahap4FiltersStore();

  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  // Query per tab
  const [materialQuery, setMaterialQuery] = useState("");
  const [peralatanQuery, setPeralatanQuery] = useState("");
  const [tenagaQuery, setTenagaQuery] = useState("");

  // Debounced (via React concurrent hint)
  const dMatQ = useDeferredValue(materialQuery);
  const dPerQ = useDeferredValue(peralatanQuery);
  const dTenQ = useDeferredValue(tenagaQuery);

  // Data hasil filter-search
  const matData = useSearchFilter(materials, materialFilters, dMatQ);
  const perData = useSearchFilter(tools, peralatanFilters, dPerQ);
  const tenData = useSearchFilter(workers, tenagaKerjaFilters, dTenQ);

  // Pagination per tab
  const [pageMat, setPageMat] = useState(1);
  const [pagePer, setPagePer] = useState(1);
  const [pageTen, setPageTen] = useState(1);

  // Reset page saat query/filter berubah
  useEffect(() => setPageMat(1), [dMatQ, materialFilters]);
  useEffect(() => setPagePer(1), [dPerQ, peralatanFilters]);
  useEffect(() => setPageTen(1), [dTenQ, tenagaKerjaFilters]);

  // Reset page saat pindah tab
  useEffect(() => {
    if (activeTab === 0) setPageMat(1);
    if (activeTab === 1) setPagePer(1);
    if (activeTab === 2) setPageTen(1);
  }, [activeTab]);

  // Opsi filter (fixed seperti halaman referensi)
  const filterOptionsByTab: SearchBoxFilter[] = useMemo(() => {
    if (activeTab === 0) {
      const active = new Set(materialFilters);
      return [
        {
          label: "Nama Material",
          value: "nama_material",
          checked: active.has("nama_material"),
        },
        { label: "Satuan", value: "satuan", checked: active.has("satuan") },
        {
          label: "Spesifikasi",
          value: "spesifikasi",
          checked: active.has("spesifikasi"),
        },
        { label: "Ukuran", value: "ukuran", checked: active.has("ukuran") },
        {
          label: "Kodefikasi",
          value: "kodefikasi",
          checked: active.has("kodefikasi"),
        },
        {
          label: "Kelompok Material",
          value: "kelompok_material",
          checked: active.has("kelompok_material"),
        },
        {
          label: "Jumlah Kebutuhan",
          value: "jumlah_kebutuhan",
          checked: active.has("jumlah_kebutuhan"),
        },
        { label: "Merk", value: "merk", checked: active.has("merk") },
        {
          label: "Provinsi",
          value: "provinsi",
          checked: active.has("provinsi"),
        },
        { label: "Kota", value: "kota", checked: active.has("kota") },
      ];
    }
    if (activeTab === 1) {
      const active = new Set(peralatanFilters);
      return [
        {
          label: "Nama Peralatan",
          value: "nama_peralatan",
          checked: active.has("nama_peralatan"),
        },
        { label: "Satuan", value: "satuan", checked: active.has("satuan") },
        {
          label: "Spesifikasi",
          value: "spesifikasi",
          checked: active.has("spesifikasi"),
        },
        {
          label: "Kapasitas",
          value: "kapasitas",
          checked: active.has("kapasitas"),
        },
        {
          label: "Kodefikasi",
          value: "kodefikasi",
          checked: active.has("kodefikasi"),
        },
        {
          label: "Kelompok Peralatan",
          value: "kelompok_peralatan",
          checked: active.has("kelompok_peralatan"),
        },
        {
          label: "Jumlah Kebutuhan",
          value: "jumlah_kebutuhan",
          checked: active.has("jumlah_kebutuhan"),
        },
        { label: "Merk", value: "merk", checked: active.has("merk") },
        {
          label: "Provinsi",
          value: "provinsi",
          checked: active.has("provinsi"),
        },
        { label: "Kota", value: "kota", checked: active.has("kota") },
      ];
    }
    const active = new Set(tenagaKerjaFilters);
    return [
      {
        label: "Jenis Tenaga Kerja",
        value: "jenis_tenaga_kerja",
        checked: active.has("jenis_tenaga_kerja"),
      },
      { label: "Satuan", value: "satuan", checked: active.has("satuan") },
      {
        label: "Jumlah Kebutuhan",
        value: "jumlah_kebutuhan",
        checked: active.has("jumlah_kebutuhan"),
      },
      {
        label: "Kodefikasi",
        value: "kodefikasi",
        checked: active.has("kodefikasi"),
      },
      { label: "Provinsi", value: "provinsi", checked: active.has("provinsi") },
      { label: "Kota", value: "kota", checked: active.has("kota") },
    ];
  }, [activeTab, materialFilters, peralatanFilters, tenagaKerjaFilters]);

  // Placeholder by tab
  const currentPlaceholder =
    activeTab === 0
      ? "Cari Material..."
      : activeTab === 1
      ? "Cari Peralatan..."
      : "Cari Tenaga Kerja...";

  // Handle search (pola sama dgn halaman referensi)
  const handleSearch = useCallback(
    (q: string) => {
      startTransition(() => {
        if (activeTab === 0) setMaterialQuery(q);
        else if (activeTab === 1) setPeralatanQuery(q);
        else setTenagaQuery(q);
      });
    },
    [activeTab]
  );

  // Handle filter (pola sama dgn halaman referensi)
  const handleFilterClick = useCallback(
    (filters: SearchBoxFilter[]) => {
      const keys = (filters ?? [])
        .filter((f) => !!f.checked)
        .map((f) => String(f.value ?? ""));
      startTransition(() => {
        if (activeTab === 0) setMaterialFilters(keys);
        else if (activeTab === 1) setPeralatanFilters(keys);
        else setTenagaKerjaFilters(keys);
      });
    },
    [activeTab, setMaterialFilters, setPeralatanFilters, setTenagaKerjaFilters]
  );

  const handlePageChangeMat = useCallback((p: number) => setPageMat(p), []);
  const handlePageChangePer = useCallback((p: number) => setPagePer(p), []);
  const handlePageChangeTen = useCallback((p: number) => setPageTen(p), []);

  return (
    <div className="w-full">
      <div className="relative">
        <div className="md:absolute md:right-0 md:top-0 md:z-10 md:flex md:items-center md:gap-3 mt-[6px]">
          <SearchBox
            placeholder={currentPlaceholder}
            onSearch={handleSearch}
            withFilter
            filterOptions={filterOptionsByTab}
            onFilterClick={handleFilterClick}
            className="h-12 w-full md:w-[320px]"
          />
        </div>

        <div className="pt-0 md:pt-0">
          <Tabs
            value={activeTab}
            onChange={(idx) => {
              setActiveTab(idx as 0 | 1 | 2);
              // reset query & filter saat pindah tab (meniru halaman referensi)
              setMaterialQuery("");
              setPeralatanQuery("");
              setTenagaQuery("");
              setMaterialFilters([]);
              setPeralatanFilters([]);
              setTenagaKerjaFilters([]);
            }}
            className="my-0"
            tabs={[
              {
                label: "Material",
                content: (
                  <div className="mt-3 space-y-4">
                    <DataTableMui<MaterialItem>
                      columns={[
                        { key: "nama_material", header: "Nama Material" },
                        { key: "satuan", header: "Satuan" },
                        { key: "spesifikasi", header: "Spesifikasi" },
                        { key: "ukuran", header: "Ukuran" },
                        { key: "kodefikasi", header: "Kodefikasi" },
                        {
                          key: "kelompok_material",
                          header: "Kelompok Material",
                        },
                        { key: "jumlah_kebutuhan", header: "Jumlah Kebutuhan" },
                        { key: "merk", header: "Merk" },
                        { key: "provinsi", header: "Provinsi" },
                        { key: "kota", header: "Kabupaten/Kota" },
                      ]}
                      data={matData}
                      striped
                      pagination={{
                        currentPage: pageMat,
                        itemsPerPage: ITEMS_PER_PAGE,
                        total: matData.length,
                        onPageChange: handlePageChangeMat,
                      }}
                    />
                    <Pagination
                      currentPage={pageMat}
                      itemsPerPage={ITEMS_PER_PAGE}
                      totalData={matData.length}
                      onPageChange={handlePageChangeMat}
                    />
                  </div>
                ),
              },
              {
                label: "Peralatan",
                content: (
                  <div className="mt-3 space-y-4">
                    <DataTableMui<PeralatanItem>
                      columns={[
                        { key: "nama_peralatan", header: "Nama Peralatan" },
                        { key: "satuan", header: "Satuan" },
                        { key: "spesifikasi", header: "Spesifikasi" },
                        { key: "kapasitas", header: "Kapasitas" },
                        { key: "kodefikasi", header: "Kodefikasi" },
                        {
                          key: "kelompok_peralatan",
                          header: "Kelompok Peralatan",
                        },
                        { key: "jumlah_kebutuhan", header: "Jumlah Kebutuhan" },
                        { key: "merk", header: "Merk" },
                        { key: "provinsi", header: "Provinsi" },
                        { key: "kota", header: "Kabupaten/Kota" },
                      ]}
                      data={perData}
                      striped
                      pagination={{
                        currentPage: pagePer,
                        itemsPerPage: ITEMS_PER_PAGE,
                        total: perData.length,
                        onPageChange: handlePageChangePer,
                      }}
                    />
                    <Pagination
                      currentPage={pagePer}
                      itemsPerPage={ITEMS_PER_PAGE}
                      totalData={perData.length}
                      onPageChange={handlePageChangePer}
                    />
                  </div>
                ),
              },
              {
                label: "Tenaga Kerja",
                content: (
                  <div className="mt-3 space-y-4">
                    <DataTableMui<TenagaKerjaItem>
                      columns={[
                        { key: "jenis_tenaga_kerja", header: "Nama Pekerja" },
                        { key: "satuan", header: "Satuan" },
                        { key: "jumlah_kebutuhan", header: "Jumlah Kebutuhan" },
                        { key: "kodefikasi", header: "Kodefikasi" },
                        { key: "provinsi", header: "Provinsi" },
                        { key: "kota", header: "Kabupaten/Kota" },
                      ]}
                      data={tenData}
                      striped
                      pagination={{
                        currentPage: pageTen,
                        itemsPerPage: ITEMS_PER_PAGE,
                        total: tenData.length,
                        onPageChange: handlePageChangeTen,
                      }}
                    />
                    <Pagination
                      currentPage={pageTen}
                      itemsPerPage={ITEMS_PER_PAGE}
                      totalData={tenData.length}
                      onPageChange={handlePageChangeTen}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
