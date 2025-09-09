"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import DataTableMui, { type ColumnDef } from "@components/ui/table";
import Pagination from "@components/ui/pagination";
import SearchBox from "@components/ui/searchbox";
import type { PublicPerencanaanDataItem } from "../../../../types/perencanaan-data/public-perencanaan-data";
import { usePublicPerencanaanData } from "@hooks/perencanaan-data/use-public-perencanaan-data";

type SBFilter = import("@components/ui/searchbox").FilterOption;

const ITEMS_PER_PAGE = 10;

const DEFAULT_FILTERS: SBFilter[] = [
  { label: "Nama Paket", value: "nama_paket", checked: false },
  { label: "Nama Balai", value: "nama_balai", checked: false },
  { label: "Nama PPK", value: "nama_ppk", checked: false },
  { label: "Status", value: "status", checked: false },
  { label: "Periode", value: "period_year", checked: false },
  { label: "Kode Kota", value: "city_code", checked: false },
];

// Helper function to get nested value for search functionality
function getNestedValue(obj: PublicPerencanaanDataItem, path: string): string {
  if (path === "informasi_umum.nama_paket") {
    return obj.informasi_umum?.nama_paket || '';
  }
  if (path === "informasi_umum.nama_balai") {
    return obj.informasi_umum?.nama_balai || '';
  }
  if (path === "informasi_umum.nama_ppk") {
    return obj.informasi_umum?.nama_ppk || '';
  }
  return '';
}

export default function PublicPerencanaanDataList() {
  const {
    // Data
    orgSettings,
    perencanaanData,
    provinces,
    
    // Loading states
    isLoadingData,
    isRefreshing,
    isExporting,
    
    // Error
    error,
    
    // Pagination
    currentPage,
    totalItems,
    setCurrentPage,
    
    // Filters
    filters,
    updateFilters,
    
    // Actions
    refresh,
    exportData,
  } = usePublicPerencanaanData();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const columns: ColumnDef<PublicPerencanaanDataItem>[] = useMemo(
    () => [
      { 
        key: "informasi_umum.nama_paket", 
        header: "Nama Paket",
        cell: (item: PublicPerencanaanDataItem) => {
          return item.informasi_umum?.nama_paket || "-";
        }
      },
      { 
        key: "informasi_umum.nama_balai", 
        header: "Nama Balai",
        cell: (item: PublicPerencanaanDataItem) => {
          return item.informasi_umum?.nama_balai || "-";
        }
      },
      { 
        key: "informasi_umum.nama_ppk", 
        header: "Nama PPK",
        cell: (item: PublicPerencanaanDataItem) => {
          return item.informasi_umum?.nama_ppk || "-";
        }
      },
      { 
        key: "period_year", 
        header: "Periode",
        cell: (item: PublicPerencanaanDataItem) => item.period_year?.toString() || "-"
      },
      { 
        key: "city_code", 
        header: "Kode Kota",
        cell: (item: PublicPerencanaanDataItem) => item.city_code || "-"
      },
      { 
        key: "status", 
        header: "Status",
        cell: (item: PublicPerencanaanDataItem) => {
          const statusMap: Record<string, string> = {
            'draft': 'Draft',
            'review': 'Review',
            'approved': 'Approved',
            'completed': 'Completed'
          };
          return statusMap[item.status] || item.status || "-";
        }
      },
      { 
        key: "created_at", 
        header: "Tanggal Dibuat",
        cell: (item: PublicPerencanaanDataItem) => {
          if (!item.created_at) return "-";
          return new Date(item.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    let items = [...perencanaanData];
    const q = searchQuery.trim().toLowerCase();
    
    if (q.length > 0) {
      const scanAll = selectedFields.length === 0;
      items = items.filter((item) => {
        if (scanAll) {
          // Search in all visible fields
          const searchableText = [
            getNestedValue(item, "informasi_umum.nama_paket"),
            getNestedValue(item, "informasi_umum.nama_balai"),
            getNestedValue(item, "informasi_umum.nama_ppk"),
            item.period_year?.toString(),
            item.city_code,
            item.status,
          ].join(' ').toLowerCase();
          
          return searchableText.includes(q);
        }
        
        return selectedFields.some((field) => {
          const value = getNestedValue(item, field);
          return value.toLowerCase().includes(q);
        });
      });
    }
    
    return items;
  }, [perencanaanData, searchQuery, selectedFields]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Update search filter in the hook
    updateFilters({ search: value });
  };

  const handleFilterClick = (filters: SBFilter[]) => {
    const selected = filters
      .filter((f) => f.checked)
      .map((f) => f.value as string);
    setSelectedFields(selected);
  };

  const handlePeriodFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ period: e.target.value });
  };

  const handleCityFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ city: e.target.value });
  };

  const handleProvinceFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ region: e.target.value });
  };

  const handleExport = () => {
    exportData();
  };

  return (
    <div className="p-8">
      <div className="space-y-3">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            {orgSettings?.logo_url && (
              <Image 
                src={orgSettings.logo_url} 
                alt="Logo" 
                width={64}
                height={64}
                className="rounded-full bg-white p-1"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {orgSettings?.name || 'E-Katalog SIPASTI'}
              </h1>
              <p className="text-blue-100">
                Data Perencanaan {orgSettings?.type ? 
                  orgSettings.type.charAt(0).toUpperCase() + orgSettings.type.slice(1) : 
                  'Daerah'}
              </p>
              <p className="text-sm text-blue-200">
                Region: {filters.region ? 
                  provinces.find(p => p.id_province === filters.region)?.province_name || filters.region.toUpperCase() :
                  orgSettings?.region_code?.toUpperCase() || 'Default'}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provinsi
              </label>
              <select
                value={filters.region || ''}
                onChange={handleProvinceFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {orgSettings?.region_code ? 
                    `Default (${orgSettings.region_code.toUpperCase()})` : 
                    'Pilih Provinsi'}
                </option>
                {provinces.map((province) => (
                  <option key={province.id_province} value={province.id_province}>
                    {province.province_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periode
              </label>
              <select
                value={filters.period || ''}
                onChange={handlePeriodFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Periode</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode Kota
              </label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={handleCityFilterChange}
                placeholder="e.g., 3301"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-2 items-end">
              <button
                onClick={refresh}
                disabled={isRefreshing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Table Header */}
        <div className="flex flex-row justify-between items-center mt-8 mb-7">
          <h2 className="text-H3 font-bold">Data Perencanaan Public</h2>
          <SearchBox
            placeholder="Cari Data..."
            onSearch={handleSearch}
            withFilter
            filterOptions={DEFAULT_FILTERS}
            onFilterClick={handleFilterClick}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}
        
        {isLoadingData && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2">Memuat data…</p>
          </div>
        )}

        {!isLoadingData && !error && (
          <>
            <DataTableMui<PublicPerencanaanDataItem>
              columns={columns}
              data={filteredData}
              striped
              stickyHeader
              pagination={{
                currentPage,
                itemsPerPage: ITEMS_PER_PAGE,
                total: totalItems,
                onPageChange: setCurrentPage,
              }}
            />
            <Pagination
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalData={totalItems}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
