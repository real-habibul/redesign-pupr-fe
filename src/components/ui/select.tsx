"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import { fieldBaseSx } from "@components/ui/field-styles";
import "@fontsource/poppins";
import OutlinedInput from "@mui/material/OutlinedInput";

type Option = { label: string; value: string };

interface MUISelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  id?: string;
  fullWidth?: boolean;
  minWidth?: number;
  disabled?: boolean;
  required?: boolean;
  menuWidthPx?: number;
  placeholder?: string;
}

export default function MUISelect({
  label,
  value,
  onChange,
  options,
  id = "mui-select",
  fullWidth = true,
  minWidth = 120,
  disabled = false,
  required = false,
  menuWidthPx = 320,
  placeholder = "Pilih salah satu",
}: MUISelectProps) {
  const labelId = `${id}-label`;
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
      const t = setTimeout(() => searchRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";
  const [focused, setFocused] = React.useState(false);

  return (
    <Box sx={{ minWidth, width: fullWidth ? "100%" : undefined }}>
      <FormControl
        fullWidth={fullWidth}
        disabled={disabled}
        required={required}
        variant="outlined"
        sx={{
          "&, & *": { fontFamily: "Poppins, sans-serif !important" },
          "& .MuiInputLabel-root": {
            color: "var(--color-emphasis-light-on-surface-small)",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "var(--color-solid-basic-blue-500)",
          },
        }}>
        <InputLabel id={labelId} shrink>
          {label}
        </InputLabel>

        <Select<string>
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => {
            setOpen(false);
            setQuery("");
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ opacity: 0.6 }}>{placeholder}</span>;
            }
            return selectedLabel;
          }}
          labelId={labelId}
          id={id}
          value={value}
          label={label}
          onChange={handleChange}
          displayEmpty
          input={
            <OutlinedInput
              label={label}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                height: 48,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-surface-light-outline)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-solid-basic-blue-400)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-solid-basic-blue-500)",
                },
              }}
            />
          }
          sx={{
            ...fieldBaseSx,
            "&, & *": { fontFamily: "Poppins, sans-serif !important" },
            "& .MuiSelect-select": {
              height: 48,
              lineHeight: "48px",
              padding: "0 14px",
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "var(--color-emphasis-light-on-surface-high)",
              backgroundColor: "#fff",
              borderRadius: "16px",
            },
          }}
          MenuProps={{
            autoFocus: false,
            disableScrollLock: true,
            MenuListProps: { autoFocusItem: false },
            PaperProps: {
              elevation: 0,
              sx: {
                "&, & *": { fontFamily: "Poppins, sans-serif !important" },
                mt: 1,
                borderRadius: "16px",
                boxShadow:
                  "0px 4px 24px rgba(0,0,0,0.12), 0px 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid var(--color-surface-light-outline, #E5E7EB)",
                maxHeight: 360,
                overflowY: "auto",
                width: menuWidthPx,
                maxWidth: menuWidthPx,
                bgcolor: "#fff",
                "& .MuiMenu-list": { p: 1, pt: 0, bgcolor: "#fff" },
              },
            },
          }}>
          <ListSubheader
            disableSticky
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              bgcolor: "#fff",
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
                  bgcolor: "#fff",
                  "& .MuiOutlinedInput-input": { py: 0.75 },
                },
              }}
            />
          </ListSubheader>

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

          {filtered.length === 0 ? (
            <MenuItem disabled sx={{ mx: 0.5, my: 0.5, height: 40 }}>
              Tidak ada hasil
            </MenuItem>
          ) : (
            filtered.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                title={opt.label}
                sx={{
                  borderRadius: "12px",
                  mx: 0.5,
                  my: 0.5,
                  height: 40,
                  "&:hover": { backgroundColor: "rgba(59,130,246,0.08)" },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(59,130,246,0.12) !important",
                  },
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}>
                {opt.label}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
