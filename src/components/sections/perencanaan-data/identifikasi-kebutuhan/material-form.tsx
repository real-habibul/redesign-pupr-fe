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
  Material,
} from "../../../../types/perencanaan-data/identifikasi-kebutuhan";
import { KELOMPOK_MATERIAL_OPTIONS } from "@constants/perencanaan-data/identifikasi-kebutuhan";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import TextInput from "@components/ui/text-input";
import MUISelect from "@components/ui/select";
import Button from "@components/ui/button";
import {
  useMaterialsStore,
  useOrder,
  useMaterialField,
  useSetField,
  useRemoveRow,
} from "@store/perencanaan-data/identifikasi-kebutuhan/material-store";

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

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

type MaterialLike = Partial<Material> & Record<string, unknown>;
function getByIdMap(): Record<string, MaterialLike> {
  const state = useMaterialsStore.getState() as unknown as {
    byId: Record<string, MaterialLike>;
  };
  return state.byId ?? {};
}

function TextCell({
  id,
  field,
  label,
  placeholder,
  required,
  onBlurSyncFormik,
}: {
  id: string;
  field:
    | "nama_material"
    | "satuan"
    | "spesifikasi"
    | "ukuran"
    | "kodefikasi"
    | "jumlah_kebutuhan"
    | "merk";
  label: string;
  placeholder: string;
  required?: boolean;
  onBlurSyncFormik: (id: string, key: string) => void;
}) {
  const setField = useSetField();
  const value = useMaterialField(id, field);
  return (
    <TextInput
      label={label}
      value={String(value ?? "")}
      onChange={(e) => setField(id, field, e.target.value)}
      onBlur={() => onBlurSyncFormik(id, field)}
      placeholder={placeholder}
      isRequired={required}
    />
  );
}

export type Option = { value: string; label: string };

function KelompokCell({
  id,
  options,
  onBlurSyncFormik,
}: {
  id: string;
  options: Option[];
  onBlurSyncFormik: (id: string, key: string) => void;
}) {
  const setField = useSetField();
  const kelompok_material = useMaterialField(id, "kelompok_material");
  return (
    <MUISelect
      label="Kelompok Material"
      options={options}
      value={kelompok_material ? String(kelompok_material) : ""}
      onChange={(val: string) => {
        setField(id, "kelompok_material", val);
        onBlurSyncFormik(id, "kelompok_material");
      }}
      required
      placeholder="Pilih Kelompok Material"
    />
  );
}

function ProvCell({
  id,
  provOptions,
  onBlurSyncFormik,
  resetCity = true,
}: {
  id: string;
  provOptions: Option[];
  onBlurSyncFormik: (id: string, key: string) => void;
  resetCity?: boolean;
}) {
  const setField = useSetField();
  const provincies_id = useMaterialField(id, "provincies_id");
  return (
    <MUISelect
      label="Provinsi"
      options={provOptions}
      value={provincies_id ? String(provincies_id) : ""}
      onChange={(val: string) => {
        setField(id, "provincies_id", val);
        if (resetCity) setField(id, "cities_id", "");
        onBlurSyncFormik(id, "provincies_id");
        onBlurSyncFormik(id, "cities_id");
      }}
      required
      placeholder="Pilih Provinsi"
    />
  );
}

function CityCell({
  id,
  getCityOptions,
  onBlurSyncFormik,
}: {
  id: string;
  getCityOptions: (prov: string | number | "") => Option[];
  onBlurSyncFormik: (id: string, key: string) => void;
}) {
  const setField = useSetField();
  const provincies_id = useMaterialField(id, "provincies_id");
  const cities_id = useMaterialField(id, "cities_id");

  const normalizedProvId: string | number | "" =
    typeof provincies_id === "string" || typeof provincies_id === "number"
      ? provincies_id
      : "";

  const cityOptions = useMemo(
    () => getCityOptions(normalizedProvId),
    [getCityOptions, normalizedProvId]
  );

  return (
    <MUISelect
      key={`city-${id}-${String(provincies_id ?? "")}`}
      label="Kota"
      options={cityOptions}
      value={cities_id ? String(cities_id) : ""}
      onChange={(val: string) => {
        setField(id, "cities_id", val);
        onBlurSyncFormik(id, "cities_id");
      }}
      required
      placeholder="Pilih Kota"
    />
  );
}

function AksiCell({ id }: { id: string }) {
  const remove = useRemoveRow();
  return (
    <div className="text-center">
      <Button
        type="button"
        variant="text_red"
        label="Hapus"
        onClick={() => remove(id)}
      />
    </div>
  );
}

