"use client";

import { useCallback, useRef, useState } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { tokens } from "@/lib/theme";

export default function UploadDropzone({
  onFiles,
}: {
  onFiles: (files: File[]) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const pdfs = Array.from(fileList).filter(
        (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
      );
      if (pdfs.length) onFiles(pdfs);
    },
    [onFiles]
  );

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      sx={{
        border: `1.5px dashed ${dragOver ? tokens.accent : tokens.borderStrong}`,
        borderRadius: 3,
        bgcolor: dragOver ? tokens.accentSoft : tokens.bgSunken,
        py: 5,
        px: 3,
        textAlign: "center",
        transition: "background-color 150ms ease, border-color 150ms ease",
      }}
    >
      <Stack spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            bgcolor: tokens.paper,
            border: `1px solid ${tokens.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UploadFileRoundedIcon sx={{ color: tokens.accent, fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight={650}>
            Drag PDF files here, or browse
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            PolicyBot indexes each page for search and citation. Max 100&nbsp;MB per file.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => inputRef.current?.click()}
          sx={{ mt: 0.5 }}
        >
          Choose files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </Stack>
    </Box>
  );
}
