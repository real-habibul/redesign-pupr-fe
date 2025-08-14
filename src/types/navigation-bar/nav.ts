export type Role =
  | "superadmin"
  | "Tim Teknis Balai"
  | "PJ Balai"
  | "Petugas Lapangan"
  | "Koordinator Provinsi"
  | "Pengolah Data"
  | "Pengawas";

export type LinkItem = {
  href: string;
  label: string;
  roles: Role[];
  activePath?: string;
  children?: { href: string; label: string }[];
};
