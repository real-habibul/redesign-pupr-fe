import * as React from "react";

export type PengumpulanRow = {
  id: string;
  nama_paket: string;
  nama_balai: string;
  nama_ppk: string;
  jabatan_ppk: string;
  kode_rup: string;
  status: string;
};

export type MenuPosition = {
  top: number;
  left: number;
  alignRight: boolean;
};

export type ColumnType = "text" | "iconButtonWithEvent";

export type Accessor<Row> = keyof Row | string | ((row: Row) => unknown);

export type ColumnDef<Row extends Record<string, unknown> = PengumpulanRow> = {
  key: string;
  header: string;
  accessor: Accessor<Row>;
  type: ColumnType;
  width?: string | number;

  icon?: React.ReactNode | React.ComponentType;

  onClick?: (row: Row, event: React.MouseEvent<HTMLElement>) => void;
};
