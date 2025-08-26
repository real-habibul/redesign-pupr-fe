"use client";
import * as React from "react";
import TextInput from "@components/ui/text-input";
import MUISelect from "@components/ui/select";
import Button from "@components/ui/button";
import {
  useMaterialField,
  useSetField,
  useRemoveRow,
} from "@store/perencanaan-data/identifikasi-kebutuhan/material-store";

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
  const setField = useSetField();
  const remove = useRemoveRow();

  const nama_material = useMaterialField(id, "nama_material");
  const satuan = useMaterialField(id, "satuan");
  const spesifikasi = useMaterialField(id, "spesifikasi");
  const ukuran = useMaterialField(id, "ukuran");
  const kodefikasi = useMaterialField(id, "kodefikasi");
  const kelompok_material = useMaterialField(id, "kelompok_material");
  const jumlah_kebutuhan = useMaterialField(id, "jumlah_kebutuhan");
  const merk = useMaterialField(id, "merk");
  const provincies_id = useMaterialField(id, "provincies_id");
  const cities_id = useMaterialField(id, "cities_id");

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
          label="Nama Material"
          value={String(nama_material ?? "")}
          onChange={(e) => setField(id, "nama_material", e.target.value)}
          onBlur={() => onBlurSyncFormik(id, "nama_material")}
          placeholder="Masukkan Nama Material"
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
          label="Ukuran"
          value={String(ukuran ?? "")}
          onChange={(e) => setField(id, "ukuran", e.target.value)}
          onBlur={() => onBlurSyncFormik(id, "ukuran")}
          placeholder="Masukkan Ukuran"
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
          label="Kelompok Material"
          options={kelompokOptions}
          value={kelompok_material ? String(kelompok_material) : ""}
          onChange={(val: string) => {
            setField(id, "kelompok_material", val);
            onBlurSyncFormik(id, "kelompok_material");
          }}
          required
          placeholder="Pilih Kelompok Material"
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

const MaterialRow = React.memo(Row);
export default MaterialRow;
