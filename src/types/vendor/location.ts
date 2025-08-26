export type CityApi = {
  cities_id: string | number;
  cities_name: string;
};

export type ProvinceApi = {
  id_province: string | number;
  province_name: string;
  cities: CityApi[];
};

export type Option = {
  value: string;
  label: string;
};

export type ProvinceOption = Option & {
  cities: CityApi[];
};
