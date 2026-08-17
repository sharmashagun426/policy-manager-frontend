"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  InputBase,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { tokens } from "@/lib/theme";
import { useDocuments } from "@/features/documents/hooks/useDocuments";
import { DocumentStatus } from "@/features/documents/types";
import DocumentsTable from "@/components/admin/DocumentsTable";
import UploadDropzone from "@/components/admin/UploadDropzone";

type Filter = "all" | DocumentStatus;

export default function DocumentsPage() {
  const { documents, loading, uploadFiles, deleteDoc, retryDoc } = useDocuments();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const matchesFilter = filter === "all" || d.status === filter;
      const matchesQuery =
        !query.trim() ||
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.category.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [documents, query, filter]);

  return (
    <Box sx={{ maxWidth: 1080, mx: "auto", px: { xs: 2.5, sm: 4 }, py: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Documents
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            {documents?.length} documents in your library
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <UploadDropzone onFiles={uploadFiles} />
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: `1px solid ${tokens.border}`,
            borderRadius: 2,
            bgcolor: tokens.paper,
            px: 1.5,
            py: 0.6,
            width: { xs: "100%", sm: 280 },
          }}
        >
          <SearchRoundedIcon sx={{ fontSize: 18, color: tokens.textMuted }} />
          <InputBase
            placeholder="Search documents…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            sx={{ fontSize: "0.88rem" }}
          />
        </Box>

        <ToggleButtonGroup
          value={filter}
          exclusive
          size="small"
          onChange={(_, val) => val && setFilter(val)}
          sx={{
            "& .MuiToggleButton-root": {
              textTransform: "none",
              px: 1.5,
              fontWeight: 600,
              fontSize: "0.8rem",
              border: `1px solid ${tokens.border}`,
              color: tokens.textSecondary,
              "&.Mui-selected": {
                bgcolor: tokens.ink,
                color: "#fff",
                "&:hover": { bgcolor: tokens.ink },
              },
            },
          }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="ready">Ready</ToggleButton>
          <ToggleButton value="processing">Processing</ToggleButton>
          <ToggleButton value="failed">Failed</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {loading ? (
        <Typography variant="body2" color="text.secondary">
          Loading documents…
        </Typography>
      ) : (
        <DocumentsTable documents={filtered} onDelete={deleteDoc} onRetry={retryDoc} />
      )}
    </Box>
  );
}
