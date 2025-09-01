"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";

import Button from "@components/ui/button";
import Tabs from "@components/ui/tabs";
import { useAlert } from "@components/ui/alert";

import BlockTempat from "@components/sections/pengumpulan-data/survei-kuesioner/block-tempat";
import BlockPetugas from "@components/sections/pengumpulan-data/survei-kuesioner/block-petugas";
import BlockPemberiInfo from "@components/sections/pengumpulan-data/survei-kuesioner/block-pemberi-info";
import MaterialTable from "@components/sections/pengumpulan-data/survei-kuesioner/material-table";
import PeralatanTable from "@components/sections/pengumpulan-data/survei-kuesioner/peralatan-table";
import TenagaKerjaTable from "@components/sections/pengumpulan-data/survei-kuesioner/tenaga-kerja";

import useSurveiKuesionerStore from "@store/pengumpulan-data/survei-kuesioner/store";

import type {
  ActionType,
  FormValues,
  MaterialRowRO,
  PeralatanRowRO,
  TenagaKerjaRowRO,
} from "../../../types/pengumpulan-data/survei-kuesioner";

import {
  DEFAULT_SUBMIT_URL,
  validateFields,
  submitForm,
} from "@lib/api/pengumpulan-data/survei-kuesioner";

type TempatView = {
  provinsi?: string;
  kota?: string;
  nama_responden?: string;
  alamat?: string;
  no_telepon?: string;
  kategori_responden?: string;
};

type UnknownRec = Record<string, unknown>;

function toTempatView(src: unknown): TempatView | null {
  if (!src || typeof src !== "object") return null;
  const s = src as UnknownRec;
  const pick = (k: string) =>
    s[k] == null ? undefined : String(s[k] as string | number);
  return {
    provinsi: pick("provinsi"),
    kota: pick("kota"),
    nama_responden: pick("nama_responden"),
    alamat: pick("alamat"),
    no_telepon: pick("no_telepon"),
    kategori_responden: pick("kategori_responden"),
  };
}

function extractProvCityIds(src: unknown): {
  provincies_id: string | number | "";
  cities_id: string | number | "";
} {
  if (!src || typeof src !== "object")
    return { provincies_id: "", cities_id: "" };
  const s = src as UnknownRec;
  return {
    provincies_id: (s["provincies_id"] as string | number | undefined) ?? "",
    cities_id: (s["cities_id"] as string | number | undefined) ?? "",
  };
}

/** ---------- Komponen Utama ---------- */
export type SurveiKuesionerFormProps = {
  token: string;
  initialTab?: 0 | 1 | 2;
  submitUrl?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  showHeaderBlock?: boolean;
};

