"use client";
import Link from "next/link";
import { User } from "iconsax-react";

export default function ProfileMenu({
  username,
  role,
  onLogout,
  hovered,
  onEnter,
  onLeave,
}: {
  username: string | null;
  role: string | null;
  onLogout: () => void;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const name =
    (username && username.includes("@gmail.com")
      ? username.replace("@gmail.com", "")
      : username) || "Loading...";

  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
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
            {name}
          </span>
        </div>
      </div>

      {hovered && (
        <div className="absolute right-0 mt-[12px] w-60 bg-white rounded-[12px] p-2 z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-emphasis_light_on_surface_high hover:bg-solid_basic_blue_50 rounded-[12px]">
            Pengaturan Akun
          </Link>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-solid_basic_red_500 hover:bg-solid_basic_red_50 rounded-[12px]">
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
