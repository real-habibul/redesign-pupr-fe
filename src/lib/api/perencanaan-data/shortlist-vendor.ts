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
  [k: string]: any;
};

export type StoreShortlistResponse = {
  status?: string;
  message?: string;
  shortlist_vendor_id?: number;
  data?: { shortlist_vendor: ShortlistRowFromApi[] };
};

function mapVendorRow(v: any): VendorItem {
  return {
    id: v?.data_vendor_id ?? v?.id,
    nama_vendor: v?.nama_vendor ?? "",
    pemilik_vendor: v?.pemilik_vendor ?? undefined,
    sumber_daya: v?.sumber_daya ?? undefined,
    alamat: v?.alamat ?? undefined,
    kontak: v?.kontak ?? undefined,
  };
}

export async function getVendorDataByIdentifikasiId(
  identifikasiId: string | number
): Promise<InitialValuesState> {
  const url = ENDPOINTS.getDataVendor(identifikasiId);
  console.log("[API][GET] getDataVendor url:", url);
  const res = await http.get<any>(url);
  console.log("[API][GET] status:", res.status);
  console.log("[API][GET] raw:", res.data);
  const src = res?.data?.data ?? res?.data ?? {};
  if (
    src &&
    (Array.isArray(src.material) ||
      Array.isArray(src.peralatan) ||
      Array.isArray(src.tenaga_kerja))
  ) {
    const out: InitialValuesState = {
      material: Array.isArray(src.material)
        ? src.material.map(mapVendorRow)
        : [],
      peralatan: Array.isArray(src.peralatan)
        ? src.peralatan.map(mapVendorRow)
        : [],
      tenaga_kerja: Array.isArray(src.tenaga_kerja)
        ? src.tenaga_kerja.map(mapVendorRow)
        : [],
    };
    console.log("[API][GET] normalized triple-array:", out);
    return out;
  }
  if (Array.isArray(src)) {
    const rows: VendorItem[] = src.map(mapVendorRow);
    console.log("[API][GET] normalized flat array length:", rows.length);
    return { material: rows, peralatan: rows, tenaga_kerja: rows };
  }
  console.warn("[API][GET] unrecognized payload shape:", src);
  return { material: [], peralatan: [], tenaga_kerja: [] };
}

export async function storeShortlistVendor(params: {
  identifikasi_kebutuhan_id: string | number;
  shortlist_vendor: ShortlistPayloadItem[];
}) {
  const url = ENDPOINTS.storeShortlistVendor;
  console.log("[API][POST] url:", url);
  console.log("[API][POST] payload:", JSON.stringify(params, null, 2));
  console.table(
    (params.shortlist_vendor ?? []).map((v) => ({
      data_vendor_id: v.data_vendor_id,
      nama_vendor: v.nama_vendor,
      pemilik_vendor: v.pemilik_vendor,
      sumber_daya: v.sumber_daya,
    }))
  );
  const res = await http.post<StoreShortlistResponse>(url, params);
  console.log("[API][POST] status:", res.status);
  console.log("[API][POST] response:", res.data);
  return res.data;
}
