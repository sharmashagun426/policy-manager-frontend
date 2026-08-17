import { Box, Stack, Typography } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";
import { tokens } from "@/lib/theme";

export default function StatCard({
  label,
  value,
  icon: Icon,
  tint = tokens.accent,
  tintSoft = tokens.accentSoft,
}: {
  label: string;
  value: string | number;
  icon: SvgIconComponent;
  tint?: string;
  tintSoft?: string;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 160,
        border: `1px solid ${tokens.border}`,
        borderRadius: 3,
        bgcolor: tokens.paper,
        p: 2.25,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: 1.5,
            bgcolor: tintSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ fontSize: 16, color: tint }} />
        </Box>
      </Stack>
      <Typography variant="h4" sx={{ mt: 1.2, fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}
