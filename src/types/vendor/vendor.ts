export type VendorPayload = {
  nama_vendor: string;
  jenis_vendor_id: number[];
  kategori_vendor_id: number[];
  alamat: string;
  no_telepon: string;
  no_hp: string;
  sumber_daya: string;
  nama_pic: string;
  provinsi_id: string;
  kota_id: string;
  koordinat: string;
  logo_url?: File | null;
  dok_pendukung_url?: File | null;
};

export type SaveVendorResponse = {
  status?: string;
  message?: string;
};
