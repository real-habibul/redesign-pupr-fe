"use client";
import * as React from "react";
import TextInput from "@components/ui/text-input";
import MUISelect from "@components/ui/select";
import Button from "@components/ui/button";
import {
  useTenagaField,
  useSetTenagaField,
  useRemoveTenagaRow,
} from "@store/perencanaan-data/identifikasi-kebutuhan/tenaga-kerja-store";

export type Option = { value: string; label: string };

type Props = {
  id: string;
  rowNumber: number;
  provOptions: Option[];
  getCityOptions: (prov: string | number | "") => Option[];
  onBlurSyncFormik: (id: string, key: string) => void;
};

function Row({
  id,
  rowNumber,
  provOptions,
  getCityOptions,
  onBlurSyncFormik,
}: Props) {
  const setField = useSetTenagaField();
  const remove = useRemoveTenagaRow();

  const jenis_tenaga_kerja = useTenagaField(id, "jenis_tenaga_kerja");
  const satuan = useTenagaField(id, "satuan");
  const jumlah_kebutuhan = useTenagaField(id, "jumlah_kebutuhan");
  const kodefikasi = useTenagaField(id, "kodefikasi");
  const provincies_id = useTenagaField(id, "provincies_id");
  const cities_id = useTenagaField(id, "cities_id");

  const cityOptions = React.useMemo(
    () => getCityOptions((provincies_id as any) ?? ""),
    [getCityOptions, provincies_id]
  );

  return (
    <tr>
      <td className="px-3 py-6 text-center">{rowNumber}</td>

      <td className="px-3 py-6">
        <TextInput
          label="Jenis Tenaga Kerja"
          value={String(jenis_tenaga_kerja ?? "")}
          onChange={(e) => setField(id, "jenis_tenaga_kerja", e.target.value)}
          onBlur={() => onBlurSyncFormik(id, "jenis_tenaga_kerja")}
          placeholder="Masukkan Jenis Tenaga Kerja"
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

const TenagaKerjaRow = React.memo(Row);
export default TenagaKerjaRow;
