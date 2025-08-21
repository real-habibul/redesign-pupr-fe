"use client";

import * as React from "react";
import clsx from "clsx";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Checkbox as MUICheckbox,
} from "@mui/material";
import Checkbox from "@components/ui/checkbox";

export type ColumnDef<T extends object> = {
  key: keyof T | string;
  header: string | React.ReactNode;
  className?: string;
  cell?: (row: T, rowIndex: number) => React.ReactNode;
};

export type PaginationProps = {
  currentPage: number;
  itemsPerPage: number;
  total: number;
  onPageChange: (p: number) => void;
};

type SelectProps<T> = {
  selectable?: boolean;
  isSelected?: (row: T) => boolean;
  onToggleRow?: (row: T, next: boolean) => void;
  onToggleAllVisible?: (rows: T[], next: boolean) => void;
  useMuiCheckbox?: boolean;
  renderSelectCell?: (row: T) => React.ReactNode;
  selectHeader?: React.ReactNode;
  selectColumnClassName?: string;
};

type DataTableProps<T extends object> = {
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
  containerClassName?: string;
  paperClassName?: string;
  tableClassName?: string;
  headerRowClassName?: string;
  stickyHeader?: boolean;
  striped?: boolean;
  pagination?: PaginationProps;
  selection?: SelectProps<T>;
};

export default function DataTableMui<T extends object>({
  columns,
  data,
  emptyMessage = "Data tidak ditemukan",
  containerClassName,
  paperClassName,
  tableClassName,
  headerRowClassName,
  stickyHeader = true,
  striped = false,
  pagination,
  selection,
}: DataTableProps<T>) {
  const {
    selectable,
    isSelected,
    onToggleRow,
    onToggleAllVisible,
    useMuiCheckbox,
    renderSelectCell,
    selectHeader = "Pilih",
    selectColumnClassName,
  } = selection ?? {};

  const currentPage = pagination?.currentPage ?? 1;
  const itemsPerPage = pagination?.itemsPerPage ?? (data.length || 10);
  const start = (currentPage - 1) * itemsPerPage;
  const sliced = pagination ? data.slice(start, start + itemsPerPage) : data;

  const allChecked =
    selectable && isSelected
      ? sliced.length > 0 && sliced.every((r) => !!isSelected(r))
      : false;
  const someChecked =
    selectable && isSelected
      ? sliced.some((r) => !!isSelected(r)) && !allChecked
      : false;

  const HeaderCheckbox = useMuiCheckbox ? MUICheckbox : Checkbox;
  const RowCheckbox = useMuiCheckbox ? MUICheckbox : Checkbox;

  return (
    <div
      className={clsx(
        "rounded-[16px] overflow-hidden font-sans",
        containerClassName
      )}>
      <TableContainer
        component={Paper}
        className={clsx("border border-gray-200", paperClassName)}
        elevation={0}
        sx={{
          borderRadius: "16px",
          "&, & *": { fontFamily: "Poppins, sans-serif !important" },
        }}>
        <Table
          stickyHeader={stickyHeader}
          className={clsx("w-full min-w-max", tableClassName)}
          aria-label="data table"
          sx={{
            "&, & *": {
              fontFamily: "Poppins, sans-serif !important",
              color: "inherit",
            },
          }}>
          <TableHead>
            <TableRow
              className={clsx(
                "uppercase tracking-wider text-left",
                headerRowClassName
              )}
              sx={{
                backgroundColor: "var(--color-solid-basic-blue-100) !important",
              }}>
              <TableCell
                className="px-3 py-6 text-base font-normal text-center w-[64px]"
                sx={{
                  borderBottom: "1px solid rgba(0,0,0,0.12)",
                  color: "var(--color-emphasis-light-on-surface-high)",
                  backgroundColor: "transparent",
                  textAlign: "center",
                }}>
                No
              </TableCell>
              {selectable && (
                <TableCell
                  className={clsx(
                    "px-3 py-6 text-base font-normal",
                    selectColumnClassName
                  )}
                  sx={{
                    borderBottom: "1px solid rgba(0,0,0,0.12)",
                    color: "var(--color-emphasis-light-on-surface-high)",
                    backgroundColor: "transparent",
                    width: 72,
                  }}>
                  <div className="flex items-center gap-2">
                    <HeaderCheckbox
                      size="small"
                      checked={allChecked}
                      indeterminate={someChecked}
                      onChange={(e) =>
                        onToggleAllVisible?.(
                          sliced,
                          (e.target as HTMLInputElement).checked
                        )
                      }
                    />
                    <span>{selectHeader}</span>
                  </div>
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  className={clsx(
                    "px-3 py-6 text-base font-normal",
                    col.className
                  )}
                  sx={{
                    borderBottom: "1px solid rgba(0,0,0,0.12)",
                    color: "var(--color-emphasis-light-on-surface-high)",
                    backgroundColor: "transparent",
                  }}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& .MuiTableCell-root": {
                color: "var(--color-emphasis-light-on-surface-medium)",
                backgroundColor: "transparent",
              },
            }}>
            {sliced.length === 0 && (
              <TableRow>
                <TableCell
                  align="center"
                  className="px-3 py-6"
                  sx={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    color: "var(--color-emphasis-light-on-surface-medium)",
                  }}
                  colSpan={(selectable ? 1 : 0) + columns.length + 1}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}

            {sliced.map((row, i) => {
              const displayIndex = start + i + 1;
              const isEven = displayIndex % 2 === 0;
              const bgColor = striped
                ? isEven
                  ? "var(--color-solid-basic-neutral-100)"
                  : "var(--color-solid-basic-neutral-0)"
                : "transparent";
              const checked =
                selectable && isSelected ? !!isSelected(row) : false;
              return (
                <TableRow
                  key={i}
                  hover
                  sx={{
                    backgroundColor: bgColor,
                    "&:last-child td, &:last-child th": { border: 0 },
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                  }}>
                  <TableCell
                    className="px-3 py-4 text-center align-middle w-[64px]"
                    sx={{ textAlign: "center" }}>
                    {displayIndex}
                  </TableCell>
                  {selectable && (
                    <TableCell
                      className={clsx(
                        "px-3 py-4 align-middle",
                        selectColumnClassName
                      )}>
                      {renderSelectCell ? (
                        renderSelectCell(row)
                      ) : (
                        <RowCheckbox
                          size="small"
                          checked={checked}
                          onChange={(e) =>
                            onToggleRow?.(
                              row,
                              (e.target as HTMLInputElement).checked
                            )
                          }
                        />
                      )}
                    </TableCell>
                  )}
                  {columns.map((col, cidx) => (
                    <TableCell
                      key={cidx}
                      className={clsx("px-3 py-4 align-middle", col.className)}>
                      {col.cell
                        ? col.cell(row as any, start + i)
                        : String((row as any)[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
