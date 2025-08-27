import type { ComponentType } from "react";

export type PengumpulanRow = {
  id: string;
  nama_paket: string;
  nama_balai: string;
  nama_ppk: string;
  jabatan_ppk: string;
  kode_rup: string;
  status: string;
};

export type ColumnDef<Row = any> = {
  key: string;
  header: string;
  accessor: keyof Row | string;
  type: "text" | "iconButtonWithEvent";
  width?: string | number;
  icon?: ComponentType<any>;
  onClick?: (row: Row, event: MouseEvent) => void;
};
