import { http } from "@lib/api/https";
import { ENDPOINTS } from "@constants/endpoints";
import type {
  PublicPerencanaanDataResponse,
  ApiOrganizationSettingsResponse,
  ApiProvincesResponse,
  OrganizationSettings,
  Province,
} from "../../../types/perencanaan-data/public-perencanaan-data";

interface GetPublicPerencanaanDataParams {
  region?: string;
  period?: string;
  city?: string;
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export async function getPublicPerencanaanData(
  params: GetPublicPerencanaanDataParams = {}
): Promise<PublicPerencanaanDataResponse> {
  const { data } = await http.get<PublicPerencanaanDataResponse>(
    ENDPOINTS.getPublicPerencanaanData,
    { params }
  );
  return data;
}

export async function getOrganizationSettings(): Promise<OrganizationSettings> {
  const { data } = await http.get<ApiOrganizationSettingsResponse>(
    ENDPOINTS.getPublicSettings
  );
  return data.data;
}

export async function getProvincesAndCities(): Promise<Province[]> {
  const { data } = await http.get<ApiProvincesResponse>(
    ENDPOINTS.getPublicProvincesAndCities
  );
  return data.data;
}

export async function exportPublicPerencanaanData(
  params: GetPublicPerencanaanDataParams = {}
): Promise<Blob> {
  const response = await http.get(
    `${ENDPOINTS.getPublicPerencanaanData}/export`,
    { 
      params,
      responseType: 'blob'
    }
  );
  return response.data;
}
