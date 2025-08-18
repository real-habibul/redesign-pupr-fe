"use client";
import * as React from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

type Props = {
  currentPage: number;
  itemsPerPage: number;
  totalData: number;
  onPageChange: (page: number) => void;
  maxPageNumbers?: number;
};

const Pagination: React.FC<Props> = ({
  currentPage,
  itemsPerPage,
  totalData,
  onPageChange,
  maxPageNumbers = 5,
}) => {
  const totalPages = Math.max(
    1,
    Math.ceil(totalData / Math.max(1, itemsPerPage))
  );

  const safeChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const startData = totalData === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endData = Math.min(currentPage * itemsPerPage, totalData);

  const pages = React.useMemo(() => {
    const nums: (number | "...")[] = [];
    const half = Math.floor(maxPageNumbers / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxPageNumbers - 1);
    start = Math.max(1, Math.min(start, end - maxPageNumbers + 1));

    if (start > 1) {
      nums.push(1);
      if (start > 2) nums.push("...");
    }

    for (let i = start; i <= end; i++) nums.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) nums.push("...");
      nums.push(totalPages);
    }

    return nums;
  }, [currentPage, maxPageNumbers, totalPages]);

  const baseBtn =
    "w-[40px] h-[40px] rounded-full flex items-center justify-center " +
    "text-[var(--color-emphasis-light-on-surface-high)] " +
    "bg-[var(--color-solid-basic-neutral-0)] " +
    "transition-transform duration-200 ease-in-out " +
    "hover:bg-[var(--color-solid-basic-blue-300)] active:scale-95";

  const numberBtn =
    "border-2 border-transparent " +
    "data-[active=true]:w-[50px] data-[active=true]:h-[50px] " +
    "data-[active=true]:bg-[var(--color-solid-basic-blue-500)] " +
    "data-[active=true]:text-[var(--color-emphasis-light-on-color-high)] " +
    "data-[active=true]:border-[8px] data-[active=true]:border-[var(--color-solid-basic-blue-50)] " +
    "data-[active=true]:scale-110";

  const disabledBtn =
    "opacity-60 cursor-not-allowed hover:bg-[var(--color-solid-basic-neutral-0)] active:scale-100";

  return (
    <div className="flex items-center justify-between mt-4 gap-2 flex-wrap font-sans">
      <div className="text-sm text-[var(--color-emphasis-light-on-surface-high)]">
        Menampilkan {startData} - {endData} dari {totalData}
      </div>

      <div className="rounded-full p-3 bg-[var(--color-solid-basic-neutral-0)] border border-[var(--color-solid-basic-neutral-200)]">
        <ul className="flex items-center gap-2">
          <li>
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              onClick={() => safeChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${baseBtn} ${
                currentPage === 1 ? disabledBtn : "cursor-pointer"
              }`}>
              <ArrowLeft2
                size={20}
                color={
                  currentPage === 1
                    ? "var(--color-emphasis-light-on-surface-small)"
                    : "var(--color-emphasis-light-on-surface-high)"
                }
              />
            </button>
          </li>
          {pages.map((p, idx) =>
            p === "..." ? (
              <li key={`e-${idx}`} className="mx-1 select-none">
                <span className="px-2 text-[var(--color-emphasis-light-on-surface-high)]">
                  …
                </span>
              </li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  aria-label={`Halaman ${p}`}
                  onClick={() => safeChange(p)}
                  data-active={p === currentPage || undefined}
                  className={`${baseBtn} ${numberBtn} cursor-pointer`}>
                  {p}
                </button>
              </li>
            )
          )}

          <li>
            <button
              type="button"
              aria-label="Halaman berikutnya"
              onClick={() => safeChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`${baseBtn} ${
                currentPage === 1 ? "cursor-pointer" : disabledBtn
              }`}>
              <ArrowRight2
                size={20}
                color={
                  currentPage === totalPages
                    ? "var(--color-emphasis-light-on-surface-small)"
                    : "var(--color-emphasis-light-on-surface-high)"
                }
              />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
