"use client";
import * as React from "react";
import TextInput from "@components/ui/text-input";
import type { CommonInformation } from "../../../../types/perencanaan-data/perancangan-kuesioner";

type Props = { info: CommonInformation };

export default function InfoUmumCard({ info }: Props) {
  const noop = () => {};
  return (
    <div className="mt-3 bg-custom-neutral-100 px-6 py-8 rounded-[16px] space-y-8">
      <TextInput label="Kode RUP" value={info.kode_rup ?? ""} onChange={noop} />
      <TextInput
        label="Nama Balai"
        value={info.nama_balai ?? ""}
        onChange={noop}
      />
      <TextInput
        label="Nama Paket"
        value={info.nama_paket ?? ""}
        onChange={noop}
      />
      <TextInput label="Nama PPK" value={info.nama_ppk ?? ""} onChange={noop} />
      <TextInput
        label="Jabatan PPK"
        value={info.jabatan_ppk ?? ""}
        onChange={noop}
      />
    </div>
  );
}
