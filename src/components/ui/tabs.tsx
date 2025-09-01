// Tabs.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import { Box, Tabs as MuiTabs, Tab } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import AppButton from "@components/ui/button";

type CustomVariant =
  | "solid_blue"
  | "outlined_yellow"
  | "text_red"
  | "text_blue";
type LegacyMuiVariant = "contained" | "outlined" | "text" | undefined;

type TabItem = { label: string; content: React.ReactNode; id?: string };

type ActionButtonProps = {
  label?: string;
  variant?: CustomVariant | LegacyMuiVariant;
  onClick?: () => void;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
};

type TabsProps = {
  tabs: ReadonlyArray<TabItem>;
  actionButton?: ActionButtonProps | null;
  initialLabel?: string;
  className?: string;
  value?: number;
  onChange?: (index: number) => void;
  tabListSx?: SxProps<Theme>;
};

function a11yProps(index: number, baseId: string) {
  return {
    id: `${baseId}-tab-${index}`,
    "aria-controls": `${baseId}-panel-${index}`,
  };
}

const mapToCustomVariant = (
  v: CustomVariant | LegacyMuiVariant | undefined
): CustomVariant => {
  if (v === "contained") return "solid_blue";
  if (v === "outlined") return "outlined_yellow";
  if (v === "text") return "text_blue";
  return (v as CustomVariant) ?? "solid_blue";
};

export default function Tabs({
  tabs,
  actionButton,
  initialLabel,
  className,
  value: valueProp,
  onChange,
  tabListSx, // <- BARU
}: TabsProps) {
  const baseId = React.useId();
  const uncontrolledInitialIndex = Math.max(
    0,
    initialLabel ? tabs.findIndex((t) => t.label === initialLabel) : 0
  );
  const [internalValue, setInternalValue] = React.useState(
    uncontrolledInitialIndex
  );
  const value = valueProp ?? internalValue;

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    onChange?.(newValue);
    if (valueProp === undefined) setInternalValue(newValue);
  };

  return (
    <Box className={className}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={2}>
        <Box
          role="tablist"
          aria-label="Tabs"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            bgcolor: "var(--color-solid-basic-neutral-100)",
            borderRadius: "16px",
            p: "8px",
            height: "60px",
            ...tabListSx,
          }}>
          <MuiTabs
            value={value}
            onChange={handleChange}
            aria-label="segment tabs"
            TabIndicatorProps={{ style: { display: "none" } }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 0, "& .MuiTabs-flexContainer": { gap: "8px" } }}>
            {tabs.map((tab, i) => (
              <Tab
                key={tab.id ?? tab.label}
                label={tab.label}
                disableRipple
                {...a11yProps(i, baseId)}
                sx={{
                  textTransform: "none",
                  minHeight: 0,
                  height: 44,
                  px: 2,
                  borderRadius: "12px",
                  fontFamily: "Poppins, sans-serif",
                  transition: "all .2s ease",
                  color: "var(--color-emphasis-light-on-surface-medium)",
                  "&:hover": {
                    backgroundColor:
                      "var(--color-surface-light-background-overlay)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "var(--color-solid-basic-blue-500)",
                    color: "var(--color-emphasis-light-on-color-high)",
                  },
                }}
              />
            ))}
          </MuiTabs>
        </Box>

        {actionButton ? (
          <AppButton
            variant={mapToCustomVariant(actionButton.variant)}
            label={actionButton.label ?? "Label"}
            onClick={actionButton.onClick}
            disabled={actionButton.disabled}
            fullWidth={actionButton.fullWidth}
            sx={{
              borderRadius: "16px",
              height: "48px",
              boxShadow: "none",
              ...(actionButton.sx as object),
            }}>
            {actionButton.label}
          </AppButton>
        ) : null}
      </Box>

      <Box width="100%" position="relative" overflow="hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}>
            {tabs[value].content}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
