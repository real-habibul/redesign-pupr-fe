"use client";
import { create } from "zustand";
import type {
  PengumpulanRow,
  MenuPosition,
} from "../../types/pengumpulan-data/pengumpulan-data";
import {
  getTableListPengumpulan,
  generateLinkPengumpulan,
  type ShortlistId,
} from "@lib/api/pengumpulan-data/pengumpulan";

type PengumpulanInformasiState = {
  tableData: PengumpulanRow[];
  masterData: PengumpulanRow[];
  currentPage: number;
  itemsPerPage: number;
  activeMenu: string | null;
  menuPosition: MenuPosition;
  selectedIdPaket: string | null;

  urlKuisionerResult: string | null;
  dateExpired: string | null;

  activeFilters: (keyof PengumpulanRow | string)[];

  setCurrentPage: (page: number) => void;
  setActiveMenu: (id: string | null) => void;
  setSelectedIdPaket: (id: string | null) => void;

  setActiveFilters: (cols: (keyof PengumpulanRow | string)[]) => void;

  fetchData: () => Promise<void>;
  fetchVendor: (id: string) => Promise<void>;
  handleSearch: (q: string) => void;
  handleFilterClick: (field: string) => void;
  handleToggleMenu: (id: string, e: MouseEvent, rowId: string) => void;

  openGenerateLinkModal: (id: ShortlistId) => Promise<void>;
  resetLinkState: () => void;
};

const fallbackCols: (keyof PengumpulanRow)[] = [
  "nama_paket",
  "nama_balai",
  "nama_ppk",
  "jabatan_ppk",
  "kode_rup",
  "status",
];

const usePengumpulanInformasiStore = create<PengumpulanInformasiState>(
  (set, get) => ({
    tableData: [],
    masterData: [],
    currentPage: 1,
    itemsPerPage: 10,
    activeMenu: null,
    menuPosition: { top: 0, left: 0, alignRight: false },
    selectedIdPaket: null,

    urlKuisionerResult: null,
    dateExpired: null,

    activeFilters: [],

    setCurrentPage: (page) => set({ currentPage: page }),
    setActiveMenu: (id) => set({ activeMenu: id }),
    setSelectedIdPaket: (id) => set({ selectedIdPaket: id }),

    setActiveFilters: (cols) => set({ activeFilters: cols }),

    fetchData: async () => {
      const data = await getTableListPengumpulan();
      set({ tableData: data, masterData: data, currentPage: 1 });
    },

    fetchVendor: async (id) => {
      console.log("fetchVendor by id:", id);
    },

    handleSearch: (q) => {
      const { masterData, activeFilters } = get();
      const term = q.trim().toLowerCase();
      if (!term) {
        set({ tableData: masterData, currentPage: 1 });
        return;
      }
      const cols = (
        activeFilters.length > 0 ? activeFilters : fallbackCols
      ) as (keyof PengumpulanRow)[];
      const filtered = masterData.filter((row) =>
        cols.some((k) =>
          String(row?.[k] ?? "")
            .toLowerCase()
            .includes(term)
        )
      );
      set({ tableData: filtered, currentPage: 1 });
    },

    handleFilterClick: (field) => {
      console.log("filter click:", field);
    },

    handleToggleMenu: (id, e) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      set({
        activeMenu: id,
        menuPosition: {
          top: rect.bottom + 8,
          left: rect.left,
          alignRight: rect.right > window.innerWidth / 2,
        },
      });
    },

    openGenerateLinkModal: async (id) => {
      console.log("[store] openGenerateLinkModal:start", { id });
      try {
        const data = await generateLinkPengumpulan(id);
        console.log("[store] openGenerateLinkModal:ok", data);
        set({ urlKuisionerResult: data.url, dateExpired: data.expired_at });
      } catch (e) {
        console.error("[store] openGenerateLinkModal:error", e);
        set({ urlKuisionerResult: null, dateExpired: null });
        throw e;
      }
    },

    resetLinkState: () => set({ urlKuisionerResult: null, dateExpired: null }),
  })
);

export default usePengumpulanInformasiStore;
