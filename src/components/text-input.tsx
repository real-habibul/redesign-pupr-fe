import React, { useState, ChangeEvent, FocusEvent } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Eye, EyeSlash, CloseCircle } from "iconsax-react";

interface TextInputProps {
  label?: string;
  placeholder?: string;
  size?: "small" | "medium";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabledActive?: boolean;
  type?: string;
  isRequired?: boolean;
  errorMessage?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder = "",
  size = "small",
  value,
  onChange,
  disabledActive = false,
  type = "text",
  isRequired = false,
  errorMessage = "Wajib diisi",
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (isRequired && !value) {
      setError(errorMessage);
    } else {
      setError("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!disabledActive) {
      onChange(e);
      if (error) setError("");
    }
  };

  const isPassword = type === "password";

  return (
    <FormControl
      fullWidth
      variant="outlined"
      size={size}
      required={isRequired}
      error={!!error}>
      {label && <InputLabel>{label}</InputLabel>}
      <OutlinedInput
        type={isPassword ? (isPasswordVisible ? "text" : "password") : type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabledActive}
        endAdornment={
          isPassword && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                edge="end">
                {isPasswordVisible ? <EyeSlash size={20} /> : <Eye size={20} />}
              </IconButton>
            </InputAdornment>
          )
        }
        label={label}
      />
      {error && (
        <FormHelperText>
          <CloseCircle
            size={16}
            style={{ verticalAlign: "middle", marginRight: 4 }}
          />
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default TextInput;
