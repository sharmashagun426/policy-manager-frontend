"use client";

import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { OrgDocument } from "@/features/documents/types";
import { tokens } from "@/lib/theme";
import StatusChip from "./StatusChip";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function DocumentsTable({
  documents,
  onDelete,
  onRetry,
}: {
  documents: OrgDocument[];
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
}) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuDoc, setMenuDoc] = useState<OrgDocument | null>(null);
  const [confirmDoc, setConfirmDoc] = useState<OrgDocument | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, doc: OrgDocument) => {
    setMenuAnchor(e.currentTarget);
    setMenuDoc(doc);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuDoc(null);
  };

  if (documents.length === 0) {
    return (
      <Box
        sx={{
          border: `1px dashed ${tokens.borderStrong}`,
          borderRadius: 3,
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography variant="body1" fontWeight={650}>
          No documents yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Upload a PDF above to make it searchable in the chatbot.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        sx={{ border: `1px solid ${tokens.border}`, borderRadius: 3, overflow: "hidden" }}
      >
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Document</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Pages</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id} hover>
                <TableCell sx={{ maxWidth: 320 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.1 }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: 1.5,
                        bgcolor: tokens.accentSoft,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      <DescriptionRoundedIcon sx={{ fontSize: 16, color: tokens.accentStrong }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={650} noWrap title={doc.title}>
                        {doc.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: tokens.textMuted,
                          fontFamily: "var(--font-jetbrains-mono)",
                        }}
                        noWrap
                      >
                        {doc.fileName}
                      </Typography>
                      {doc.status === "failed" && doc.failReason && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.4 }}>
                          <ErrorOutlineRoundedIcon sx={{ fontSize: 13, color: tokens.red }} />
                          <Typography variant="caption" sx={{ color: tokens.red }}>
                            {doc.failReason}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={doc.category}
                    sx={{ bgcolor: tokens.bgSunken, fontWeight: 600, fontSize: "0.72rem" }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {doc.status === "processing" ? "—" : doc.pages}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatSize(doc.sizeKb)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(doc.uploadedAt)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: tokens.textMuted }}>
                    {doc.uploadedBy}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={doc.status} />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="More actions">
                    <IconButton size="small" onClick={(e) => openMenu(e, doc)}>
                      <MoreVertRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
        {menuDoc?.status === "failed" && (
          <MenuItem
            onClick={() => {
              if (menuDoc) onRetry(menuDoc.id);
              closeMenu();
            }}
          >
            <ListItemIcon>
              <ReplayRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Retry processing</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setConfirmDoc(menuDoc);
            closeMenu();
          }}
          sx={{ color: tokens.red }}
        >
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" sx={{ color: tokens.red }} />
          </ListItemIcon>
          <ListItemText>Delete document</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={!!confirmDoc} onClose={() => setConfirmDoc(null)}>
        <DialogTitle>Delete this document?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            “{confirmDoc?.title}” will be removed and the chatbot will stop citing it.
            This can&apos;t be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmDoc(null)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (confirmDoc) onDelete(confirmDoc.id);
              setConfirmDoc(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
