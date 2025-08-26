"use client";
import * as React from "react";
import MuiCard, { CardProps as MuiCardProps } from "@mui/material/Card";
import MuiCardHeader, {
  CardHeaderProps as MuiCardHeaderProps,
} from "@mui/material/CardHeader";
import MuiCardContent, {
  CardContentProps as MuiCardContentProps,
} from "@mui/material/CardContent";
import { SxProps, Theme } from "@mui/material/styles";
import "@fontsource/poppins";

export interface CardProps extends MuiCardProps {
  sx?: SxProps<Theme>;
}

export interface CardHeaderProps extends MuiCardHeaderProps {
  sx?: SxProps<Theme>;
}

export interface CardContentProps extends MuiCardContentProps {
  sx?: SxProps<Theme>;
}

export function Card({ sx, children, ...props }: CardProps) {
  return (
    <MuiCard
      elevation={0}
      sx={[
        {
          borderRadius: "20px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#fff",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}>
      {children}
    </MuiCard>
  );
}

export function CardHeader({ sx, ...props }: CardHeaderProps) {
  return (
    <MuiCardHeader
      sx={[
        {
          padding: "16px 20px",
          "& .MuiCardHeader-title": {
            fontSize: "1rem",
            fontWeight: 600,
            fontFamily: "Poppins, sans-serif",
          },
          "& .MuiCardHeader-subheader": {
            fontSize: "0.875rem",
            color: "#6B7280",
            marginTop: "4px",
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export function CardContent({ sx, ...props }: CardContentProps) {
  return (
    <MuiCardContent
      sx={[
        {
          padding: "16px 20px",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}
