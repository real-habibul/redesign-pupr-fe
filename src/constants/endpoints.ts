export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api-ecatalogue-staging.online/api";

export const ENDPOINTS = {
  getBalaiKerja: "/get-balai-kerja",
  getInformasiUmum: (id: string) =>
    `/perencanaan-data/informasi-umum/${id}`,
  storeInformasiUmum: "/perencanaan-data/store-informasi-umum",
};