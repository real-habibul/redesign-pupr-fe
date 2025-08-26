"use client";
import { create } from "zustand";

export type Material = {
  id?: string | number;
  shortlist_id?: string | number;
  nama_material?: string;
  satuan?: string;
  spesifikasi?: string;
  ukuran?: string;
  kodefikasi?: string;
  kelompok_material?: string | number;
  jumlah_kebutuhan?: string | number;
  merk?: string;
  provincies_id?: string | number;
  cities_id?: string | number;
};

function safeRandomId(): string {
  if (typeof crypto !== "undefined") {
    const c = crypto as Crypto & { randomUUID?: () => string };
    if (typeof c.randomUUID === "function") return c.randomUUID();
    if (typeof c.getRandomValues === "function") {
      const b = new Uint8Array(16);
      c.getRandomValues(b);
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0"));
      return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
        .slice(6, 8)
        .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
    }
  }
  return `id-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

type MaterialsState = {
  byId: Record<string, Material>;
  order: string[];
  bulkInit: (items: Material[]) => void;
  setField: <K extends keyof Material>(
    id: string,
    key: K,
    value: Material[K]
  ) => void;
  remove: (id: string) => void;
};

export const useMaterialsStore = create<MaterialsState>((set) => ({
  byId: {},
  order: [],
  bulkInit: (items) => {
    const byId: Record<string, Material> = {};
    const order: string[] = [];
    for (const it of items ?? []) {
      const rid = String(it.id ?? it.shortlist_id ?? safeRandomId());
      byId[rid] = { ...it, id: it.id ?? it.shortlist_id ?? rid };
      order.push(rid);
    }
    set({ byId, order });
  },
  setField: (id, key, value) => {
    set((s) => ({
      byId: { ...s.byId, [id]: { ...s.byId[id], [key]: value } },
    }));
  },
  remove: (id) => {
    set((s) => {
      const n = { ...s.byId };
      delete n[id];
      return { byId: n, order: s.order.filter((x) => x !== id) };
    });
  },
}));

export function useMaterialField<T extends keyof Material>(id: string, key: T) {
  return useMaterialsStore((s) => s.byId[id]?.[key]);
}
export function useMaterialRow(id: string) {
  return useMaterialsStore((s) => s.byId[id]);
}
export function useOrder() {
  return useMaterialsStore((s) => s.order);
}
export function useSetField() {
  return useMaterialsStore((s) => s.setField);
}
export function useRemoveRow() {
  return useMaterialsStore((s) => s.remove);
}
