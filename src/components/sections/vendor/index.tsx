"use client";
import * as React from "react";
import TextInput from "@components/ui/text-input";
import Button from "@components/ui/button";
import MapPicker from "@components/common/map/map-picker";
import { useVendorForm } from "@hooks/vendor/use-vendor-form";
import { saveVendor } from "@lib/api/vendor/vendor";
import { useAlert } from "@components/ui/alert";
import Checkbox from "@components/ui/checkbox";
import FileInput from "@components/ui/file-input";
import MUISelect from "@components/ui/select";
import SumberDayaTable, {
  type SumberDayaTableHandle,
} from "./sumber-daya-table";
import Tabs from "@components/ui/tabs";
import SearchBox, { type FilterOption } from "@components/ui/searchbox";

type UiOption = { value: string; label: string };
type RowSD = { sumber: string; spesifikasi: string };
type FileState = "default" | "processing" | "done";

function toUiOptions(list: unknown): UiOption[] {
  if (!Array.isArray(list)) return [];
  return list.map((o) => {
    const r = o as Record<string, unknown>;
    const v = r?.value;
    const l = r?.label;
    return {
      value: String(v ?? ""),
      label: typeof l === "string" ? l : String(l ?? ""),
    };
  });
}
function findUiOption(
  opts: readonly UiOption[],
  val: string
): UiOption | undefined {
  return opts.find((o) => o.value === String(val));
}

type Props = { onNext?: () => void; onBack?: () => void; onClose?: () => void };

const defaultCenter = { lat: -6.236307766247564, lng: 106.80058533427567 };

