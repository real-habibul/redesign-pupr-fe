"use client";

import { useEffect, useRef, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@components/ui/alert";
import {
  getBalaiKerja,
  getInformasiUmum,
} from "@lib/api/perencanaan-data/informasi-umum";
import useInformasiUmumStore from "@store/perencanaan-data/informasi-umum/store";
import type {
  ManualFormValues,
  Option,
} from "../../types/perencanaan-data/informasi-umum";

type SubmitOpts = { redirect?: boolean };

const toNum = (v: string | number | null | undefined) =>
  typeof v === "string" ? Number.parseInt(v, 10) : Number(v ?? 0);

export function useInformasiUmum() {
  const router = useRouter();
  const { show } = useAlert();
  const aliveRef = useRef(true);

  const {
    balaiOptions,
    isSubmitting,
    initialValueManual,
    setBalaiOptions,
    setInitialValueManual,
    submitManual: submitManualFromStore,
  } = useInformasiUmumStore();

  const fetchBalaiOptions = async () => {
    try {
      const list = await getBalaiKerja();
      const options = list.map((b) => ({
        value: b.id,
        label: b.nama,
      })) as Option[];
      if (aliveRef.current) setBalaiOptions(options);
    } catch (err) {
      console.error("fetchBalaiOptions error:", err);
      show("Gagal memuat daftar balai.", "error");
    }
  };

  const fetchInformasiUmum = async (id: string) => {
    try {
      const d = await getInformasiUmum(id);
      if (!d) return;
      if (balaiOptions.length === 0) await fetchBalaiOptions();
      const targetId = toNum(d.nama_balai);
      const selected =
        balaiOptions.find((opt) => toNum(opt.value) === targetId) ?? null;
      if (aliveRef.current) {
        setInitialValueManual({
          kodeRup: d.kode_rup ?? "",
          namaPaket: d.nama_paket ?? "",
          namaPpk: d.nama_ppk ?? "",
          jabatanPpk: d.jabatan_ppk ?? "",
          namaBalai: (selected as Option | null) ?? null,
        });
      }
    } catch (err) {
      console.error("fetchInformasiUmum error:", err);
      show("Gagal memuat data Informasi Umum.", "error");
    }
  };

  const hardRedirect = (href: string) => {
    if (typeof window !== "undefined") window.location.assign(href);
  };

  const targetPath = "/perencanaan-data/identifikasi-kebutuhan";

  const submitManual = async (
    values: ManualFormValues,
    opts: SubmitOpts = { redirect: true }
  ) => {
    try {
      const ok = await submitManualFromStore(values);
      if (ok) {
        show("Data berhasil disimpan.", "success");
        if (opts.redirect) {
          startTransition(() => {
            router.push(targetPath);
          });
          setTimeout(() => {
            if (
              typeof window !== "undefined" &&
              !window.location.pathname.endsWith(targetPath)
            ) {
              hardRedirect(targetPath);
            }
          }, 150);
        }
      } else {
        show("Gagal mengirim data ke API.", "error");
      }
      return ok;
    } catch (err) {
      console.error("submitManual error:", err);
      show("Terjadi kesalahan koneksi.", "error");
      return false;
    }
  };

  useEffect(() => {
    aliveRef.current = true;
    fetchBalaiOptions();
    return () => {
      aliveRef.current = false;
    };
  }, []);

  return {
    balaiOptions,
    isSubmitting,
    initialValueManual,
    fetchBalaiOptions,
    fetchInformasiUmum,
    submitManual,
    setInitialValueManual,
  };
}
