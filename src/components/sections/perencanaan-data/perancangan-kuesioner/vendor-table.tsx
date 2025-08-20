"use client";

import * as React from "react";
import { useMemo, useState, useEffect, useCallback } from "react";

import TextInput from "@components/ui/text-input";
import Button from "@components/ui/button";
import SearchBox from "@components/ui/searchbox";
import Pagination from "@components/ui/pagination";

import type { VendorItem } from "../../../../types/perencanaan-data/perancangan-kuesioner";
import { useTahap4FiltersStore } from "../../../../store/perencanaan-data/perancangan-kuesioner/store";

type Props = {
  vendors: VendorItem[];
  onOpenModal: (id: number) => void;
  onBlurSyncFormik?: (id: string, key: string) => void;
  onChangeRow?: (next: VendorItem) => void;
  onRemoveRow?: (id: number | string) => void;
};

const ITEMS_PER_PAGE = 10;

export default function VendorTable({
  vendors,
  onOpenModal,
  onBlurSyncFormik = () => {},
  onChangeRow,
  onRemoveRow,
}: Props) {
  const { vendorFilters, setVendorFilters } = useTahap4FiltersStore();

  const [rows, setRows] = useState<VendorItem[]>(vendors ?? []);
  useEffect(() => {
    setRows(vendors ?? []);
  }, [vendors]);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const baseOptions = useMemo(
    () => [
      { label: "Responden/Vendor", value: "nama_vendor" },
      { label: "Pemilik Vendor", value: "pemilik_vendor" },
      { label: "Alamat", value: "alamat" },
      { label: "Kontak", value: "kontak" },
    ],
    []
  );

  const [sbOptions, setSbOptions] = useState(
    baseOptions.map((o) => ({ label: o.label, value: o.value, checked: false }))
  );

  useEffect(() => {
    setSbOptions((prev) =>
      prev.map((o) => ({
        ...o,
        checked: vendorFilters.includes(String(o.value)),
      }))
    );
  }, [vendorFilters]);

  useEffect(() => {
    setSbOptions(
      baseOptions.map((o) => ({
        label: o.label,
        value: o.value,
        checked: vendorFilters.includes(String(o.value)),
      }))
    );
  }, [baseOptions]);

  const applyFiltersToStore = useCallback(
    (opts: { label: string; value?: string | number; checked: boolean }[]) => {
      setSbOptions(opts as any);
      const active = opts
        .filter((f) => f.checked)
        .map((f) => String(f.value ?? ""));
      setVendorFilters(active);
    },
    [setVendorFilters]
  );

  useEffect(() => {
    setPage(1);
  }, [query, vendorFilters]);

  const lower = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    const list = rows;
    if (!lower) return list;

    if (vendorFilters.length === 0) {
      return list.filter((row) =>
        Object.values(row).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(lower)
        )
      );
    }

    return list.filter((row) =>
      vendorFilters.some((key) =>
        String((row as any)[key] ?? "")
          .toLowerCase()
          .includes(lower)
      )
    );
  }, [rows, lower, vendorFilters]);

  const paged = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const updateCell = (
    id: number | string,
    key: keyof VendorItem,
    value: any
  ) => {
    setRows((prev) => {
      const next = prev.map((r) =>
        String(r.id) === String(id) ? { ...r, [key]: value } : r
      );
      const changed = next.find((r) => String(r.id) === String(id));
      if (changed && onChangeRow) onChangeRow(changed);
      return next;
    });
  };

  const removeRow = (id: number | string) => {
    setRows((prev) => prev.filter((r) => String(r.id) !== String(id)));
    onRemoveRow?.(id);
  };

  return (
    <div className="space-y-4">
      <SearchBox
        placeholder="Cari Vendor..."
        onSearch={setQuery}
        withFilter
        filterOptions={sbOptions}
        onFilterClick={applyFiltersToStore}
        onApplyFilters={applyFiltersToStore}
      />

      <div className="rounded-[16px] overflow-hidden border border-gray-200">
        <table className="w-full min-w-max table-fixed">
          <thead>
            <tr
              className="uppercase tracking-wider text-left"
              style={{ backgroundColor: "var(--color-solid-basic-blue-100)" }}>
              <th className="px-3 py-6 w-[64px] text-center">No</th>
              <th className="px-3 py-6 w-[252px]">Responden/Vendor</th>
              <th className="px-3 py-6 w-[260px]">Pemilik Vendor</th>
              <th className="px-3 py-6 w-[340px]">Alamat</th>
              <th className="px-3 py-6 w-[200px]">Kontak</th>
              <th className="px-3 py-6 w-[300px] text-center">
                Rancangan Kuesioner
              </th>
              <th className="px-3 py-6 w-[120px] text-center">Aksi</th>
            </tr>
          </thead>

          <tbody
            style={{
              backgroundColor: "var(--color-surface-light-background)",
            }}>
            {paged.length === 0 && (
              <tr>
                <td
                  className="px-3 py-6 text-center text-emphasis-on_surface-medium"
                  colSpan={7}>
                  Data tidak ditemukan
                </td>
              </tr>
            )}

            {paged.map((row, idx) => {
              const rowNumber = (page - 1) * ITEMS_PER_PAGE + (idx + 1);
              return (
                <tr key={String(row.id)}>
                  <td className="px-3 py-6 text-center">{rowNumber}</td>

                  <td className="px-3 py-6">
                    <TextInput
                      label="Responden/Vendor"
                      value={String(row.nama_vendor ?? "")}
                      onChange={(e) =>
                        updateCell(row.id, "nama_vendor", e.target.value)
                      }
                      onBlur={() =>
                        onBlurSyncFormik(String(row.id), "nama_vendor")
                      }
                      placeholder="Masukkan Nama Vendor"
                      isRequired
                    />
                  </td>

                  <td className="px-3 py-6">
                    <TextInput
                      label="Pemilik Vendor"
                      value={String(row.pemilik_vendor ?? "")}
                      onChange={(e) =>
                        updateCell(row.id, "pemilik_vendor", e.target.value)
                      }
                      onBlur={() =>
                        onBlurSyncFormik(String(row.id), "pemilik_vendor")
                      }
                      placeholder="Masukkan Pemilik Vendor"
                      isRequired
                    />
                  </td>

                  <td className="px-3 py-6">
                    <TextInput
                      label="Alamat"
                      value={String(row.alamat ?? "")}
                      onChange={(e) =>
                        updateCell(row.id, "alamat", e.target.value)
                      }
                      onBlur={() => onBlurSyncFormik(String(row.id), "alamat")}
                      placeholder="Masukkan Alamat"
                      isRequired
                    />
                  </td>

                  <td className="px-3 py-6">
                    <TextInput
                      label="Kontak"
                      value={String(row.kontak ?? "")}
                      onChange={(e) =>
                        updateCell(row.id, "kontak", e.target.value)
                      }
                      onBlur={() => onBlurSyncFormik(String(row.id), "kontak")}
                      placeholder="Masukkan Kontak"
                      isRequired
                    />
                  </td>

                  <td className="px-3 py-6 text-center">
                    <td className="px-3 py-6 text-center">
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
                    </td>
                  </td>

                  <td className="px-3 py-6 text-center">
                    <Button
                      type="button"
                      variant="text_red"
                      label="Hapus"
                      onClick={() => removeRow(row.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        itemsPerPage={ITEMS_PER_PAGE}
        totalData={filtered.length}
        onPageChange={setPage}
      />
    </div>
  );
}
