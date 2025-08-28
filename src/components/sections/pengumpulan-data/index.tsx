"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import Pagination from "@components/ui/pagination";
import SearchBox from "@components/ui/searchbox";
import IconButton from "@mui/material/IconButton";
import { More } from "iconsax-react";

import type { PengumpulanRow } from "../../../types/pengumpulan-data/pengumpulan-data";
import { getTableListPengumpulan } from "@lib/api/pengumpulan-data/pengumpulan";
import { useFetch } from "@hooks/perencanaan-data/use-fetch";
import PengumpulanDetailDialog from "./pengumpulan-detail-dialog";

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

export default function PengumpulanDataList() {
  const { data, error, loading } = useFetch(getTableListPengumpulan, []);
  React.useEffect(() => {
    console.log("API raw data (pengumpulan):", data);
  }, [data]);

  const allData = Array.isArray(data) ? (data as PengumpulanRow[]) : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFields, setSelectedFields] = useState<
    (keyof PengumpulanRow)[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SBFilter[]>(DEFAULT_FILTERS);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PengumpulanRow | null>(null);

  const openDialog = (row: PengumpulanRow) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const columns: ColumnDef<PengumpulanRow>[] = useMemo(
    () => [
      { key: "nama_paket", header: "Nama Paket" },
      { key: "nama_balai", header: "Nama Balai" },
      { key: "nama_ppk", header: "Nama PPK" },
      { key: "jabatan_ppk", header: "Jabatan PPK" },
      { key: "kode_rup", header: "Kode RUP" },
      { key: "status", header: "Status" },
      {
        key: "__aksi",
        header: "Aksi",
        className: "w-[64px] text-center",
        cell: (row) => (
          <IconButton
            aria-label="aksi"
            onClick={(e) => {
              e.stopPropagation?.();
              openDialog(row as PengumpulanRow);
            }}
            size="small">
            <More
              size={20}
              color="var(--color-emphasis-light-on-surface-high)"
            />
          </IconButton>
        ),
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    let items = [...allData];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const scanAll = selectedFields.length === 0;
      items = items.filter((item) => {
        if (scanAll)
          return Object.values(item).some((v) =>
            String(v ?? "")
              .toLowerCase()
              .includes(q)
          );
        return selectedFields.some((k) =>
          String(item[k] ?? "")
            .toLowerCase()
            .includes(q)
        );
      });
    }
    const uniq = new Map<string | number, PengumpulanRow>();
    items.forEach((it) => uniq.set(it.id, it));
    return Array.from(uniq.values());
  }, [allData, searchQuery, selectedFields]);

  const total = filteredData.length;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterClick = (next: SBFilter[]) => {
    setFilters(next);
    const selected = next
      .filter((f) => f.checked)
      .map((f) => f.value)
      .filter((v): v is keyof PengumpulanRow => typeof v === "string") as (
      | keyof PengumpulanRow
    )[];
    setSelectedFields(selected);
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      <div className="space-y-3">
        <div className="flex flex-row justify-between items-center mt-8 mb-7">
          <h1 className="text-H3 font-bold">
            Informasi Tahap Pengumpulan Data
          </h1>
          <SearchBox
            placeholder="Cari Data..."
            onSearch={handleSearch}
            withFilter
            filterOptions={filters}
            onFilterClick={handleFilterClick}
            debounceDelay={200}
          />
        </div>

        {error && <div className="text-red-600">Error: {String(error)}</div>}
        {loading && <div>Memuat data…</div>}

        {!loading && !error && (
          <>
            <DataTableMui
              columns={columns}
              data={filteredData as unknown as PengumpulanRow[]}
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

      <PengumpulanDetailDialog
        open={dialogOpen}
        row={selectedRow}
        onClose={closeDialog}
      />
    </div>
  );
}
