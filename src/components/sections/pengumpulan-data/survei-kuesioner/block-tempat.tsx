"use client";
import TextInput from "@components/ui/text-input";

export default function BlockTempat({
  dataEntri,
}: {
  dataEntri?: {
    provinsi?: string;
    kota?: string;
    nama_responden?: string;
    alamat?: string;
    no_telepon?: string;
    kategori_responden?: string;
  } | null;
}) {
  const d = dataEntri ?? {};

  return (
    <div className="mt-3 bg-neutral-100 px-6 py-8 rounded-[16px] space-y-8">
      <TextInput
        label="Provinsi"
        value={d.provinsi ?? ""}
        disabled
        onChange={() => {}}
      />
      <TextInput
        label="Kabupaten/Kota"
        value={d.kota ?? ""}
        disabled
        onChange={() => {}}
      />
      <TextInput
        label="Nama Responden/Vendor"
        value={d.nama_responden ?? ""}
        disabled
        onChange={() => {}}
      />
      <TextInput
        label="Alamat Responden/Geo-tagging"
        value={d.alamat ?? ""}
        disabled
        onChange={() => {}}
      />
      <TextInput
        label="Nomor Telepon/HP /E-mail"
        value={d.no_telepon ?? ""}
        disabled
        onChange={() => {}}
      />
      <TextInput
        label="Kategori Responden /Vendor"
        value={d.kategori_responden ?? ""}
        disabled
        onChange={() => {}}
      />
    </div>
  );
}
