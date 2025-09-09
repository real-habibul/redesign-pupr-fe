export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const ENDPOINTS = {
  getBalaiKerja: "/get-balai-kerja",
  getInformasiUmum: (id: string | number) =>
    `/perencanaan-data/informasi-umum/${id}`,
  storeInformasiUmum: "/perencanaan-data/store-informasi-umum",

  provincesAndCities: "/provinces-and-cities",
  getIdentifikasiKebutuhan: (id: string | number) =>
    `/perencanaan-data/get-identifikasi-kebutuhan/${id}`,
  storeIdentifikasiKebutuhan: "/perencanaan-data/store-identifikasi-kebutuhan",

  storeShortlistVendor: "/perencanaan-data/store-shortlist-vendor",
  getDataVendor: (id: string | number) =>
    `/perencanaan-data/get-data-vendor/${id}`,

  getPerencanaanList: "/perencanaan-data/table-list-prencanaan-data",
  
  // Public endpoints
  getPublicPerencanaanData: "/perencanaan-data",
  getPublicSettings: "/settings/public",
  getPublicProvincesAndCities: "/provinces-and-cities",

  getTableListPengumpulan: "/pengumpulan-data/table-list-pengumpulan",
  generateLinkPengumpulan: (id: string | number) =>
    `/pengumpulan-data/generate-link/${id}`,
  getVendorsByPaket: (id: string | number) =>
    `/pengumpulan-data/list-vendor-by-paket/${id}`,

  getSurveyByToken: "/survey-kuisioner/get-data-survey",
  listUserByRole: "/pengumpulan-data/list-user",
} as const;
