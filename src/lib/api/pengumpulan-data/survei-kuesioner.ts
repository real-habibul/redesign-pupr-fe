"use client";

import axios, { isAxiosError } from "axios";
import { http } from "@lib/api/https";
import type {
  FormValues,
  ActionType,
} from "../../../types/pengumpulan-data/survei-kuesioner";

export const DEFAULT_SUBMIT_URL =
  "https://api-ecatalogue-staging.online/api/pengumpulan-data/store-entri-data";

export function validateFields(values: FormValues, action: ActionType) {
  if (action === "draft") return { ok: true as const };
  if (!values.tanggal_survei)
    return { ok: false as const, msg: "Tanggal survei wajib diisi!" };
  if (!values.user_id_petugas_lapangan)
    return { ok: false as const, msg: "Petugas lapangan wajib diisi!" };
  if (!values.user_id_pengawas)
    return { ok: false as const, msg: "Pengawas wajib diisi!" };
  if (!values.nama_pemberi_informasi)
    return { ok: false as const, msg: "Nama pemberi informasi wajib diisi!" };
  return { ok: true as const };
}

export async function submitForm(params: {
  values: FormValues;
  submitUrl?: string;
  currentAction: ActionType;
  identifikasi_kebutuhan_id?: string | number;
  data_vendor_id?: string | number;
}) {
  const {
    values,
    submitUrl = DEFAULT_SUBMIT_URL,
    currentAction,
    identifikasi_kebutuhan_id,
    data_vendor_id,
  } = params;

  const payload = {
    type_save: currentAction === "draft" ? "draft" : "final",
    user_id_petugas_lapangan: values.user_id_petugas_lapangan,
    user_id_pengawas: values.user_id_pengawas,
    nama_pemberi_informasi: values.nama_pemberi_informasi,
    identifikasi_kebutuhan_id,
    tanggal_survei: values.tanggal_survei,
    tanggal_pengawasan: values.tanggal_pengawasan,
    material: values.material ?? [],
    peralatan: values.peralatan ?? [],
    tenaga_kerja: values.tenaga_kerja ?? [],
    data_vendor_id,
  };

  try {
    const res = await axios.post(submitUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return {
      ok: res.data?.status === "success",
      message: res.data?.message as string | undefined,
    };
  } catch (err) {
    const message = isAxiosError(err)
      ? err.response?.data?.message ?? err.message
      : "Gagal menyimpan data.";
    return { ok: false, message };
  }
}

export type ID = string | number;

export interface ResourceItem {
  nama: string;
  spesifikasi: string;
}
export type MaterialItem = ResourceItem;
export type PeralatanItem = ResourceItem;
export type TenagaKerjaItem = ResourceItem;

export interface SurveyData {
  data_vendor_id: string;
  identifikasi_kebutuhan_id: string;
  material: MaterialItem[];
  peralatan: PeralatanItem[];
  tenaga_kerja: TenagaKerjaItem[];
}

interface ApiSuccess<T> {
  status: "success";
  message: string;
  data: T;
}

export async function fetchSurveyByToken(token: string): Promise<SurveyData> {
  const { data } = await http.get<ApiSuccess<SurveyData>>(
    "/survey-kuisioner/get-data-survey",
    { params: { token } }
  );
  return data.data;
}

export interface UserApi {
  user_id: string | number;
  nama_lengkap: string;
  nip: string;
}
export interface UsersResponse {
  data: UserApi[];
}

export async function listUsersByRole(role: string): Promise<UserApi[]> {
  const { data } = await http.get<UsersResponse>(
    "/pengumpulan-data/list-user",
    { params: { role } }
  );
  return Array.isArray(data?.data) ? data.data : [];
}
