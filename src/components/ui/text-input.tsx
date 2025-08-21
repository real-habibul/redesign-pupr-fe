import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "@fontsource/poppins";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  isRequired?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  disabled?: boolean;
}

export default function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  isRequired = false,
  onBlur,
  error,
  helperText,
  disabled = false,
}: TextInputProps) {
  const [touched, setTouched] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const isPasswordField = type === "password";
  const internalError = isRequired && touched && value.trim() === "";
  const mergedError = error ?? internalError;
  const mergedHelperText =
    helperText ?? (internalError ? `${label} wajib diisi` : "");

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    onBlur?.(e);
  };

  return (
    <TextField
      label={
        isRequired ? (
          <span>
            {label} <span style={{ color: "red" }}>*</span>
          </span>
        ) : (
          label
        )
      }
      value={value}
      onChange={onChange}
      onBlur={handleBlur}
      type={isPasswordField ? (showPassword ? "text" : "password") : type}
      placeholder={placeholder}
      required={isRequired}
      error={mergedError}
      helperText={mergedHelperText}
      InputLabelProps={{ required: false }}
      fullWidth
      variant="outlined"
      disabled={disabled}
      InputProps={
        isPasswordField
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
      sx={{
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
          WebkitTextFillColor: "var(--color-emphasis-light-on-surface-medium)",
          cursor: "not-allowed",
        },
        "& .MuiFormHelperText-root.Mui-error": {
          color: "var(--color-solid-basic-red-500, #EF4444)",
        },
      }}
    />
  );
}
