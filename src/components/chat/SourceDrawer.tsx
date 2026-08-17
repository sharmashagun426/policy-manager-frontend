"use client";

import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { Citation } from "@/features/chat/types";
import { tokens } from "@/lib/theme";

export default function SourceDrawer({
  open,
  onClose,
  citations,
  activeId,
}: {
  open: boolean;
  onClose: () => void;
  citations: Citation[];
  activeId?: string;
}) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 380 },
            bgcolor: tokens.paper,
          },
        },
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
          <Typography variant="subtitle1" fontWeight={700}>
            Sources
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2.5}>
          Passages PolicyBot used to answer this question.
        </Typography>

        <Stack spacing={2}>
          {citations.map((c, i) => (
            <Box
              key={c.id}
              id={`source-${c.id}`}
              sx={{
                border: `1px solid ${
                  c.id === activeId ? tokens.accent : tokens.border
                }`,
                borderRadius: 2,
                p: 1.75,
                bgcolor: c.id === activeId ? tokens.accentSoft : tokens.paper,
                transition: "background-color 200ms ease, border-color 200ms ease",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                <Box
                  sx={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: tokens.accentStrong,
                    bgcolor: "#fff",
                    border: `1px solid ${tokens.accent}55`,
                    borderRadius: "5px",
                    padding: "1px 5px",
                    mt: "2px",
                  }}
                >
                  {i + 1}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <DescriptionRoundedIcon
                      sx={{ fontSize: 15, color: tokens.textSecondary }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={650}
                      noWrap
                      title={c.documentTitle}
                    >
                      {c.documentTitle}
                    </Typography>
                  </Stack>
                  <Chip
                    size="small"
                    label={`PAGE ${c.page}`}
                    sx={{
                      mt: 0.6,
                      height: 20,
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      bgcolor: tokens.bgSunken,
                      color: tokens.textSecondary,
                    }}
                  />
                </Box>
              </Stack>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                “{c.snippet}”
              </Typography>
            </Box>
          ))}
          {citations.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No sources for this message.
            </Typography>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}
