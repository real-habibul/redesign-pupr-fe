"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@components/common/navigation-bar/navigation-bar";
import Table from "@components/ui/table";
import Pagination from "@components/ui/pagination";
import SearchBox from "@components/ui/searchbox";
import usePengumpulanInformasiStore from "@store/pengumpulanInformasiStore";
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
    setActiveMenu,
    setCurrentPage,
    fetchData,
    handleSearch,
    handleFilterClick,
    handleToggleMenu,
    setSelectedIdPaket,
    selectedIdPaket,
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
      <Navbar />
      <div className="space-y-3">
        <div className="flex flex-row justify-between items-center mt-8 mb-7">
          <h1 className="text-H3 font-bold">
            Informasi Tahap Pengumpulan Data
          </h1>
          <SearchBox
            placeholder="Cari Data..."
            onSearch={handleSearch}
            withFilter
            filterOptions={[
              { label: "Nama Paket", accessor: "nama_paket", checked: false },
              { label: "Nama Balai", accessor: "nama_balai", checked: false },
              { label: "Nama PPK", accessor: "nama_ppk", checked: false },
              { label: "Jabatan PPK", accessor: "jabatan_ppk", checked: false },
              { label: "Kode RUP", accessor: "kode_rup", checked: false },
              { label: "Status", accessor: "status", checked: false },
            ]}
            onFilterClick={handleFilterClick}
          />
        </div>
        <Table
          columns={columnsWithNumbering(handleToggleMenu, setSelectedIdPaket)}
          data={paginatedData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
        {tableData.length === 0 && (
          <div className="text-center mt-4 text-B1 text-emphasis-on_surface-medium">
            <span>: (</span>
            <p className="py-6">Tidak ada data tersedia</p>
          </div>
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
