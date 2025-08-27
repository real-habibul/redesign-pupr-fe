import { http } from "@lib/api/https";
import type {
  PerencanaanResult,
  VendorDetail,
  ID,
} from "../../../types/perencanaan-data/perancangan-kuesioner";

export async function fetchPerencanaanData(informasiUmumId: string) {
  console.log("[API] fetchPerencanaanData:start", { informasiUmumId });
  try {
    console.time("[API] fetchPerencanaanData");
    const { data } = await http.get<{ data: PerencanaanResult }>(
      `/perencanaan-data/perencanaan-data-result`,
      { params: { id: informasiUmumId } }
    );
    console.timeEnd("[API] fetchPerencanaanData");
    console.log("[API] fetchPerencanaanData:response", data);
    return data.data;
  } catch (e) {
    console.error("[API] fetchPerencanaanData:error", e, { informasiUmumId });
    throw e;
  }
}

export async function fetchVendorDetail(
  shortlistVendorId: ID,
  informasiUmumId: string
) {
  console.log("[API] fetchVendorDetail:start", {
    shortlistVendorId,
    informasiUmumId,
  });
  if (shortlistVendorId == null)
    throw new Error("shortlistVendorId is required");
  if (!informasiUmumId) throw new Error("informasiUmumId is required");
  try {
    console.time("[API] fetchVendorDetail");
    const { data } = await http.get<{ data: VendorDetail }>(
      `/perencanaan-data/shortlist-detail-identifikasi`,
      {
        params: {
          shortlist_vendor_id: String(shortlistVendorId),
          informasi_umum_id: String(informasiUmumId),
        },
      }
    );
    console.timeEnd("[API] fetchVendorDetail");
    console.log("[API] fetchVendorDetail:response", data);
    return data.data;
  } catch (e) {
    console.error("[API] fetchVendorDetail:error", e, {
      shortlistVendorId,
      informasiUmumId,
    });
    throw e;
  }
}

export async function adjustIdentifikasiKebutuhan(payload: {
  id_vendor: number;
  shortlist_vendor_id: number | null;
  material: Array<{ id: ID }>;
  peralatan: Array<{ id: ID }>;
  tenaga_kerja: Array<{ id: ID }>;
}) {
  console.log("[API] adjustIdentifikasiKebutuhan:start", payload);
  try {
    console.time("[API] adjustIdentifikasiKebutuhan");
    const { data } = await http.post(
      `/perencanaan-data/adjust-identifikasi-kebutuhan`,
      payload
    );
    console.timeEnd("[API] adjustIdentifikasiKebutuhan");
    console.log("[API] adjustIdentifikasiKebutuhan:response", data);
    return data;
  } catch (e) {
    console.error("[API] adjustIdentifikasiKebutuhan:error", e, payload);
    throw e;
  }
}

export async function savePerencanaanData(informasiUmumId: string) {
  console.log("[API] savePerencanaanData:start", { informasiUmumId });
  try {
    console.time("[API] savePerencanaanData");
    const { data } = await http.post(
      `/perencanaan-data/save-perencanaan-data/${informasiUmumId}`,
      {}
    );
    console.timeEnd("[API] savePerencanaanData");
    console.log("[API] savePerencanaanData:response", data);
    return data;
  } catch (e) {
    console.error("[API] savePerencanaanData:error", e, { informasiUmumId });
    throw e;
  }
}
