import { http } from "@lib/api/https";
import { ENDPOINTS } from "@constants/endpoints";
import type {
  ApiPerencanaanListResponse,
  PerencanaanRow,
} from "../../../types/perencanaan-data/perencanaan-list";

export async function getPerencanaanList(): Promise<PerencanaanRow[]> {
  const { data } = await http.get<ApiPerencanaanListResponse>(
    ENDPOINTS.getPerencanaanList
  );
  return data?.data ?? [];
}
