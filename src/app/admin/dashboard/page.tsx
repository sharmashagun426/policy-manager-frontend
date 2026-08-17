"use client";

import { Box, Stack, Typography, Divider, Drawer, Fab, Tooltip } from "@mui/material";
import { useState } from "react";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import { tokens } from "@/lib/theme";
import { useAuth } from "@/lib/AuthContext";
import { useDocuments } from "@/features/documents/hooks/useDocuments";
import StatCard from "@/components/admin/StatCard";
import UploadDropzone from "@/components/admin/UploadDropzone";
import DocumentsTable from "@/components/admin/DocumentsTable";
import PolicyUpdateAssistant from "@/components/admin/PolicyUpdateAssistant";

export default function DashboardPage() {
  const [policyAssistantOpen, setPolicyAssistantOpen] = useState(false);
  const { orgName } = useAuth();
  const { documents, loading, uploadFiles, deleteDoc, retryDoc } = useDocuments();

  const counts = {
    total: documents.length,
    ready: documents.filter((d) => d.status === "ready").length,
    processing: documents.filter((d) => d.status === "processing").length,
    failed: documents.filter((d) => d.status === "failed").length,
  };

  return (
    <Box sx={{ maxWidth: 1080, mx: "auto", px: { xs: 2.5, sm: 4 }, py: 4 }}>
      <Typography variant="h5" fontWeight={700}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
        {orgName} · document library overview
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mt: 3 }}>
        <StatCard label="Total documents" value={counts.total} icon={DescriptionRoundedIcon} />
        <StatCard
          label="Ready"
          value={counts.ready}
          icon={CheckCircleRoundedIcon}
          tint={tokens.accent}
          tintSoft={tokens.accentSoft}
        />
        <StatCard
          label="Processing"
          value={counts.processing}
          icon={AutorenewRoundedIcon}
          tint={tokens.amber}
          tintSoft={tokens.amberSoft}
        />
        <StatCard
          label="Failed"
          value={counts.failed}
          icon={ErrorOutlineRoundedIcon}
          tint={tokens.red}
          tintSoft={tokens.redSoft}
        />
      </Stack>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          Upload documents
        </Typography>
        <UploadDropzone onFiles={uploadFiles} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Recent documents
          </Typography>
        </Stack>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading documents…
          </Typography>
        ) : (
          <DocumentsTable
            documents={documents.slice(0, 6)}
            onDelete={deleteDoc}
            onRetry={retryDoc}
          />
        )}
      </Box>

      <Tooltip title="Open HR policy assistant" placement="left">
        <Fab
          color="primary"
          aria-label="Open HR policy assistant"
          onClick={() => setPolicyAssistantOpen(true)}
          sx={{ position: "fixed", right: { xs: 20, sm: 32 }, bottom: { xs: 20, sm: 32 } }}
        >
          <AutoFixHighRoundedIcon />
        </Fab>
      </Tooltip>

      <Drawer
        anchor="right"
        open={policyAssistantOpen}
        onClose={() => setPolicyAssistantOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 560, md: 640 },
              bgcolor: tokens.bg,
            },
          },
        }}
      >
        <Box role="dialog" aria-label="HR policy update sidebar" sx={{ minHeight: "100%" }}>
          <PolicyUpdateAssistant onClose={() => setPolicyAssistantOpen(false)} />
        </Box>
      </Drawer>
    </Box>
  );
}
