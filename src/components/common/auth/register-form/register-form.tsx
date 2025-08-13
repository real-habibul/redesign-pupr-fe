"use client";
import React, { useState, useEffect } from "react";
import TextInput from "@components/ui/text-input";
import Button from "@components/ui/button";
// import FileInput from "../components/FileInput";
// import IconCheckbox from "../components/checkbox";
import { CloseCircle } from "iconsax-react";
import Select from "@components/ui/select";
// import CustomAlert from "../components/alert";

const Register = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [nama_lengkap, setNamaLengkap] = useState("");
  const [nik, setNIK] = useState("");
  const [nrp, setNRP] = useState("");
  const [balai_kerja_id, setBalai] = useState("");
  const [satuan_kerja_id, setSatuanKerja] = useState("");
  const [no_handphone, setNomorTelepon] = useState("");
  const [surat_penugasan_url, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<
    "default" | "processing" | "done"
  >("default");
  const [progress, setProgress] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>(
    {}
  );
  const [generalError, setGeneralError] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    "info" | "success" | "error" | "warning"
  >("info");
  const [alertOpen, setAlertOpen] = useState(false);
  const [balaiOptions, setBalaiOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const labels: Record<string, string> = {
    nama_lengkap: "Nama Lengkap",
    nik: "NIK",
    email: "Email",
    satuan_kerja_id: "Satuan Kerja",
    no_handphone: "Nomor Telepon",
    balai_kerja_id: "Balai",
    surat_penugasan_url: "SK/Surat Penugasan",
  };

  useEffect(() => {
    const fetchBalaiOptions = async () => {
      try {
        const response = await fetch(
          "https://api-ecatalogue-staging.online/api/get-balai-kerja"
        );
        const result = await response.json();
        if (result && result.data && Array.isArray(result.data)) {
          const formattedOptions = result.data.map((item: any) => ({
            value: String(item.id),
            label: item.nama,
          }));
          setBalaiOptions(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching balai options:", error);
      }
    };
    fetchBalaiOptions();
  }, []);

  const satuanKerjaOptions = [{ value: "1", label: "satker_007" }];

  const handleCheckboxChange = () => setIsChecked((prev) => !prev);

  const handleFileSelect = (files: File[]) => {
    if (!files || files.length === 0) {
      setError("File wajib dipilih.");
      return;
    }
    const file = files[0];
    setSelectedFile(file);
    setUploadState("processing");
    setError("");

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("done");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCancel = () => {
    setUploadState("default");
    setSelectedFile(null);
    setProgress(0);
  };

  const handleRegister = async () => {
    setErrorMessages({});
    setGeneralError("");

    const newErrorMessages: Record<string, string> = {};
    if (!nama_lengkap)
      newErrorMessages.nama_lengkap = "Nama Lengkap tidak boleh kosong";
    if (!nik) newErrorMessages.nik = "NIK tidak boleh kosong";
    if (!email) newErrorMessages.email = "Email tidak boleh kosong";
    if (!satuan_kerja_id)
      newErrorMessages.satuan_kerja_id = "Satuan Kerja tidak boleh kosong";
    if (!no_handphone)
      newErrorMessages.no_handphone = "Nomor Telepon tidak boleh kosong";
    if (!balai_kerja_id)
      newErrorMessages.balai_kerja_id = "Balai tidak boleh kosong";
    if (!surat_penugasan_url)
      newErrorMessages.surat_penugasan_url =
        "Upload SK/Surat Penugasan tidak boleh kosong";

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      setGeneralError(
        "Anda belum mengisi kolom: " +
          Object.keys(newErrorMessages)
            .map((key) => labels[key])
            .join(", ")
      );
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("nama_lengkap", nama_lengkap);
    formData.append("nik", nik);
    formData.append("nrp", nrp);
    formData.append("balai_kerja_id", balai_kerja_id);
    formData.append("satuan_kerja_id", satuan_kerja_id);
    formData.append("no_handphone", no_handphone);
    if (surat_penugasan_url)
      formData.append("surat_penugasan_url", surat_penugasan_url);

    // NOTE: FormData tidak perlu di-JSON.stringify
    // const jsonPayload = JSON.stringify(formData);

    try {
      const response = await fetch(
        "https://api-ecatalogue-staging.online/api/store-user",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || result.status === "error") {
        throw new Error(result.message || "Terjadi kesalahan saat registrasi.");
      }

      setAlertMessage(result.message || "Registrasi berhasil!");
      setAlertSeverity("success");
      setAlertOpen(true);

      if (result.status === "success") onClose();
    } catch (error: any) {
      setAlertMessage(error.message);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleSatuanKerjaSelect = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setSatuanKerja(selectedOption.value);
  };
  return (
    <div className="space-y-3 max-w-[90vw] max-h-[90vh] overflow-auto overflow-x-hidden p-4">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-H5 text-emphasis-on_surface-high text-left">
          Buat Akun
        </h5>
        <button className="text-emphasis-on_surface-high" onClick={onClose}>
          <CloseCircle size="24" />
        </button>
      </div>

      <p className="text-B1 text-emphasis-on_surface-medium text-left">
        Daftarkan diri anda segera ke katalog HSPW untuk mendapatkan akses mudah
        aman ke katalog, dan kemudahan administrasi daring.
      </p>

      <div className="flex items-center justify-left gap-x-1">
        <p className="text-Small text-neutral-500">Sudah punya akun?</p>
        <button
          type="button"
          onClick={onClose}
          className="text-ExtraSmall text-solid_basic_blue_500 font-medium hover:underline cursor-pointer">
          Masuk
        </button>
      </div>

      <div className="mb-2">
        <TextInput
          label="Nama Lengkap"
          placeholder="Masukkan Nama Lengkap"
          value={nama_lengkap}
          isRequired
          onChange={(e: any) => setNamaLengkap(e.target.value)}
        />
      </div>

      <div className="flex justify-center items-center">
        <div className="flex gap-x-8 w-full max-w-5xl min-w-0">
          <div className="flex-1 min-w-0 space-y-4">
            <div className="mb2">
              <TextInput
                label="NIK"
                placeholder="Masukkan NIK"
                value={nik}
                isRequired={true}
                onChange={(e: any) => setNIK(e.target.value)}
              />
            </div>
            <div className="mb2">
              <TextInput
                label="NRP"
                placeholder="Masukkan NRP"
                value={nrp}
                onChange={(e: any) => setNRP(e.target.value)}
              />
            </div>
            <div className="mb2">
              <Select
                options={balaiOptions}
                label="Balai"
                placeholder="Pilih Balai"
                value={balai_kerja_id}
                onChange={setBalai}
                required
                menuWidthPx={320}
              />
            </div>
          </div>

          {/* kolom kanan */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="mb2">
              <TextInput
                label="Email"
                placeholder="Masukkan Email"
                value={email}
                isRequired={true}
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb2">
              <Select
                options={satuanKerjaOptions}
                label="Kategori Vendor/Perusahaan"
                placeholder="Pilih kategori vendor/perusahaan"
                value={satuan_kerja_id}
                onChange={setSatuanKerja}
                required
                // menuWidthPx={320}
              />
            </div>
            <div className="mb2">
              <TextInput
                label="Nomor Telepon"
                placeholder="Masukkan Nomor Telepon"
                value={no_handphone}
                isRequired={true}
                onChange={(e: any) => setNomorTelepon(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div>
        <FileInput
          onFileSelect={handleFileSelect}
          setSelectedFile={setSelectedFile}
          buttonText="Pilih Berkas"
          iconLeft={null}
          iconRight={null}
          multiple={false}
          accept=".pdf"
          Label="Unggah SK/Surat Penugasan"
          HelperText="Format .PDF dan maksimal 2MB"
          state={uploadState}
          onCancel={handleCancel}
          selectedFile={surat_penugasan_url}
          required={true}
          maxSizeMB={2}
        />
      </div> */}

      {/* <div>
        <IconCheckbox
          label="Saya setuju dengan syarat dan ketentuan berlaku."
          onChange={handleCheckboxChange}
        />
      </div> */}

      {generalError && (
        <div className="text-custom-red-500 text-sm mt-2">{generalError}</div>
      )}

      <div className="flex flex-row justify-end items-right space-x-4">
        <div className="flex flex-row justify-end items-center gap-4">
          <Button variant="outlined_yellow" fullWidth={false} onClick={onClose}>
            Batal
          </Button>

          <Button
            variant="solid_blue"
            fullWidth={false}
            onClick={handleRegister}
            disabled={!isChecked}>
            Buat Akun
          </Button>
        </div>

        {/* <CustomAlert
          message={alertMessage as any}
          severity={alertSeverity as any}
          openInitially={alertOpen}
          onClose={() => setAlertOpen(false)}
        /> */}
      </div>
    </div>
  );
};

export default Register;
