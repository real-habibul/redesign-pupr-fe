import axios from "axios";
import type {
  ProvinceApi,
  ProvinceOption,
} from "../../../types/vendor/location";

export async function fetchProvincesAndCities(): Promise<ProvinceOption[]> {
  const { data } = await axios.get<{ data: ProvinceApi[] }>(
    "https://api-ecatalogue-staging.online/api/provinces-and-cities"
  );
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows.map((p) => ({
    value: String(p.id_province),
    label: p.province_name,
    cities: p.cities,
  }));
}
