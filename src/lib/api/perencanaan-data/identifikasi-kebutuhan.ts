import { http } from "@lib/api/https";
import { ENDPOINTS } from "@constants/endpoints";
import type {
  ProvincesApiResponse,
  IdentifikasiKebutuhanApi,
  IdentifikasiKebutuhanFormValues,
  StoreIdentifikasiResponse,
} from "../../../types/perencanaan-data/identifikasi-kebutuhan";

export async function getProvincesAndCities() {
  const res = await http.get<ProvincesApiResponse>(
    ENDPOINTS.provincesAndCities
  );
  return res.data;
}

export async function getIdentifikasiKebutuhan(id: string | number) {
  const res = await http.get<IdentifikasiKebutuhanApi>(
    ENDPOINTS.getIdentifikasiKebutuhan(id)
  );
  return res.data;
}

export async function storeIdentifikasiKebutuhan(payload: {
  material: IdentifikasiKebutuhanFormValues["materials"];
  peralatan: IdentifikasiKebutuhanFormValues["peralatans"];
  tenaga_kerja: IdentifikasiKebutuhanFormValues["tenagaKerjas"];
  informasi_umum_id: string | number | null;
}) {
  const res = await http.post<StoreIdentifikasiResponse>(
    ENDPOINTS.storeIdentifikasiKebutuhan,
    payload
  );
  return res.data;
}
