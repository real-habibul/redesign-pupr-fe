"use client";

import TextInput from "@components/ui/text-input";
import type { FormikHelpers } from "formik";
import type { FormValues } from "../../../../types/pengumpulan-data/survei-kuesioner";

export default function BlockPemberiInfo({
  values,
  setFieldValue,
}: {
  values: FormValues;
  setFieldValue: FormikHelpers<FormValues>["setFieldValue"];
}) {
  return (
    <div className="mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
      <TextInput
        label="Nama Pemberi Informasi / Jabatan"
        value={values.nama_pemberi_informasi || ""}
        placeholder="Masukkan Nama Pemberi Informasi / Jabatan"
        isRequired
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFieldValue("nama_pemberi_informasi", e.target.value)
        }
      />
    </div>
  );
}
