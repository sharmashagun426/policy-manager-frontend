"use client";

import { Box } from "@mui/material";
import { tokens } from "@/lib/theme";

export default function CitationChip({
  index,
  onClick,
}: {
  index: number;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: "0.68rem",
        fontWeight: 600,
        lineHeight: 1,
        color: tokens.accentStrong,
        bgcolor: tokens.accentSoft,
        border: `1px solid ${tokens.accent}33`,
        borderRadius: "5px",
        padding: "2px 5px",
        marginLeft: "3px",
        cursor: "pointer",
        verticalAlign: "super",
        transition: "background-color 120ms ease, transform 120ms ease",
        "&:hover": {
          bgcolor: tokens.accent,
          color: "#fff",
        },
      }}
    >
      {index}
    </Box>
  );
}
