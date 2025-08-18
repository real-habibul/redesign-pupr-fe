"use client";

import * as React from "react";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Popover from "@mui/material/Popover";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@components/ui/checkbox";
import { Filter, SearchNormal } from "iconsax-react";

export type FilterOption = {
  label: string;
  checked: boolean;
  value?: string | number;
};

export type SearchBoxProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
  withFilter?: boolean;
  onFilterClick?: (filters: FilterOption[]) => void;
  filterOptions?: FilterOption[];
  onApplyFilters?: (filters: FilterOption[]) => void;
  width?: number | string;
  className?: string;
  iconColorVar?: string;
  enableSelectAll?: boolean;
  selectAllLabel?: string;
  debounceDelay?: number;
};

export default function SearchBox({
  placeholder = "Cari...",
  onSearch,
  withFilter = false,
  onFilterClick,
  filterOptions = [],
  onApplyFilters,
  width = 336,
  className,
  iconColorVar = "--color-emphasis-light-on-surface-medium",
  enableSelectAll = true,
  selectAllLabel = "Pilih semua",
  debounceDelay = 0,
}: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedFilters, setSelectedFilters] =
    useState<FilterOption[]>(filterOptions);

  useEffect(() => {
    setSelectedFilters(filterOptions);
  }, [filterOptions]);

  const isFilterOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

  // debounce
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushAndCall = useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (debounceDelay <= 0) onSearch(value);
      else
        debounceTimer.current = setTimeout(
          () => onSearch(value),
          debounceDelay
        );
    },
    [onSearch, debounceDelay]
  );
  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    },
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    flushAndCall(value);
  };

  const toggleFilterDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl((prev) =>
      prev ? null : (e.currentTarget as HTMLButtonElement)
    );
  };

  const handleFilterChange = (index: number, newChecked: boolean) => {
    const updated = [...selectedFilters];
    updated[index] = { ...updated[index], checked: newChecked };
    setSelectedFilters(updated);
    onFilterClick?.(updated);
  };

  const applyFilters = () => {
    onApplyFilters?.(selectedFilters);
    setAnchorEl(null);
  };

  const allChecked =
    selectedFilters.length > 0 && selectedFilters.every((o) => o.checked);
  const someChecked = selectedFilters.some((o) => o.checked) && !allChecked;

  const handleSelectAll = (_: unknown, checked: boolean) => {
    const updated = selectedFilters.map((o) => ({ ...o, checked }));
    setSelectedFilters(updated);
    onFilterClick?.(updated);
  };

  return (
    <div
      className={`relative flex items-center gap-4 font-sans ${
        className ?? ""
      }`}>
      <TextField
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        variant="outlined"
        fullWidth={false}
        sx={{
          width,
          "& .MuiOutlinedInput-root": {
            height: 48,
            borderRadius: "16px",
            backgroundColor: "var(--color-solid-basic-neutral-0)",
          },
          "& .MuiInputBase-input": {
            fontFamily: "var(--font-family-sans)",
            fontSize: "0.875rem",
            "&::placeholder": {
              fontFamily: "var(--font-family-sans)",
              opacity: 1,
              color: "var(--color-emphasis-light-on-surface-medium)",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: 0.5 }}>
              <span
                style={{
                  color: `var(${iconColorVar})`,
                  display: "inline-flex",
                }}>
                <SearchNormal size="24" color="currentColor" />
              </span>
            </InputAdornment>
          ),
        }}
      />

      {withFilter && (
        <>
          <Button
            type="button"
            onClick={toggleFilterDropdown}
            variant="outlined"
            sx={{
              height: 46,
              minWidth: 119,
              borderRadius: "16px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontFamily: "var(--font-family-sans)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderWidth: 2,
              color: "var(--color-emphasis-light-on-surface-medium)",
              borderColor: "var(--color-solid-basic-neutral-300)",
              "&:hover": {
                borderColor: "var(--color-solid-basic-blue-400)",
                backgroundColor: "var(--color-solid-basic-blue-50)",
              },
            }}>
            <span
              style={{ color: "var(--color-emphasis-light-on-surface-medium)" }}
              className="inline-flex">
              <Filter size="20" color="currentColor" />
            </span>
            <span className="text-Small font-medium">Filter</span>
          </Button>

          <Popover
            open={isFilterOpen}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                width: 280,
                borderRadius: "12px",
                boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
                p: 2,
                maxHeight: 316,
                overflowY: "auto",
                backgroundColor: "var(--color-solid-basic-neutral-0)",
                fontFamily: "var(--font-family-sans)",
              },
            }}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel
                component="legend"
                sx={{
                  fontFamily: "var(--font-family-sans)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-solid-basic-neutral-700)",
                  mb: 1,
                }}>
                Pilih Filter
              </FormLabel>

              {enableSelectAll && selectedFilters.length > 0 && (
                <FormGroup sx={{ mb: 1 }}>
                  <FormControlLabel
                    sx={{
                      borderRadius: "8px",
                      px: 1,
                      ".MuiFormControlLabel-label": {
                        fontFamily: "var(--font-family-sans)",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        transition: "transform 140ms ease, color 160ms ease",
                      },
                      "&:hover": {
                        backgroundColor: "var(--color-solid-basic-blue-50)",
                      },
                      "&:hover .MuiFormControlLabel-label": {
                        color: "var(--color-solid-basic-blue-700)",
                        transform: "translateX(2px)",
                      },
                    }}
                    control={
                      <Checkbox
                        shape="circle"
                        indeterminate={someChecked}
                        checked={allChecked}
                        onChange={handleSelectAll}
                        inputProps={{ "aria-label": selectAllLabel }}
                      />
                    }
                    label={selectAllLabel}
                  />
                </FormGroup>
              )}

              <FormGroup>
                {selectedFilters.map((option, index) => (
                  <FormControlLabel
                    key={`${option.value ?? option.label}-${index}`}
                    sx={{
                      width: "100%",
                      alignItems: "center",
                      borderRadius: "8px",
                      px: 1,
                      py: 0.25,
                      transition:
                        "background-color 160ms ease, color 160ms ease",
                      ".MuiFormControlLabel-label": {
                        flex: 1,
                        display: "block",
                        fontFamily: "var(--font-family-sans)",
                        fontSize: "0.9rem",
                        color: "var(--color-solid-basic-neutral-700)",
                        fontWeight: 500,
                        lineHeight: 1.6,
                        transition: "transform 140ms ease, color 160ms ease",
                      },
                      "&:hover": {
                        backgroundColor: "var(--color-solid-basic-blue-50)",
                      },
                      "&:hover .MuiFormControlLabel-label": {
                        color: "var(--color-solid-basic-blue-700)",
                        transform: "translateX(2px)",
                      },
                      "& + .MuiFormControlLabel-root": { mt: 1 },
                    }}
                    control={
                      <Checkbox
                        shape="circle"
                        checked={option.checked}
                        onChange={(_, checked) =>
                          handleFilterChange(index, checked)
                        }
                        inputProps={{ "aria-label": option.label }}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </FormGroup>

              {onApplyFilters && (
                <Button
                  onClick={applyFilters}
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    borderRadius: "8px",
                    textTransform: "none",
                    height: 40,
                    fontFamily: "var(--font-family-sans)",
                    backgroundColor: "var(--color-solid-basic-blue-600)",
                    "&:hover": {
                      backgroundColor: "var(--color-solid-basic-blue-700)",
                    },
                  }}>
                  Terapkan
                </Button>
              )}
            </FormControl>
          </Popover>
        </>
      )}
    </div>
  );
}
