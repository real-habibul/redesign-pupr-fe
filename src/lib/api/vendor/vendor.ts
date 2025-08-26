// @lib/api/vendor/vendor.ts
import { http } from "@lib/api/https";

type Files = { logo?: File | null; dokumen?: File | null };

type Primitive = string | number | boolean | null | undefined;
type JSONValue = Primitive | { [k: string]: JSONValue } | JSONValue[];
type FormDataValue = Primitive | JSONValue[] | { [k: string]: JSONValue };

type SaveVendorResponse = {
  status?: string;
  message?: string;
  data?: unknown;
};

function appendValue(fd: FormData, key: string, val: FormDataValue): void {
  if (val === undefined || val === null) return;
  if (Array.isArray(val)) {
    val.forEach((v) => fd.append(`${key}[]`, String(v as Primitive)));
    return;
  }
  if (typeof val === "object") {
    fd.append(key, JSON.stringify(val));
    return;
  }
  fd.append(key, String(val));
}

export async function saveVendor(
  payload: Record<string, FormDataValue>,
  files?: Files
): Promise<SaveVendorResponse> {
  const fd = new FormData();

  Object.entries(payload || {}).forEach(([k, v]) => appendValue(fd, k, v));

  if (files?.logo) fd.append("logo", files.logo);
  if (files?.dokumen) fd.append("dokumen", files.dokumen);

  const res = await http.post<SaveVendorResponse>(
    "/perencanaan-data/store-vendor",
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}
