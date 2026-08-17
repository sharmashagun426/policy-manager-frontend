import { Box, Stack, Typography } from "@mui/material";
import { DocumentStatus } from "@/features/documents/types";
import { tokens } from "@/lib/theme";

const config: Record<
  DocumentStatus,
  { label: string; fg: string; bg: string; dot: string; pulse?: boolean }
> = {
  ready: {
    label: "Ready",
    fg: tokens.accentStrong,
    bg: tokens.accentSoft,
    dot: tokens.accent,
  },
  processing: {
    label: "Processing",
    fg: tokens.amber,
    bg: tokens.amberSoft,
    dot: tokens.amber,
    pulse: true,
  },
  failed: {
    label: "Failed",
    fg: tokens.red,
    bg: tokens.redSoft,
    dot: tokens.red,
  },
};

export default function StatusChip({ status }: { status: DocumentStatus }) {
  const c = config[status];
  return (
    <Stack
      direction="row"
      spacing={0.8}
      alignItems="center"
      sx={{
        display: "inline-flex",
        bgcolor: c.bg,
        color: c.fg,
        borderRadius: "999px",
        px: 1.1,
        py: 0.35,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: c.dot,
          animation: c.pulse ? "status-breathe 1.4s ease-in-out infinite" : "none",
        }}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "0.66rem",
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        }}
      >
        {c.label}
      </Typography>
    </Stack>
  );
}
