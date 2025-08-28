import { More } from "iconsax-react";
import type {
  ColumnDef,
  PengumpulanRow,
} from "../../../types/pengumpulan-data/pengumpulan-data";

export const columnsWithNumbering = (
  handleToggleMenu: (id: string, e: MouseEvent, rowId: string) => void,
  setSelectedIdPaket: (id: string) => void
): ColumnDef<PengumpulanRow>[] => [
  {
    key: "nama_paket",
    header: "Nama Paket",
    accessor: "nama_paket",
    type: "text",
    width: "280px",
    icon: undefined,
    onClick: undefined,
  },
  {
    key: "nama_balai",
    header: "Nama Balai",
    accessor: "nama_balai",
    type: "text",
    width: "280px",
    icon: undefined,
    onClick: undefined,
  },
  {
    key: "nama_ppk",
    header: "Nama PPK",
    accessor: "nama_ppk",
    type: "text",
    width: "200px",
    icon: undefined,
    onClick: undefined,
  },
  {
    key: "jabatan_ppk",
    header: "Jabatan PPK",
    accessor: "jabatan_ppk",
    type: "text",
    width: "200px",
    icon: undefined,
    onClick: undefined,
  },
  {
    key: "kode_rup",
    header: "Kode RUP",
    accessor: "kode_rup",
    type: "text",
    width: "140px",
    icon: undefined,
    onClick: undefined,
  },
  {
    key: "status",
    header: "Status",
    accessor: "status",
    type: "text",
    width: "280px",
    icon: undefined,
    onClick: undefined,
  },
  {
    key: "aksi",
    header: "Aksi",
    accessor: "aksi",
    type: "iconButtonWithEvent",
    icon: More,
    width: "52px",
    onClick: (row, event) => {
      handleToggleMenu(row.id, event as unknown as MouseEvent, row.id);
      setSelectedIdPaket(row.id);
    },
  },
];
