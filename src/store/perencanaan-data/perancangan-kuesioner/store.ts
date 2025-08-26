"use client";
import { create } from "zustand";

export type FiltersState = {
  vendorFilters: string[];
  materialFilters: string[];
  peralatanFilters: string[];
  tenagaKerjaFilters: string[];
  setVendorFilters: (v: string[]) => void;
  setMaterialFilters: (v: string[]) => void;
  setPeralatanFilters: (v: string[]) => void;
  setTenagaKerjaFilters: (v: string[]) => void;
};

export const useTahap4FiltersStore = create<FiltersState>((set) => ({
  vendorFilters: [],
  materialFilters: [],
  peralatanFilters: [],
  tenagaKerjaFilters: [],
  setVendorFilters: (v) => set({ vendorFilters: v }),
  setMaterialFilters: (v) => set({ materialFilters: v }),
  setPeralatanFilters: (v) => set({ peralatanFilters: v }),
  setTenagaKerjaFilters: (v) => set({ tenagaKerjaFilters: v }),
}));
