import axios from "axios";
import type {
  ProvincesApiResponse,
  IdentifikasiKebutuhanApi,
  IdentifikasiKebutuhanFormValues,
  StoreIdentifikasiResponse,
} from "../../../types/perencanaan-data/identifikasi_kebutuhan";

const http = axios.create({
  baseURL: "https://api-ecatalogue-staging.online",
});

export async function getProvincesAndCities() {
  const res = await http.get<ProvincesApiResponse>("/api/provinces-and-cities");
  return res.data;
}

export async function getIdentifikasiKebutuhan(id: string | number) {
  const res = await http.get<IdentifikasiKebutuhanApi>(
    `/api/perencanaan-data/get-identifikasi-kebutuhan/${id}`
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
    "/api/perencanaan-data/store-identifikasi-kebutuhan",
    payload
  );
  return res.data;
}
