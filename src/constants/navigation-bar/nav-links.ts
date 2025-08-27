import type { LinkItem } from "../../types/navigation-bar/nav";

export const NAV_LINKS: LinkItem[] = [
  { href: "/dashboard", label: "Beranda", roles: [] },

  // {
  //   href: "/perencanaan-data/informasi-umum",
  //   label: "Perencanaan Data",
  //   activePath: "/perencanaan-data",
  //   roles: [],
  //   children: [
  //     { href: "/perencanaan-data/tahap1", label: "Buat Baru" },
  //     { href: "/perencanaan-data/perencanaan-data-list", label: "Informasi Perencanaan Data" }
  //   ]
  // },

  {
    href: "/pengumpulan-data/informasi-tahap-pengumpulan",
    label: "Pengumpulan Data",
    activePath: "/pengumpulan-data",
    roles: [],
  },
  // { href: "/pemeriksaan-data/informasi-pemeriksaan-data", label: "Pemeriksaan", activePath: "/pemeriksaan-data", roles: [] },

  {
    href: "/input-vendor",
    label: "Responden/Vendor",
    activePath: "/input-vendor",
    roles: [],
    children: [
      { href: "/input-vendor", label: "Input Data Responden/Vendor" },
      {
        href: "/vendor/informasi-responden",
        label: "Informasi Responden/Vendor",
      },
    ],
  },

  // {
  //   href: "/pj-balai/monitoring/monitoring-perencanaan-data",
  //   label: "Monitoring",
  //   activePath: "/pj-balai",
  //   roles: [],
  //   children: [
  //     { href: "/pj-balai/monitoring/monitoring-perencanaan-data", label: "Perencanaan Data" },
  //     { href: "/pj-balai/monitoring/monitoring-pengumpulan-data", label: "Pengumpulan Data" },
  //     { href: "/pj-balai/monitoring/monitoring-pemeriksaan-data", label: "Pemeriksaan Data" }
  //   ]
  // },

  // { href: "/user-role/user-role", label: "Assign User", activePath: "/user-role", roles: [] }

  {
    href: "/perencanaan-data/informasi-umum",
    label: "Perencanaan Data",
    activePath: "/perencanaan-data/",
    roles: [],
  },
];
