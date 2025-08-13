"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User } from "iconsax-react";

type Role =
  | "superadmin"
  | "Tim Teknis Balai"
  | "PJ Balai"
  | "Petugas Lapangan"
  | "Koordinator Provinsi"
  | "Pengolah Data"
  | "Pengawas";

type LinkItem = {
  href: string;
  label: string;
  roles: Role[];
  activePath?: string;
};

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<number | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole((localStorage.getItem("role") as Role) ?? null);
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  const clearHoverTimeout = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  const handleMouseEnter = (index: number) => {
    clearHoverTimeout();
    setHovered(index);
  };

  const handleMouseLeave = () => {
    clearHoverTimeout();
    hoverTimeout.current = setTimeout(() => setHovered(null), 300);
  };

  const handleProfileMouseEnter = () => {
    clearHoverTimeout();
    setIsProfileHovered(true);
  };

  const handleProfileMouseLeave = () => {
    clearHoverTimeout();
    hoverTimeout.current = setTimeout(() => setIsProfileHovered(false), 300);
  };

  const allLinks: LinkItem[] = [
    {
      href: "/dashboard",
      label: "Beranda",
      roles: [
        "superadmin",
        "Tim Teknis Balai",
        "PJ Balai",
        "Petugas Lapangan",
        "Koordinator Provinsi",
        "Pengolah Data",
        "Pengawas",
      ],
    },
    {
      href: "",
      label: "Perencanaan Data",
      activePath: "/perencanaan_data",
      roles: ["superadmin", "Tim Teknis Balai"],
    },
    {
      href: "/pengumpulan_data/informasi_tahap_pengumpulan",
      label: "Pengumpulan Data",
      activePath: "/pengumpulan_data",
      roles: ["superadmin", "Petugas Lapangan", "Pengolah Data", "Pengawas"],
    },
    {
      href: "/pemeriksaan_data/informasi_pemeriksaan_data",
      label: "Pemeriksaan",
      activePath: "/pemeriksaan_data",
      roles: ["superadmin", "Koordinator Provinsi", "Tim Teknis Balai"],
    },
    {
      href: "",
      label: "Responden/Vendor",
      activePath: "/vendor",
      roles: ["superadmin", "Tim Teknis Balai"],
    },
    {
      href: "",
      label: "Monitoring",
      activePath: "/pj_balai",
      roles: ["superadmin", "PJ Balai"],
    },
    {
      href: "/user_role/user_role",
      label: "Assign User",
      activePath: "/user_role",
      roles: ["superadmin"],
    },
  ];

  const links = role
    ? allLinks.filter((link) => link.roles.includes(role))
    : [];

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearHoverTimeout();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
  };

  const isActivePath = (link: LinkItem) =>
    pathname.startsWith(link.activePath ?? link.href);

  return (
    <nav
      className={`flex justify-between items-center ${
        isSticky ? "sticky" : "relative"
      }`}>
      {/* Logo */}
      <Link
        href="/dashboard"
        className="bg-solid_basic_blue_500 flex items-center rounded-full py-6 px-7 transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95">
        <Image
          src="/images/navigation-bar/logo.svg"
          alt="SIPASTI Logo"
          width={156}
          height={55}
          className={`max-h-[54.37px] max-w-[156px] transition-transform duration-300 ease-in-out
            ${links.some((l) => isActivePath(l)) ? "scale-110" : "scale-100"}
          `}
          priority
        />
      </Link>

      {/* Navbar Links */}
      <div className="flex items-center rounded-full bg-solid_basic_neutral_100 mx-auto">
        <ul className="inline-flex flex-row items-center gap-x-3 px-2 h-[66px]">
          {links.map((link, index) => {
            const active = isActivePath(link);
            const isHovered = hovered === index;
            return (
              <li
                key={`${link.label}-${index}`}
                className="relative"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}>
                <Link
                  href={link.href || "#"}
                  className={`py-4 px-4
                    ${
                      active
                        ? "text-emphasis_light_on_high text-H6"
                        : "text-emphasis_light_on_surface_medium text-B1"
                    } 
                    leading-none rounded-full transition-all duration-300 ease-in-out transform 
                    ${active ? "bg-solid_basic_blue_500" : ""} 
                    ${
                      isHovered
                        ? "hover:bg-surface_light_background_overlay active:bg-solid_basic_neutral_300"
                        : ""
                    }
                    ${isHovered ? "scale-105" : "scale-100"}
                  `}>
                  {link.label}
                </Link>
                {/* Dropdowns */}
                {link.label === "Perencanaan Data" && isHovered && (
                  <div className="absolute left-0 mt-[32px] w-56 bg-white rounded-[12px] shadow-lg p-2 z-50">
                    {[
                      { href: "/perencanaan_data/tahap1", label: "Buat Baru" },
                      {
                        href: "/perencanaan_data/perencanaan_data_list",
                        label: "Informasi Perencanaan Data",
                      },
                    ].map((submenu, i) => (
                      <Link
                        key={i}
                        href={submenu.href}
                        className="block px-4 py-2 text-sm text-emphasis_light_on_surface_high hover:bg-solid_basic_blue_50 rounded-[12px] transition-all duration-200">
                        {submenu.label}
                      </Link>
                    ))}
                  </div>
                )}
                {link.label === "Responden/Vendor" && isHovered && (
                  <div className="absolute left-0 mt-[32px] w-56 bg-white rounded-[12px] shadow-lg p-2 z-50">
                    {[
                      {
                        href: "/vendor/inputvendor",
                        label: "Input Data Responden/Vendor",
                      },
                      {
                        href: "/perencanaan_data/perencanaan_data_list",
                        label: "Informasi Responden/Vendor",
                      },
                    ].map((submenu, i) => (
                      <Link
                        key={i}
                        href={submenu.href}
                        className="block px-4 py-2 text-sm text-emphasis_light_on_surface_high hover:bg-solid_basic_blue_50 rounded-[12px] transition-all duration-200">
                        {submenu.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Profile */}
      <div
        className="relative"
        onMouseEnter={handleProfileMouseEnter}
        onMouseLeave={handleProfileMouseLeave}>
        <div className="bg-solid_basic_neutral_100 flex items-center rounded-full px-3 pe-6 h-[66px] space-x-3 cursor-pointer">
          <div className="p-2 bg-solid_basic_neutral_0 rounded-full">
            <User
              className="text-emphasis_light_on_surface_high"
              variant="Linear"
              size={24}
            />
          </div>
          <div className="space-y-1 flex flex-col">
            <span className="text-emphasis_light_on_surface_high text-ExtraSmall">
              {role || "Loading..."}
            </span>
            <span className="text-emphasis_light_on_surface_high text-H6">
              {(username && username.includes("@gmail.com")
                ? username.replace("@gmail.com", "")
                : username) || "Loading..."}
            </span>
          </div>
        </div>
        {isProfileHovered && (
          <div className="absolute right-0 mt-[12px] w-60 bg-white rounded-[12px] p-2 z-50">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-emphasis_light_on_surface_high hover:bg-solid_basic_blue_50 rounded-[12px]">
              Pengaturan Akun
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-solid_basic_red_500 hover:bg-solid_basic_red_50 rounded-[12px]">
              Keluar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
