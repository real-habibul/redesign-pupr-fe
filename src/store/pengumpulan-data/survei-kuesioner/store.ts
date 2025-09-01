import { create } from "zustand";
import {
  fetchSurveyByToken,
  listUsersByRole,
  type SurveyData,
  type MaterialItem,
  type PeralatanItem,
  type TenagaKerjaItem,
  type UserApi,
} from "@lib/api/pengumpulan-data/survei-kuesioner";
import { isAxiosError } from "axios";

export interface UserOption {
  value: string;
  label: string;
  nip: string;
}

export interface InitialValues {
  user_id_petugas_lapangan: string;
  user_id_pengawas: string;
  nip_petugas_lapangan: string;
  nip_pengawas: string;
  nama_pemberi_informasi: string;
  data_vendor_id: string;
  identifikasi_kebutuhan_id: string;
  material: MaterialItem[];
  peralatan: PeralatanItem[];
  tenaga_kerja: TenagaKerjaItem[];
}

export interface SurveiKuesionerState {
  selectedValue: number;
  petugasLapanganuserOptions: UserOption[];
  pengawasUserOptions: UserOption[];
  initialValues: InitialValues;
  dataEntri: SurveyData | null;
  material: MaterialItem[] | null;
  peralatan: PeralatanItem[] | null;
  tenaga_kerja: TenagaKerjaItem[] | null;
  data_vendor_id: string;
  identifikasi_kebutuhan_id: string;

  setSelectedValue: (value: number) => void;
  fetchData: (token: string) => Promise<void>;
  fetchPetugasLapanganUserOptions: () => Promise<void>;
  fetchPengawasUserOptions: () => Promise<void>;
}

const mapUserToOption = (u: UserApi): UserOption => ({
  value: String(u.user_id),
  label: u.nama_lengkap,
  nip: u.nip,
});

const useSurveiKuesionerStore = create<SurveiKuesionerState>((set) => ({
  selectedValue: 0,
  petugasLapanganuserOptions: [],
  pengawasUserOptions: [],
  initialValues: {
    user_id_petugas_lapangan: "",
    user_id_pengawas: "",
    nip_petugas_lapangan: "",
    nip_pengawas: "",
    nama_pemberi_informasi: "",
    data_vendor_id: "",
    identifikasi_kebutuhan_id: "",
    material: [],
    peralatan: [],
    tenaga_kerja: [],
  },
  dataEntri: null,
  material: null,
  peralatan: null,
  tenaga_kerja: null,
  data_vendor_id: "",
  identifikasi_kebutuhan_id: "",

  setSelectedValue: (value) => set({ selectedValue: value }),

  fetchData: async (token: string) => {
    try {
      const data = await fetchSurveyByToken(token);

      set((state) => ({
        dataEntri: data,
        material: data.material ?? [],
        peralatan: data.peralatan ?? [],
        tenaga_kerja: data.tenaga_kerja ?? [],
        initialValues: {
          ...state.initialValues,
          data_vendor_id: data.data_vendor_id ?? "",
          identifikasi_kebutuhan_id: data.identifikasi_kebutuhan_id ?? "",
          material: data.material ?? [],
          peralatan: data.peralatan ?? [],
          tenaga_kerja: data.tenaga_kerja ?? [],
        },
        data_vendor_id: data.data_vendor_id ?? "",
        identifikasi_kebutuhan_id: data.identifikasi_kebutuhan_id ?? "",
      }));
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data ?? err.message : err;
      console.error("Error fetchData:", msg);
    }
  },

  fetchPetugasLapanganUserOptions: async () => {
    try {
      const users = await listUsersByRole("Petugas Lapangan");
      set({ petugasLapanganuserOptions: users.map(mapUserToOption) });
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data ?? err.message : err;
      console.error("Error fetchPetugasLapanganUserOptions:", msg);
    }
  },

  fetchPengawasUserOptions: async () => {
    try {
      const users = await listUsersByRole("Pengawas");
      set({ pengawasUserOptions: users.map(mapUserToOption) });
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data ?? err.message : err;
      console.error("Error fetchPengawasUserOptions:", msg);
    }
  },
}));

export default useSurveiKuesionerStore;
