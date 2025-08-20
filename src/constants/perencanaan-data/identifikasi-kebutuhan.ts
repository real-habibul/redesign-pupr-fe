import type {
  Material,
  Peralatan,
  TenagaKerja,
  Option,
} from "../../types/perencanaan-data/identifikasi-kebutuhan";

export const NUMBER_OF_STEPS = 4;

export const STEP_LABELS = [
  "Informasi Umum",
  "Identifikasi Kebutuhan",
  "Penentuan Shortlist Vendor",
  "Perancangan Kuesioner",
];

export const KELOMPOK_MATERIAL_OPTIONS: Option[] = [
  { value: "Bahan Baku", label: "Bahan Baku" },
  { value: "Bahan Olahan", label: "Bahan Olahan" },
  { value: "Bahan Jadi", label: "Bahan Jadi" },
];

export const KELOMPOK_PERALATAN_OPTIONS: Option[] = [
  { value: "Mekanis", label: "Mekanis" },
  { value: "Semi Mekanis", label: "Semi Mekanis" },
];

export const EMPTY_MATERIAL: Material = {
  nama_material: "",
  satuan: "",
  spesifikasi: "",
  ukuran: "",
  kodefikasi: "",
  kelompok_material: "",
  jumlah_kebutuhan: "",
  merk: "",
  provincies_id: "",
  cities_id: "",
};

export const EMPTY_PERALATAN: Peralatan = {
  nama_peralatan: "",
  satuan: "",
  spesifikasi: "",
  kapasitas: "",
  kodefikasi: "",
  kelompok_peralatan: "",
  jumlah_kebutuhan: "",
  merk: "",
  provincies_id: "",
  cities_id: "",
};

export const EMPTY_TENAGA_KERJA: TenagaKerja = {
  jenis_tenaga_kerja: "",
  satuan: "",
  jumlah_kebutuhan: "",
  kodefikasi: "",
  provincies_id: "",
  cities_id: "",
};
