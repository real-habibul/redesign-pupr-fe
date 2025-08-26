"use client";

import { create } from "zustand";
import { submitInformasiUmum } from "@services/informasi-umum";
import type {
  ManualFormValues,
  NumberOption,
} from "../../../types/perencanaan-data/informasi-umum";

export type Sev = "success" | "error" | "info" | "warning";

export interface Informasi_umum_state {
  selectedTab: number;
  setSelectedTab: (value: number) => void;

  initialValueManual: ManualFormValues;
  setInitialValueManual: (value: ManualFormValues) => void;

  alertMessage: string;
  alertSeverity: Sev;
  isAlertOpen: boolean;
  setAlertMessage: (message: string) => void;
  setAlertSeverity: (severity: Sev) => void;
  setIsAlertOpen: (value: boolean) => void;

  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;

  balaiOptions: NumberOption[];
  setBalaiOptions: (
    value: Array<{ value: string | number; label: string }>
  ) => void;

  submitManual: (values: ManualFormValues) => Promise<boolean>;
}

const toNumber = (v: string | number): number =>
  typeof v === "string" ? Number.parseInt(v, 10) : v;

const normalizeNamaBalai = (
  opt: { value: string | number; label: string } | null
): NumberOption | null =>
  opt ? { value: toNumber(opt.value), label: opt.label } : null;

const normalizeValues = (v: ManualFormValues): ManualFormValues => ({
  ...v,
  namaBalai: normalizeNamaBalai(v.namaBalai),
});

export const useInformasiUmumStore = create<Informasi_umum_state>((set) => ({
  selectedTab: 0,
  setSelectedTab: (value) => set({ selectedTab: value }),

  initialValueManual: {
    kodeRup: "",
    namaBalai: null,
    namaPaket: "",
    namaPpk: "",
    jabatanPpk: "",
  },
  setInitialValueManual: (value) =>
    set({ initialValueManual: normalizeValues(value) }),

  alertMessage: "",
  alertSeverity: "info",
  isAlertOpen: false,
  setAlertMessage: (message) => set({ alertMessage: message }),
  setAlertSeverity: (severity) => set({ alertSeverity: severity }),
  setIsAlertOpen: (value) => set({ isAlertOpen: value }),

  isSubmitting: false,
  setIsSubmitting: (value) => set({ isSubmitting: value }),

  balaiOptions: [],
  setBalaiOptions: (value) =>
    set({
      balaiOptions: value.map((o) => ({
        value: toNumber(o.value),
        label: o.label,
      })),
    }),

  submitManual: async (values: ManualFormValues) => {
    set({ isSubmitting: true });
    try {
      const normalized = normalizeValues(values);
      const res = await submitInformasiUmum(normalized);
      if (res.status === "success") {
        set({
          alertMessage: "Data berhasil Disimpan.",
          alertSeverity: "success",
          isAlertOpen: true,
        });
        const id = res.data?.id ?? "";
        if (typeof window !== "undefined") {
          localStorage.setItem("informasi_umum_id", String(id));
        }
        return true;
      }
      set({
        alertMessage: res.message ?? "Gagal mengirim data ke API.",
        alertSeverity: "error",
        isAlertOpen: true,
      });
      return false;
    } catch (err) {
      console.error("Submit manual data failed", err);
      set({
        alertMessage: "Gagal mengirim data ke API.",
        alertSeverity: "error",
        isAlertOpen: true,
      });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));

export default useInformasiUmumStore;
