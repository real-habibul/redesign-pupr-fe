import { http } from "@lib/api/https";
import { ENDPOINTS } from "@constants/endpoints";
import type { PengumpulanRow } from "../../../types/pengumpulan-data/pengumpulan-data";

export type TableListResponse = PengumpulanRow[];

export type GenerateLinkPayload = {
  url: string;
  expired_at: string;
};

export type VendorRow = {
  shortlist_id: number;
  informasi_umum_id: number;
  nama_vendor: string;
  pic: string;
  alamat_vendor: string;
};

type ApiSuccess<T> = {
  status: "success";
  message: string;
  data: T;
};

export async function getTableListPengumpulan() {
  const { data } = await http.get(ENDPOINTS.getTableListPengumpulan);
  const list = Array.isArray(data?.data) ? data.data : [];
  return list as PengumpulanRow[];
}

export async function generateLinkPengumpulan(
  id: string | number
): Promise<GenerateLinkPayload> {
  const url = ENDPOINTS.generateLinkPengumpulan(id);

  // 1) coba POST wrapped
  try {
    const r = await http.post<ApiSuccess<GenerateLinkPayload>>(url);
    if (r?.data?.data?.url && r.data.data.expired_at) return r.data.data;
  } catch {}

  // 2) coba POST unwrapped
  try {
    const r = await http.post<GenerateLinkPayload>(url);
    if (r?.data?.url && r.data.expired_at) return r.data;
  } catch {}

  // 3) fallback GET wrapped
  try {
    const r = await http.get<ApiSuccess<GenerateLinkPayload>>(url);
    if (r?.data?.data?.url && r.data.data.expired_at) return r.data.data;
  } catch {}

  // 4) fallback GET unwrapped
  const r = await http.get<GenerateLinkPayload>(url);
  if (r?.data?.url && r.data.expired_at) return r.data;

  throw new Error("Unexpected response from generateLinkPengumpulan");
}

export async function getVendorsByPaket(
  paketId: string | number
): Promise<VendorRow[]> {
  const { data } = await http.get<ApiSuccess<VendorRow[]>>(
    ENDPOINTS.getVendorsByPaket(paketId)
  );
  const list = Array.isArray(data?.data) ? data.data : [];
  return list as VendorRow[];
}
