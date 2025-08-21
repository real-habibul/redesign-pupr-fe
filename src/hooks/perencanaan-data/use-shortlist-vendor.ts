"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  storeShortlistVendor,
  type ShortlistPayloadItem,
} from "@lib/api/perencanaan-data/shortlist-vendor";
import { useAlert } from "@components/ui/alert";
import type {
  FormValues,
  InitialValuesState,
} from "../../types/perencanaan-data/shortlist-vendor";

export function useShortlistSubmit(initialValues: InitialValuesState) {
  const router = useRouter();
  const { show } = useAlert();

  const onSubmit = React.useCallback(
    async (values: FormValues) => {
      const selected = [
        ...(values.material ?? []).filter((i) => i.checked),
        ...(values.peralatan ?? []).filter((i) => i.checked),
        ...(values.tenaga_kerja ?? []).filter((i) => i.checked),
      ];

      if (selected.length === 0) {
        show("Pilih minimal satu vendor untuk disimpan.", "error");
        return;
      }

      const mapped: ShortlistPayloadItem[] = selected
        .map((item) => {
          const found =
            initialValues.material.find((v) => v.id === item.value) ||
            initialValues.peralatan.find((v) => v.id === item.value) ||
            initialValues.tenaga_kerja.find((v) => v.id === item.value);

          return found
            ? {
                data_vendor_id: found.id,
                nama_vendor: found.nama_vendor,
                pemilik_vendor: found.pemilik_vendor ?? null,
                sumber_daya: found.sumber_daya ?? null,
                alamat: found.alamat ?? null,
                kontak: found.kontak ?? null,
              }
            : null;
        })
        .filter(Boolean) as ShortlistPayloadItem[];

      const identifikasiId =
        typeof window !== "undefined"
          ? localStorage.getItem("identifikasi_kebutuhan_id") || ""
          : "";

      try {
        const res = await storeShortlistVendor({
          identifikasi_kebutuhan_id: identifikasiId,
          shortlist_vendor: mapped,
        });

        if (res?.status === "success") {
          if (res.shortlist_vendor_id) {
            localStorage.setItem(
              "shortlist_vendor_id",
              String(res.shortlist_vendor_id)
            );
          }
          const savedCount =
            res?.data?.shortlist_vendor?.length ?? mapped.length;

          show(
            `Berhasil menyimpan ${savedCount} vendor ke shortlist.`,
            "success"
          );

          router.replace("/perencanaan-data/perancangan-kuesioner");
          return;
        }

        show(res?.message ?? "Gagal menyimpan data shortlist.", "error");
      } catch (e: any) {
        const msg =
          e?.friendlyMessage ??
          e?.response?.data?.message ??
          "Terjadi kesalahan saat menyimpan data.";
        show(msg, "error");
      }
    },
    [initialValues, router, show]
  );

  return { onSubmit };
}
