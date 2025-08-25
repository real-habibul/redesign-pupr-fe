import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProvinceOption, Option } from "../../types/vendor/location";
import type { VendorPayload } from "../../types/vendor/vendor";
import { fetchProvincesAndCities } from "@lib/api/vendor/locations";

export function useVendorForm() {
  const [provinsiOptions, setProvinsiOptions] = useState<ProvinceOption[]>([]);
  const [kotaOptions, setKotaOptions] = useState<Option[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<Option[]>([]);
  const [nama_vendor, set_nama_vendor] = useState("");
  const [jenis_vendor_id, set_jenis_vendor_id] = useState<number[]>([]);
  const [kategori_vendor_id, set_kategori_vendor_id] = useState<number[]>([]);
  const [alamat, set_alamat] = useState("");
  const [no_telepon, set_no_telepon] = useState("");
  const [no_hp, set_no_hp] = useState("");
  const [sumber_daya, set_sumber_daya] = useState("");
  const [nama_pic, set_nama_pic] = useState("");
  const [provinsi_id, set_provinsi_id] = useState("");
  const [kota_id, set_kota_id] = useState("");
  const [koordinat, set_koordinat] = useState("");
  const [logo_url, set_logo_url] = useState<File | null>(null);
  const [dok_pendukung_url, set_dok_pendukung_url] = useState<File | null>(
    null
  );

  useEffect(() => {
    fetchProvincesAndCities()
      .then(setProvinsiOptions)
      .catch(() => setProvinsiOptions([]));
  }, []);

  const handleProvinsiChange = useCallback(
    (opt: Option | ProvinceOption) => {
      const val = String(opt?.value ?? "");
      set_provinsi_id(val);
      set_kota_id("");
      const selected = provinsiOptions.find((p) => p.value === val);
      const cities = selected?.cities ?? [];
      setKotaOptions(
        cities.map((c) => ({
          value: String(c.cities_id),
          label: c.cities_name,
        }))
      );
    },
    [provinsiOptions]
  );

  const handleKotaChange = useCallback((opt: Option | null) => {
    set_kota_id(opt ? String(opt.value) : "");
  }, []);

  const mapKategoriOptions = useCallback((types: string[]): Option[] => {
    const data: Record<string, Option[]> = {
      "1": [
        { value: "1", label: "Pedagang Grosir" },
        { value: "2", label: "Distributor" },
        { value: "3", label: "Produsen" },
        { value: "4", label: "Pedagang Campuran" },
      ],
      "2": [
        { value: "8", label: "Produsen" },
        { value: "5", label: "Jasa Penyewaan Alat Berat" },
        { value: "6", label: "Kontraktor" },
        { value: "7", label: "Agen" },
      ],
      "3": [
        { value: "9", label: "Kontraktor" },
        { value: "10", label: "Pemerintah Daerah" },
      ],
    };
    const map = new Map<string, Option>();
    types.forEach((t) => {
      (data[t] || []).forEach((o) => {
        if (!map.has(o.label)) map.set(o.label, { ...o });
        else {
          const prev = map.get(o.label)!;
          map.set(o.label, {
            value: `${prev.value},${o.value}`,
            label: o.label,
          });
        }
      });
    });
    return Array.from(map.values());
  }, []);

  const toggleJenis = useCallback(
    (type: string) => {
      setSelectedTypes((prev) => {
        const next = prev.includes(type)
          ? prev.filter((x) => x !== type)
          : [...prev, type];
        set_jenis_vendor_id(next.map((n) => parseInt(n, 10)));
        setKategoriOptions(mapKategoriOptions(next));
        set_kategori_vendor_id([]);
        return next;
      });
    },
    [mapKategoriOptions]
  );

  const setKategori = useCallback((opt: Option | null) => {
    if (!opt) {
      set_kategori_vendor_id([]);
      return;
    }
    const nums = String(opt.value)
      .split(",")
      .map((v) => parseInt(v, 10));
    set_kategori_vendor_id(nums);
  }, []);

  const payload: VendorPayload = useMemo(
    () => ({
      nama_vendor,
      jenis_vendor_id,
      kategori_vendor_id,
      alamat,
      no_telepon,
      no_hp,
      sumber_daya,
      nama_pic,
      provinsi_id,
      kota_id,
      koordinat,
      logo_url,
      dok_pendukung_url,
    }),
    [
      nama_vendor,
      jenis_vendor_id,
      kategori_vendor_id,
      alamat,
      no_telepon,
      no_hp,
      sumber_daya,
      nama_pic,
      provinsi_id,
      kota_id,
      koordinat,
      logo_url,
      dok_pendukung_url,
    ]
  );

  return {
    provinsiOptions,
    kotaOptions,
    kategoriOptions,
    selectedTypes,
    toggleJenis,
    handleProvinsiChange,
    handleKotaChange,
    setKategori,
    payload,
    set_nama_vendor,
    set_alamat,
    set_no_telepon,
    set_no_hp,
    set_sumber_daya,
    set_nama_pic,
    set_koordinat,
    set_logo_url,
    set_dok_pendukung_url,
  };
}
