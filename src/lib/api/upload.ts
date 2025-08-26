import { http } from "@lib/api/https";

type UploadArgs = {
  path: string;
  formData: FormData;
  onProgress?: (percent: number) => void;
};

export async function uploadFile({ path, formData, onProgress }: UploadArgs) {
  const res = await http.post(path, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (!evt || typeof evt.total !== "number" || evt.total <= 0) return;
      const pct = Math.round((evt.loaded / evt.total) * 100);
      onProgress?.(pct);
    },
  });
  return res.data;
}
