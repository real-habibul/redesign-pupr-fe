"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import Pagination from "@components/ui/pagination";
import SearchBox from "@components/ui/searchbox";
import Button from "@components/ui/button";
import ActionMenu, { type ActionMenuItem } from "@components/ui/action-menu";
import {
  More,
  DocumentText,
  Document,
  Link as LinkIcon,
  TickCircle,
} from "iconsax-react";

import type { PengumpulanRow } from "../../../types/pengumpulan-data/pengumpulan-data";
import {
  getVendorsByPaket,
  type VendorRow,
} from "@lib/api/pengumpulan-data/pengumpulan";

import CloseIcon from "@mui/icons-material/Close";
import LinkKuesioner from "./link-kuesioner";

type SBFilter = import("@components/ui/searchbox").FilterOption;

type Props = {
  open: boolean;
  row: PengumpulanRow | null;
  onClose: () => void;
};

const ITEMS_PER_PAGE = 10;

const DEFAULT_FILTERS: SBFilter[] = [
  { label: "Nama Vendor", value: "nama_vendor", checked: false },
  { label: "PIC", value: "pic", checked: false },
  { label: "Alamat", value: "alamat_vendor", checked: false },
  { label: "Shortlist ID", value: "shortlist_id", checked: false },
  { label: "Informasi Umum ID", value: "informasi_umum_id", checked: false },
];

export default function PengumpulanDetailDialog({ open, row, onClose }: Props) {
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SBFilter[]>(DEFAULT_FILTERS);
  const [selectedFields, setSelectedFields] = useState<(keyof VendorRow)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorRow | null>(null);

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    r: VendorRow
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedVendor(r);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSoftcopy = () => {
    handleMenuClose();
  };
  const handleHardcopy = () => {
    handleMenuClose();
  };
  const handleKuesioner = () => {
    handleMenuClose();
    if (selectedVendor && typeof window !== "undefined") {
      // ✅ pakai informasi_umum_id sebagai ID generate-link
      localStorage.setItem(
        "selectedIdLinkKuesioner",
        String(selectedVendor.informasi_umum_id)
      );
      setLinkDialogOpen(true);
    }
  };
  const handlePemeriksaan = () => {
    handleMenuClose();
  };

  useEffect(() => {
    if (!open || !row?.id) return;

    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await getVendorsByPaket(row.id);
        if (!aborted) {
          setVendors(list);
          setCurrentPage(1);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : String(err ?? "Unknown error");
        if (!aborted) setError(message || "Gagal memuat vendor");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [open, row?.id]);

  const columns: ColumnDef<VendorRow>[] = useMemo(
    () => [
      { key: "shortlist_id", header: "ID" },
      { key: "nama_vendor", header: "Nama Vendor" },
      { key: "pic", header: "PIC" },
      { key: "alamat_vendor", header: "Alamat" },
      {
        key: "__aksi",
        header: "Aksi",
        className: "w-[64px] text-center",
        cell: (r: VendorRow) => (
          <IconButton
            aria-label="aksi vendor"
            onClick={(e) => handleMenuOpen(e, r)}
            size="small">
            <More
              size={20}
              color="var(--color-emphasis-light-on-surface-high)"
            />
          </IconButton>
        ),
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let items = vendors.slice();

    if (q) {
      const scanAll = selectedFields.length === 0;
      items = items.filter((it) => {
        if (scanAll) {
          return (Object.values(it) as unknown[]).some((v) =>
            String(v ?? "")
              .toLowerCase()
              .includes(q)
          );
        }
        return selectedFields.some((k) =>
          String(it[k] ?? "")
            .toLowerCase()
            .includes(q)
        );
      });
    }

    const uniq = new Map<number, VendorRow>();
    items.forEach((it) => uniq.set(it.shortlist_id, it));
    return Array.from(uniq.values());
  }, [vendors, searchQuery, selectedFields]);

  const total = filteredData.length;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterClick = (next: SBFilter[]) => {
    setFilters(next);
    const picked = next
      .filter((f) => f.checked)
      .map((f) => f.value)
      .filter((v): v is keyof VendorRow => typeof v === "string");
    setSelectedFields(picked);
    setCurrentPage(1);
  };

  const menuItems: ActionMenuItem[] = useMemo(
    () => [
      {
        id: "softcopy",
        label: "Entri Data Softcopy",
        icon: <DocumentText size={18} color="currentColor" />,
        onClick: handleSoftcopy,
      },
      {
        id: "hardcopy",
        label: "Entri Data Hardcopy",
        icon: <Document size={18} color="currentColor" />,
        onClick: handleHardcopy,
      },
      {
        id: "kuesioner",
        label: "Link Kuesioner",
        icon: <LinkIcon size={18} color="currentColor" />,
        onClick: handleKuesioner,
      },
      {
        id: "pemeriksaan",
        label: "Pemeriksaan",
        icon: <TickCircle size={18} color="currentColor" />,
        onClick: handlePemeriksaan,
      },
    ],
    [selectedVendor]
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle>Daftar Vendor Paket #{row?.id}</DialogTitle>

        <DialogContent dividers>
          <div className="flex justify-between items-center mb-4">
            <SearchBox
              placeholder="Cari vendor…"
              onSearch={handleSearch}
              withFilter
              filterOptions={filters}
              onFilterClick={handleFilterClick}
              debounceDelay={200}
            />
          </div>

          {error && <div className="text-red-600 mb-3">{error}</div>}
          {loading ? (
            <div>Memuat vendor…</div>
          ) : (
            <>
              <DataTableMui
                columns={columns}
                data={filteredData}
                striped
                stickyHeader
                pagination={{
                  currentPage,
                  itemsPerPage: ITEMS_PER_PAGE,
                  total,
                  onPageChange: setCurrentPage,
                }}
              />
              <Pagination
                currentPage={currentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalData={total}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined_yellow"
            size="small"
            onClick={onClose}
            sx={{ height: 40, padding: "8px 16px" }}>
            Tutup
          </Button>
        </DialogActions>

        <ActionMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          items={menuItems}
        />
      </Dialog>

      <Dialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>
        <DialogTitle
          sx={{
            fontWeight: 700,
            "&, & *": { fontFamily: "Poppins, sans-serif !important" },
            pr: 6,
          }}>
          Link Kuesioner
          <IconButton
            onClick={() => setLinkDialogOpen(false)}
            aria-label="close"
            sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <LinkKuesioner />
        </DialogContent>
      </Dialog>
    </>
  );
}
