"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import Pagination from "@components/ui/pagination";
import SearchBox from "@components/ui/searchbox";
import type { PerencanaanRow } from "../../../../types/perencanaan-data/perencanaan-list";
import { getPerencanaanList } from "@lib/api/perencanaan-data/perencanaan-list";
import { useFetch } from "@hooks/perencanaan-data/use-fetch";

type SBFilter = import("@components/ui/searchbox").FilterOption;

const ITEMS_PER_PAGE = 10;

const DEFAULT_FILTERS: SBFilter[] = [
  { label: "Nama Paket", value: "nama_paket", checked: false },
  { label: "Nama Balai", value: "nama_balai", checked: false },
  { label: "Nama PPK", value: "nama_ppk", checked: false },
  { label: "Jabatan PPK", value: "jabatan_ppk", checked: false },
  { label: "Kode RUP", value: "kode_rup", checked: false },
  { label: "Status", value: "status", checked: false },
];

export default function PerencanaanDataList() {
  const { data, error, loading } = useFetch(getPerencanaanList);
  const allData = useMemo<PerencanaanRow[]>(
    () => (Array.isArray(data) ? (data as PerencanaanRow[]) : []),
    [data]
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFields, setSelectedFields] = useState<
    (keyof PerencanaanRow)[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const columns: ColumnDef<PerencanaanRow>[] = useMemo(
    () => [
      { key: "nama_paket", header: "Nama Paket" },
      { key: "nama_balai", header: "Nama Balai" },
      { key: "nama_ppk", header: "Nama PPK" },
      { key: "jabatan_ppk", header: "Jabatan PPK" },
      { key: "kode_rup", header: "Kode RUP" },
      { key: "status", header: "Status" },
    ],
    []
  );

  const filteredData = useMemo(() => {
    let items = [...allData];
    const q = searchQuery.trim().toLowerCase();
    if (q.length > 0) {
      const scanAll = selectedFields.length === 0;
      items = items.filter((item) => {
        if (scanAll)
          return Object.values(item).some((v) =>
            String(v).toLowerCase().includes(q)
          );
        return selectedFields.some((k) =>
          String(item[k] ?? "")
            .toLowerCase()
            .includes(q)
        );
      });
    }
    const uniq = new Map<string | number, PerencanaanRow>();
    items.forEach((it) => uniq.set(it.id, it));
    return Array.from(uniq.values());
  }, [allData, searchQuery, selectedFields]);

  const total = filteredData.length;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterClick = (filters: SBFilter[]) => {
    const selected = filters
      .filter((f) => f.checked)
      .map((f) => f.value)
      .filter(
        (v): v is keyof PerencanaanRow => typeof v === "string"
      ) as (keyof PerencanaanRow)[];
    setSelectedFields(selected);
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      <div className="space-y-3">
        <div className="flex flex-row justify-between items-center mt-8 mb-7">
          <h1 className="text-H3 font-bold">Informasi Perencanaan Data</h1>
          <SearchBox
            placeholder="Cari Data..."
            onSearch={handleSearch}
            withFilter
            filterOptions={DEFAULT_FILTERS}
            onFilterClick={handleFilterClick}
          />
        </div>

        {error && <div className="text-red-600">Error: {error}</div>}
        {loading && <div>Memuat data…</div>}

        {!loading && !error && (
          <>
            <DataTableMui<PerencanaanRow>
              columns={columns}
              data={filteredData}
              striped
              stickyHeader
              pagination={{
                currentPage,
                itemsPerPage: ITEMS_PER_PAGE,
                total,
                onPageChange: setCurrentPage,
              }}
            />
            <Pagination
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalData={total}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
