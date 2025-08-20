export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.101.25.95:8000/api";
// process.env.NEXT_PUBLIC_API_BASE_URL ||
// "https://api-ecatalogue-staging.online/api";

export const ENDPOINTS = {
  // Informasi Umum
  getBalaiKerja: "/get-balai-kerja",
  getInformasiUmum: (id: string | number) =>
    `/perencanaan-data/informasi-umum/${id}`,
  storeInformasiUmum: "/perencanaan-data/store-informasi-umum",

  // Identifikasi Kebutuhan
  provincesAndCities: "/provinces-and-cities",
  getIdentifikasiKebutuhan: (id: string | number) =>
    `/perencanaan-data/get-identifikasi-kebutuhan/${id}`,
  storeIdentifikasiKebutuhan: "/perencanaan-data/store-identifikasi-kebutuhan",
} as const;
