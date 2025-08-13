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
}

export default function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  isRequired = false,
}: TextInputProps) {
  const [touched, setTouched] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const isPasswordField = type === "password";
  const isError = isRequired && touched && value.trim() === "";

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
      onBlur={() => setTouched(true)}
      type={isPasswordField ? (showPassword ? "text" : "password") : type}
      placeholder={placeholder}
      required={isRequired}
      error={isError}
      helperText={isError ? `${label} wajib diisi` : ""}
      InputLabelProps={{ required: false }}
      fullWidth
      variant="outlined"
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

        "& .MuiInputBase-input": {
          color: "var(--color-emphasis-light-on-surface-high)",
        },
        "& .MuiFormHelperText-root.Mui-error": {
          color: "var(--color-solid-basic-red-500, #EF4444)",
        },
      }}
    />
  );
}
