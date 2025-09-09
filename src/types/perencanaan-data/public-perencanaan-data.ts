export interface OrganizationSettings {
  name: string;
  type: string;
  region_code: string;
  logo_url: string;
}

export interface Province {
  id_province: string;
  province_name: string;
  cities: {
    cities_id: string;
    cities_name: string;
  }[];
}

export interface PublicPerencanaanDataItem {
  id: number;
  region_code: string;
  period_year: number;
  city_code: string;
  status: string;
  created_at: string;
  updated_at: string;
  informasi_umum?: {
    nama_paket: string;
    nama_ppk: string;
    nama_balai: string;
    jabatan_ppk?: string;
    kode_rup?: string;
  };
}

export interface PublicPerencanaanDataResponse {
  status: string;
  message: string;
  data: {
    data: PublicPerencanaanDataItem[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
  };
  filters: {
    region: string;
    period: string;
    city: string;
  };
}

export interface ApiOrganizationSettingsResponse {
  status: string;
  message: string;
  data: OrganizationSettings;
}

export interface ApiProvincesResponse {
  status: string;
  message: string;
  data: Province[];
}
