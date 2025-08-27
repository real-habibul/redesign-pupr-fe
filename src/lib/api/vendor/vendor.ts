import { http } from "@lib/api/https";

type Files = { logo?: File | null; dokumen?: File | null };

type Primitive = string | number | boolean | null | undefined;
type JSONLike = Primitive | { [k: string]: JSONLike } | JSONLike[];

export type SumberDayaItem = { nama: string; spesifikasi: string };
export type SumberDayaGroup = {
  material: SumberDayaItem[];
  peralatan: SumberDayaItem[];
  tenaga_kerja: SumberDayaItem[];
};

type Payload =
  | Record<string, Primitive | JSONLike>
  | (Record<string, Primitive | JSONLike> & {
      sumber_daya?: SumberDayaGroup[];
    });

function appendSimple(fd: FormData, key: string, val: Primitive | JSONLike) {
  if (val === undefined || val === null) return;
  if (typeof val === "object") {
    fd.append(key, JSON.stringify(val));
  } else {
    fd.append(key, String(val));
  }
}

function appendSumberDaya(fd: FormData, groups: SumberDayaGroup[]) {
  const one = groups?.[0];
  if (!one) return;
  (["material", "peralatan", "tenaga_kerja"] as const).forEach((k) => {
    const list = one[k] ?? [];
    list.forEach((item, idx) => {
      fd.append(`sumber_daya[${k}][${idx}][nama]`, item.nama ?? "");
      fd.append(
        `sumber_daya[${k}][${idx}][spesifikasi]`,
        item.spesifikasi ?? ""
      );
    });
  });
}

export type SaveVendorResponse = {
  status?: string;
  message?: string;
  data?: unknown;
};

export async function saveVendor(
  payload: Payload,
  files?: Files
): Promise<SaveVendorResponse> {
  const fd = new FormData();

  const { sumber_daya, ...rest } =
    (payload as { sumber_daya?: SumberDayaGroup[] }) ?? {};
  Object.entries(rest).forEach(([k, v]) => appendSimple(fd, k, v as JSONLike));
  if (Array.isArray(sumber_daya)) appendSumberDaya(fd, sumber_daya);

  if (files?.logo) fd.append("logo", files.logo);
  if (files?.dokumen) fd.append("dokumen", files.dokumen);

  const res = await http.post<SaveVendorResponse>("/input-vendor", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
