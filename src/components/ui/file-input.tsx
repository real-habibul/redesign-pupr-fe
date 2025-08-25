"use client";
import * as React from "react";
import Button from "@mui/material/Button";

type FileState = "default" | "processing" | "done";

type Props = {
  onFileSelect: (files: File[]) => void;
  setSelectedFile: (f: File | null) => void;
  buttonText?: string;
  multiple?: boolean;
  accept?: string;
  Label?: string;
  HelperText?: string;
  state?: FileState;
  onCancel?: () => void;
  selectedFile?: File | null;
  maxSizeMB?: number;
  disabled?: boolean;
};

export default function FileInput({
  onFileSelect,
  setSelectedFile,
  buttonText = "Pilih Berkas",
  multiple = false,
  accept,
  Label,
  HelperText,
  state = "default",
  onCancel,
  selectedFile,
  maxSizeMB = 2,
  disabled = false,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handlePick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const maxBytes = maxSizeMB * 1024 * 1024;
    const oversized = files.find((f) => f.size > maxBytes);
    if (oversized) {
      setError(`Ukuran berkas melebihi ${maxSizeMB}MB`);
      e.target.value = "";
      return;
    }
    if (!multiple) {
      setSelectedFile(files[0] || null);
      onFileSelect(files.slice(0, 1));
    } else {
      setSelectedFile(files[0] || null);
      onFileSelect(files);
    }
  };

  const isProcessing = state === "processing";
  const isDone = state === "done";

  return (
    <div className="w-full">
      {Label ? (
        <div className="mb-2 text-B2 text-emphasis_light_on_surface_high">
          {Label}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <Button
          disableRipple
          onClick={handlePick}
          disabled={disabled || isProcessing}
          variant="contained"
          sx={{
            "@keyframes btn-pop": {
              "0%": { transform: "scale(1)" },
              "60%": { transform: "scale(1.04)" },
              "100%": { transform: "scale(1)" },
            },
            textTransform: "none",
            borderRadius: "12px",
            paddingX: "16px",
            paddingY: "8px",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "var(--color-solid-basic-neutral-0)",
            backgroundColor: "var(--color-solid-basic-blue-500)",
            transition:
              "transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease, opacity 140ms ease",
            "&:hover": {
              transform: "scale(1.03)",
              backgroundColor: "var(--color-solid-basic-blue-500)",
              boxShadow:
                "0 0 0 8px color-mix(in oklab, var(--color-solid-basic-blue-50) 70%, transparent)",
            },
            "&:focus-visible": {
              outline: "2px solid var(--color-solid-basic-blue-300)",
              outlineOffset: "2px",
            },
            "&.Mui-disabled": {
              opacity: 0.6,
              color: "var(--color-solid-basic-neutral-0)",
              backgroundColor: "var(--color-solid-basic-blue-500)",
            },
          }}>
          {buttonText}
        </Button>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />

        <div className="flex-1 min-w-0">
          <div className="truncate text-B3 text-emphasis_light_on_surface_medium">
            {selectedFile ? selectedFile.name : "Tidak ada berkas terpilih"}
          </div>
          {HelperText ? (
            <div className="text-C2 text-emphasis_light_on_surface_small mt-1">
              {HelperText}
            </div>
          ) : null}
          {error ? (
            <div className="text-C2 text-solid_basic_error_600 mt-1">
              {error}
            </div>
          ) : null}
        </div>

        {selectedFile && (isProcessing || isDone) ? (
          <Button
            disableRipple
            onClick={onCancel}
            variant="contained"
            sx={{
              "@keyframes btn-pop": {
                "0%": { transform: "scale(1)" },
                "60%": { transform: "scale(1.04)" },
                "100%": { transform: "scale(1)" },
              },
              textTransform: "none",
              borderRadius: "12px",
              paddingX: "12px",
              paddingY: "8px",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--color-solid-basic-neutral-0)",
              backgroundColor: "var(--color-solid-basic-error-500)",
              transition:
                "transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease",
              "&:hover": {
                transform: "scale(1.03)",
                backgroundColor: "var(--color-solid-basic-error-500)",
                boxShadow:
                  "0 0 0 8px color-mix(in oklab, var(--color-solid-basic-blue-50) 70%, transparent)",
              },
              "&:focus-visible": {
                outline: "2px solid var(--color-solid-basic-blue-300)",
                outlineOffset: "2px",
              },
            }}>
            Batal
          </Button>
        ) : null}
      </div>

      {isProcessing || isDone ? (
        <div className="mt-3 text-C2 text-emphasis_light_on_surface_small">
          {isProcessing ? "Mengunggah..." : "Selesai diunggah"}
        </div>
      ) : null}
    </div>
  );
}
