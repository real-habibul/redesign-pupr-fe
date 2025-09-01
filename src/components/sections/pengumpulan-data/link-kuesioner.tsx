"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ClipboardText } from "iconsax-react";
import TextInput from "@components/ui/text-input";
import usePengumpulanInformasiStore from "@store/pengumpulan-data/store";
import { useAlert } from "@components/ui/alert";

function extractToken(url?: string | null): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    const tokenFromQuery = u.searchParams.get("token");
    if (tokenFromQuery) return tokenFromQuery;
    const manual = url.split("token=")[1];
    return manual ?? "";
  } catch {
    const manual = url.split("token=")[1];
    return manual ?? "";
  }
}

type Props = {
  shortlistId: number | string | null;
};

const LinkKuesioner: React.FC<Props> = ({ shortlistId }) => {
  const { show } = useAlert();
  const [loading, setLoading] = useState(false);
  const { urlKuisionerResult, dateExpired, openGenerateLinkModal } =
    usePengumpulanInformasiStore();

  useEffect(() => {
    console.log("[LinkKuesioner] shortlist_id =", shortlistId);
  }, [shortlistId]);

  useEffect(() => {
    if (shortlistId == null || typeof openGenerateLinkModal !== "function")
      return;
    setLoading(true);
    openGenerateLinkModal(shortlistId).finally(() => setLoading(false));
  }, [shortlistId, openGenerateLinkModal]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const token = useMemo(
    () => extractToken(urlKuisionerResult),
    [urlKuisionerResult]
  );

  const composedLink = useMemo(() => {
    if (!origin || !token) return "";
    return `${origin}/pengumpulan-data/survei-kuesioner/${token}`;
  }, [origin, token]);

  const handleCopyLink = async () => {
    if (!composedLink) return;
    try {
      await navigator.clipboard.writeText(composedLink);
      show("Link berhasil disalin ke clipboard!", "success");
    } catch {
      show("Gagal menyalin link.", "error");
    }
  };

  return (
    <div className="pl-4 pr-4 pb-4">
      <div className="flex items-end gap-4">
        <TextInput
          label="Link"
          value={
            composedLink ||
            (loading ? "Sedang memuat link..." : "Link tidak ditemukan")
          }
          onChange={() => {}}
          placeholder={loading ? "Memuat..." : "Link tidak ditemukan"}
          disabled
        />
        <button
          type="button"
          onClick={handleCopyLink}
          disabled={!composedLink || loading}
          aria-label="Salin link kuesioner"
          className="w-[52px] h-[52px] rounded-full flex items-center justify-center transition-colors hover:bg-solid_basic_blue_50 cursor-pointer border-2 border-surface_light_outline outline-none focus:outline-solid_basic_blue_500 disabled:opacity-50 disabled:cursor-not-allowed">
          <span className="text-emphasis_light_on_surface_high">
            <ClipboardText size={24} color="currentColor" />
          </span>
        </button>
      </div>
      <div className="text-small text-solid_basic_red_500 mt-2">
        {dateExpired
          ? `Link berlaku hingga: ${dateExpired}`
          : loading
          ? "Memuat tanggal expired..."
          : "Tanggal expired tidak tersedia."}
      </div>
    </div>
  );
};

export default LinkKuesioner;
