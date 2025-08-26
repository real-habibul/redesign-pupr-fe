import { http } from "@lib/api/https";
import type {
  PerencanaanResult,
  VendorDetail,
  ID,
} from "../../../types/perencanaan-data/perancangan-kuesioner";

export async function fetchPerencanaanData(informasiUmumId: string) {
  const { data } = await http.get<{ data: PerencanaanResult }>(
    `/perencanaan-data/perencanaan-data-result`,
    { params: { id: informasiUmumId } }
  );
  return data.data;
}

export async function fetchVendorDetail(vendorId: ID, informasiUmumId: string) {
  const { data } = await http.get<{ data: VendorDetail }>(
    `/perencanaan-data/shortlist-detail-identifikasi`,
    { params: { id: vendorId, informasi_umum_id: informasiUmumId } }
  );
  return data.data;
}

export async function adjustIdentifikasiKebutuhan(payload: {
  id_vendor: number;
  shortlist_vendor_id: number | null;
  material: Array<{ id: ID }>;
  peralatan: Array<{ id: ID }>;
  tenaga_kerja: Array<{ id: ID }>;
}) {
  const { data } = await http.post(
    `/perencanaan-data/adjust-identifikasi-kebutuhan`,
    payload
  );
  return data;
}

export async function savePerencanaanData(informasiUmumId: string) {
  const { data } = await http.post(
    `/perencanaan-data/save-perencanaan-data/${informasiUmumId}`,
    {}
  );
  return data;
}
