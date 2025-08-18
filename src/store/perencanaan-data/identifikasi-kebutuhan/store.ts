"use client";

import { create } from "zustand";
import type {
  ProvinceOption,
  IdentifikasiKebutuhanFormValues,
  Severity,
} from "../../../types/perencanaan-data/identifikasi_kebutuhan";

type State = {
  selectedValue: 0 | 1 | 2;
  provincesOptions: ProvinceOption[];
  initialValues: IdentifikasiKebutuhanFormValues;

  materialFilters: string[];
  peralatanFilters: string[];
  tenagaKerjaFilters: string[];

  alertMessage: string;
  alertSeverity: Severity;
  isAlertOpen: boolean;
};

type Actions = {
  setSelectedValue: (v: State["selectedValue"]) => void;
  setProvincesOptions: (o: ProvinceOption[]) => void;
  setInitialValues: (v: Partial<IdentifikasiKebutuhanFormValues>) => void;

  setMaterialFilters: (keys: string[]) => void;
  setPeralatanFilters: (keys: string[]) => void;
  setTenagaKerjaFilters: (keys: string[]) => void;

  setAlertMessage: (m: string) => void;
  setAlertSeverity: (s: Severity) => void;
  setIsAlertOpen: (b: boolean) => void;
};

const useTahap2Store = create<State & Actions>((set) => ({
  selectedValue: 0,
  provincesOptions: [],
  initialValues: { materials: [], peralatans: [], tenagaKerjas: [] },

  materialFilters: [],
  peralatanFilters: [],
  tenagaKerjaFilters: [],

  alertMessage: "",
  alertSeverity: "info",
  isAlertOpen: false,

  setSelectedValue: (v) => set({ selectedValue: v }),
  setProvincesOptions: (o) => set({ provincesOptions: o }),
  setInitialValues: (v) =>
    set((s) => ({ initialValues: { ...s.initialValues, ...v } })),

  setMaterialFilters: (keys) => set({ materialFilters: keys }),
  setPeralatanFilters: (keys) => set({ peralatanFilters: keys }),
  setTenagaKerjaFilters: (keys) => set({ tenagaKerjaFilters: keys }),

  setAlertMessage: (m) => set({ alertMessage: m }),
  setAlertSeverity: (s) => set({ alertSeverity: s }),
  setIsAlertOpen: (b) => set({ isAlertOpen: b }),
}));

export default useTahap2Store;