export default function InputVendorSection({ onNext, onBack }: Props) {
  const {
    provinsiOptions,
    kotaOptions,
    kategoriOptions,
    selectedTypes,
    toggleJenis,
    handleProvinsiChange,
    handleKotaChange,
    setKategori,
    payload,
    set_nama_vendor,
    set_alamat,
    set_no_telepon,
    set_no_hp,
    set_sumber_daya,
    set_nama_pic,
    set_koordinat,
  } = useVendorForm();

  const { show } = useAlert();
  const [marker, setMarker] = React.useState(defaultCenter);

  const [logoState, setLogoState] = React.useState<FileState>("default");
  const [logoFile, setLogoFile] = React.useState<File | null>(null);

  const [dokState, setDokState] = React.useState<FileState>("default");
  const [dokFile, setDokFile] = React.useState<File | null>(null);

  const [sumberDetail, setSumberDetail] = React.useState<RowSD[]>([]);
  const [sumberMaterial, setSumberMaterial] = React.useState<RowSD[]>([]);
  const [sumberPeralatan, setSumberPeralatan] = React.useState<RowSD[]>([]);
  const [sumberTenaga, setSumberTenaga] = React.useState<RowSD[]>([]);

  const [activeTab, setActiveTab] = React.useState<0 | 1 | 2>(0);

  const initialFilters: FilterOption[] = React.useMemo(
    () => [
      { label: "Dengan spesifikasi", checked: true, value: "hasSpec" },
      { label: "Tanpa spesifikasi", checked: true, value: "noSpec" },
    ],
    []
  );

  const [queryByTab, setQueryByTab] = React.useState<string[]>(["", "", ""]);
  const [filtersByTab, setFiltersByTab] = React.useState<FilterOption[][]>([
    initialFilters,
    initialFilters,
    initialFilters,
  ]);

  const materialRef = React.useRef<SumberDayaTableHandle | null>(null);
  const peralatanRef = React.useRef<SumberDayaTableHandle | null>(null);
  const tenagaRef = React.useRef<SumberDayaTableHandle | null>(null);

  React.useEffect(() => {
    set_koordinat(`${marker.lat}, ${marker.lng}`);
  }, [marker, set_koordinat]);

  const kategoriValue = React.useMemo(() => {
    const arr = payload.kategori_vendor_id;
    return Array.isArray(arr) ? arr.map(String).join(",") : "";
  }, [payload.kategori_vendor_id]);

  const mergeAndEmit = React.useCallback(
    (m: RowSD[], p: RowSD[], t: RowSD[]) => {
      const merged = [...m, ...p, ...t].filter((r) => (r.sumber ?? "").trim());
      setSumberDetail(merged);
      set_sumber_daya(merged.map((r) => r.sumber.trim()).join(","));
    },
    [setSumberDetail, set_sumber_daya]
  );

  React.useEffect(() => {
    mergeAndEmit(sumberMaterial, sumberPeralatan, sumberTenaga);
  }, [sumberMaterial, sumberPeralatan, sumberTenaga, mergeAndEmit]);

  const provOpts = React.useMemo(
    () => toUiOptions(provinsiOptions),
    [provinsiOptions]
  );
  const kotaOpts = React.useMemo(() => toUiOptions(kotaOptions), [kotaOptions]);
  const kategoriOpts = React.useMemo(
    () => toUiOptions(kategoriOptions),
    [kategoriOptions]
  );

  const onSave = async () => {
    try {
      if (logoFile) setLogoState("processing");
      if (dokFile) setDokState("processing");

      const { logo_url, dok_pendukung_url, ...rest } = payload as Record<
        string,
        unknown
      >;
      const cleanPayload = {
        ...rest,
        jenis_vendor: selectedTypes,
        sumber_daya_detail: JSON.stringify(sumberDetail),
      };

      const res = await saveVendor(
        cleanPayload as Parameters<typeof saveVendor>[0],
        { logo: logoFile, dokumen: dokFile }
      );

      setLogoState(logoFile ? "done" : "default");
      setDokState(dokFile ? "done" : "default");

      show(
        (res as { message?: string })?.message || "Input vendor berhasil!",
        "success"
      );
      onNext?.();
    } catch (e: unknown) {
      setLogoState("default");
      setDokState("default");
      const msg =
        (typeof e === "object" && e && "friendlyMessage" in e
          ? (e as { friendlyMessage?: string }).friendlyMessage
          : undefined) ||
        (e instanceof Error ? e.message : undefined) ||
        "Data gagal disimpan.";
      show(msg, "error");
    }
  };

  const cancelLogo = () => {
    setLogoFile(null);
    setLogoState("default");
  };
  const cancelDok = () => {
    setDokFile(null);
    setDokState("default");
  };

  const tabDefs = [
    { label: "Material" },
    { label: "Peralatan" },
    { label: "Tenaga Kerja" },
  ] as const;

  const handleAddRow = () => {
    if (activeTab === 0) materialRef.current?.addRow();
    else if (activeTab === 1) peralatanRef.current?.addRow();
    else tenagaRef.current?.addRow();
  };

  const currentFilters = filtersByTab[activeTab] ?? initialFilters;

  const setCurrentQuery = (v: string) => {
    setQueryByTab((prev) => {
      const next = [...prev];
      next[activeTab] = v;
      return next;
    });
  };
  const setCurrentFilters = (v: FilterOption[]) => {
    setFiltersByTab((prev) => {
      const next = [...prev];
      next[activeTab] = v;
      return next;
    });
  };

  return (
    <div className="p-8">
      <div className="p-6">
        <h3 className="text-H3 text-emphasis_light_on_surface_high">
          Input Data Vendor
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
          <div className="col-span-1 grid grid-cols-1 gap-6 py-8 px-6 rounded-[16px] bg-solid_basic_neutral_100">
            <TextInput
              label="Nama Vendor/Perusahaan"
              placeholder="Masukkan nama vendor/perusahaan"
              isRequired
              value={payload.nama_vendor}
              onChange={(e) => set_nama_vendor(e.target.value)}
            />

            <div>
              <p className="text-B2 mb-1">Jenis Responden/ Vendor</p>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <Checkbox
                  label="Material"
                  checked={selectedTypes.includes("1")}
                  onChange={() => toggleJenis("1")}
                  shape="rounded-square"
                />
                <Checkbox
                  label="Peralatan"
                  checked={selectedTypes.includes("2")}
                  onChange={() => toggleJenis("2")}
                  shape="rounded-square"
                />
                <Checkbox
                  label="Tenaga Kerja"
                  checked={selectedTypes.includes("3")}
                  onChange={() => toggleJenis("3")}
                  shape="rounded-square"
                />
              </div>
            </div>

            <MUISelect
              label="Kategori Vendor/Perusahaan"
              value={kategoriValue}
              onChange={(val: string) => {
                const opt = findUiOption(kategoriOpts, val) ?? null;
                (setKategori as (o: UiOption | null) => void)(opt);
              }}
              options={kategoriOpts}
              placeholder="Pilih kategori vendor/perusahaan"
              required
            />

            <div>
              <p className="text-B2">Sumber daya yang dimiliki</p>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Tabs
                    tabs={tabDefs.map((t) => ({
                      label: t.label,
                      content: null,
                    }))}
                    tabListSx={{
                      bgcolor: "var(--color-surface-light-background)",
                    }}
                    value={activeTab}
                    onChange={(i: number) => setActiveTab(i as 0 | 1 | 2)}
                  />
                </div>
                <div className="mt-1">
                  <Button
                    variant="solid_blue"
                    size="small"
                    onClick={handleAddRow}>
                    Tambah Baris
                  </Button>
                </div>
              </div>

              <div className="mt-1">
                <SearchBox
                  placeholder="Cari sumber daya atau spesifikasi…"
                  onSearch={setCurrentQuery}
                  width="100%"
                  debounceDelay={200}
                  withFilter
                  filterOptions={currentFilters}
                  onFilterClick={setCurrentFilters}
                  onApplyFilters={setCurrentFilters}
                />
              </div>

              <div className="mt-1">
                {activeTab === 0 && (
                  <SumberDayaTable
                    ref={materialRef}
                    initialCSV={payload.sumber_daya}
                    onRowsChange={setSumberMaterial}
                    externalQuery={queryByTab[0]}
                    externalFilters={filtersByTab[0]}
                  />
                )}
                {activeTab === 1 && (
                  <SumberDayaTable
                    ref={peralatanRef}
                    onRowsChange={setSumberPeralatan}
                    externalQuery={queryByTab[1]}
                    externalFilters={filtersByTab[1]}
                  />
                )}
                {activeTab === 2 && (
                  <SumberDayaTable
                    ref={tenagaRef}
                    onRowsChange={setSumberTenaga}
                    externalQuery={queryByTab[2]}
                    externalFilters={filtersByTab[2]}
                  />
                )}
              </div>
            </div>

            <TextInput
              label="Alamat vendor atau perusahaan"
              placeholder="Masukkan alamat"
              isRequired
              value={payload.alamat}
              onChange={(e) => set_alamat(e.target.value)}
            />

            <div className="flex gap-6">
              <TextInput
                label="Nomor Telepon"
                placeholder="Masukkan nomor telepon"
                isRequired
                value={payload.no_telepon}
                onChange={(e) => set_no_telepon(e.target.value)}
              />
              <TextInput
                label="Nomor HP"
                placeholder="Masukkan nomor HP"
                isRequired
                value={payload.no_hp}
                onChange={(e) => set_no_hp(e.target.value)}
              />
            </div>

            <TextInput
              label="Nama PIC"
              placeholder="Masukkan nama PIC"
              isRequired
              value={payload.nama_pic}
              onChange={(e) => set_nama_pic(e.target.value)}
            />

            <div className="flex gap-6">
              <MUISelect
                label="Pilih Provinsi"
                value={payload.provinsi_id || ""}
                onChange={(val: string) => {
                  const opt = findUiOption(provOpts, val) ?? null;
                  (handleProvinsiChange as (o: UiOption | null) => void)(opt);
                }}
                options={provOpts}
                placeholder="Pilih Provinsi"
                required
              />
              <MUISelect
                label="Pilih Kota"
                value={payload.kota_id || ""}
                onChange={(val: string) => {
                  const opt = findUiOption(kotaOpts, val) ?? null;
                  (handleKotaChange as (o: UiOption | null) => void)(opt);
                }}
                options={kotaOpts}
                placeholder="Pilih Kota"
                required
              />
            </div>
          </div>

          <div className="col-span-1 grid grid-cols-1 gap-6 py-8 px-6 rounded-[16px] bg-solid_basic_neutral_100">
            <MapPicker
              center={defaultCenter}
              value={marker}
              onChange={setMarker}
            />
            <TextInput
              label="Koordinat"
              placeholder="Masukkan Koordinat"
              value={`${marker.lat}, ${marker.lng}`}
              onChange={(e) => {
                const [lat, lng] = e.target.value
                  .split(",")
                  .map((n) => parseFloat(n.trim()));
                if (!Number.isNaN(lat) && !Number.isNaN(lng))
                  setMarker({ lat, lng });
              }}
            />

            <FileInput
              onFileSelect={(files: File[]) => {
                const f = files?.[0] || null;
                setLogoFile(f);
                setLogoState("default");
              }}
              setSelectedFile={setLogoFile}
              buttonText="Pilih Berkas"
              multiple={false}
              accept=".jpg,.jpeg"
              Label="Unggah Logo"
              HelperText="Format .JPG, .JPEG dan maksimal 2MB"
              state={logoState}
              onCancel={cancelLogo}
              selectedFile={logoFile}
              maxSizeMB={2}
            />

            <FileInput
              onFileSelect={(files: File[]) => {
                const f = files?.[0] || null;
                setDokFile(f);
                setDokState("default");
              }}
              setSelectedFile={setDokFile}
              buttonText="Pilih Berkas"
              multiple={false}
              accept=".pdf"
              Label="Unggah Dokumen Pendukung"
              HelperText="Format .PDF dan maksimal 2MB"
              state={dokState}
              onCancel={cancelDok}
              selectedFile={dokFile}
              maxSizeMB={2}
            />
          </div>
        </div>

        <div className="flex flex-row justify-end space-x-4 mt-3 bg-solid_basic_neutral_100 px-6 py-6 rounded-[16px]">
          <Button variant="outlined_yellow" size="medium" onClick={onBack}>
            Kembali
          </Button>
          <Button variant="solid_blue" size="medium" onClick={onSave}>
            Simpan & Lanjut
          </Button>
        </div>
      </div>
    </div>
  );
}
