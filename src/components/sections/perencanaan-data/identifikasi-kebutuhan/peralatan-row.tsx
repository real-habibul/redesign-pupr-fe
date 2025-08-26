"use client";
import * as React from "react";
import TextInput from "@components/ui/text-input";
import MUISelect from "@components/ui/select";
import Button from "@components/ui/button";
import {
  usePeralatanField,
  useSetPeralatanField,
  useRemovePeralatanRow,
} from "@store/perencanaan-data/identifikasi-kebutuhan/peralatan-store";

export type Option = { value: string; label: string };

type Props = {
  id: string;
  rowNumber: number;
  provOptions: Option[];
  getCityOptions: (prov: string | number | "") => Option[];
  kelompokOptions: Option[];
  onBlurSyncFormik: (id: string, key: string) => void;
};

function Row({
  id,
  rowNumber,
  provOptions,
  getCityOptions,
  kelompokOptions,
  onBlurSyncFormik,
}: Props) {
  const setField = useSetPeralatanField();
  const remove = useRemovePeralatanRow();

  const nama_peralatan = usePeralatanField(id, "nama_peralatan");
  const satuan = usePeralatanField(id, "satuan");
  const spesifikasi = usePeralatanField(id, "spesifikasi");
  const kapasitas = usePeralatanField(id, "kapasitas");
  const kodefikasi = usePeralatanField(id, "kodefikasi");
  const kelompok_peralatan = usePeralatanField(id, "kelompok_peralatan");
  const jumlah_kebutuhan = usePeralatanField(id, "jumlah_kebutuhan");
  const merk = usePeralatanField(id, "merk");
  const provincies_id = usePeralatanField(id, "provincies_id");
  const cities_id = usePeralatanField(id, "cities_id");

  const normalizedProvId: string | number | "" =
    typeof provincies_id === "string" || typeof provincies_id === "number"
      ? provincies_id
      : "";

  const cityOptions = React.useMemo(
    () => getCityOptions(normalizedProvId),
    [getCityOptions, normalizedProvId]
  );

  return (
    <tr>
      <td className="px-3 py-6 text-center">{rowNumber}</td>

      <td className="px-3 py-6">
        <TextInput
          label="Nama Peralatan"
          value={String(nama_peralatan ?? "")}
          onChange={(e) => setField(id, "nama_peralatan", e.target.value)}
          onBlur={() => onBlurSyncFormik(id, "nama_peralatan")}
          placeholder="Masukkan Nama Peralatan"
          isRequired
        />
      </td>

      <td className="px-3 py-6">
        <TextInput
          label="Satuan"
          value={String(satuan ?? "")}
          onChange={(e) => setField(id, "satuan", e.target.value)}
          onBlur={() => onBlurSyncFormik(id, "satuan")}
          placeholder="Masukkan Satuan"
          isRequired
        />
      </td>

      <td className="px-3 py-6">
        <TextInput
          label="Spesifikasi"
          value={String(spesifikasi ?? "")}
          onChange={(e) => setField(id, "spesifikasi", e.target.value)}
          onBlur={() => onBlurSyncFormik(id, "spesifikasi")}
          placeholder="Masukkan Spesifikasi"
          isRequired
        />
      </td>

      <td className="px-3 py-6">
        <TextInput
          label="Kapasitas"
          value={String(kapasitas ?? "")}
          onChange={(e) => setField(id, "kapasitas", e.target.value)}
          onBlur={() => onBlurSyncFormik(id, "kapasitas")}
          placeholder="Masukkan Kapasitas"
          isRequired
        />
      </td>

      <td className="px-3 py-6">
        <TextInput
          label="Kodefikasi"
          value={String(kodefikasi ?? "")}
          onChange={(e) => setField(id, "kodefikasi", e.target.value)}
          onBlur={() => onBlurSyncFormik(id, "kodefikasi")}
          placeholder="Masukkan Kodefikasi"
          isRequired
        />
      </td>

      <td className="px-3 py-6">
        <MUISelect
          label="Kelompok Peralatan"
          options={kelompokOptions}
          value={kelompok_peralatan ? String(kelompok_peralatan) : ""}
          onChange={(val: string) => {
            setField(id, "kelompok_peralatan", val);
            onBlurSyncFormik(id, "kelompok_peralatan");
          }}
          required
          placeholder="Pilih Kelompok Peralatan"
        />
      </td>

      <td className="px-3 py-6">
        <TextInput
          label="Jumlah Kebutuhan"
          value={String(jumlah_kebutuhan ?? "")}
          onChange={(e) => setField(id, "jumlah_kebutuhan", e.target.value)}
          onBlur={() => onBlurSyncFormik(id, "jumlah_kebutuhan")}
          placeholder="Masukkan Jumlah Kebutuhan"
          isRequired
        />
      </td>

      <td className="px-3 py-6">
        <TextInput
          label="Merk"
          value={String(merk ?? "")}
          onChange={(e) => setField(id, "merk", e.target.value)}
          onBlur={() => onBlurSyncFormik(id, "merk")}
          placeholder="Masukkan Merk"
          isRequired
        />
      </td>

      <td className="px-3 py-6">
        <MUISelect
          label="Provinsi"
          options={provOptions}
          value={provincies_id ? String(provincies_id) : ""}
          onChange={(val: string) => {
            setField(id, "provincies_id", val);
            setField(id, "cities_id", "");
            onBlurSyncFormik(id, "provincies_id");
            onBlurSyncFormik(id, "cities_id");
          }}
          required
          placeholder="Pilih Provinsi"
        />
      </td>

      <td className="px-3 py-6">
        <MUISelect
          key={`city-${id}-${String(provincies_id ?? "")}`}
          label="Kota"
          options={cityOptions}
          value={cities_id ? String(cities_id) : ""}
          onChange={(val: string) => {
            setField(id, "cities_id", val);
            onBlurSyncFormik(id, "cities_id");
          }}
          required
          placeholder="Pilih Kota"
        />
      </td>

      <td className="px-3 py-6 text-center">
        <Button
          type="button"
          variant="text_red"
          label="Hapus"
          onClick={() => remove(id)}
        />
      </td>
    </tr>
  );
}

const PeralatanRow = React.memo(Row);
export default PeralatanRow;
