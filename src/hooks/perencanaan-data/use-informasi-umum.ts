"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import manualstore from "@store/perencanaan-data/informasi-umum/store";
import { useAlert } from "@components/ui/alert";
import {
  getBalaiKerja,
  getInformasiUmum,
  storeInformasiUmum,
} from "@lib/api/perencanaan-data";
import type {
  Option,
  ManualFormValues,
  SubmitType,
} from "../../types/perencanaan-data/informasi-umum";

type SubmitOpts = { redirect?: boolean };

export function useInformasiUmum() {
  const [balaiOptions, setBalaiOptions] = useState<Option[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { show } = useAlert();
  const { setInitialValueManual } = manualstore();

  const fetchBalaiOptions = async () => {
    try {
      const { data } = await getBalaiKerja();
      if (Array.isArray(data?.data)) {
        setBalaiOptions(
          data.data.map((item) => ({ value: item.id, label: item.nama }))
        );
      }
    } catch (e) {
      console.error("Error fetching balai:", e);
      show("Gagal memuat daftar balai.", "error");
    }
  };

  const fetchInformasiUmum = async (id: string) => {
    try {
      const { data } = await getInformasiUmum(id);
      if (data?.data) {
        const selectedBalai = balaiOptions.find(
          (opt) => opt.value === parseInt(data.data!.nama_balai, 10)
        );
        setInitialValueManual?.({
          kodeRup: data.data.kode_rup,
          namaPaket: data.data.nama_paket,
          namaPpk: data.data.nama_ppk,
          jabatanPpk: data.data.jabatan_ppk,
          namaBalai: selectedBalai ?? null,
        });
      }
    } catch (e) {
      console.error("Gagal memuat data Informasi Umum:", e);
      show("Gagal memuat data Informasi Umum.", "error");
    }
  };

  const submitManual = async (values: ManualFormValues, opts: SubmitOpts = {}) => {
    const { redirect = false } = opts;

    const payload = {
      tipe_informasi_umum: "manual",
      kode_rup: values.kodeRup,
      nama_paket: values.namaPaket,
      nama_ppk: values.namaPpk,
      jabatan_ppk: values.jabatanPpk,
      nama_balai: Number(values.namaBalai?.value ?? 0),
    };

    setIsSubmitting(true);
    try {
      const { data } = await storeInformasiUmum(payload);
      console.log("[STORE INFORMASI UMUM][manual] resp:", data); 

      if (data.status === "success" && data.data?.id) {
        localStorage.setItem("informasi_umum_id", String(data.data.id));
        show("Data berhasil disimpan.", "success");
        if (redirect) {
          router.replace("/perencanaan-data/tahap2"); 
        }
        return true;
      }
      show(data?.message || "Gagal mengirim data.", "error");
      return false;
    } catch (e) {
      console.error("Submit error:", e);
      show("Terjadi kesalahan koneksi.", "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchBalaiOptions();
  }, []);

  return {
    balaiOptions,
    isSubmitting,
    fetchInformasiUmum,
    submitManual,
  };
}
