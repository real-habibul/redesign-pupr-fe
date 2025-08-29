import Link from "next/link";
import type { PengumpulanRow } from "../../../types/pengumpulan-data/pengumpulan-data";

type Props = {
  activeMenu: string | null;
  menuPosition: { top: number; left: number; alignRight: boolean };
  tableData: PengumpulanRow[];
  openModal: (id: string) => void;
};

export default function ActiveMenuPopup({
  activeMenu,
  menuPosition,
  tableData,
  openModal,
}: Props) {
  if (!activeMenu) return null;

  return (
    <div
      className="absolute bg-white rounded-[12px] mr-[12px] shadow-lg p-2 w-56"
      style={{
        top: menuPosition.top,
        left: menuPosition.alignRight ? undefined : menuPosition.left,
        right: menuPosition.alignRight ? 0 : undefined,
        zIndex: 10,
        boxShadow: "0px 4px 16px 0px rgba(165, 163, 174, 0.45)",
      }}>
      <Link
        href="#"
        className="block px-4 py-2 text-sm text-emphasis-on_surface-high hover:bg-custom-blue-50 rounded-[12px] transition-all duration-200"
        onClick={() => {
          const item = tableData.find((row) => row.id === activeMenu);
          if (item) openModal(item.id);
        }}>
        Lihat Detail Kuesioner
      </Link>
    </div>
  );
}
