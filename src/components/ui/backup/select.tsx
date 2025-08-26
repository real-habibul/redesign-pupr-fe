"use client";

import * as React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import Check from "@mui/icons-material/Check";
import { fieldBaseSx } from "@components/ui/field-styles";
import "@fontsource/poppins";

type Option = { value: string; label: string };

interface SelectDropdownProps {
  options: Option[];
  label: string;
  placeholder?: string;
  value: string;
  onSelect: (selected: Option) => void;
  isRequired?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  id?: string;
  /** Lebar dropdown menu dalam px (samain untuk beberapa Select) */
  menuWidthPx?: number;
}

export default function SelectDropdown({
  options,
  label,
  placeholder = "Pilih salah satu",
  value,
  onSelect,
  isRequired = false,
  errorMessage = "Field wajib diisi",
  disabled = false,
  id = "select-balai",
  menuWidthPx = 320, // <<-- baru
}: SelectDropdownProps) {
  const [touched, setTouched] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  React.useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const val = e.target.value as string;
    const opt = options.find((o) => o.value === val);
    if (opt) onSelect(opt);
  };

  const isError = isRequired && touched && !value;
  const labelId = `${id}-label`;

  const selectedLabel = React.useMemo(() => {
    const opt = options.find((o) => o.value === value);
    return opt?.label ?? "";
  }, [options, value]);

  return (
    <FormControl
      fullWidth
      error={isError}
      disabled={disabled}
      sx={{
        fontFamily: "Poppins, sans-serif",
        "& .MuiInputLabel-root": {
          color: "var(--color-emphasis-light-on-surface-small)",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "var(--color-solid-basic-blue-500)",
        },
        "& .MuiInputLabel-root.Mui-error": {
          color: "var(--color-solid-basic-red-500, #EF4444)",
        },
        "& .MuiFormHelperText-root.Mui-error": {
          color: "var(--color-solid-basic-red-500, #EF4444)",
        },
      }}>
      <InputLabel id={labelId} shrink>
        {label}
      </InputLabel>

      <Select
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => {
          setOpen(false);
          setQuery("");
        }}
        labelId={labelId}
        id={id}
        value={value}
        label={label}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        displayEmpty
        inputProps={{
          "aria-label": label,
          title: selectedLabel || placeholder,
        }}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <span style={{ opacity: 0.6 }} title={placeholder}>
                {placeholder}
              </span>
            );
          }
          return selectedLabel;
        }}
        sx={{
          ...fieldBaseSx,
          "&, & *": { fontFamily: "Poppins, sans-serif !important" },
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            height: 48,
            lineHeight: "48px",
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
          },
          // value tampil di field -> ellipsis
          "& .MuiSelect-select": {
            height: 48,
            lineHeight: "48px",
            padding: "0 14px",
            display: "block",
            boxSizing: "border-box",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "var(--color-emphasis-light-on-surface-high)",
          },
          "& .MuiInputBase-input": { height: 48, lineHeight: "48px" },
          "&:hover": { transform: disabled ? "none" : "scale(1.03)" },
        }}
        MenuProps={{
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
          autoFocus: false,
          disableAutoFocusItem: true,
          MenuListProps: { autoFocusItem: false },
          PaperProps: {
            elevation: 0,
            sx: {
              mt: 1,
              borderRadius: "16px",
              boxShadow:
                "0px 4px 24px rgba(0,0,0,0.12), 0px 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid var(--color-surface-light-outline, #E5E7EB)",
              maxHeight: 360,
              overflowY: "auto",
              width: menuWidthPx, // <<-- kunci lebar menu
              maxWidth: menuWidthPx, // <<-- konsisten
              "& .MuiMenu-list": { p: 1, pt: 0 },
              "&::-webkit-scrollbar": { width: 8 },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: "#E5E7EB",
                borderRadius: 8,
              },
            },
          },
        }}>
        {/* 🔍 Search header */}
        <ListSubheader
          disableSticky
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            borderBottom: "1px solid #EEE",
            px: 1,
            py: 1,
          }}
          onKeyDown={(e) => e.stopPropagation()}>
          <TextField
            inputRef={searchRef}
            size="small"
            placeholder="Cari..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "10px",
                "& .MuiOutlinedInput-input": { py: 0.75 },
              },
            }}
          />
        </ListSubheader>

        {/* Placeholder */}
        <MenuItem
          value=""
          disabled
          sx={{
            opacity: 0.7,
            fontStyle: "italic",
            borderRadius: "12px",
            mx: 0.5,
            my: 0.5,
            height: 40,
          }}>
          {placeholder}
        </MenuItem>

        {/* Items */}
        {filtered.length === 0 ? (
          <MenuItem disabled sx={{ mx: 0.5, my: 0.5, height: 40 }}>
            <ListItemText
              primary="Tidak ada hasil"
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </MenuItem>
        ) : (
          filtered.map((o) => {
            const selected = value === o.value;
            return (
              <MenuItem
                key={o.value}
                value={o.value}
                title={o.label} // tooltip full text
                sx={{
                  borderRadius: "12px",
                  mx: 0.5,
                  my: 0.5,
                  height: 40,
                  color: "var(--color-emphasis-light-on-surface-high, #0A0A0A)",
                  "&:hover": { backgroundColor: "rgba(59,130,246,0.08)" },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(59,130,246,0.12) !important",
                  },
                  // ellipsis di item
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {selected ? <Check fontSize="small" /> : null}
                </ListItemIcon>
                <ListItemText
                  primary={o.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 500,
                    noWrap: true, // pastiin satu baris
                  }}
                />
              </MenuItem>
            );
          })
        )}
      </Select>

      {isError && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}