export default function SurveiKuesionerForm({
  token,
  initialTab = 0,
  submitUrl = DEFAULT_SUBMIT_URL,
  onSuccess,
  onError,
  showHeaderBlock = true,
}: SurveiKuesionerFormProps) {
  const [currentAction, setCurrentAction] = useState<ActionType>("save");
  const [errorDate, setErrorDate] = useState(false);
  const alert = useAlert();

  const {
    selectedValue,
    setSelectedValue,
    petugasLapanganuserOptions,
    pengawasUserOptions,
    initialValues,
    material,
    peralatan,
    tenaga_kerja,
    dataEntri,
    fetchData,
    fetchPengawasUserOptions,
    fetchPetugasLapanganUserOptions,
    data_vendor_id,
    identifikasi_kebutuhan_id,
  } = useSurveiKuesionerStore();

  useEffect(() => {
    setSelectedValue(initialTab);
  }, [initialTab, setSelectedValue]);

  useEffect(() => {
    if (token) void fetchData(token);
  }, [token, fetchData]);

  useEffect(() => {
    void fetchPetugasLapanganUserOptions();
  }, [fetchPetugasLapanganUserOptions]);

  useEffect(() => {
    void fetchPengawasUserOptions();
  }, [fetchPengawasUserOptions]);

  const initialFormValues: FormValues = {
    ...initialValues,
    tanggal_survei: "",
    tanggal_pengawasan: "",
    material: [],
    peralatan: [],
    tenaga_kerja: [],
  };

  // VM untuk blok tempat & id prov/kota
  const tempatVM = toTempatView(dataEntri);
  const { provincies_id, cities_id } = extractProvCityIds(dataEntri);

  // Helper aman ambil string / string|number dari object unknown
  const getStr = (o: UnknownRec, k: string): string =>
    o[k] == null ? "" : String(o[k] as string | number);
  const getStrNum = (o: UnknownRec, k: string): string | number =>
    o[k] == null ? "" : (o[k] as string | number);

  // Mapping inline tanpa mappers
  const materialRows: MaterialRowRO[] = (
    Array.isArray(material) ? (material as unknown[]) : []
  ).map((raw): MaterialRowRO => {
    const m = (raw ?? {}) as UnknownRec;
    return {
      id: getStr(m, "id"),
      nama_material: getStr(m, "nama_material"),
      satuan: getStr(m, "satuan"),
      spesifikasi: getStr(m, "spesifikasi"),
      ukuran: getStr(m, "ukuran"),
      kodefikasi: getStr(m, "kodefikasi"),
      kelompok_material: getStr(m, "kelompok_material"),
      jumlah_kebutuhan: getStrNum(m, "jumlah_kebutuhan"),
      merk: getStr(m, "merk"),
      provincies_id,
      cities_id,
    };
  });

  const peralatanRows: PeralatanRowRO[] = (
    Array.isArray(peralatan) ? (peralatan as unknown[]) : []
  ).map((raw): PeralatanRowRO => {
    const p = (raw ?? {}) as UnknownRec;
    return {
      id: getStr(p, "id"),
      nama_peralatan: getStr(p, "nama_peralatan"),
      satuan: getStr(p, "satuan"),
      spesifikasi: getStr(p, "spesifikasi"),
      kapasitas: getStr(p, "kapasitas"),
      kodefikasi: getStr(p, "kodefikasi"),
      kelompok_peralatan: getStr(p, "kelompok_peralatan"),
      jumlah_kebutuhan: getStrNum(p, "jumlah_kebutuhan"),
      merk: getStr(p, "merk"),
      provincies_id,
      cities_id,
    };
  });

  const tenagaKerjaRows: TenagaKerjaRowRO[] = (
    Array.isArray(tenaga_kerja) ? (tenaga_kerja as unknown[]) : []
  ).map((raw): TenagaKerjaRowRO => {
    const t = (raw ?? {}) as UnknownRec;
    return {
      id: getStr(t, "id"),
      jenis_tenaga_kerja: getStr(t, "jenis_tenaga_kerja"),
      satuan: getStr(t, "satuan"),
      jumlah_kebutuhan: getStrNum(t, "jumlah_kebutuhan"),
      kodefikasi: getStr(t, "kodefikasi"),
      provincies_id,
      cities_id,
    };
  });

  return (
    <div className="w-full">
      {showHeaderBlock && (
        <>
          <div className="space-y-3 pt-2">
            <h3 className="text-H3 text-emphasis-on_surface-high">
              Entri Data Hasil Survei
            </h3>
            <h4 className="text-H4 text-emphasis-on_surface-high mt-4">
              Blok I: Keterangan Tempat
            </h4>
          </div>
          <BlockTempat dataEntri={tempatVM ?? null} />
        </>
      )}

      <Formik<FormValues>
        initialValues={initialFormValues}
        onSubmit={async (values, { setSubmitting }) => {
          const v = validateFields(values, currentAction);
          if (!v.ok) {
            alert.show(v.msg ?? "Validasi gagal", "error");
            setSubmitting(false);
            return;
          }

          const res = await submitForm({
            values,
            submitUrl,
            currentAction,
            identifikasi_kebutuhan_id,
            data_vendor_id,
          });

          const msg =
            res.message ??
            (res.ok
              ? "Data berhasil disimpan!"
              : "Terjadi kesalahan. Silakan coba lagi.");

          alert.show(msg, res.ok ? "success" : "error");
          if (res.ok) onSuccess?.(msg);
          else onError?.(msg);

          setSubmitting(false);
        }}>
        {({ values, setFieldValue }) => (
          <Form>
            <h4 className="text-H4 text-emphasis-on_surface-high mt-6">
              Blok II: Keterangan Petugas Lapangan
            </h4>
            <BlockPetugas
              values={values}
              setFieldValue={setFieldValue}
              petugasLapanganuserOptions={petugasLapanganuserOptions}
              pengawasUserOptions={pengawasUserOptions}
              errorDate={errorDate}
              setErrorDate={setErrorDate}
            />

            <h4 className="text-H4 text-emphasis-on_surface-high mt-4">
              Blok III: Keterangan Pemberi Informasi
            </h4>
            <BlockPemberiInfo values={values} setFieldValue={setFieldValue} />

            <h4 className="text-H4 text-emphasis-on_surface-high mt-4">
              Blok IV: Detail
            </h4>
            <Tabs
              value={selectedValue}
              onChange={setSelectedValue}
              tabs={[
                {
                  label: "Material",
                  content: (
                    <MaterialTable
                      rows={materialRows}
                      values={values}
                      setFieldValue={setFieldValue}
                    />
                  ),
                },
                {
                  label: "Peralatan",
                  content: (
                    <PeralatanTable
                      rows={peralatanRows}
                      values={values}
                      setFieldValue={setFieldValue}
                    />
                  ),
                },
                {
                  label: "Tenaga Kerja",
                  content: (
                    <TenagaKerjaTable
                      rows={tenagaKerjaRows}
                      values={values}
                      setFieldValue={setFieldValue}
                    />
                  ),
                },
              ]}
            />

            <div className="flex justify-end gap-4 mt-6 bg-neutral-100 px-6 py-8 rounded-[16px]">
              <Button
                variant="outlined_yellow"
                type="submit"
                onClick={() => setCurrentAction("draft")}>
                Simpan sebagai Draf
              </Button>
              <Button
                variant="solid_blue"
                type="submit"
                onClick={() => setCurrentAction("save")}>
                Simpan
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
