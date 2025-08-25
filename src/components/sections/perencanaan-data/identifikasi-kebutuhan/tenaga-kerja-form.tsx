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
  City,
  TenagaKerja,
} from "../../../../types/perencanaan-data/identifikasi-kebutuhan";
import Pagination from "@components/ui/pagination";
import TenagaKerjaRow, { Option } from "./tenaga-kerja-row";
import {
  useTenagaStore,
  useTenagaOrder,
} from "@store/perencanaan-data/identifikasi-kebutuhan/tenaga-kerja-store";

type SetFieldValue = (
  field: string,
  value: unknown,
  shouldValidate?: boolean
) => void;

type Props = {
  values: IdentifikasiKebutuhanFormValues;
  setFieldValue: SetFieldValue;
  provincesOptions?: ProvinceOption[];
  query: string;
  filterKeys: string[];
};

const TENAGA_PATH = "tenagaKerjas";

// Representasi aman untuk objek Tenaga Kerja di store (boleh partial + field UI)
type TenagaLike = Partial<TenagaKerja> & Record<string, unknown>;

// Ambil byId dari store dengan tipe aman
function getByIdMap(): Record<string, TenagaLike> {
  const state = useTenagaStore.getState() as unknown as {
    byId: Record<string, TenagaLike>;
  };
  return state.byId ?? {};
}

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function TenagaKerjaForm({
  values,
  setFieldValue,
  provincesOptions,
  query,
  filterKeys,
}: Props) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const order = useTenagaOrder();
  const bulkInit = useTenagaStore((s) => s.bulkInit);

  const tenagaArr = useMemo(
    () => (values.tenagaKerjas ?? []) as TenagaKerja[],
    [values.tenagaKerjas]
  );

  useEffect(() => {
    bulkInit(tenagaArr);
  }, [bulkInit, tenagaArr]);

  const handlePageChange = useCallback(
    (p: number) => startTransition(() => setCurrentPage(p)),
    []
  );

  const debouncedQuery = useDebounced(query, 250);
  const deferredQuery = useDeferredValue(debouncedQuery);
  const qLower = (deferredQuery ?? "").trim().toLowerCase();

  const provOptionsFull = useMemo(
    () =>
      (provincesOptions ?? []).map((p) => ({
        value: String(p.value),
        label: p.label,
        cities: (p.cities ?? []) as City[],
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
      const cities = (sp?.cities ?? []) as City[];
      return cities.map(
        (c): Option => ({
          value: String(c.cities_id),
          label: c.cities_name,
        })
      );
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
    const byId = getByIdMap();
    if (!qLower && !filterKeys?.length) return order;

    const keys = filterKeys ?? [];
    const res: string[] = [];

    const cols = [
      "jenis_tenaga_kerja",
      "satuan",
      "jumlah_kebutuhan",
      "kodefikasi",
      "provincies_id",
      "cities_id",
    ] as const;

    const readsAll = (it: TenagaLike) => {
      for (let i = 0; i < cols.length; i++) {
        const k = cols[i];
        let v: string;
        if (k === "provincies_id") {
          v = provIdToName[String(it?.provincies_id ?? "")] ?? "";
        } else if (k === "cities_id") {
          v = cityIdToName[String(it?.cities_id ?? "")] ?? "";
        } else {
          const raw = (it as Record<string, unknown>)[k];
          v = typeof raw === "string" ? raw : String(raw ?? "");
        }
        if (v.toLowerCase().includes(qLower)) return true;
      }
      return false;
    };

    const readsKeys = (it: TenagaLike) => {
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i]!;
        let v: string;
        if (k === "provincies_id") {
          v = provIdToName[String(it?.provincies_id ?? "")] ?? "";
        } else if (k === "cities_id") {
          v = cityIdToName[String(it?.cities_id ?? "")] ?? "";
        } else {
          const raw = (it as Record<string, unknown>)[k];
          v = typeof raw === "string" ? raw : String(raw ?? "");
        }
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
      const path = `${TENAGA_PATH}.${idx}.${key}`;
      const byId = getByIdMap();
      const row = byId[id] as Record<string, unknown> | undefined;
      const val = row ? row[key] : undefined;
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
                  "Jenis Tenaga Kerja",
                  "Satuan",
                  "Jumlah Kebutuhan",
                  "Kodefikasi",
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
                <TenagaKerjaRow
                  key={id}
                  id={id}
                  rowNumber={start + i + 1}
                  provOptions={provOptions}
                  getCityOptions={getCityOptions}
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
