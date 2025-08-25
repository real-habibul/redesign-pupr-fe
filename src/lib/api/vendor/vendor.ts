// @lib/api/vendor/vendor.ts
import { http } from "@lib/api/https";

type Files = { logo?: File | null; dokumen?: File | null };

function appendValue(fd: FormData, key: string, val: any) {
  if (val === undefined || val === null) return;
  if (Array.isArray(val)) {
    val.forEach((v) => fd.append(`${key}[]`, String(v)));
    return;
  }
  if (typeof val === "object") {
    fd.append(key, JSON.stringify(val));
    return;
  }
  fd.append(key, String(val));
}

export async function saveVendor(payload: Record<string, any>, files?: Files) {
  const fd = new FormData();
  Object.keys(payload || {}).forEach((k) =>
    appendValue(fd, k, (payload as any)[k])
  );
  if (files?.logo) fd.append("logo", files.logo);
  if (files?.dokumen) fd.append("dokumen", files.dokumen);
  const res = await http.post("/perencanaan-data/store-vendor", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
