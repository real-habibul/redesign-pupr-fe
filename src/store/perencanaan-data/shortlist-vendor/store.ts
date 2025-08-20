"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import type {
  InitialValuesState,
  VendorItem,
} from "../../../types/perencanaan-data/shortlist-vendor";

export type Sev = "success" | "error" | "info" | "warning";

type Tahap3State = {
  initialValues: InitialValuesState;

  currentTab: 0 | 1 | 2;

  alertMessage: string;
  alertSeverity: Sev;
  isAlertOpen: boolean;
  isLoadingStatus: boolean;
  statusProgres?: unknown;

  setInitialValues: (values: InitialValuesState) => void;
  upsertList: (payload: Partial<InitialValuesState>) => void;

  setCurrentTab: (index: 0 | 1 | 2) => void;

  setAlertMessage: (message: string) => void;
  setAlertSeverity: (severity: Sev) => void;
  setIsAlertOpen: (open: boolean) => void;

  fetchStatusProgres: () => Promise<void>;
};

const defaultInitialValues: InitialValuesState = {
  material: [],
  peralatan: [],
  tenaga_kerja: [],
};

const useTahap3Store = create<Tahap3State>()(
  devtools(
    persist(
      (set, get) => ({
        initialValues: defaultInitialValues,
        currentTab: 0,
        alertMessage: "",
        alertSeverity: "info",
        isAlertOpen: false,
        isLoadingStatus: false,
        statusProgres: undefined,

        setInitialValues: (values) => {
          set({ initialValues: values }, false, "tahap3/setInitialValues");
        },

        upsertList: (payload) => {
          const prev = get().initialValues;
          set(
            {
              initialValues: {
                material: payload.material ?? prev.material,
                peralatan: payload.peralatan ?? prev.peralatan,
                tenaga_kerja: payload.tenaga_kerja ?? prev.tenaga_kerja,
              },
            },
            false,
            "tahap3/upsertList"
          );
        },

        setCurrentTab: (index) => {
          set({ currentTab: index }, false, "tahap3/setCurrentTab");
        },

        setAlertMessage: (message) => {
          set({ alertMessage: message }, false, "tahap3/setAlertMessage");
        },

        setAlertSeverity: (severity) => {
          set({ alertSeverity: severity }, false, "tahap3/setAlertSeverity");
        },

        setIsAlertOpen: (open) => {
          set({ isAlertOpen: open }, false, "tahap3/setIsAlertOpen");
        },

        fetchStatusProgres: async () => {
          set(
            { isLoadingStatus: true },
            false,
            "tahap3/fetchStatusProgres:start"
          );
          try {
            // contoh kalau nanti ada helper:
            // const res = await getStatusProgres();
            // set({ statusProgres: res }, false, "tahap3/fetchStatusProgres:success");
          } catch (e) {
            // optional: set alert error
          } finally {
            set(
              { isLoadingStatus: false },
              false,
              "tahap3/fetchStatusProgres:done"
            );
          }
        },
      }),
      {
        name: "tahap3-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          initialValues: state.initialValues,
          currentTab: state.currentTab,
        }),
      }
    ),
    { name: "tahap3-store-devtools" }
  )
);

export default useTahap3Store;
