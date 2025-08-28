"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { CloseCircle } from "iconsax-react";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedIdPaket: string | null;
  iframeHeight: number;
};

export default function ModalDetail({
  isModalOpen,
  closeModal,
  selectedIdPaket,
  iframeHeight,
}: Props) {
  return (
    <Dialog
      open={isModalOpen}
      onClose={closeModal}
      fullWidth
      maxWidth="lg"
      keepMounted
      PaperProps={{ sx: { borderRadius: "16px" } }}>
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <span>Informasi Vendor</span>
        <IconButton onClick={closeModal} size="small">
          <CloseCircle size="24" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <iframe
          src={`./modal/vendor?id=${selectedIdPaket ?? ""}`}
          width="100%"
          height={iframeHeight}
          frameBorder={0}
          title="Vendor Detail"
          style={{ display: "block" }}
        />
      </DialogContent>
    </Dialog>
  );
}
