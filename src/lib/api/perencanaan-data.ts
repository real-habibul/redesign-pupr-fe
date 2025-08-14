import { api } from "./client";
import { ENDPOINTS } from "@constants/endpoints";
import type {
  ApiBalaiResponse,
  ApiInformasiUmumResponse,
} from "../../types/perencanaan-data/informasi-umum";

export function getBalaiKerja() {
  return api.get<ApiBalaiResponse>(ENDPOINTS.getBalaiKerja);
}

export function getInformasiUmum(id: string) {
  return api.get<ApiInformasiUmumResponse>(ENDPOINTS.getInformasiUmum(id));
}

export function storeInformasiUmum(payload: unknown) {
  return api.post<ApiInformasiUmumResponse>(
    ENDPOINTS.storeInformasiUmum,
    payload
  );
}