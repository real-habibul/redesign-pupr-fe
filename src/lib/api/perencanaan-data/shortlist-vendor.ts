import { http } from "@lib/api/https";
import { ENDPOINTS } from "@constants/endpoints";
import type {
  VendorItem,
  InitialValuesState,
} from "../../../types/perencanaan-data/shortlist-vendor";

export type ShortlistPayloadItem = {
  data_vendor_id: string | number;
  nama_vendor: string;
  pemilik_vendor?: string | null;
  sumber_daya?: string | null;
  alamat?: string | null;
  kontak?: string | null;
};

export type ShortlistRowFromApi = {
  id: number;
  data_vendor_id: number;
  shortlist_vendor_id?: number;
  nama_vendor: string;
  pemilik_vendor?: string | null;
  alamat?: string | null;
  kontak?: string | null;
  sumber_daya?: string | null;
  [k: string]: unknown;
};

export type StoreShortlistResponse = {
  status?: string;
  message?: string;
  shortlist_vendor_id?: number;
  data?: { shortlist_vendor: ShortlistRowFromApi[] };
};

type VendorSource = Partial<{
  id: number | string;
  data_vendor_id: number | string;
  nama_vendor: string;
  pemilik_vendor: string | null;
  alamat: string | null;
  kontak: string | null;
  sumber_daya: string | null;
}>;

function isObject(u: unknown): u is Record<string, unknown> {
  return !!u && typeof u === "object";
}

function getNestedData(u: unknown): unknown {
  if (isObject(u) && "data" in u) {
    const v = (u as { data?: unknown }).data;
    return typeof v === "undefined" ? u : v;
  }
  return u;
}

function pickArray(obj: unknown, key: string): VendorSource[] | undefined {
  if (!isObject(obj)) return undefined;
  const v = (obj as Record<string, unknown>)[key];
  return Array.isArray(v) ? (v as VendorSource[]) : undefined;
}

function mapVendorRow(v: unknown): VendorItem {
  const o = (isObject(v) ? (v as VendorSource) : {}) as VendorSource;
  const id = (o.data_vendor_id ?? o.id) as string | number | undefined;
  return {
    id: id ?? "",
    nama_vendor: o.nama_vendor ?? "",
    pemilik_vendor: o.pemilik_vendor ?? undefined,
    sumber_daya: o.sumber_daya ?? undefined,
    alamat: o.alamat ?? undefined,
    kontak: o.kontak ?? undefined,
  };
}

export async function getVendorDataByIdentifikasiId(
  identifikasiId: string | number
): Promise<InitialValuesState> {
  const url = ENDPOINTS.getDataVendor(identifikasiId);
  const res = await http.get<unknown>(url);
  const raw = res.data;
  const src = getNestedData(raw);

  const materialSrc = pickArray(src, "material");
  const peralatanSrc = pickArray(src, "peralatan");
  const tenagaSrc = pickArray(src, "tenaga_kerja");

  if (materialSrc || peralatanSrc || tenagaSrc) {
    return {
      material: (materialSrc ?? []).map(mapVendorRow),
      peralatan: (peralatanSrc ?? []).map(mapVendorRow),
      tenaga_kerja: (tenagaSrc ?? []).map(mapVendorRow),
    };
  }

  if (Array.isArray(src)) {
    const rows = (src as VendorSource[]).map(mapVendorRow);
    return { material: rows, peralatan: rows, tenaga_kerja: rows };
  }

  return { material: [], peralatan: [], tenaga_kerja: [] };
}

export async function storeShortlistVendor(params: {
  identifikasi_kebutuhan_id: string | number;
  shortlist_vendor: ShortlistPayloadItem[];
}) {
  const url = ENDPOINTS.storeShortlistVendor;
  const res = await http.post<StoreShortlistResponse>(url, params);
  return res.data;
}
