"use client";

import * as React from "react";
import { useMemo, useState, useEffect } from "react";

import Button from "@components/ui/button";
import Pagination from "@components/ui/pagination";
import DataTableMui, { type ColumnDef } from "@components/ui/table";

import type { VendorItem } from "../../../../types/perencanaan-data/perancangan-kuesioner";

type Props = {
  vendors: VendorItem[];
  onOpenModal: (id: number) => void;
  onRemoveRow?: (id: number | string) => void;
  query?: string;
  filterKeys?: string[];
};

const ITEMS_PER_PAGE = 10;

export default function VendorTable({
  vendors,
  onOpenModal,
  // onRemoveRow: _onRemoveRow,
  query = "",
  filterKeys = [],
}: Props) {
  const [rows, setRows] = useState<VendorItem[]>(vendors ?? []);
  useEffect(() => {
    setRows(vendors ?? []);
  }, [vendors]);

  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [query, filterKeys]);

  const lower = (query ?? "").trim().toLowerCase();

  const filtered = useMemo(() => {
    const list = rows;
    if (!lower) return list;

    if (!filterKeys || filterKeys.length === 0) {
      return list.filter((row) =>
        Object.values(row).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(lower)
        )
      );
    }

    return list.filter((row) =>
      filterKeys.some((key) => {
        const value = (row as Record<string, unknown>)[key];
        return String(value ?? "")
          .toLowerCase()
          .includes(lower);
      })
    );
  }, [rows, lower, filterKeys]);

  const cols: ColumnDef<VendorItem>[] = [
    { key: "nama_vendor", header: "Responden/Vendor", className: "w-[252px]" },
    { key: "pemilik_vendor", header: "Pemilik Vendor", className: "w-[260px]" },
    { key: "alamat", header: "Alamat", className: "w-[340px]" },
    { key: "kontak", header: "Kontak", className: "w-[200px]" },
    {
      key: "__rancangan__",
      header: (
        <div className="flex items-center justify-center w-full">
          Rancangan Kuesioner
        </div>
      ),
      className: "w-[300px]",
      cell: (row) => (
        <div className="flex items-center justify-center w-full">
          <Button
            variant={row.url_kuisioner ? "text_blue" : "solid_blue"}
            label={row.url_kuisioner ? "Lihat PDF" : "Edit PDF"}
            onClick={() => {
              if (row.url_kuisioner) {
                const w = window.open(
                  String(row.url_kuisioner),
                  "_blank",
                  "noopener,noreferrer"
                );
                if (w) w.opener = null;
              } else {
                onOpenModal(Number(row.id));
              }
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTableMui<VendorItem>
        columns={cols}
        data={filtered}
        striped
        pagination={{
          currentPage: page,
          itemsPerPage: ITEMS_PER_PAGE,
          total: filtered.length,
          onPageChange: setPage,
        }}
      />
      <Pagination
        currentPage={page}
        itemsPerPage={ITEMS_PER_PAGE}
        totalData={filtered.length}
        onPageChange={setPage}
      />
    </div>
  );
}