export default function MaterialForm({
  values,
  setFieldValue,
  provincesOptions,
  query,
  filterKeys,
}: Props) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const order = useOrder();
  const bulkInit = useMaterialsStore((s) => s.bulkInit);

  useEffect(() => {
    const mats = (values.materials ?? []) as unknown as Material[];
    bulkInit(mats);
  }, [bulkInit, values.materials]);

  const handlePageChange = useCallback(
    (p: number) => startTransition(() => setCurrentPage(p)),
    []
  );

  const debouncedQuery = useDebounced(query, 250);
  const deferredQuery = useDeferredValue(debouncedQuery);
  const qLower = (deferredQuery ?? "").trim().toLowerCase();

  const kelompokOptions: Option[] = useMemo(
    () =>
      KELOMPOK_MATERIAL_OPTIONS.map((o) => ({
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

    const readsAll = (it: MaterialLike) => {
      const cols = [
        "nama_material",
        "satuan",
        "spesifikasi",
        "ukuran",
        "kodefikasi",
        "kelompok_material",
        "jumlah_kebutuhan",
        "merk",
        "provincies_id",
        "cities_id",
      ] as const;

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

    const readsKeys = (it: MaterialLike) => {
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
      const path = `materials.${idx}.${key}`;
      const byId = getByIdMap();
      const row = byId[id] as Record<string, unknown> | undefined;
      const val = row ? row[key] : undefined;
      setFieldValue(path, val);
    },
    [indexById, setFieldValue]
  );

  type RowData = { id: string };
  const data: RowData[] = useMemo(
    () => visibleIds.map((id) => ({ id })),
    [visibleIds]
  );

  const columns: ColumnDef<RowData>[] = useMemo(
    () => [
      {
        key: "nama_material",
        header: "Nama Material",
        cell: (row) => (
          <TextCell
            id={row.id}
            field="nama_material"
            label="Nama Material"
            placeholder="Masukkan Nama Material"
            required
            onBlurSyncFormik={onBlurSyncFormik}
          />
        ),
      },
      {
        key: "satuan",
        header: "Satuan",
        cell: (row) => (
          <TextCell
            id={row.id}
            field="satuan"
            label="Satuan"
            placeholder="Masukkan Satuan"
            required
            onBlurSyncFormik={onBlurSyncFormik}
          />
        ),
      },
      {
        key: "spesifikasi",
        header: "Spesifikasi",
        cell: (row) => (
          <TextCell
            id={row.id}
            field="spesifikasi"
            label="Spesifikasi"
            placeholder="Masukkan Spesifikasi"
            required
            onBlurSyncFormik={onBlurSyncFormik}
          />
        ),
      },
      {
        key: "ukuran",
        header: "Ukuran",
        cell: (row) => (
          <TextCell
            id={row.id}
            field="ukuran"
            label="Ukuran"
            placeholder="Masukkan Ukuran"
            required
            onBlurSyncFormik={onBlurSyncFormik}
          />
        ),
      },
      {
        key: "kodefikasi",
        header: "Kodefikasi",
        cell: (row) => (
          <TextCell
            id={row.id}
            field="kodefikasi"
            label="Kodefikasi"
            placeholder="Masukkan Kodefikasi"
            required
            onBlurSyncFormik={onBlurSyncFormik}
          />
        ),
      },
      {
        key: "kelompok_material",
        header: "Kelompok Material",
        cell: (row) => (
          <KelompokCell
            id={row.id}
            options={kelompokOptions}
            onBlurSyncFormik={onBlurSyncFormik}
          />
        ),
      },
      {
        key: "jumlah_kebutuhan",
        header: "Jumlah Kebutuhan",
        cell: (row) => (
          <TextCell
            id={row.id}
            field="jumlah_kebutuhan"
            label="Jumlah Kebutuhan"
            placeholder="Masukkan Jumlah Kebutuhan"
            required
            onBlurSyncFormik={onBlurSyncFormik}
          />
        ),
      },
      {
        key: "merk",
        header: "Merk",
        cell: (row) => (
          <TextCell
            id={row.id}
            field="merk"
            label="Merk"
            placeholder="Masukkan Merk"
            required
            onBlurSyncFormik={onBlurSyncFormik}
          />
        ),
      },
      {
        key: "provincies_id",
        header: "Provinsi",
        cell: (row) => (
          <ProvCell
            id={row.id}
            provOptions={provOptions}
            onBlurSyncFormik={onBlurSyncFormik}
          />
        ),
      },
      {
        key: "cities_id",
        header: "Kota",
        cell: (row) => (
          <CityCell
            id={row.id}
            getCityOptions={getCityOptions}
            onBlurSyncFormik={onBlurSyncFormik}
          />
        ),
      },
      {
        key: "aksi",
        header: "Aksi",
        className: "text-center",
        cell: (row) => <AksiCell id={row.id} />,
      },
    ],
    [onBlurSyncFormik, kelompokOptions, provOptions, getCityOptions]
  );

  return (
    <div className="rounded-[16px] overflow-visible">
      <DataTableMui
        columns={columns}
        data={data}
        emptyMessage="Data tidak ditemukan"
        striped
        stickyHeader
        containerClassName=""
        paperClassName=""
        tableClassName="min-w-max"
        headerRowClassName="bg-solid_basic_blue_100 text-emphasis_light_on_surface_high"
        pagination={{
          currentPage,
          itemsPerPage,
          total: totalFiltered,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}
