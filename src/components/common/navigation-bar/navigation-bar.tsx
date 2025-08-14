"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@constants/navigation-bar/nav-links";
import { useClientRole } from "@components/ui/navigation-bar-atom/use-client-role";
import { useHoverDelay } from "@components/ui/navigation-bar-atom/use-hover-delay";
import NavItem from "@components/ui/navigation-bar-atom/nav-item";
import ProfileMenu from "@components/ui/navigation-bar-atom/profile-menu";

export default function Navbar() {
  const pathname = usePathname();
  const { role, username } = useClientRole();
  const { hoveredIndex, onEnter, onLeave } = useHoverDelay(300);
  const {
    hoveredIndex: profileHovered,
    onEnter: profileEnter,
    onLeave: profileLeave,
  } = useHoverDelay(300);

  const links = NAV_LINKS;
  const isActive = (href?: string, activePath?: string) =>
    pathname.startsWith(activePath ?? href ?? "");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <nav className="flex justify-between items-center mt-8 mx-8">
      <Link
        href="/dashboard"
        className="bg-solid_basic_blue_500 flex items-center rounded-full py-6 px-7 transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95">
        <Image
          src="/images/navigation-bar/logo.svg"
          alt="SIPASTI Logo"
          width={116}
          height={18}
          className="w-auto transition-transform duration-300 ease-in-out"
          priority
        />
      </Link>

      <div className="flex items-center rounded-full bg-solid_basic_neutral_100 mx-auto">
        <ul className="inline-flex flex-row items-center gap-x-3 px-2 h-[66px]">
          {links.map((item, i) => (
            <NavItem
              key={item.label}
              item={item}
              active={isActive(item.href, item.activePath)}
              hovered={hoveredIndex === i}
              onEnter={() => onEnter(i)}
              onLeave={onLeave}
            />
          ))}
        </ul>
      </div>

      <ProfileMenu
        username={username}
        role={role}
        onLogout={handleLogout}
        hovered={!!profileHovered}
        onEnter={() => profileEnter(1)}
        onLeave={profileLeave}
      />
    </nav>
  );
}
