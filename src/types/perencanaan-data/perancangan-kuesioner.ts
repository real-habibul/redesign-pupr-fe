export type ID = number | string;

export type FilterOption = {
  label: string;
  accessor: string;
  checked: boolean;
};

export type CommonInformation = {
  kode_rup: string;
  nama_balai: string;
  nama_paket: string;
  nama_ppk: string;
  jabatan_ppk: string;
  jenis_informasi?: string;
};

export type MaterialItem = {
  id: ID;
  nama_material: string;
  satuan: string;
  spesifikasi?: string;
  ukuran?: string;
  kodefikasi?: string;
  kelompok_material?: string;
  jumlah_kebutuhan?: number | string;
  merk?: string;
  provinsi?: string;
  kota?: string;
  [k: string]: unknown;
};

export type PeralatanItem = {
  id: ID;
  nama_peralatan: string;
  satuan: string;
  spesifikasi?: string;
  kapasitas?: string;
  kodefikasi?: string;
  kelompok_peralatan?: string;
  jumlah_kebutuhan?: number | string;
  merk?: string;
  provinsi?: string;
  kota?: string;
  [k: string]: unknown;
};

export type TenagaKerjaItem = {
  id: ID;
  jenis_tenaga_kerja: string;
  satuan: string;
  jumlah_kebutuhan?: number | string;
  kodefikasi?: string;
  provinsi?: string;
  kota?: string;
  [k: string]: unknown;
};

export type VendorItem = {
  id: ID;
  nama_vendor: string;
  pemilik_vendor?: string;
  alamat?: string;
  kontak?: string;
  url_kuisioner?: string | null;
};

export type PerencanaanResult = {
  informasi_umum: CommonInformation;
  material: MaterialItem[];
  peralatan: PeralatanItem[];
  tenaga_kerja: TenagaKerjaItem[];
  shortlist_vendor: VendorItem[];
};

export type VendorDetail = {
  id_vendor: ID;
  identifikasi_kebutuhan?: {
    material?: MaterialItem[];
    peralatan?: PeralatanItem[];
    tenaga_kerja?: TenagaKerjaItem[];
  };
};
