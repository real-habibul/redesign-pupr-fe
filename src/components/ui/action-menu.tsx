"use client";

import * as React from "react";
import { Menu, MenuItem, Divider, type MenuProps } from "@mui/material";
import clsx from "clsx";

export type ActionMenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  hidden?: boolean;
  dividerBefore?: boolean;
  className?: string;
};

export type ActionMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: ActionMenuItem[];
  menuProps?: Partial<MenuProps>;
  minWidth?: number;
  iconGap?: number | string;
};

export default function ActionMenu({
  anchorEl,
  open,
  onClose,
  items,
  menuProps,
  minWidth = 220,
  iconGap = 12,
}: ActionMenuProps) {
  const handleItemClick = (fn?: () => void) => () => {
    onClose();
    fn?.();
  };

  const visibleItems = items.filter((it) => !it.hidden);
  const children: React.ReactNode[] = [];
  visibleItems.forEach((it) => {
    if (it.dividerBefore)
      children.push(<Divider key={`div-${it.id}`} sx={{ my: 0.5 }} />);
    const isDanger = Boolean(it.danger);
    children.push(
      <MenuItem
        key={`mi-${it.id}`}
        disabled={it.disabled}
        onClick={handleItemClick(it.onClick)}
        className={clsx(it.className)}
        sx={{
          p: "8px",
          gap: typeof iconGap === "number" ? `${iconGap}px` : iconGap,
          borderRadius: "12px",
          fontFamily: "var(--font-family-sans, Poppins, sans-serif)",
          fontSize: "0.9rem",
          lineHeight: 1.4,
          color: isDanger
            ? "var(--color-solid-basic-red-600)"
            : "var(--color-emphasis-light-on-surface-high)",
          "&:hover": {
            backgroundColor: isDanger
              ? "var(--color-solid-basic-red-50)"
              : "var(--color-solid-basic-blue-50)",
            color: isDanger
              ? "var(--color-solid-basic-red-600)"
              : "var(--color-solid-basic-blue-500)",
          },
        }}>
        {it.icon && (
          <span
            className="inline-flex items-center"
            style={{ color: "currentColor" }}>
            {it.icon}
          </span>
        )}
        <span>{it.label}</span>
      </MenuItem>
    );
  });

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          p: "8px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          minWidth,
          backgroundColor: "var(--color-solid-basic-neutral-0)",
          "& .MuiMenu-list": {
            p: 0,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          },
        },
      }}
      {...menuProps}>
      {children}
    </Menu>
  );
}
