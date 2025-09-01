export type ActionType = "save" | "draft";

export type MaterialRowRO = {
  id: number | string;
  nama_material: string;
  satuan: string;
  spesifikasi: string;
  ukuran: string;
  kodefikasi: string;
  kelompok_material: string;
  jumlah_kebutuhan: string | number;
  merk: string;
  provincies_id: string | number;
  cities_id: string | number;
};

export type MaterialEditable = {
  id?: number | string;
  satuan_setempat?: string;
  satuan_setempat_panjang?: string;
  satuan_setempat_lebar?: string;
  satuan_setempat_tinggi?: string;
  konversi_satuan_setempat?: string;
  harga_satuan_setempat?: string;
  harga_konversi_satuan_setempat?: string;
  harga_khusus?: string;
  keterangan?: string;
};

export type PeralatanRowRO = {
  id: number | string;
  nama_peralatan: string;
  satuan: string;
  spesifikasi: string;
  kapasitas: string;
  kodefikasi: string;
  kelompok_peralatan: string;
  jumlah_kebutuhan: string | number;
  merk: string;
  provincies_id: string | number;
  cities_id: string | number;
};

export type PeralatanEditable = {
  id?: number | string;
  satuan_setempat?: string;
  harga_sewa_satuan_setempat?: string;
  harga_sewa_konversi?: string;
  harga_pokok?: string;
  keterangan?: string;
};

export type TenagaKerjaRowRO = {
  id: number | string;
  jenis_tenaga_kerja: string;
  satuan: string;
  jumlah_kebutuhan: string | number;
  kodefikasi: string;
  provincies_id: string | number;
  cities_id: string | number;
};

export type TenagaKerjaEditable = {
  id?: number | string;
  harga_per_satuan_setempat?: string;
  harga_konversi_perjam?: string;
  keterangan?: string;
};

export type StoreInitialValues =
  import("@store/pengumpulan-data/survei-kuesioner/store").InitialValues;

type BaseForm = Omit<
  StoreInitialValues,
  | "user_id_petugas_lapangan"
  | "user_id_pengawas"
  | "nip_petugas_lapangan"
  | "nip_pengawas"
  | "nama_pemberi_informasi"
  | "material"
  | "peralatan"
  | "tenaga_kerja"
> & {
  user_id_petugas_lapangan: string;
  user_id_pengawas: string;
  nip_petugas_lapangan: string;
  nip_pengawas: string;
  nama_pemberi_informasi: string;
};

export interface FormValues extends BaseForm {
  tanggal_survei?: string;
  tanggal_pengawasan?: string;
  material: MaterialEditable[];
  peralatan: PeralatanEditable[];
  tenaga_kerja: TenagaKerjaEditable[];
}
