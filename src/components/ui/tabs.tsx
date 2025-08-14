"use client";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import {
  Box,
  Tabs as MuiTabs,
  Tab,
  Button,
  type ButtonProps,
} from "@mui/material";

type TabItem = {
  label: string;
  content: React.ReactNode;
  id?: string;
};

type TabsProps = {
  tabs: ReadonlyArray<TabItem>;
  actionButton?: (ButtonProps & { label?: string }) | null;
  initialLabel?: string;
  className?: string;

  value?: number;
  onChange?: (index: number) => void;
};

function a11yProps(index: number, baseId: string) {
  return {
    id: `${baseId}-tab-${index}`,
    "aria-controls": `${baseId}-panel-${index}`,
  };
}

export default function Tabs({
  tabs,
  actionButton,
  initialLabel,
  className,
  // 🔧 Controlled props
  value: valueProp,
  onChange,
}: TabsProps) {
  const baseId = React.useId();

  // 🔧 Tentukan initial index untuk mode uncontrolled
  const uncontrolledInitialIndex = Math.max(
    0,
    initialLabel ? tabs.findIndex((t) => t.label === initialLabel) : 0
  );

  // 🔧 State internal hanya dipakai kalau tidak controlled
  const [internalValue, setInternalValue] = React.useState(
    uncontrolledInitialIndex
  );

  // 🔧 Sumber kebenaran value: controlled > uncontrolled
  const value = valueProp ?? internalValue;

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    // 🔧 Kalau ada onChange, panggil supaya parent bisa update state
    onChange?.(newValue);
    // 🔧 Kalau tidak controlled, update state internal
    if (valueProp === undefined) {
      setInternalValue(newValue);
    }
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
          }}>
          <MuiTabs
            value={value}
            onChange={handleChange}
            aria-label="segment tabs"
            TabIndicatorProps={{ style: { display: "none" } }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 0,
              "& .MuiTabs-flexContainer": { gap: "8px" },
            }}>
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
          <Button
            variant={actionButton.variant ?? "contained"}
            size={actionButton.size ?? "medium"}
            onClick={actionButton.onClick}
            startIcon={actionButton.startIcon}
            endIcon={actionButton.endIcon}
            sx={{
              textTransform: "none",
              borderRadius: "16px",
              height: 48,
              boxShadow: "none",
            }}
            {...actionButton}>
            {actionButton.label ?? "Label"}
          </Button>
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
