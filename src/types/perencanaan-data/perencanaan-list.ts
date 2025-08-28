export type PerencanaanRow = {
  id: number | string;
  nama_paket: string;
  nama_balai: string;
  nama_ppk: string;
  jabatan_ppk: string;
  kode_rup: string;
  status: string;
  [key: string]: unknown;
};

export type FilterOption = {
  label: string;
  accessor: keyof PerencanaanRow;
  checked: boolean;
};

export type ApiPerencanaanListResponse = {
  data: PerencanaanRow[];
};
