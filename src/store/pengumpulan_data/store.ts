"use client";
import { create } from "zustand";

type PengumpulanInformasiState = {
  tableData: any[];
  masterData: any[];
  currentPage: number;
  itemsPerPage: number;
  activeMenu: string | null;
  menuPosition: { top: number; left: number; alignRight: boolean };
  selectedIdPaket: string | null;

  urlKuisionerResult: string | null;
  dateExpired: string | null;

  activeFilters: string[];

  setCurrentPage: (page: number) => void;
  setActiveMenu: (id: string | null) => void;
  setSelectedIdPaket: (id: string | null) => void;

  setActiveFilters: (cols: string[]) => void;

  fetchData: () => Promise<void>;
  fetchVendor: (id: string) => Promise<void>;
  handleSearch: (q: string) => void;
  handleFilterClick: (field: string) => void;
  handleToggleMenu: (id: string, e: MouseEvent, rowId: string) => void; // pakai MouseEvent

  openGenerateLinkModal: (id: string) => Promise<void>;
};

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
      const res = await fetch("/api/pengumpulan-data/table-list-pengumpulan");
      const data = await res.json();
      set({ tableData: data, masterData: data });
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

      const fallbackCols = [
        "nama_paket",
        "nama_balai",
        "nama_ppk",
        "jabatan_ppk",
        "kode_rup",
        "status",
      ];
      const cols = activeFilters.length > 0 ? activeFilters : fallbackCols;

      const filtered = masterData.filter((row: any) =>
        cols.some((k) =>
          String(row?.[k] ?? "")
            .toLowerCase()
            .includes(term)
        )
      );

      set({ tableData: filtered, currentPage: 1 });
    },

    handleFilterClick: (field) => {
      console.log("filter click (legacy):", field);
    },

    handleToggleMenu: (id, e) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      set({
        activeMenu: id,
        menuPosition: {
          top: rect.bottom,
          left: rect.left,
          alignRight: rect.right > window.innerWidth / 2,
        },
      });
    },

    openGenerateLinkModal: async (id) => {
      const res = await fetch(`/api/pengumpulan-data/generate-link?id=${id}`);
      const data = await res.json();
      set({
        urlKuisionerResult: data.url,
        dateExpired: data.expired_at,
      });
    },
  })
);

export default usePengumpulanInformasiStore;
