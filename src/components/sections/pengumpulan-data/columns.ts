import { More } from "iconsax-react";

export const columnsWithNumbering = (
  handleToggleMenu: (id: string, e: Event, rowId: string) => void,
  setSelectedIdPaket: (id: string) => void
) => [
  { title: "Nama Paket", accessor: "nama_paket", type: "text", width: "280px" },
  { title: "Nama Balai", accessor: "nama_balai", type: "text", width: "280px" },
  { title: "Nama PPK", accessor: "nama_ppk", type: "text", width: "200px" },
  {
    title: "Jabatan PPK",
    accessor: "jabatan_ppk",
    type: "text",
    width: "200px",
  },
  { title: "Kode RUP", accessor: "kode_rup", type: "text", width: "140px" },
  { title: "Status", accessor: "status", type: "text", width: "280px" },
  {
    title: "Aksi",
    accessor: "aksi",
    type: "iconButtonWithEvent",
    icon: More,
    width: "52px",
    onClick: (row: any, event: any) => {
      handleToggleMenu(row.id, event, row.id);
      setSelectedIdPaket(row.id);
    },
  },
];
