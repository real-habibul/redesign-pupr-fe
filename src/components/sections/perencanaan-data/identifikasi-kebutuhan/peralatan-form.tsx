"use client";
import * as React from "react";
import {
  useState,
  useMemo,
  useCallback,
  useDeferredValue,
  startTransition,
  useEffect,
} from "react";
import type {
  ProvinceOption,
  IdentifikasiKebutuhanFormValues,
} from "../../../../types/perencanaan-data/identifikasi-kebutuhan";
import { KELOMPOK_PERALATAN_OPTIONS } from "@constants/perencanaan-data/identifikasi-kebutuhan";
import Pagination from "@components/ui/pagination";
import PeralatanRow, {
  Option,
} from "@components/sections/perencanaan-data/identifikasi-kebutuhan/peralatan-row";
import {
  usePeralatanStore,
  usePeralatanOrder,
} from "@store/perencanaan-data/identifikasi-kebutuhan/peralatan-store";

type Props = {
  values: IdentifikasiKebutuhanFormValues;
  setFieldValue: (field: string, value: any) => void;
  provincesOptions?: ProvinceOption[];
  query: string;
  filterKeys: string[];
};

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function PeralatanForm({
  values,
  setFieldValue,
  provincesOptions,
  query,
  filterKeys,
}: Props) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const order = usePeralatanOrder();
  const bulkInit = usePeralatanStore((s) => s.bulkInit);

  useEffect(() => {
    bulkInit((values.peralatans as any[]) ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.peralatans?.length]);

  const handlePageChange = useCallback(
    (p: number) => startTransition(() => setCurrentPage(p)),
    []
  );

  const debouncedQuery = useDebounced(query, 250);
  const deferredQuery = useDeferredValue(debouncedQuery);
  const qLower = (deferredQuery ?? "").trim().toLowerCase();

  const kelompokOptions: Option[] = useMemo(
    () =>
      KELOMPOK_PERALATAN_OPTIONS.map((o) => ({
        label: o.label,
        value: String(o.value),
      })),
    []
  );

  const provOptionsFull = useMemo(
    () =>
      (provincesOptions ?? []).map((p) => ({
        value: String(p.value),
        label: p.label,
        cities: p.cities ?? [],
      })),
    [provincesOptions]
  );

  const provOptions: Option[] = useMemo(
    () => provOptionsFull.map((p) => ({ value: p.value, label: p.label })),
    [provOptionsFull]
  );

  const getCityOptions = useCallback(
    (provValue: string | number | "") => {
      const sp = provOptionsFull.find((p) => p.value === String(provValue));
      const cities = sp?.cities ?? [];
      return cities.map((c: any) => ({
        value: String(c.cities_id),
        label: c.cities_name,
      })) as Option[];
    },
    [provOptionsFull]
  );

  const provIdToName = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of provOptionsFull) m[p.value] = p.label;
    return m;
  }, [provOptionsFull]);

  const cityIdToName = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of provOptionsFull)
      for (const c of p.cities ?? []) m[String(c.cities_id)] = c.cities_name;
    return m;
  }, [provOptionsFull]);

  const filteredIds = useMemo(() => {
    const state = usePeralatanStore.getState();
    const byId = state.byId;
    if (!qLower && !filterKeys?.length) return order;
    const keys = filterKeys ?? [];
    const res: string[] = [];
    const readsAll = (it: any) => {
      const cols = [
        "nama_peralatan",
        "satuan",
        "spesifikasi",
        "kapasitas",
        "kodefikasi",
        "kelompok_peralatan",
        "jumlah_kebutuhan",
        "merk",
        "provincies_id",
        "cities_id",
      ];
      for (let i = 0; i < cols.length; i++) {
        const k = cols[i];
        let v: string;
        if (k === "provincies_id")
          v = provIdToName[String(it?.provincies_id ?? "")] ?? "";
        else if (k === "cities_id")
          v = cityIdToName[String(it?.cities_id ?? "")] ?? "";
        else v = String(it?.[k] ?? "");
        if (v.toLowerCase().includes(qLower)) return true;
      }
      return false;
    };
    const readsKeys = (it: any) => {
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        let v: string;
        if (k === "provincies_id")
          v = provIdToName[String(it?.provincies_id ?? "")] ?? "";
        else if (k === "cities_id")
          v = cityIdToName[String(it?.cities_id ?? "")] ?? "";
        else v = String(it?.[k] ?? "");
        if (v.toLowerCase().includes(qLower)) return true;
      }
      return false;
    };
    for (const id of order) {
      const it = byId[id];
      if (!it) continue;
      if (!keys.length ? readsAll(it) : readsKeys(it)) res.push(id);
    }
    return res;
  }, [order, qLower, filterKeys, provIdToName, cityIdToName]);

  const totalFiltered = filteredIds.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleIds = filteredIds.slice(start, end);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [qLower, filterKeys]);

  const indexById = useMemo(() => {
    const map: Record<string, number> = {};
    order.forEach((id, i) => (map[id] = i));
    return map;
  }, [order]);

  const onBlurSyncFormik = useCallback(
    (id: string, key: string) => {
      const idx = indexById[id];
      if (idx === undefined) return;
      const path = `peralatans.${idx}.${key}`;
      const val = (usePeralatanStore.getState().byId[id] as any)?.[key];
      setFieldValue(path, val);
    },
    [indexById, setFieldValue]
  );

  return (
    <div className="rounded-[16px] overflow-visible">
      <div className="rounded-[16px] border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-auto w-full min-w-max">
            <thead>
              <tr className="bg-solid_basic_blue_100 text-left text-emphasis_light_on_surface_high uppercase tracking-wider">
                <th className="px-3 py-6 text-base font-normal">No</th>
                {[
                  "Nama Peralatan",
                  "Satuan",
                  "Spesifikasi",
                  "Kapasitas",
                  "Kodefikasi",
                  "Kelompok Peralatan",
                  "Jumlah Kebutuhan",
                  "Merk",
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
              {visibleIds.map((id, i) => (
                <PeralatanRow
                  key={id}
                  id={id}
                  rowNumber={start + i + 1}
                  provOptions={provOptions}
                  getCityOptions={getCityOptions}
                  kelompokOptions={kelompokOptions}
                  onBlurSyncFormik={onBlurSyncFormik}
                />
              ))}
              {visibleIds.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-emphasis_light_on_surface_medium"
                    colSpan={12}>
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
  );
}
