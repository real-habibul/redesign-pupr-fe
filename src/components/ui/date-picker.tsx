"use client";

import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/id";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

type Props = {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
};

const FORMAT = "DD-MM-YYYY";

export default function AppDatePicker({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  error,
  helperText,
  disabled = false,
  fullWidth = true,
}: Props) {
  const parsed: Dayjs | null = value ? dayjs(value, FORMAT, true) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
      <DatePicker
        label={
          required ? (
            <span>
              {label} <span style={{ color: "red" }}>*</span>
            </span>
          ) : (
            label
          )
        }
        value={parsed && parsed.isValid() ? parsed : null}
        onChange={(d: Dayjs | null) => {
          const formatted = d ? d.format(FORMAT) : "";
          onChange(formatted);
        }}
        format={FORMAT}
        disabled={disabled}
        slotProps={{
          textField: {
            fullWidth,
            placeholder,
            required,
            error,
            helperText,
            InputLabelProps: { required: false },
            sx: {
              "&, & *": { fontFamily: "Poppins, sans-serif !important" },
              "& .MuiInputLabel-root": {
                color: "var(--color-emphasis-light-on-surface-small)",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "var(--color-solid-basic-blue-500)",
              },
              "& .MuiInputLabel-root.Mui-error": {
                color: "var(--color-solid-basic-red-500, #EF4444)",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                height: "48px",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-surface-light-outline)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-solid-basic-blue-400)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-solid-basic-blue-500)",
                },
                "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-solid-basic-red-500, #EF4444)",
                },
                "&:hover.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-solid-basic-red-500, #EF4444)",
                },
                "&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-solid-basic-red-500, #EF4444)",
                },
              },
              "& .MuiOutlinedInput-root.Mui-disabled": {
                backgroundColor: "#f9fafb",
                borderRadius: "16px",
                cursor: "not-allowed",
              },
              "& .MuiInputBase-input": {
                color: "var(--color-emphasis-light-on-surface-high)",
              },
              "& .MuiInputBase-input.Mui-disabled": {
                color: "var(--color-emphasis-light-on-surface-medium)",
                WebkitTextFillColor:
                  "var(--color-emphasis-light-on-surface-medium)",
                cursor: "not-allowed",
              },
              "& .MuiFormHelperText-root.Mui-error": {
                color: "var(--color-solid-basic-red-500, #EF4444)",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
