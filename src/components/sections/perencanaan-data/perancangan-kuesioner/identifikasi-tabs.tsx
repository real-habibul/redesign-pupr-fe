"use client";
import * as React from "react";
import Tabs from "@components/ui/tabs";
import SearchBox from "@components/ui/searchbox";
import type { FilterOption as SearchBoxFilter } from "@components/ui/searchbox";
import DataTableMui from "@components/ui/table";
import { useState, useMemo, useDeferredValue, useEffect } from "react";
import { useTahap4FiltersStore } from "@store/perencanaan-data/perancangan-kuesioner/store";
import type {
  MaterialItem,
  PeralatanItem,
  TenagaKerjaItem,
  FilterOption as AccessorFilterOption,
} from "../../../../types/perencanaan-data/perancangan-kuesioner";

const ITEMS_PER_PAGE = 10;

function toSBFilters(
  source: AccessorFilterOption[],
  active: string[]
): SearchBoxFilter[] {
  return (source as Array<{ label: string; accessor: string }>).map((f) => ({
    label: f.label,
    value: f.accessor,
    checked: active.includes(f.accessor),
  }));
}

function fromSBFilters(selected: SearchBoxFilter[]): string[] {
  return (selected ?? [])
    .filter((f) => !!f.checked && f.value !== undefined)
    .map((f) => String(f.value));
}

function useSearchFilter<T extends Record<string, unknown>>(
  all: T[],
  filters: string[],
  q: string
) {
  const lower = q.trim().toLowerCase();
  const data = useMemo(() => {
    if (!lower) return all;
    return all.filter((row) => {
      if (!filters.length) {
        return Object.values(row).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(lower)
        );
      }
      return filters.some((key) =>
        String((row as any)[key] ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });
  }, [all, lower, filters]);
  return data;
}

export default function IdentifikasiTabs({
  materials,
  tools,
  workers,
  filterOptionsMaterial,
  filterOptionsPeralatan,
  filterOptionsTenagaKerja,
}: {
  materials: MaterialItem[];
  tools: PeralatanItem[];
  workers: TenagaKerjaItem[];
  filterOptionsMaterial: AccessorFilterOption[];
  filterOptionsPeralatan: AccessorFilterOption[];
  filterOptionsTenagaKerja: AccessorFilterOption[];
}) {
  const {
    materialFilters,
    peralatanFilters,
    tenagaKerjaFilters,
    setMaterialFilters,
    setPeralatanFilters,
    setTenagaKerjaFilters,
  } = useTahap4FiltersStore();

  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  const [materialQuery, setMaterialQuery] = useState("");
  const [peralatanQuery, setPeralatanQuery] = useState("");
  const [tenagaQuery, setTenagaQuery] = useState("");

  const dMatQ = useDeferredValue(materialQuery);
  const dPerQ = useDeferredValue(peralatanQuery);
  const dTenQ = useDeferredValue(tenagaQuery);

  const matData = useSearchFilter(materials, materialFilters, dMatQ);
  const perData = useSearchFilter(tools, peralatanFilters, dPerQ);
  const tenData = useSearchFilter(workers, tenagaKerjaFilters, dTenQ);

  const [pageMat, setPageMat] = useState(1);
  const [pagePer, setPagePer] = useState(1);
  const [pageTen, setPageTen] = useState(1);

  useEffect(() => setPageMat(1), [dMatQ, materialFilters]);
  useEffect(() => setPagePer(1), [dPerQ, peralatanFilters]);
  useEffect(() => setPageTen(1), [dTenQ, tenagaKerjaFilters]);

  const currentPlaceholder =
    activeTab === 0
      ? "Cari Material..."
      : activeTab === 1
      ? "Cari Peralatan..."
      : "Cari Tenaga Kerja...";

  const currentFilters =
    activeTab === 0
      ? toSBFilters(filterOptionsMaterial, materialFilters)
      : activeTab === 1
      ? toSBFilters(filterOptionsPeralatan, peralatanFilters)
      : toSBFilters(filterOptionsTenagaKerja, tenagaKerjaFilters);

  const handleSearch = (q: string) => {
    if (activeTab === 0) setMaterialQuery(q);
    else if (activeTab === 1) setPeralatanQuery(q);
    else setTenagaQuery(q);
  };

  const handleFilterClick = (filters: SearchBoxFilter[]) => {
    const keys = fromSBFilters(filters);
    if (activeTab === 0) setMaterialFilters(keys);
    else if (activeTab === 1) setPeralatanFilters(keys);
    else setTenagaKerjaFilters(keys);
  };

  return (
    <div className="w-full">
      \{" "}
      <div className="relative">
        <div className="md:absolute md:right-0 md:top-0 md:z-10 md:flex md:items-center md:gap-3">
          <SearchBox
            placeholder={currentPlaceholder}
            onSearch={handleSearch}
            withFilter
            debounceDelay={200}
            filterOptions={currentFilters}
            onFilterClick={handleFilterClick}
            className="h-12 w-full md:w-[320px]"
          />
        </div>

        <div className="pt-0 md:pt-0">
          <Tabs
            value={activeTab}
            onChange={(idx) => setActiveTab(idx as 0 | 1 | 2)}
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
                      pagination={{
                        currentPage: pageMat,
                        itemsPerPage: ITEMS_PER_PAGE,
                        total: matData.length,
                        onPageChange: setPageMat,
                      }}
                      striped
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
                      pagination={{
                        currentPage: pagePer,
                        itemsPerPage: ITEMS_PER_PAGE,
                        total: perData.length,
                        onPageChange: setPagePer,
                      }}
                      striped
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
                      pagination={{
                        currentPage: pageTen,
                        itemsPerPage: ITEMS_PER_PAGE,
                        total: tenData.length,
                        onPageChange: setPageTen,
                      }}
                      striped
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
