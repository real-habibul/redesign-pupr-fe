export type Option<T = string | number> = {
  value: T;
  label: string;
};

export type City = {
  cities_id: number | string;
  cities_name: string;
};

export type ProvinceOption = Option<number | string> & {
  cities: City[];
};

export type Material = {
  nama_material: string;
  satuan: string;
  spesifikasi: string;
  ukuran: string;
  kodefikasi: string;
  kelompok_material: string;
  jumlah_kebutuhan: string;
  merk: string;
  provincies_id: number | string | "";
  cities_id: number | string | "";
};

export type Peralatan = {
  nama_peralatan: string;
  satuan: string;
  spesifikasi: string;
  kapasitas: string;
  kodefikasi: string;
  kelompok_peralatan: string;
  jumlah_kebutuhan: string;
  merk: string;
  provincies_id: number | string | "";
  cities_id: number | string | "";
};

export type TenagaKerja = {
  jenis_tenaga_kerja: string;
  satuan: string;
  jumlah_kebutuhan: string;
  kodefikasi: string;
  provincies_id: number | string | "";
  cities_id: number | string | "";
};

export type IdentifikasiKebutuhanFormValues = {
  materials: Material[];
  peralatans: Peralatan[];
  tenagaKerjas: TenagaKerja[];
};

export type Severity = "success" | "error" | "warning" | "info";

export type ProvincesApiResponse = {
  data: Array<{
    id_province: number | string;
    province_name: string;
    cities: City[];
  }>;
};

export type IdentifikasiKebutuhanApi = {
  data: {
    material: Material[];
    peralatan: Peralatan[];
    tenaga_kerja?: TenagaKerja[];
  };
  status?: string;
};

export type StoreIdentifikasiResponse = {
  status: "success" | "error";
  data?: {
    material?: Array<{ identifikasi_kebutuhan_id?: number | string }>;
  };
  message?: string;
};
