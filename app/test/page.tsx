"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import MUISelect from "@components/ui/select";

export default function Page() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const longLabel =
    "This is an extremely long option label that goes on and on just to see how the Select handles very long text gracefully with ellipsis";

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          alignItems: "center",
        }}>
        <MUISelect
          label="Left"
          value={left}
          onChange={setLeft}
          options={[
            { label: "Ten", value: "10" },
            { label: longLabel, value: "long" },
            { label: "Thirty", value: "30" },
          ]}
          // samain lebar menu untuk kiri & kanan
          menuWidthPx={320}
        />

        <MUISelect
          label="Right"
          value={right}
          onChange={setRight}
          options={[
            { label: "Ten", value: "10" },
            { label: "Twenty", value: "20" },
            { label: longLabel, value: "long" },
          ]}
          menuWidthPx={320}
        />
      </Box>
    </Box>
  );
}
