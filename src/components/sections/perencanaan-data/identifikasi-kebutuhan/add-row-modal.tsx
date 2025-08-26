"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material";
import Button from "@components/ui/button";
import TextInput from "@components/ui/text-input";

type AddRowModalProps = {
  handleClose: () => void;
  handleAddRow: (rows: number) => void;
  currentIndex: number;
  open?: boolean;
};

const AddRowModal: React.FC<AddRowModalProps> = ({
  handleClose,
  handleAddRow,
  currentIndex,
  open = true,
}) => {
  const [rowsToAdd, setRowsToAdd] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const title = useMemo(() => {
    switch (currentIndex) {
      case 0:
        return "Material";
      case 1:
        return "Peralatan";
      case 2:
        return "Tenaga Kerja";
      default:
        return "";
    }
  }, [currentIndex]);

  const onlyDigits = /^[0-9]+$/.test(rowsToAdd);
  const val = Number(rowsToAdd);
  let errorMessage = "";
  if (touched) {
    if (rowsToAdd.trim() === "") {
      errorMessage = "Jumlah Baris wajib diisi";
    } else if (!onlyDigits) {
      errorMessage = "Hanya menerima angka positif";
    } else if (val < 1) {
      errorMessage = "Jumlah minimal 1";
    }
  }

  const hasError = !!errorMessage;
  const disableSubmit = !touched || hasError;

  const onConfirm = () => {
    if (disableSubmit) return;
    handleAddRow(val);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          fontFamily: "Poppins, sans-serif !important",
        },
      }}>
      <DialogTitle sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
        Tambah Data {title}
      </DialogTitle>

      <DialogContent sx={{ fontFamily: "Poppins, sans-serif" }}>
        <DialogContentText sx={{ fontSize: "0.875rem" }}>
          Masukkan jumlah baris yang ingin ditambahkan:
        </DialogContentText>

        <Box sx={{ mt: 1.5 }}>
          <TextInput
            label="Jumlah Baris"
            value={rowsToAdd}
            onChange={(e) => {
              setRowsToAdd(e.target.value);
              if (!touched) setTouched(true);
            }}
            onBlur={() => setTouched(true)}
            type="text"
            isRequired
            error={hasError}
            helperText={errorMessage}
            placeholder="contoh: 3"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined_yellow" onClick={handleClose} label="Batal" />
        <Button onClick={onConfirm} label="Tambah" disabled={disableSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default AddRowModal;
