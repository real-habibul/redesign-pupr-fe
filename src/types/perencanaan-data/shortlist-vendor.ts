export type VendorId = number | string;

export type VendorItem = {
  id: VendorId;
  nama_vendor: string;
  pemilik_vendor?: string;
  sumber_daya?: string;
  alamat?: string;
  kontak?: string;
  [key: string]: unknown;
};

export type InitialValuesState = {
  material: VendorItem[];
  peralatan: VendorItem[];
  tenaga_kerja: VendorItem[];
};

export type ShortlistChoice = {
  value: VendorId;
  checked: boolean;
};

export type FormValues = {
  material: ShortlistChoice[];
  peralatan: ShortlistChoice[];
  tenaga_kerja: ShortlistChoice[];
};
