import { http } from "@lib/api/https";
import { ENDPOINTS } from "@constants/endpoints";
import type { ManualFormValues } from "../types/perencanaan-data/informasi-umum";

export type ApiSubmitResponse = {
  status: "success" | "error";
  message?: string;
  data?: { id: number | string };
};

export async function submitInformasiUmum(
  values: ManualFormValues
): Promise<ApiSubmitResponse> {
  const payload = {
    tipe_informasi_umum: "manual",
    kode_rup: values.kodeRup,
    nama_paket: values.namaPaket,
    nama_ppk: values.namaPpk,
    jabatan_ppk: values.jabatanPpk,
    nama_balai: values.namaBalai?.value ?? 0,
  };

   const { data } = await http.post<ApiSubmitResponse>(
    ENDPOINTS.storeInformasiUmum,
    payload
  );
  return data;
}
