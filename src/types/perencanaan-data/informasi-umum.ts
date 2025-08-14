export type Id = string | number;

export type Option<T extends Id = number> = {
  value: T;
  label: string;
};

export type NumberOption = Option<number>;
export type StringOption  = Option<string>;

export interface ManualFormValues {
  kodeRup: string;
  namaBalai: NumberOption | null; 
  namaPaket: string;
  namaPpk: string;
  jabatanPpk: string;
}

export type SubmitType = "sipasti" | "manual";
export type Severity   = "success" | "error" | "warning" | "info";

export interface ApiBalaiItem {
  id: number;
  nama: string;
}

export interface ApiBalaiResponse {
  data?: ApiBalaiItem[];
}

export interface InformasiUmumData {
  id: number;
  kode_rup: string;
  nama_paket: string;
  nama_ppk: string;
  jabatan_ppk: string;
  nama_balai: string;
}

export interface ApiInformasiUmumResponse {
  data?: InformasiUmumData;
  status?: string;
  message?: string;
}
