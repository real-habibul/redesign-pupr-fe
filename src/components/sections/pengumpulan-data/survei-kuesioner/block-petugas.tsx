"use client";

import TextInput from "@components/ui/text-input";
import MUISelect from "@components/ui/select";
import AppDatePicker from "@components/ui/date-picker";
import type { FormValues } from "../../../../types/pengumpulan-data/survei-kuesioner";

type Opt = { value: string; label: string; nip: string };

export default function BlockPetugas({
  values,
  setFieldValue,
  petugasLapanganuserOptions,
  pengawasUserOptions,
  errorDate,
  setErrorDate,
}: {
  values: FormValues;
  setFieldValue: (field: string, value: unknown) => void;
  petugasLapanganuserOptions: Opt[];
  pengawasUserOptions: Opt[];
  errorDate: boolean;
  setErrorDate: (v: boolean) => void;
}) {
  const petugasOptions = petugasLapanganuserOptions.map((o) => ({
    label: o.label,
    value: String(o.value),
  }));
  const pengawasOptions = pengawasUserOptions.map((o) => ({
    label: o.label,
    value: String(o.value),
  }));

  return (
    <div className="mt-3 bg-neutral-100 px-6 py-8 rounded-[16px] space-y-8">
      <MUISelect
        label="Nama Petugas Lapangan"
        value={values.user_id_petugas_lapangan ?? ""}
        onChange={(val) => {
          setFieldValue("user_id_petugas_lapangan", String(val));
          const found = petugasLapanganuserOptions.find(
            (o) => String(o.value) === String(val)
          );
          setFieldValue("nip_petugas_lapangan", found?.nip ?? "");
        }}
        options={petugasOptions}
      />

      <TextInput
        label="NIP Petugas Lapangan"
        value={values.nip_petugas_lapangan || ""}
        placeholder="NIP Petugas Lapangan"
        disabled
        onChange={(e) => setFieldValue("nip_petugas_lapangan", e.target.value)}
      />

      <div className="flex items-center gap-[256px]">
        <div className="text-B2 min-w-[200px]">Tanggal Survei</div>
        <div className="w-full">
          <AppDatePicker
            label="Tanggal Survei"
            value={values.tanggal_survei || ""}
            onChange={(v) => {
              setFieldValue("tanggal_survei", v);
              setErrorDate(!v);
            }}
            required
            error={errorDate}
            helperText={errorDate ? "Tanggal harus diisi" : ""}
          />
        </div>
      </div>

      <MUISelect
        label="Nama Pengawas"
        value={values.user_id_pengawas ? String(values.user_id_pengawas) : ""}
        onChange={(val) => {
          setFieldValue("user_id_pengawas", val);
          const found = pengawasUserOptions.find(
            (o) => String(o.value) === val
          );
          setFieldValue("nip_pengawas", found?.nip ?? "");
        }}
        options={pengawasOptions}
        required
        placeholder="Masukkan Nama Pengawas"
      />

      <TextInput
        label="NIP Pengawas"
        value={values.nip_pengawas || ""}
        placeholder="NIP Pengawas"
        disabled
        onChange={(e) => setFieldValue("nip_pengawas", e.target.value)}
      />

      <div className="flex items-center gap-[256px]">
        <div className="text-B2 min-w-[200px]">Tanggal Pengawasan</div>
        <div className="w-full">
          <AppDatePicker
            label="Tanggal Pengawasan"
            value={values.tanggal_pengawasan || ""}
            onChange={(v) => setFieldValue("tanggal_pengawasan", v)}
          />
        </div>
      </div>
    </div>
  );
}
