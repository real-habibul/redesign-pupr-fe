"use client";
import Link from "next/link";
import type { LinkItem } from "../../../types/navigation-bar/nav";

type Props = {
  item: LinkItem;
  active: boolean;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
};

export default function NavItem({
  item,
  active,
  hovered,
  onEnter,
  onLeave,
}: Props) {
  return (
    <li className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Link
        href={item.href || "#"}
        className={`py-4 px-4
          ${
            active
              ? "text-emphasis_light_on_high text-H6"
              : "text-emphasis_light_on_surface_medium text-B1"
          }
          leading-none rounded-full transition-all duration-300 ease-in-out transform
          ${active ? "bg-solid_basic_blue_500" : ""}
          ${
            hovered
              ? "hover:bg-surface_light_background_overlay active:bg-solid_basic_neutral_300"
              : ""
          }
          ${hovered ? "scale-105" : "scale-100"}
        `}>
        {item.label}
      </Link>

      {!!item.children?.length && hovered && (
        <div className="absolute left-0 mt-[32px] w-56 bg-white rounded-[12px] shadow-lg p-2 z-50">
          {item.children.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block px-4 py-2 text-sm text-emphasis_light_on_surface_high hover:bg-solid_basic_blue_50 rounded-[12px] transition-all duration-200">
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}
