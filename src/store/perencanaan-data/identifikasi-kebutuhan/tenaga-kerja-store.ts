"use client";
import { create } from "zustand";

export type TenagaKerja = {
  id?: string | number;
  shortlist_id?: string | number;
  jenis_tenaga_kerja?: string;
  satuan?: string;
  jumlah_kebutuhan?: string | number;
  kodefikasi?: string;
  provincies_id?: string | number;
  cities_id?: string | number;
};

function safeRandomId(): string {
  const c = (
    globalThis as typeof globalThis & {
      crypto?: Crypto & { randomUUID?: () => string };
    }
  ).crypto;

  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  if (c && typeof c.getRandomValues === "function") {
    const b = new Uint8Array(16);
    c.getRandomValues(b);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
      .slice(6, 8)
      .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
  }
  return `id-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

type TenagaState = {
  byId: Record<string, TenagaKerja>;
  order: string[];
  bulkInit: (items: TenagaKerja[]) => void;
  setField: <T extends keyof TenagaKerja>(
    id: string,
    key: T,
    value: TenagaKerja[T]
  ) => void;
  remove: (id: string) => void;
};

export const useTenagaStore = create<TenagaState>((set) => ({
  byId: {},
  order: [],
  bulkInit: (items) => {
    const byId: Record<string, TenagaKerja> = {};
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

export function useTenagaField<T extends keyof TenagaKerja>(
  id: string,
  key: T
) {
  return useTenagaStore((s) => s.byId[id]?.[key]);
}
export function useTenagaOrder() {
  return useTenagaStore((s) => s.order);
}
export function useSetTenagaField() {
  return useTenagaStore((s) => s.setField);
}
export function useRemoveTenagaRow() {
  return useTenagaStore((s) => s.remove);
}
