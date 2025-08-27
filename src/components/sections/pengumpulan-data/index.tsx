"use client";
import React, { useState, useEffect, useCallback } from "react";
import Table from "@components/ui/table";
import Pagination from "@components/ui/pagination";
import SearchBox from "@components/ui/searchbox";
import usePengumpulanInformasiStore from "@store/pengumpulan_data/store";
import { columnsWithNumbering } from "./columns";
import ActiveMenuPopup from "./active-menu-popup";
import ModalDetail from "./modal-detail";
import useIframeResize from "@hooks/pengumpulan-data/use-iframe-resize";

export default function InformasiPengumpulanData() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(400);

  const {
    tableData,
    currentPage,
    itemsPerPage,
    activeMenu,
    menuPosition,
    setCurrentPage,
    fetchData,
    handleSearch,
    setSelectedIdPaket,
    selectedIdPaket,
    handleToggleMenu,
    setActiveFilters,
  } = usePengumpulanInformasiStore();

  const { handleIframeResize } = useIframeResize(setIframeHeight);

  useEffect(() => {
    fetchData();
    const storedId = localStorage.getItem("selectedIdPaket");
    if (storedId) setSelectedIdPaket(storedId);

    window.addEventListener("message", handleIframeResize);
    return () => window.removeEventListener("message", handleIframeResize);
  }, [fetchData, setSelectedIdPaket, handleIframeResize]);

  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = useCallback(
    (id: string) => {
      localStorage.setItem("selectedIdPaket", id);
      setSelectedIdPaket(id);
      setIsModalOpen(true);
    },
    [setSelectedIdPaket]
  );

  const closeModal = () => {
    setIsModalOpen(false);
    localStorage.removeItem("selectedIdPaket");
  };

  return (
    <div className="p-8">
      <div className="space-y-3">
        <div className="flex flex-row justify-between items-center mt-8 mb-7">
          <h1 className="text-H3 font-bold">
            Informasi Tahap Pengumpulan Data
          </h1>

          <SearchBox
            placeholder="Cari Data..."
            onSearch={handleSearch}
            withFilter
            debounceDelay={200}
            filterOptions={[
              { label: "Nama Paket", value: "nama_paket", checked: false },
              { label: "Nama Balai", value: "nama_balai", checked: false },
              { label: "Nama PPK", value: "nama_ppk", checked: false },
              { label: "Jabatan PPK", value: "jabatan_ppk", checked: false },
              { label: "Kode RUP", value: "kode_rup", checked: false },
              { label: "Status", value: "status", checked: false },
            ]}
            onApplyFilters={(filters) =>
              setActiveFilters(
                filters
                  .filter((f) => f.checked && !!f.value)
                  .map((f) => f.value as any)
              )
            }
          />
        </div>

        <Table
          columns={columnsWithNumbering(handleToggleMenu, setSelectedIdPaket)}
          data={paginatedData}
        />

        {tableData.length === 0 && (
          <div className="text-center mt-4 text-B1 text-emphasis-on_surface-medium"></div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalData={tableData.length}
        onPageChange={setCurrentPage}
      />

      <ActiveMenuPopup
        activeMenu={activeMenu}
        menuPosition={menuPosition}
        tableData={tableData}
        openModal={openModal}
      />

      <ModalDetail
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedIdPaket={selectedIdPaket}
        iframeHeight={iframeHeight}
      />
    </div>
  );
}
