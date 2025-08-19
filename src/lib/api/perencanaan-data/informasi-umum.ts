import { http } from "../https";
import { ENDPOINTS } from "@constants/endpoints";
import type {
  ApiBalaiResponse,
  ApiBalaiItem,
  ApiInformasiUmumResponse,
  InformasiUmumData,
} from "../../../types/perencanaan-data/informasi-umum";

export async function getBalaiKerja(): Promise<ApiBalaiItem[]> {
  const { data } = await http.get<ApiBalaiResponse>(ENDPOINTS.getBalaiKerja);
  return data?.data ?? [];
}

export async function getInformasiUmum(
  id: string
): Promise<InformasiUmumData | null> {
  const { data } = await http.get<ApiInformasiUmumResponse>(
    ENDPOINTS.getInformasiUmum(id)
  );
  return data?.data ?? null;
}

export async function storeInformasiUmum(
  payload: Record<string, unknown>
): Promise<ApiInformasiUmumResponse> {
  const { data } = await http.post<ApiInformasiUmumResponse>(
    ENDPOINTS.storeInformasiUmum,
    payload
  );
  return data;
}
