import { http } from "@lib/api/https";
import { ENDPOINTS } from "@constants/endpoints";
import type { PengumpulanRow } from "../../../types/pengumpulan-data/pengumpulan-data";

export type TableListResponse = PengumpulanRow[];

export type GenerateLinkPayload = {
  url: string;
  expired_at?: string | null;
};

export type VendorRow = {
  shortlist_id: number;
  informasi_umum_id: number;
  nama_vendor: string;
  pic: string;
  alamat_vendor: string;
};

type ApiSuccess<T> = { status: "success"; message: string; data: T };

export type ShortlistId = string | number;
export type PaketId = string | number;

type GenerateLinkResponse =
  | ApiSuccess<string>
  | ApiSuccess<{ url: string; expired_at?: string | null }>
  | string
  | { url: string; expired_at?: string | null };

export async function getTableListPengumpulan() {
  const { data } = await http.get(ENDPOINTS.getTableListPengumpulan);
  const list = Array.isArray(data?.data) ? data.data : [];
  return list as PengumpulanRow[];
}

function normalizeGenerateLink(
  res: GenerateLinkResponse
): GenerateLinkPayload | null {
  if (typeof res === "string") {
    return { url: res, expired_at: null };
  }
  if ("url" in res) {
    return { url: res.url, expired_at: res.expired_at ?? null };
  }
  if (typeof res.data === "string") {
    return { url: res.data, expired_at: null };
  }
  if (res.data && "url" in res.data) {
    return { url: res.data.url, expired_at: res.data.expired_at ?? null };
  }
  return null;
}

export async function generateLinkPengumpulan(
  id: ShortlistId
): Promise<GenerateLinkPayload> {
  const url = ENDPOINTS.generateLinkPengumpulan(id);
  const r = await http.get<GenerateLinkResponse>(url, {
    params: { t: Date.now() },
  });
  const parsed = normalizeGenerateLink(r.data ?? r);
  if (parsed) return parsed;
  throw new Error("Unexpected response from generateLinkPengumpulan (GET)");
}

export async function getVendorsByPaket(
  paketId: PaketId
): Promise<VendorRow[]> {
  const { data } = await http.get<ApiSuccess<VendorRow[]>>(
    ENDPOINTS.getVendorsByPaket(paketId)
  );
  const list = Array.isArray(data?.data) ? data.data : [];
  return list as VendorRow[];
}
