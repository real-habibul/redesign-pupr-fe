"use client";
import { create } from "zustand";

export type Peralatan = {
  id?: string | number;
  shortlist_id?: string | number;
  nama_peralatan?: string;
  satuan?: string;
  spesifikasi?: string;
  kapasitas?: string | number;
  kodefikasi?: string;
  kelompok_peralatan?: string | number;
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

type PeralatanState = {
  byId: Record<string, Peralatan>;
  order: string[];
  bulkInit: (items: Peralatan[]) => void;
  setField: <K extends keyof Peralatan>(
    id: string,
    key: K,
    value: Peralatan[K]
  ) => void;
  remove: (id: string) => void;
};

export const usePeralatanStore = create<PeralatanState>((set) => ({
  byId: {},
  order: [],
  bulkInit: (items) => {
    const byId: Record<string, Peralatan> = {};
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

export function usePeralatanField<T extends keyof Peralatan>(
  id: string,
  key: T
) {
  return usePeralatanStore((s) => s.byId[id]?.[key]);
}
export function usePeralatanRow(id: string) {
  return usePeralatanStore((s) => s.byId[id]);
}
export function usePeralatanOrder() {
  return usePeralatanStore((s) => s.order);
}
export function useSetPeralatanField() {
  return usePeralatanStore((s) => s.setField);
}
export function useRemovePeralatanRow() {
  return usePeralatanStore((s) => s.remove);
}
